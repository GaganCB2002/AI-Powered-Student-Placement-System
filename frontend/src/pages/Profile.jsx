import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import resumeService from '../services/ResumeService'

export default function Profile() {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        skills: [],
        bio: '',
        phone: '',
        resumeName: ''
    })
    const [loading, setLoading] = useState(false)
    const [analyzing, setAnalyzing] = useState(false)
    const [analysisResult, setAnalysisResult] = useState(null)
    const [newSkill, setNewSkill] = useState('')

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user')) || {}
        setUser({
            ...storedUser,
            skills: storedUser.skills || ['React', 'Java'],
            bio: storedUser.bio || 'Passionate learner aiming for top product companies.',
            phone: storedUser.phone || '+91 98765 43210',
            email: storedUser.email || 'student@test.com',
            address: storedUser.address || '123, Tech Street, Silicon Valley, India',
            resumeName: storedUser.resumeName || 'resume_v1.pdf',
            avatar: storedUser.avatar || null // For preview
        })
    }, [])

    const handleFileChange = (e, field) => {
        const file = e.target.files[0]
        if (file) {
            // If it's the avatar, convert to Base64 for persistence
            if (field === 'avatar') {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result;
                    setUser(prev => ({ ...prev, avatar: base64String }));

                    // Update LocalStorage Immediately for Header Sync
                    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
                    const updatedUser = { ...currentUser, avatar: base64String };
                    localStorage.setItem('user', JSON.stringify(updatedUser));

                    // Dispatch event to notify Header
                    window.dispatchEvent(new Event('userUpdated'));
                };
                reader.readAsDataURL(file);
            } else {
                setUser({ ...user, [field]: file.name })
            }
        }
    }

    const handleAnalyzeResume = async () => {
        setAnalyzing(true)
        try {
            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Mock Analysis Data (In real app, this comes from backend/gemini)
            const mockAnalysis = {
                score: 85,
                extractedSkills: ['React', 'JavaScript', 'Tailwind CSS', 'Node.js'],
                missingSkills: ['TypeScript', 'GraphQL', 'AWS'],
                summary: "Strong frontend focus. Consider adding backend skills for full-stack roles.",
                improvements: [
                    "Add a project showcasing GraphQL usage",
                    "Certify in AWS Cloud Basics",
                    "Include quantifiable metrics in experience"
                ]
            }

            setAnalysisResult(mockAnalysis)

            // Update User with new skills if found
            const updatedUser = {
                ...user,
                skills: [...new Set([...user.skills, ...mockAnalysis.extractedSkills])],
                aiAnalysis: mockAnalysis // Save for dashboard
            }
            setUser(updatedUser)
            localStorage.setItem('user', JSON.stringify(updatedUser))

        } catch (error) {
            console.error("Analysis failed", error)
        } finally {
            setAnalyzing(false)
        }
    }

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const handleAddSkill = (e) => {
        if (e.key === 'Enter' && newSkill.trim()) {
            e.preventDefault()
            const updatedSkills = [...user.skills, newSkill.trim()]
            setUser({ ...user, skills: updatedSkills })
            setNewSkill('')
        }
    }

    const removeSkill = (skillToRemove) => {
        setUser({ ...user, skills: user.skills.filter(s => s !== skillToRemove) })
    }

    const handleSave = (e) => {
        e.preventDefault()
        setLoading(true)
        // Simulate API call
        setTimeout(() => {
            localStorage.setItem('user', JSON.stringify(user))
            alert("Profile Updated Successfully! ✅")
            setLoading(false)
        }, 800)
    }

    return (
        <DashboardLayout role={user.roles?.[0]?.replace('ROLE_', '').toLowerCase() || 'student'}>
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <span className="text-primary">👤</span> My Profile
                </h2>

                <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Avatar & Quick Info */}
                    <div className="glass-card p-8 rounded-3xl flex flex-col items-center text-center h-fit">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-purple-600 p-1 mb-6 shadow-[0_0_30px_rgba(0,242,234,0.3)] relative group cursor-pointer" onClick={() => document.getElementById('avatar-upload').click()}>
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                {user.avatar ? (
                                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent group-hover:hidden">
                                        {user.firstName?.charAt(0)}
                                    </span>
                                )}
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-sm font-bold text-white">Change</span>
                                </div>
                            </div>
                            <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} />
                        </div>

                        <h3 className="text-xl font-bold">{user.firstName} {user.lastName}</h3>
                        <p className="text-gray-400 text-sm mb-6 capitalize">{user.roles?.[0]?.replace('ROLE_', '').replace('_', ' ').toLowerCase()}</p>

                        <div className="w-full space-y-3">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                                <span>📧</span>
                                <span className="text-sm truncate">{user.email}</span>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                                <span>📱</span>
                                <span className="text-sm truncate">{user.phone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Edit Form */}
                    <div className="lg:col-span-2 glass-card p-8 rounded-3xl">
                        <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Personal Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">First Name</label>
                                <input name="firstName" value={user.firstName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Last Name</label>
                                <input name="lastName" value={user.lastName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm text-gray-400 mb-2">Bio</label>
                            <textarea name="bio" value={user.bio} onChange={handleChange} rows="3" className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Email</label>
                                <input name="email" value={user.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Phone</label>
                                <input name="phone" value={user.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm text-gray-400 mb-2">Address</label>
                            <input name="address" value={user.address || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                        </div>

                        <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4 mt-8">Skills & Resume</h3>

                        <div className="mb-6">
                            <label className="block text-sm text-gray-400 mb-2">Skills (Press Enter to add)</label>
                            <input
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyDown={handleAddSkill}
                                placeholder="e.g. React, Python, AWS"
                                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all mb-3"
                            />
                            <div className="flex flex-wrap gap-2">
                                {user.skills.map(skill => (
                                    <span key={skill} className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/30 text-sm flex items-center gap-2 group">
                                        {skill}
                                        <button type="button" onClick={() => removeSkill(skill)} className="hover:text-white transition-colors">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm text-gray-400 mb-2">Resume</label>
                            <div className="flex items-center gap-4 p-4 border border-dashed border-white/20 rounded-xl hover:bg-white/5 transition-all">
                                <span className="text-3xl">📄</span>
                                <div>
                                    <p className="font-bold text-sm text-white">{user.resumeName}</p>
                                    <p className="text-xs text-gray-500">Last updated: Just now</p>
                                </div>
                                <div className="ml-auto flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleAnalyzeResume}
                                        className="text-sm px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-2"
                                        disabled={analyzing}
                                    >
                                        {analyzing ? (
                                            <>
                                                <span className="animate-spin">⏳</span> Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <span>🧠</span> Analyze
                                            </>
                                        )}
                                    </button>
                                    <button type="button" onClick={() => document.getElementById('resume-upload').click()} className="text-sm text-secondary hover:underline">Replace</button>
                                </div>
                                <input type="file" id="resume-upload" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e, 'resume')} />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button type="button" className="px-6 py-3 rounded-xl text-gray-400 hover:text-white transition-colors">Cancel</button>
                            <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-secondary to-pink-600 font-bold text-white shadow-[0_0_20px_rgba(255,0,80,0.3)] hover:shadow-[0_0_30px_rgba(255,0,80,0.5)] transform hover:scale-105 transition-all">
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>


            {/* ANALYSIS RESULT MODAL */}
            {
                analysisResult && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                        <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl max-w-2xl w-full p-8 relative shadow-2xl">
                            <button onClick={() => setAnalysisResult(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">✕</button>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-3xl font-bold text-black">
                                    {analysisResult.score}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">Resume Analysis Report</h3>
                                    <p className="text-gray-400 text-sm">AI-Powered Insights</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                                    <h4 className="font-bold text-green-400 mb-2">✅ Extracted Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {analysisResult.extractedSkills.map(s => (
                                            <span key={s} className="text-xs px-2 py-1 bg-green-500/20 rounded text-green-300">{s}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                    <h4 className="font-bold text-red-400 mb-2">⚠️ Missing to Target</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {analysisResult.missingSkills.map(s => (
                                            <span key={s} className="text-xs px-2 py-1 bg-red-500/20 rounded text-red-300">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="font-bold mb-3 flex items-center gap-2">
                                    <span className="text-yellow-400">💡</span> Improvement Tips
                                </h4>
                                <ul className="space-y-2 text-gray-300 text-sm">
                                    {analysisResult.improvements.map((tip, i) => (
                                        <li key={i} className="flex gap-2">
                                            <span>•</span>
                                            <span>{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button onClick={() => setAnalysisResult(null)} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors">
                                Close Report
                            </button>
                        </div>
                    </div>
                )
            }
        </DashboardLayout>
    )
}
