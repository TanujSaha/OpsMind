from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline

# A small synthetic dataset to train our model instantly on startup
TRAINING_DATA = [
    ("The AC in room 204 is running but not cooling.", "HVAC"),
    ("Ventilation is completely broken in the main hall.", "HVAC"),
    ("Water is leaking from the ceiling in the lobby.", "Plumbing"),
    ("Toilet is overflowing in the men's restroom.", "Plumbing"),
    ("Power outage in the east wing.", "Electrical"),
    ("Flickering lights and sparks in the hallway.", "Electrical"),
    ("Elevator 3 is stuck on the 4th floor.", "Elevator"),
    ("The freight elevator doors won't close.", "Elevator")
]

# Simple rule-based mapping for priority and actions based on the ML category prediction
CATEGORY_MAPPING = {
    "HVAC": {"priority": "MEDIUM", "severity": 6, "action": "Inspect compressor, condenser, and ventilation fans."},
    "Plumbing": {"priority": "HIGH", "severity": 8, "action": "Shut off main water valve and inspect pipes for leaks."},
    "Electrical": {"priority": "CRITICAL", "severity": 9, "action": "Check breaker box, verify circuit load, and secure area."},
    "Elevator": {"priority": "CRITICAL", "severity": 10, "action": "Halt elevator operations and dispatch emergency technician."},
    "Unassigned": {"priority": "LOW", "severity": 3, "action": "Awaiting manual inspection."}
}

class AIEngine:
    def __init__(self):
        # Create a Machine Learning pipeline: TF-IDF extracts text features, Logistic Regression classifies them
        self.model = make_pipeline(TfidfVectorizer(), LogisticRegression())
        self._train_model()

    def _train_model(self):
        # Train the model using our synthetic data
        texts = [item[0] for item in TRAINING_DATA]
        labels = [item[1] for item in TRAINING_DATA]
        self.model.fit(texts, labels)
        print("✅ AI Model trained successfully on startup!")

    def analyze_issue(self, description: str):
        if not description or not description.strip():
            return {"category": "Unassigned", **CATEGORY_MAPPING["Unassigned"]}

        # 1. Predict Category using Machine Learning
        predicted_category = self.model.predict([description])[0]
        
        # 2. Fetch related metadata mapping
        metadata = CATEGORY_MAPPING.get(predicted_category, CATEGORY_MAPPING["Unassigned"])
        
        return {
            "category": predicted_category,
            "priority": metadata["priority"],
            "severity": metadata["severity"],
            "recommendedAction": metadata["action"]
        }