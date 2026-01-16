import re
import spacy
from pdfminer.high_level import extract_text as extract_pdf_text
import docx

# Load NLP model
try:
    nlp = spacy.load("en_core_web_sm")
except:
    # If model is not present, we will fallback to simple parsing or user needs to install it
    # For this environment, we assume dependencies are installed or we handle gracefully
    nlp = None

def parse_resume(file_path):
    text = ""
    if file_path.endswith('.pdf'):
        text = extract_pdf_text(file_path)
    elif file_path.endswith('.docx'):
        doc = docx.Document(file_path)
        text = " ".join([para.text for para in doc.paragraphs])
    
    return {
        "email": extract_email(text),
        "phone": extract_phone(text),
        "skills": extract_skills(text),
        "education": extract_education(text),
        "raw_text": text
    }

def extract_email(text):
    match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    return match.group(0) if match else None

def extract_phone(text):
    match = re.search(r'(\d{3}[-\.\s]??\d{3}[-\.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-\.\s]??\d{4}|\d{3}[-\.\s]??\d{4})', text)
    return match.group(0) if match else None

def extract_skills(text):
    # Expanded skill database
    known_skills = {
        "Python", "Java", "C++", "C#", "JavaScript", "TypeScript", "React", "Angular", "Vue",
        "HTML", "CSS", "SQL", "NoSQL", "MongoDB", "PostgreSQL", "MySQL",
        "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Jenkins", "CI/CD",
        "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy",
        "NLP", "Computer Vision", "Git", "GitHub", "Linux", "Agile", "Scrum",
        "Communication", "Leadership", "Problem Solving", "Teamwork"
    }
    
    found_skills = set()
    
    # 1. Regex/Keyword Matching (High Precision)
    text_lower = text.lower()
    for skill in known_skills:
        # Check for word boundary to avoid partial matches (e.g., "Java" in "JavaScript")
        if re.search(r'\b' + re.escape(skill.lower()) + r'\b', text_lower):
            found_skills.add(skill)
            
    # 2. NLP Entity Extraction (If model loaded)
    if nlp:
        doc = nlp(text)
        # Assuming we might catch some ORG or PRODUCT entities that are skills not in our DB
        for ent in doc.ents:
            if ent.label_ in ["ORG", "PRODUCT", "LANGUAGE"] and ent.text in known_skills:
                 found_skills.add(ent.text)
                 
    return list(found_skills)

def extract_education(text):
    # Simple heuristic
    education_keywords = ["Bachelor", "Master", "B.Tech", "M.Tech", "PhD", "Degree", "University", "College"]
    found_edu = []
    for line in text.split('\n'):
        for key in education_keywords:
            if key.lower() in line.lower():
                found_edu.append(line.strip())
                break
    return found_edu[:2] # Return top 2 found lines
