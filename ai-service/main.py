from fastapi import FastAPI
from pydantic import BaseModel
import re

app = FastAPI()

class IssueRequest(BaseModel):
    description: str

@app.post("/analyze")
async def analyze_issue(request: IssueRequest):
    text = request.description.lower()
    
    # Default values
    department = "General Facilities"
    category = "General Maintenance"
    priority = "Medium"
    eta = "24-48 Hours"
    
    # Real-world keyword routing logic
    if any(word in text for word in ["wifi", "internet", "router", "connection", "net", "slow", "ethernet"]):
        department = "IT & Network Support"
        category = "Network Infrastructure"
        priority = "High"
        eta = "2-4 Hours"
    elif any(word in text for word in ["light", "fan", "ac", "power", "socket", "short circuit", "electricity", "switch"]):
        department = "Electrical Maintenance"
        category = "Power & HVAC"
        priority = "High" if "spark" in text or "smoke" in text else "Medium"
        eta = "4-6 Hours"
    elif any(word in text for word in ["water", "pipe", "leak", "tap", "washroom", "toilet", "drainage"]):
        department = "Plumbing & Sanitation"
        category = "Water Works"
        priority = "High" if "leak" in text else "Medium"
        eta = "3-5 Hours"
    elif any(word in text for word in ["pc", "computer", "lab", "projector", "screen", "keyboard"]):
        department = "Lab Administration"
        category = "Hardware Asset"
        priority = "Medium"
        eta = "12 Hours"

    return {
        "department": department,
        "category": category,
        "priority": priority,
        "eta": eta,
        "status": "Assigned"
    }

@app.get("/")
def root():
    return {"status": "OpsMind AI Engine Online"}