exports.analyzeIssueText = async (description) => {
  const AI_URL = 'http://127.0.0.1:8000';
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    // 1. Updated endpoint to match your Python main.py
    const response = await fetch(`${AI_URL}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // 2. Updated payload to match Python's IssueRequest BaseModel
      body: JSON.stringify({ description: description }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) throw new Error(`AI Service returned status: ${response.status}`);
    
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("⚠️ AI Fetch Error:", error.message); 
    return null; 
  }
};