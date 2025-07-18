import os
from google.cloud import firestore
from google.api_core.exceptions import GoogleAPIError
from dotenv import load_dotenv
from datetime import datetime
from pydantic import BaseModel, ValidationError

load_dotenv()

class LeadModel(BaseModel):
    url: str
    ai_analysis: dict
    timestamp: str | None = None

def save_lead_to_firestore(data: dict) -> bool:
    """
    Save a lead dictionary to Firestore in the 'leads' collection.
    Validates data using LeadModel. Returns True on success, False on failure.
    """
    try:
        # Validate data before saving
        lead = LeadModel(**data)
        db = firestore.Client()
        doc_ref = db.collection('leads').document()
        data_with_timestamp = lead.dict()
        if not data_with_timestamp.get('timestamp'):
            from datetime import datetime
            data_with_timestamp['timestamp'] = datetime.utcnow().isoformat()
        doc_ref.set(data_with_timestamp)
        return True
    except ValidationError as ve:
        print(f"Validation error: {ve}")
        return False
    except GoogleAPIError as e:
        print(f"Firestore error: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False

if __name__ == '__main__':
    sample_lead = {
        "url": "https://example.com",
        "ai_analysis": {
            "funding": "$10M Series B",
            "new_hire": "Jane Doe, CTO",
            "expansion": "Europe",
            "hiring": "cloud engineers"
        }
    }
    result = save_lead_to_firestore(sample_lead)
    print("Success" if result else "Failed to save lead.") 