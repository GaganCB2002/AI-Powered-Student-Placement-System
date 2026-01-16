from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import shutil
import os
from typing import List, Optional
from pydantic import BaseModel

from resume_parser import parse_resume
from matcher import JobMatcher

app = FastAPI()
matcher = JobMatcher()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Data Models
class JobRequest(BaseModel):
    job_id: str
    title: str
    description: str
    required_skills: List[str]

class MatchRequest(BaseModel):
    resume_text: str
    resume_skills: List[str]
    jobs: List[JobRequest]
    cgpa: float = 0.0
    internships: int = 0

@app.get("/")
def read_root():
    return {"message": "AIPSMS AI Engine is Powered Up 🚀"}

@app.post("/analyze-resume")
async def analyze_resume_endpoint(file: UploadFile = File(...)):
    try:
        allowed_extensions = {".pdf", ".docx"}
        ext = os.path.splitext(file.filename)[1].lower()
        
        if ext not in allowed_extensions:
             raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")

        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Parse the resume
        analysis_result = parse_resume(file_path)
        
        # Cleanup
        # os.remove(file_path) 
        
        return {
            "filename": file.filename,
            "data": analysis_result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/match-jobs")
def match_jobs_endpoint(request: MatchRequest):
    try:
        job_descriptions = [job.description + " " + " ".join(job.required_skills) for job in request.jobs]
        
        # 1. Similarity Matching
        similarity_scores = matcher.match_jobs(request.resume_text, job_descriptions)
        
        results = []
        for i, job in enumerate(request.jobs):
            # 2. Skill Gap Analysis
            gap_analysis = matcher.analyze_skill_gap(request.resume_skills, job.required_skills)
            
            # 3. Placement Score
            placement_score = matcher.calculate_placement_score(
                gap_analysis['match_percentage'], 
                request.cgpa, 
                request.internships
            )
            
            results.append({
                "job_id": job.job_id,
                "title": job.title,
                "similarity_score": round(similarity_scores[i] * 100, 2),
                "placement_probability": placement_score,
                "missing_skills": gap_analysis['missing_skills'],
                "matching_skills": gap_analysis['matching_skills']
            })
            
        # Sort by placement probability
        results.sort(key=lambda x: x['placement_probability'], reverse=True)
        
        return {"matches": results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend-learning")
def recommend_learning(missing_skills: List[str] = Body(...)):
    # Simple Mock Recommendation Engine
    recommendations = []
    library = {
        "python": "Advanced Python by RealPython",
        "react": "React - The Complete Guide (Udemy)",
        "aws": "AWS Certified Solutions Architect",
        "sql": "SQLZoo Interactive Tutorials",
        "java": "Effective Java Series"
    }
    
    for skill in missing_skills:
        skill_lower = skill.lower()
        for key in library:
            if key in skill_lower:
                recommendations.append({"skill": skill, "course": library[key]})
    
    return {"recommendations": recommendations}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
