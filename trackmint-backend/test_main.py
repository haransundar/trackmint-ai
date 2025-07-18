import os
import pytest
from fastapi.testclient import TestClient
from main import app

API_KEY = os.getenv("API_KEY", "changeme")
client = TestClient(app)

def test_no_api_key():
    response = client.post("/process-company", json={"url": "https://example.com"})
    assert response.status_code == 401

def test_invalid_api_key():
    response = client.post("/process-company", json={"url": "https://example.com"}, headers={"x-api-key": "wrong"})
    assert response.status_code == 401

def test_process_company_valid(monkeypatch):
    # Mock scraper and analyzer to avoid real network/AI calls
    monkeypatch.setattr("scraper.scrape_website", lambda url: "test content")
    monkeypatch.setattr("analyzer.analyze_text", lambda text: {"funding": "$10M"})
    monkeypatch.setattr("database.save_lead_to_firestore", lambda data: True)
    response = client.post("/process-company", json={"url": "https://example.com"}, headers={"x-api-key": API_KEY})
    assert response.status_code == 200
    assert response.json()["success"] is True 