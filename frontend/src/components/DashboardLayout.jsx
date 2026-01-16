import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import AiChatBot from './AiChatBot'

const SidebarItem = ({ to, icon, label }) => {
    const location = useLocation()
    const isActive = location.pathname === to

    return (
        <Link to={to} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${isActive ? 'bg-[#00f2ea]/10 text-[#00f2ea] shadow-[0_0_20px_rgba(0,242,234,0.15)] font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <span className={`text-xl transition-transform group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>{icon}</span>
            <span>{label}</span>
            {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00f2ea] shadow-[0_0_10px_#00f2ea]"></div>}
        </Link>
    )
}

export default function DashboardLayout({ children, role }) {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [userAvatar, setUserAvatar] = useState(null) // State for avatar
    const [showNotifications, setShowNotifications] = useState(false) // State for dropdown
    const [selectedNotification, setSelectedNotification] = useState(null) // Modal State
    const [showAssessmentModal, setShowAssessmentModal] = useState(false) // New Assessment Modal State

    // Mock Notifications with Rich Details
    const [notifications] = useState([
        {
            id: 1,
            text: "Resume analysis complete: 85% match!",
            time: "2 mins ago",
            type: "success",
            details: "Your resume scored 85% for the 'Frontend Developer' role. You matched key skills: React, JavaScript, and CSS. Recommendation: Add more backend projects to increase your score."
        },
        {
            id: 2,
            text: "New job posted: React Developer",
            time: "1 hour ago",
            type: "info",
            details: "TechCorp Inc. just posted a new opening for a Senior React Developer. Salary range: $80k - $120k. Location: Remote. Apply now to be an early applicant!"
        },
        {
            id: 3,
            text: "Interview scheduled with Google",
            time: "2 hours ago",
            type: "warning",
            details: "Your technical interview is confirmed for tomorrow at 10:00 AM EST via Google Meet. Check your email for the calendar invite and preparation materials."
        },
        {
            id: 4,
            text: "Profile update reminder",
            time: "5 hours ago",
            type: "alert",
            details: "It's been 30 days since your last profile update. Keeping your skills current increases your visibility to recruiters by 40%. Please review your profile."
        }
    ])

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (!user) {
            navigate('/auth/login')
            return
        }
        setUsername(user.firstName || 'User')
        // Load avatar from storage (support base64 or url)
        if (user.avatar || user.profileImage) {
            setUserAvatar(user.avatar || user.profileImage)
        }
    }, [navigate])

    const handleLogout = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        navigate('/')
    }

    // Listen for storage changes to update avatar/name in real-time
    useEffect(() => {
        const handleStorageChange = () => {
            const user = JSON.parse(localStorage.getItem('user'))
            if (user) {
                setUsername(user.firstName || 'User')
                setUserAvatar(user.avatar || user.profileImage)
            }
        }

        // Listen for custom event 'userUpdated' (dispatched from Profile)
        window.addEventListener('userUpdated', handleStorageChange)
        // Also listen to standard storage events
        window.addEventListener('storage', handleStorageChange)

        return () => {
            window.removeEventListener('userUpdated', handleStorageChange)
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [])

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-black text-white">
            {/* Global Marquee - Clickable for Assessment Modal */}
            <div
                className="bg-[#ff0050] text-white font-bold py-1.5 overflow-hidden z-40 shadow-md border-b border-white/10 shrink-0 relative cursor-pointer hover:bg-[#d40043] transition-colors"
                onClick={() => setShowAssessmentModal(true)}
            >
                <div className="animate-marquee whitespace-nowrap text-sm tracking-wide">
                    ⚠️ Mandatory Skill Assessment Required: Assessments are valid for **15 Days** only. &nbsp;&nbsp;&nbsp;&nbsp; 📈 You must maintain a **75% Score** average to be eligible for placements. &nbsp;&nbsp;&nbsp;&nbsp; 📚 Questions cover **Frontend, Backend, and Database** concepts. &nbsp;&nbsp;&nbsp;&nbsp; ⏳ Click here to Take Assessment Now!
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar */}
                <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 p-6 flex flex-col relative overflow-hidden z-20 group">
                    {/* Sidebar Glow */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-primary/10 blur-[60px] pointer-events-none"></div>

                    <h1 className="text-3xl font-bold mb-10 tracking-tight flex items-center gap-2">
                        <span className="text-4xl">🚀</span>
                        <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">SkillNova AI</span>
                    </h1>

                    <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar relative pr-2" id="sidebar-nav">
                        <SidebarItem to="/" icon="🏠" label="Home" />
                        <SidebarItem to={role === 'student' ? '/dashboard/student' : `/dashboard/${role}`} icon="📊" label="Overview" />
                        {role === 'student' && (
                            <>
                                <SidebarItem to="/dashboard/student/jobs" icon="💼" label="Find Jobs" />
                                <SidebarItem to="/dashboard/student/applications" icon="📝" label="Applications" />
                                <SidebarItem to="/dashboard/student/auto-apply" icon="🤖" label="AI Auto-Apply" />
                                <SidebarItem to="/dashboard/student/roadmap" icon="🗺️" label="AI Roadmap" />
                                <SidebarItem to="/dashboard/student/assessment" icon="🛡️" label="Skill Test" />
                                <SidebarItem to="/dashboard/student/interview" icon="🎙️" label="Mock Interview" />
                            </>
                        )}
                        {role === 'hr' && <SidebarItem to="/dashboard/hr/post-job" icon="✍️" label="Post a Job" />}
                        {role === 'officer' && <SidebarItem to="/dashboard/officer" icon="📈" label="Analytics" />}
                        <SidebarItem to="/profile" icon="👤" label="Profile" />
                    </nav>

                    {/* Scroll Hint (Visible only if overflow/hover) */}
                    <div className="absolute bottom-24 left-0 w-full flex justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="animate-bounce bg-black/50 backdrop-blur-sm rounded-full p-1 border border-white/10">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 mt-auto relative z-10 bg-[#0a0a0a]">
                        <Link to="/profile" className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center font-bold text-lg overflow-hidden">
                                {userAvatar ? (
                                    <img src={userAvatar} alt="User" className="w-full h-full object-cover" />
                                ) : (
                                    username.charAt(0)
                                )}
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-sm font-bold text-white truncate">{username}</div>
                                <div className="text-xs text-gray-400 capitalize">{role}</div>
                            </div>
                        </Link>
                        <button onClick={handleLogout} className="w-full py-2.5 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all font-medium text-sm flex items-center justify-center gap-2">
                            <span>🚪</span> Logout
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 overflow-y-auto relative flex flex-col z-10">
                    {/* Background glow similar to Landing */}
                    <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

                    {/* Top Header with Interactive Bell & Avatar */}
                    <header className="flex justify-between items-center mb-6 relative z-50">
                        <h2 className="text-gray-400 tracking-wider text-sm uppercase">
                            Dashboard / {location.pathname.split('/').pop().replace('-', ' ')}
                        </h2>

                        <div className="flex items-center gap-6">
                            {/* Notification Bell */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative p-2 hover:bg-white/5 rounded-full transition-colors focus:outline-none"
                                >
                                    <span className="text-2xl">🔔</span>
                                    {/* Badge Count: 24 */}
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold">
                                        24
                                    </span>
                                </button>

                                {/* Notification Dropdown */}
                                {showNotifications && (
                                    <div className="absolute right-0 mt-3 w-80 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-fade-in-down">
                                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                                            <h3 className="font-bold relative z-10">Notifications</h3>
                                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">24 New</span>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto custom-scrollbar relative z-10">
                                            {notifications.map(n => (
                                                <div
                                                    key={n.id}
                                                    onClick={() => {
                                                        setSelectedNotification(n)
                                                        setShowNotifications(false)
                                                    }}
                                                    className="p-4 hover:bg-white/5 border-b border-white/5 transition-colors cursor-pointer flex gap-3 group"
                                                >
                                                    <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${n.type === 'success' ? 'bg-green-500' :
                                                        n.type === 'warning' ? 'bg-yellow-500' :
                                                            n.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'
                                                        }`}></div>
                                                    <div>
                                                        <p className="text-sm text-gray-200 leading-tight mb-1 group-hover:text-primary transition-colors">{n.text}</p>
                                                        <p className="text-[10px] text-gray-500">{n.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-3 text-center border-t border-white/5 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer relative z-10">
                                            <span className="text-xs font-bold text-primary">View All Notifications</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* User Avatar - Wrapped in Link */}
                            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                                <Link to="/profile" className="block relative group">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-purple-600 p-[2px] transform group-hover:scale-105 transition-transform">
                                        <div className="w-full h-full rounded-full bg-black overflow-hidden">
                                            <img
                                                src={userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </header>

                    <div className="relative z-10 flex-1">
                        {children}
                    </div>
                </main>
            </div>

            <AiChatBot />

            {/* Notification Details Modal */}
            {selectedNotification && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
                        <button
                            onClick={() => setSelectedNotification(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                        >
                            ✕
                        </button>

                        <div className="mb-6">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-4 ${selectedNotification.type === 'success' ? 'bg-green-500/20 text-green-500' :
                                selectedNotification.type === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
                                    selectedNotification.type === 'alert' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'
                                }`}>
                                {selectedNotification.type === 'success' ? '✅' : selectedNotification.type === 'alert' ? '⚠️' : 'ℹ️'}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{selectedNotification.text}</h3>
                            <p className="text-xs text-gray-500">{selectedNotification.time}</p>
                        </div>

                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 mb-6 text-gray-300 text-sm leading-relaxed">
                            {selectedNotification.details}
                        </div>

                        <button
                            onClick={() => setSelectedNotification(null)}
                            className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}

            {/* Mandatory Assessment Modal - Full Screen Overlay */}
            {showAssessmentModal && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
                    <div className="bg-[#111] border border-red-500/30 rounded-3xl max-w-2xl w-full p-8 relative shadow-[0_0_50px_rgba(255,0,80,0.15)] glow-red">
                        <button
                            onClick={() => setShowAssessmentModal(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors text-xl"
                        >
                            ✕
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="text-6xl mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">⏳</div>

                            <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-white tracking-tight">
                                Mandatory Skill Assessment Required
                            </h2>

                            <div className="bg-[#1a1a1a] rounded-2xl p-6 md:p-8 w-full border border-white/5 text-left mb-8 shadow-inner">
                                <p className="text-gray-400 mb-6 text-sm uppercase tracking-wider font-semibold">
                                    To ensure quality, all students must maintain a valid assessment score.
                                </p>
                                <ul className="space-y-4 text-gray-200 text-lg">
                                    <li className="flex items-start gap-3">
                                        <span className="text-red-500 mt-1">•</span>
                                        <span>Assessments are valid for <strong className="text-white">**15 Days**</strong> only.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-red-500 mt-1">•</span>
                                        <span>You must maintain a <strong className="text-white">**75% Score**</strong> average.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-red-500 mt-1">•</span>
                                        <span>Questions cover <strong className="text-white">**Frontend, Backend, and Database**</strong>.</span>
                                    </li>
                                </ul>
                            </div>

                            <button
                                onClick={() => {
                                    setShowAssessmentModal(false);
                                    navigate('/dashboard/student/assessment');
                                }}
                                className="w-full md:w-auto px-12 py-4 bg-[#da2f2f] hover:bg-[#b01e1e] text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-[0_4px_20px_rgba(218,47,47,0.4)] flex items-center justify-center gap-3"
                            >
                                <span className="text-2xl">📝</span> Take Assessment Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
