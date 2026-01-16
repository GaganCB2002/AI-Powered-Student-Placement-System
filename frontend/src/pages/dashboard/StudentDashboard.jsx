import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import SkillRoadmap from '../../components/SkillRoadmap'
import jobService from '../../services/JobService'
import resumeService from '../../services/ResumeService'

export default function StudentDashboard() {
    const navigate = useNavigate()
    const [jobs, setJobs] = useState([])
    const [stats, setStats] = useState({ applied: 0, matches: 0 })
    const [userProfile, setUserProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    // AI Roadmap State
    const [file, setFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [aiAnalysis, setAiAnalysis] = useState(null) // Holds Gemini Data

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user')) || { name: 'Student', email: 'student@test.com', skills: [] };
        setUserProfile(user);

        // If user already has Analysis data from DB, load it directly
        if (user.aiAnalysis) {
            setAiAnalysis(user.aiAnalysis)
        } else if (user.skills && user.skills.length > 0) {
            // Fallback: Re-generate if only skills exist
            resumeService.analyzeSkillsWithGemini(user.skills).then(data => setAiAnalysis(data));
        }

        const fetchData = async () => {
            setLoading(true);
            const fetchedJobs = await jobService.fetchJobs();
            const applications = jobService.getApplications(user.email);

            // Match Score Calculation (if skills exist)
            const scoredJobs = fetchedJobs.map(job => {
                const { score } = resumeService.calculateMatchScore(user.skills || [], job.skills || []);
                return { ...job, matchScore: score };
            }).sort((a, b) => b.matchScore - a.matchScore);

            setJobs(scoredJobs.slice(0, 6));
            setStats({
                applied: applications.length,
                matches: scoredJobs.filter(j => j.matchScore > 80).length
            });
            setLoading(false);
        };
        fetchData();
    }, [])

    const handleFileUpload = async () => {
        if (!file) return;
        setUploading(true);
        try {
            // 1. Simulate Parse
            const profile = await resumeService.parseResume(file);

            // 2. Simulate Gemini Analysis
            const analysis = await resumeService.analyzeSkillsWithGemini(profile.extractedSkills);

            setAiAnalysis(analysis);

            // 3. Update User Context & Persistent "DB"
            const updatedUser = {
                ...userProfile,
                skills: profile.extractedSkills,
                resumeUploaded: true,
                aiAnalysis: analysis // Save the full roadmap too!
            };

            // Save to Session
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUserProfile(updatedUser);

            // Save to Persistent Mock DB
            const dbUsers = JSON.parse(localStorage.getItem('DB_USERS') || "{}")
            if (updatedUser.email) {
                dbUsers[updatedUser.email] = updatedUser
                localStorage.setItem('DB_USERS', JSON.stringify(dbUsers))
            }

        } catch (e) {
            console.error("Analysis Failed", e);
        } finally {
            setUploading(false);
        }
    }

    // --- MANDATORY ASSESSMENT POLICY CHECK ---
    const [policyStatus, setPolicyStatus] = useState({ compliant: true, warning: false, daysLeft: 15, modalOpen: false })

    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        // Check if modal was already shown in this session
        const wasShown = sessionStorage.getItem('assessmentModalShown');

        // Calculate policy status (keep exiting logic for warning banners)
        const checkPolicy = () => {
            const lastDate = localStorage.getItem('lastAssessmentDate')
            const score = parseInt(localStorage.getItem('assessmentScore') || '0', 10)

            // LOGIC: Show modal if "Not Compliant" AND "Not Shown Yet"
            // If no test taken or expired/low score
            const isCompliant = lastDate && (new Date() - new Date(lastDate) < 15 * 24 * 60 * 60 * 1000) && score >= 75;

            if (!isCompliant && !wasShown) {
                setShowModal(true)
                sessionStorage.setItem('assessmentModalShown', 'true')
            }

            // Update warning state for banner
            if (!lastDate) {
                setPolicyStatus({ compliant: false, warning: false, daysLeft: 0 })
            } else {
                const diffTime = Math.abs(new Date() - new Date(lastDate))
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                if (!isCompliant) {
                    setPolicyStatus({ compliant: false, warning: false, daysLeft: 0 })
                } else {
                    // Compliant but expiring
                    setPolicyStatus({ compliant: true, warning: 15 - diffDays <= 3, daysLeft: 15 - diffDays })
                }
            }
        }
        checkPolicy()
    }, [])

    const closeModal = () => setShowModal(false);

    return (
        <DashboardLayout role="student">
            {/* POLICY BLOCKING MODAL - DISMISSIBLE */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-[#1a1a1a] border-2 border-red-500/50 rounded-3xl max-w-2xl w-full p-8 relative shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                        >
                            ✕
                        </button>

                        <div className="text-6xl mb-6 text-center animate-bounce">⏳</div>
                        <h2 className="text-3xl font-bold mb-4 text-center">Mandatory Skill Assessment Required</h2>

                        <div className="space-y-4 mb-8 bg-white/5 p-6 rounded-xl border-l-4 border-red-500">
                            <p className="text-gray-300">To ensure quality, all students must maintain a valid assessment score.</p>
                            <ul className="text-sm font-mono space-y-2 text-red-200">
                                <li>• Assessments are valid for **15 Days** only.</li>
                                <li>• You must maintain a **75% Score** average.</li>
                                <li>• Questions cover **Frontend, Backend, and Database**.</li>
                            </ul>
                        </div>

                        <button
                            onClick={() => navigate('/dashboard/student/assessment')}
                            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl text-xl transition-all shadow-lg flex items-center justify-center gap-3"
                        >
                            <span>📝</span> Take Assessment Now
                        </button>

                        <div className="mt-4 text-center">
                            <button onClick={closeModal} className="text-sm text-gray-500 hover:text-gray-300 underline">
                                I'll do this later
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* EXPIRY WARNING BANNER */}
            {policyStatus.compliant && policyStatus.warning && (
                <div className="mb-6 bg-yellow-500/10 border border-yellow-500/50 p-4 rounded-xl flex items-center justify-between animate-pulse">
                    <div className="flex items-center gap-4">
                        <span className="text-2xl">⚠️</span>
                        <div>
                            <h4 className="font-bold text-yellow-500">Assessment Expiring Soon</h4>
                            <p className="text-xs text-yellow-200/80">Your skill score expires in <span className="text-white font-bold">{policyStatus.daysLeft} days</span>. Retake now to avoid service interruption.</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/dashboard/student/assessment')} className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold text-sm hover:scale-105 transition-transform">
                        Retake Test
                    </button>
                </div>
            )}

            <h2 className="text-3xl font-bold mb-6">Student Dashboard</h2>


            {/* AI Career Roadmapping Section (The "Zero State" Handler) */}
            <div className="mb-10">
                {!aiAnalysis ? (
                    /* ZERO STATE: Upload Resume Prompt */
                    <div className="glass-card p-10 rounded-3xl text-center relative overflow-hidden group border border-dashed border-white/20">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-600 animate-pulse"></div>

                        <div className="max-w-xl mx-auto relative z-10">
                            <div className="text-6xl mb-6 animate-bounce">📄</div>
                            <h2 className="text-3xl font-bold mb-4">Start Your AI Career Journey</h2>
                            <p className="text-gray-400 mb-8">
                                Upload your resume to unlock a <span className="text-primary font-bold">Personalized AI Skill Roadmap</span>.
                                We'll analyze your current skills, predict future market trends, and give you a free learning path.
                            </p>

                            <div className="flex justify-center gap-4 items-center">
                                <input
                                    type="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-3 file:px-6
                                    file:rounded-xl file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-primary/10 file:text-primary
                                    hover:file:bg-primary/20 cursor-pointer"
                                />
                                <button
                                    onClick={handleFileUpload}
                                    disabled={!file || uploading}
                                    className="bg-primary text-black font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 shadow-[0_0_20px_rgba(0,242,234,0.3)]"
                                >
                                    {uploading ? 'Analyzing with Gemini...' : 'Analyze Now 🚀'}
                                </button>
                            </div>
                        </div>

                        {/* Background Deco */}
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"></div>
                    </div>
                ) : (
                    /* ACTIVE STATE: The Roadmap */
                    <div className="animate-fade-in space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                                🚀 AI Career Architect
                            </h2>
                            <button
                                onClick={() => {
                                    if (window.confirm("Upload a new resume? This will replace your current roadmap.")) {
                                        setAiAnalysis(null);
                                        setFile(null);
                                    }
                                }}
                                className="text-sm bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg text-gray-300 transition-colors flex items-center gap-2"
                            >
                                <span>🔄</span> Re-Analyze Resume
                            </button>
                        </div>
                        <SkillRoadmap analysis={aiAnalysis} />
                    </div>
                )}
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-3xl">📝</div>
                    <div>
                        <h3 className="text-gray-400 text-sm font-medium">Applications</h3>
                        <p className="text-3xl font-bold text-white">{stats.applied}</p>
                    </div>
                </div>
                <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-3xl">⚡</div>
                    <div>
                        <h3 className="text-gray-400 text-sm font-medium">Perfect Matches</h3>
                        <p className="text-3xl font-bold text-white">{stats.matches}</p>
                    </div>
                </div>
                <div className="glass-card p-6 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => navigate('/dashboard/student/assessment')}>
                    <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center text-3xl">🛡️</div>
                    <div>
                        <h3 className="text-gray-400 text-sm font-medium">Skill Test</h3>
                        <p className="text-base font-bold text-primary">Take Assessment →</p>
                    </div>
                </div>
            </div>

            {/* Recommended Jobs Grid */}
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">⚡</span> Smart Job Picks
            </h3>

            {loading ? (
                <div className="h-40 flex items-center justify-center text-gray-500">Loading Recommendations...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                        <div key={job.id} onClick={() => navigate('/dashboard/student/jobs')} className="glass-card p-6 rounded-2xl group relative overflow-hidden flex flex-col cursor-pointer hover:shadow-[0_0_30px_rgba(0,242,234,0.15)] transition-all">
                            <div className={`absolute top-0 right-0 text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl ${job.matchScore > 80 ? 'bg-green-500 text-black' : 'bg-yellow-500 text-black'}`}>
                                {job.matchScore}% MATCH
                            </div>

                            <div className="flex justify-between items-start mb-2 mt-2">
                                <h4 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">{job.title}</h4>
                            </div>

                            <p className="text-gray-400 text-sm mb-4 font-medium">{job.company}</p>

                            <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                                <span className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-blue-300">{job.location}</span>
                                <span className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-green-300 font-bold">{job.salary}</span>
                            </div>

                            <div className="w-full py-2 rounded-xl bg-white/5 text-center text-sm font-bold group-hover:bg-primary group-hover:text-black transition-colors">
                                View Details
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    )
}
