from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class JobMatcher:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english')

    def match_jobs(self, resume_text, job_descriptions):
        """
        Matches a resume against a list of job descriptions.
        """
        if not job_descriptions:
            return []

        documents = [resume_text] + job_descriptions
        tfidf_matrix = self.vectorizer.fit_transform(documents)
        
        # Calculate cosine similarity between resume (index 0) and all jobs (index 1 to N)
        cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
        
        return cosine_sim.tolist()

    def analyze_skill_gap(self, resume_skills, job_required_skills):
        """
        Identifies missing skills.
        """
        resume_set = set([s.lower() for s in resume_skills])
        job_set = set([s.lower() for s in job_required_skills])
        
        missing_skills = list(job_set - resume_set)
        matching_skills = list(job_set.intersection(resume_set))
        
        match_percentage = (len(matching_skills) / len(job_set)) * 100 if job_set else 0
        
        return {
            "missing_skills": missing_skills,
            "matching_skills": matching_skills,
            "match_percentage": round(match_percentage, 2)
        }

    def calculate_placement_score(self, match_percentage, cgpa, internship_count):
        """
        Calculates a placement probability score (0-100).
        Weights: Skills (60%), CGPA (20%), Experience (20%)
        """
        # Normalize inputs
        cgpa_score = (cgpa / 10.0) * 100 if cgpa <= 10 else cgpa # Assume 10 scale or 100 scale
        exp_score = min(internship_count * 25, 100) # Cap at 4 internships
        
        final_score = (match_percentage * 0.6) + (cgpa_score * 0.2) + (exp_score * 0.2)
        return round(final_score, 2)
