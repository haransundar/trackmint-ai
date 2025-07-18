import os
import json
import vertexai
from vertexai.generative_models import GenerativeModel
from dotenv import load_dotenv

load_dotenv()

async def analyze_text(text_content: str) -> dict:
    """
    Analyze text for B2B sales signals using Gemini on Vertex AI.
    Returns a dictionary of findings or a status if no signals found.
    """
    project = os.getenv('GOOGLE_CLOUD_PROJECT')
    location = os.getenv('GOOGLE_CLOUD_REGION', 'us-central1')
    model_name = 'publishers/google/models/gemini-2.0-flash-001'
    prompt = (
        "Please analyze the following text from a company's website. Identify and extract key B2B sales signals such as funding announcements, "
        "new executive hires (C-suite or VP level), mentions of 'expansion', 'new product launches', 'integration partnerships', or specific technology hiring needs. "
        "If you find any signals, return them in a structured JSON format with a key for each signal type. If no signals are found, return a JSON object with a key 'status' and value 'no signals found'.\n\n"
        f"Text: {text_content}"
    )
    try:
        vertexai.init(project=project, location=location)
        model = GenerativeModel(model_name)
        response = await model.generate_content_async(prompt)
        # Clean the response text
        cleaned = response.text.strip()
        if cleaned.startswith('```json'):
            cleaned = cleaned[len('```json'):].strip()
        if cleaned.startswith('```'):
            cleaned = cleaned[len('```'):].strip()
        if cleaned.endswith('```'):
            cleaned = cleaned[:-len('```')].strip()
        # Try to parse the cleaned response as JSON
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            return {"status": "Could not parse JSON from Gemini response", "raw_response": cleaned}
    except Exception as e:
        return {"status": f"error: {str(e)}"}

if __name__ == '__main__':
    import asyncio
    sample_text = (
        "Acme Corp announced a $10M Series B funding round led by TopVC. "
        "Jane Doe was appointed as the new CTO. The company is expanding into Europe and hiring for cloud engineers."
    )
    result = asyncio.run(analyze_text(sample_text))
    print(result) 