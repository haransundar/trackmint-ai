# TrackMint-AI Backend

## Overview
This is the backend for TrackMint-AI, a B2B lead intelligence platform. It scrapes company websites, analyzes them for sales signals using Vertex AI, and stores results in Google Firestore.

## Features
- FastAPI REST API
- Google Firestore integration
- Vertex AI (Gemini) for text analysis
- API key authentication
- Docker support

## Setup
1. **Clone the repo**
2. **Create and activate a virtual environment**
3. **Install dependencies**
   ```
   pip install -r requirements.txt
   ```
4. **Set up your `.env` file** (see `.env.example`):
   ```
   GOOGLE_APPLICATION_CREDENTIALS=auth/trackmint-ai-ed3a448c15c6.json
   GOOGLE_CLOUD_PROJECT=trackmint-ai
   GOOGLE_CLOUD_REGION=asia-south1
   API_KEY=your-secret-api-key
   ```
5. **Ensure your Firestore database is set up** and your service account has access.

## Running the API
```
uvicorn main:app --reload
```

## API Usage
All endpoints require an `x-api-key` header.

### POST `/process-company`
- **Body:** `{ "url": "https://company.com" }`
- **Returns:** AI analysis and save status

### GET `/leads`
- **Returns:** List of all leads

### GET `/leads/{lead_id}`
- **Returns:** Single lead by ID

## Testing
```
pytest
```

## Docker
```
docker build -t trackmint-backend .
docker run -p 8000:8000 --env-file .env trackmint-backend
```

## Security
- Keep your service account JSON and API key secure.
- Adjust Firestore security rules for production.

## License
MIT 