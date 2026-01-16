# AI-Powered Student Placement Management System (AIPSMS)

AIPSMS is a comprehensive, intelligent platform designed to bridge the gap between students and recruitment opportunities. Unlike traditional placement systems, AIPSMS utilizes an **AI Engine** to analyze resumes, calculate placement probabilities, and identify skill gaps to provide personalized learning recommendations.

 ## 📸 Visual Tour



![image alt](https://github.com/GaganCB2002/AI-Powered-Student-Placement-System/blob/main/Images/Screenshot%202026-01-16%20111021.png?raw=true)

![image alt](https://github.com/GaganCB2002/AI-Powered-Student-Placement-System/blob/main/Images/Screenshot%202026-01-16%20111057.png?raw=true)

![image alt](https://github.com/GaganCB2002/AI-Powered-Student-Placement-System/blob/main/Images/Screenshot%202026-01-16%20111119.png?raw=true)

![image alt](https://github.com/GaganCB2002/AI-Powered-Student-Placement-System/blob/main/Images/Screenshot%202026-01-16%20111141.png?raw=true)

![image alt](https://github.com/GaganCB2002/AI-Powered-Student-Placement-System/blob/main/Images/Screenshot%202026-01-16%20111147.png?raw=true)

![image alt](https://github.com/GaganCB2002/AI-Powered-Student-Placement-System/blob/main/Images/Screenshot%202026-01-16%20111152.png?raw=true)

![image alt](https://github.com/GaganCB2002/AI-Powered-Student-Placement-System/blob/main/Images/Screenshot%202026-01-16%20132239.png?raw=true)
![image alt](https://github.com/GaganCB2002/AI-Powered-Student-Placement-System/blob/main/Images/Screenshot%202026-01-16%20111159.png?raw=true)
![image alt](https://github.com/GaganCB2002/AI-Powered-Student-Placement-System/blob/main/Images/Screenshot%202026-01-16%20111405.png?raw=true)




## 🚀 Key Features

### Existing & Core Features
- **Role-Based Access**: Specialized portals for **Students** and **Administrators**.
- **Secure Authentication**: Robust login system backed by Spring Security and JWT.
- **Job Management**: Admins can post job openings with detailed descriptions and required skills.
- **Application Tracking**: Students can apply for jobs and track their status.
- **Dashboard Analytics**: Visual insights into placement statistics.

### ✨ New AI-Powered Features
The project integrates a dedicated AI Engine (FastAPI) to enhance the recruitment process:
- **📄 Smart Resume Parsing**: Automatically extracts skills, education, and experience from PDF/DOCX resumes.
- **🎯 Job Matching & Probability**: Scores candidates against job descriptions using TF-IDF and Cosine Similarity to predict placement success.
- **📊 Skill Gap Analysis**: Identifies missing skills for specific roles and provides a "match percentage".
- **💡 Learning Recommendations**: Suggests specific resources (courses, tutorials) to bridge identified skill gaps.

---

## 📂 Project Structure

```bash
student-palace-system/
├── src/ # (Conceptual Source Root)
│
├── frontend/                 # React.js + Vite Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Application pages (Student/Admin views)
│   │   └── services/         # API integration (Axios)
│   └── package.json
│
├── backend/                  # Spring Boot Backend
│   ├── src/main/java/com/aipsms/
│   │   ├── controller/       # REST API Endpoints
│   │   ├── model/            # JPA Entities (Student, Job, etc.)
│   │   └── service/          # Business Logic
│   └── pom.xml
│
├── ai_engine/                # Python FastAPI AI Service
│   ├── main.py               # API Entry point
│   ├── resume_parser.py      # NLP logic for parsing
│   ├── matcher.py            # Matching algorithms
│   └── requirements.txt
│
├── database/                 # Database scripts
│   └── schema.sql            # Initial database setup
│
├── run_aipsms.bat            # One-click startup script (Windows)
└── start_servers.py          # Python automation script
```

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React 19, Vite, Tailwind CSS, Three.js (Visuals) |
| **Backend** | Java 17, Spring Boot 3.2.0, Spring Security |
| **AI Engine** | Python 3.10+, FastAPI, scikit-learn, spaCy, NLTK |
| **Database** | PostgreSQL |

---

## ⚙️ Prerequisites

Before running the project, ensure you have the following installed:
1.  **Node.js** (v18 or higher)
2.  **Java JDK** (17 or higher)
3.  **Python** (3.9 or higher)
4.  **Maven** (optional, wrapper included)
5.  **PostgreSQL** (running locally)

---

## 🚀 How to Run

### Option 1: One-Click Start (Windows)
Simply double-click the `run_aipsms.bat` file in the root directory. This will check for dependencies and launch all three services (Frontend, Backend, AI Engine) in separate windows.

### Option 2: Using Python Script
Run the automation script from your terminal:
```bash
python start_servers.py
```

### Option 3: Manual Startup
If you prefer to run services individually:

**1. Database Setup**
Ensure your PostgreSQL database is running and configured according to `backend/src/main/resources/application.properties`.

**2. Backend (Spring Boot)**
```bash
cd backend
mvn spring-boot:run
# Server starts at http://localhost:8080
```

**3. AI Engine (FastAPI)**
```bash
cd ai_engine
pip install -r requirements.txt
python main.py
# Server starts at http://localhost:8000
```

**4. Frontend (React)**
```bash
cd frontend
npm install
npm run dev
# App starts at http://localhost:5173
```

---

## 📋 Application Workflow

1.  **Student Registration**: Students sign up and create their profiles.
2.  **Resume Upload**: A student uploads their resume (PDF/DOCX) via the portal.
3.  **AI Analysis**:
    - The **AI Engine** extracts skills and experience.
    - It compares the profile against available job listings.
4.  **Job Recommendations**: The system shows jobs with the highest "Placement Probability".
5.  **Skill Gap Check**: For any specific job, the student can see which skills they are missing.
6.  **Application**: The student applies for jobs they are eligible for.
7.  **Admin Review**: Administrators review applications and manage the recruitment lifecycle.

---

## 🤝 Contributing

We welcome contributions!
1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/NewFeature`).
3.  Commit your changes (`git commit -m 'Add some NewFeature'`).
4.  Push to the branch (`git push origin feature/NewFeature`).
5.  Open a Pull Request.


