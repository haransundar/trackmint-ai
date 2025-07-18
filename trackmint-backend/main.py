from fastapi import FastAPI, HTTPException, Depends, Request
from pydantic import BaseModel
from scraper import scrape_website
from analyzer import analyze_text
from database import save_lead_to_firestore
from google.cloud import firestore
import asyncio
from typing import List, Optional
import logging
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://trackmint-ai.vercel.app"],  # Or ["*"] for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

API_KEY = os.getenv("API_KEY", "changeme")

def verify_api_key(request: Request):
    api_key = request.headers.get("x-api-key")
    if not api_key or api_key != API_KEY:
        logger.warning("Unauthorized access attempt.")
        raise HTTPException(status_code=401, detail="Invalid or missing API key.")

class CompanyRequest(BaseModel):
    url: str

class LeadResponse(BaseModel):
    id: str
    url: str
    ai_analysis: dict
    timestamp: Optional[str] = None

@app.post("/process-company", dependencies=[Depends(verify_api_key)])
async def process_company(request: CompanyRequest):
    """
    Process a company URL: scrape, analyze, and save to Firestore.
    """
    url = request.url
    try:
        text_content = await scrape_website(url)
        if not text_content:
            logger.warning(f"Failed to scrape website: {url}")
            return {"success": False, "step": "scrape", "message": "Failed to scrape website."}
        analysis = await analyze_text(text_content)
        if not analysis or (isinstance(analysis, dict) and analysis.get("status", "") == "no signals found"):
            logger.info(f"No sales signals found for: {url}")
            return {"success": False, "step": "analyze", "message": "No sales signals found.", "analysis": analysis}
        lead_data = {"url": url, "ai_analysis": analysis}
        save_success = save_lead_to_firestore(lead_data)
        if not save_success:
            logger.error(f"Failed to save lead for: {url}")
            return {"success": False, "step": "save", "message": "Failed to save to Firestore.", "analysis": analysis}
        logger.info(f"Lead processed and saved for: {url}")
        return {"success": True, "step": "complete", "message": "Lead processed and saved.", "analysis": analysis}
    except Exception as e:
        logger.exception(f"Unexpected error processing company: {url}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/leads", response_model=List[LeadResponse], dependencies=[Depends(verify_api_key)])
def list_leads():
    """
    List all leads from Firestore.
    """
    try:
        db = firestore.Client()
        leads_ref = db.collection('leads').order_by('timestamp', direction=firestore.Query.DESCENDING)
        docs = leads_ref.stream()
        results = []
        for doc in docs:
            data = doc.to_dict()
            results.append(LeadResponse(id=doc.id, **data))
        logger.info(f"Listed {len(results)} leads.")
        return results
    except Exception as e:
        logger.exception("Error listing leads.")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/leads/{lead_id}", response_model=LeadResponse, dependencies=[Depends(verify_api_key)])
def get_lead(lead_id: str):
    """
    Retrieve a single lead by document ID.
    """
    try:
        db = firestore.Client()
        doc_ref = db.collection('leads').document(lead_id)
        doc = doc_ref.get()
        if not doc.exists:
            logger.warning(f"Lead not found: {lead_id}")
            raise HTTPException(status_code=404, detail="Lead not found")
        data = doc.to_dict()
        logger.info(f"Retrieved lead: {lead_id}")
        return LeadResponse(id=doc.id, **data)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Error retrieving lead: {lead_id}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/")
def read_root():
    return {"message": "TrackMint AI backend is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 