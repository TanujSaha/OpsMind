from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ai_engine import AIEngine

app = FastAPI(title="OpsMind AI Service")

# Allow Node.js to talk to this service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize our ML model
ai = AIEngine()

# Define the expected JSON payload format
class IssueRequest(BaseModel):
    description: str

@app.get("/ai/health")
def health_check():
    return {"status": "AI Service is running!"}

@app.post("/ai/analyze")
def analyze_issue(request: IssueRequest):
    # Pass the text to our scikit-learn model
    result = ai.analyze_issue(request.description)
    return result