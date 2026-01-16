import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Layout from '../../components/Layout'

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showForgotPwd, setShowForgotPwd] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        if (!email.trim() || !password.trim()) {
            setError("Please enter both email and password")
            return
        }

        setLoading(true)
        setError('')

        try {
            // Try Real Backend
            const res = await fetch('http://localhost:8080/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            if (!res.ok) throw new Error("Failed to connect")

            const data = await res.json()
            localStorage.setItem('user', JSON.stringify(data))
            localStorage.setItem('token', data.accessToken)
            navigate(`/dashboard/${data.roles[0].toLowerCase()}`)

        } catch (err) {
            console.warn("Backend unavailable, using mock login")
            // Mock Fallback Strategy - STRICT DB CHECK
            setTimeout(() => {
                // 1. Load the "Mock Database"
                const dbUsers = JSON.parse(localStorage.getItem('DB_USERS') || "{}")

                // 2. Pre-seed Admin/Officer if missing (Simulating backend pre-provisioned accounts)
                if (!dbUsers['admin@college.edu']) {
                    dbUsers['admin@college.edu'] = {
                        email: 'admin@college.edu',
                        password: 'admin',
                        firstName: 'Placement',
                        lastName: 'Officer',
                        role: 'PLACEMENT_OFFICER',
                        createdAt: new Date().toISOString()
                    }
                    localStorage.setItem('DB_USERS', JSON.stringify(dbUsers))
                }

                // 3. Strict Lookup
                const existingUser = dbUsers[email]

                if (existingUser) {
                    // FOUND: Verify Credentials
                    if (existingUser.password === password) {
                        // SUCCESS: Restore session from DB
                        localStorage.setItem('user', JSON.stringify(existingUser))

                        // Generate appropriate token
                        const token = existingUser.role === 'PLACEMENT_OFFICER'
                            ? 'mock-token-officer'
                            : 'mock-token-student'
                        localStorage.setItem('token', token)

                        // Redirect based on role
                        navigate(existingUser.role === 'PLACEMENT_OFFICER' ? '/dashboard/officer' : '/dashboard/student')
                    } else {
                        // WRONG PASSWORD
                        setError("Invalid Password. Please try again.")
                    }
                } else {
                    // NOT FOUND
                    setError("Account not found. Please Register to create a new profile.")
                }
            }, 800)
        } finally {
            setLoading(false)
        }
    }

    const handleForgotPwd = (e) => {
        e.preventDefault()
        setShowForgotPwd(true)
    }

    return (
        <Layout>
            {/* Forgot Password Modal (Mock) */}
            {showForgotPwd && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="glass-card p-8 rounded-2xl max-w-sm w-full text-center relative border border-white/10">
                        <div className="text-4xl mb-4">🔐</div>
                        <h3 className="text-2xl font-bold mb-2">Reset Password</h3>
                        <p className="text-gray-400 text-sm mb-6">Enter your email to receive a secure reset link.</p>
                        <input
                            type="email"
                            id="forgot-email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 mb-4 focus:border-primary outline-none"
                        />
                        <button onClick={() => {
                            const emailInput = document.getElementById('forgot-email').value;
                            const dbUsers = JSON.parse(localStorage.getItem('DB_USERS') || "{}");

                            if (dbUsers[emailInput]) {
                                alert(`Reset Link Sent to ${emailInput}! (Check your fake inbox)`);
                                setShowForgotPwd(false);
                            } else {
                                alert("Error: Email not found in our database.");
                            }
                        }} className="w-full bg-primary text-black font-bold py-3 rounded-xl">Send Reset Link</button>
                        <button onClick={() => setShowForgotPwd(false)} className="mt-4 text-sm text-gray-500 hover:text-white">Cancel</button>
                    </div>
                </div>
            )}

            <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
                {/* Background Blobs for Auth */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

                <div className="w-full max-w-md glass-card p-10 rounded-3xl relative overflow-hidden group">
                    <div className="relative z-10 transition-transform duration-500">
                        <div className="mb-8 text-center">
                            <Link to="/" className="inline-block mb-6 text-sm text-gray-500 hover:text-white transition-colors">← Back to Home</Link>
                            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Welcome Back</h2>
                            <p className="text-gray-400">Access your personalized dashboard</p>
                        </div>

                        <form className="space-y-6" onSubmit={handleLogin}>
                            {error && <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/20">⚠️ {error}</div>}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-5 py-4 focus:ring-0"
                                    placeholder="student@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 py-4 focus:ring-0"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="flex items-center justify-between text-sm px-1">
                                <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-white transition-colors">
                                    <input type="checkbox" className="rounded border-gray-600 bg-transparent text-primary focus:ring-0" />
                                    Remember me
                                </label>
                                <button type="button" onClick={handleForgotPwd} className="text-primary hover:text-white transition-colors font-medium">Forgot Password?</button>
                            </div>

                            <button className="w-full bg-gradient-to-r from-primary to-blue-600 py-4 rounded-xl font-bold text-lg text-black hover:shadow-[0_0_30px_rgba(0,242,234,0.3)] hover:scale-[1.02] transition-all duration-300 mt-4">
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="mt-8 text-center text-gray-400 text-sm">
                            Don't have an account?
                            <Link to="/auth/register" className="text-white font-bold ml-1 hover:text-primary transition-colors">
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
