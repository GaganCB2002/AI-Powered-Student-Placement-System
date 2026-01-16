import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Layout from '../../components/Layout'

export default function Register() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        securityQuestion: 'mother_maiden_name',
        securityAnswer: '',
        college: '',
        role: 'STUDENT'
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError('') // Clear error on typing
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!")
            return
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long.")
            return
        }
        if (!formData.securityAnswer.trim()) {
            setError("Please provide an answer to the security question.")
            return
        }

        setLoading(true)

        try {
            // Simulated Backend Call
            await new Promise(r => setTimeout(r, 1000))

            // 1. Create New User Profile (The "Blank Data Block")
            const newUserProfile = {
                ...formData,
                skills: [], // New users start with ZERO skills
                resumeUploaded: false,
                applications: [],
                createdAt: new Date().toISOString()
            }

            // 2. Save to "Mock Database" (Persistent Storage)
            const dbUsers = JSON.parse(localStorage.getItem('DB_USERS') || "{}")

            if (dbUsers[formData.email]) {
                alert("User already exists! Please login.")
                navigate('/auth/login')
                return
            }

            dbUsers[formData.email] = newUserProfile
            localStorage.setItem('DB_USERS', JSON.stringify(dbUsers))

            alert(`Account created successfully! Please Login.`)
            navigate('/auth/login')

        } catch (error) {
            console.error(error)
            setError("Registration failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen animate-pulse"></div>

                <div className="w-full max-w-2xl glass-card p-10 rounded-3xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="text-center mb-10">
                            <Link to="/" className="inline-block mb-6 text-sm text-gray-500 hover:text-white transition-colors">← Back to Home</Link>
                            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Create Account</h2>
                            <p className="text-gray-400">Start your career journey with AI-powered guidance</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm font-bold text-center">
                                ⚠️ {error}
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleRegister}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">First Name</label>
                                    <input name="firstName" onChange={handleChange} type="text" className="w-full px-5 py-4 focus:ring-0" placeholder="John" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Last Name</label>
                                    <input name="lastName" onChange={handleChange} type="text" className="w-full px-5 py-4 focus:ring-0" placeholder="Doe" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Account Role</label>
                                    <select name="role" onChange={handleChange} className="w-full px-5 py-4 focus:ring-0 text-white bg-[#050505] appearance-none cursor-pointer">
                                        <option value="STUDENT" className="text-black">Student</option>
                                        <option value="PLACEMENT_OFFICER" className="text-black">Placement Officer</option>
                                        <option value="PRINCIPAL" className="text-black">College Principal</option>
                                        <option value="COMPANY_HR" className="text-black">Company HR</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">College / University</label>
                                    <input name="college" onChange={handleChange} type="text" className="w-full px-5 py-4 focus:ring-0" placeholder="Enter college name" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Email Address</label>
                                <input name="email" onChange={handleChange} type="email" className="w-full px-5 py-4 focus:ring-0" placeholder="student@example.com" required />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Password</label>
                                    <input name="password" onChange={handleChange} type="password" className="w-full px-5 py-4 focus:ring-0" placeholder="••••••••" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Confirm Password</label>
                                    <input name="confirmPassword" onChange={handleChange} type="password" className="w-full px-5 py-4 focus:ring-0" placeholder="••••••••" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Security Question</label>
                                    <select name="securityQuestion" onChange={handleChange} className="w-full px-5 py-4 focus:ring-0 text-white bg-[#050505] appearance-none cursor-pointer">
                                        <option value="mother_maiden_name" className="text-black">Mother's Maiden Name</option>
                                        <option value="first_pet" className="text-black">First Pet's Name</option>
                                        <option value="childhood_hero" className="text-black">Childhood Hero</option>
                                        <option value="favorite_subject" className="text-black">Favorite Subject</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Security Answer</label>
                                    <input name="securityAnswer" onChange={handleChange} type="text" className="w-full px-5 py-4 focus:ring-0" placeholder="Your Answer" required />
                                </div>
                            </div>

                            <div className="flex items-start gap-3 text-sm text-gray-400 px-1 mt-2">
                                <input type="checkbox" className="mt-1 rounded border-gray-600 bg-transparent text-secondary focus:ring-0" required />
                                <p>I agree to the <a href="#" className="text-secondary hover:text-white underline decoration-dotted underline-offset-4">Terms of Service</a> and <a href="#" className="text-secondary hover:text-white underline decoration-dotted underline-offset-4">Privacy Policy</a></p>
                            </div>

                            <button className="w-full bg-gradient-to-r from-secondary to-pink-600 py-4 rounded-xl font-bold text-lg text-white hover:shadow-[0_0_30px_rgba(255,0,80,0.3)] hover:scale-[1.02] transition-all duration-300 mt-6">
                                {loading ? 'Creating Account...' : 'Get Started'}
                            </button>
                        </form>

                        <div className="mt-8 text-center text-gray-400 text-sm">
                            Already have an account?
                            <Link to="/auth/login" className="text-white font-bold ml-1 hover:text-secondary transition-colors">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
