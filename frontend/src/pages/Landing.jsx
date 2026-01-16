import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const heroImages = [
    '/assets/images/hero.png',
    '/assets/images/hero2.png',
    '/assets/images/hero3.png'
]

export default function Landing() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [contactSent, setContactSent] = useState(false)
    const heroRef = useRef()
    const section1Ref = useRef()
    const section2Ref = useRef()
    const section3Ref = useRef()
    const section4Ref = useRef()
    const section5Ref = useRef()
    const ctaRef = useRef()

    // Carousel State
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isHovering, setIsHovering] = useState(false)

    // Workflow Animation State
    const [travelStep, setTravelStep] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setTravelStep(prev => (prev + 1) % 4)
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    // Carousel Timer (60s)
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % heroImages.length)
        }, 3000) // 3 seconds
        return () => clearInterval(interval)
    }, [])

    const scrollToWorkflow = () => {
        section3Ref.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        // Mouse movement for interactive background
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e
            const x = (clientX / window.innerWidth - 0.5) * 20
            const y = (clientY / window.innerHeight - 0.5) * 20
            setMousePos({ x, y })

            // Update CSS variables for cursor glow
            document.body.style.setProperty('--cursor-x', `${clientX}px`)
            document.body.style.setProperty('--cursor-y', `${clientY}px`)
        }

        window.addEventListener('mousemove', handleMouseMove)

        // GSAP ScrollTrigger animations
        gsap.fromTo(
            heroRef.current.querySelector('.hero-text'),
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top center',
                    end: 'bottom center',
                },
            }
        )

        gsap.fromTo(
            heroRef.current.querySelector('.hero-visual'),
            { opacity: 0, scale: 0.9, rotate: -5 },
            {
                opacity: 1,
                scale: 1,
                rotate: 0,
                duration: 1.2,
                ease: 'elastic.out(1, 0.5)',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top center',
                },
            }
        )

        // Animate sections on scroll
        const sections = [section1Ref, section2Ref, section3Ref, section4Ref, section5Ref, ctaRef]
        sections.forEach((ref) => {
            if (ref.current) {
                gsap.fromTo(
                    ref.current,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: ref.current,
                            start: 'top 85%',
                            toggleActions: 'play none none reverse',
                        },
                    }
                )
            }
        })

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
        }
    }, [])

    return (
        <div className="relative overflow-hidden bg-black text-white selection:bg-primary selection:text-white">
            {/* Interactive Background Gradient Blobs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div
                    className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full mix-blend-screen animate-pulse"
                    style={{ transform: `translate(${mousePos.x * -2}px, ${mousePos.y * 2}px)` }}
                />
                <div
                    className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-secondary/20 blur-[120px] rounded-full mix-blend-screen"
                    style={{ transform: `translate(${mousePos.x * 2}px, ${mousePos.y * -2}px)` }}
                />
                <div
                    className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-accent/10 blur-[80px] rounded-full mix-blend-screen"
                    style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
                />
                <div className="cursor-glow fixed w-[400px] h-[400px] bg-white/5 blur-[80px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 top-[var(--cursor-y)] left-[var(--cursor-x)] mix-blend-overlay transition-transform duration-75 ease-out" />
            </div>

            {/* Hero Section */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-between px-8 md:px-16 lg:px-24 z-10 pt-20">
                <div className="hero-text max-w-2xl">
                    <div className="inline-block px-4 py-2 mb-6 rounded-full glass border-primary/30 text-primary font-medium text-sm tracking-wide uppercase">
                        🚀 The Future of Campus Placements
                    </div>
                    <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight tracking-tight">
                        Shape Your <span className="gradient-text italic">Career</span>.
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Master Skills.</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-lg">
                        A next-gen AI platform connecting students to their dream jobs through intelligent skill matching and automated placement tracking.
                    </p>
                    <div className="flex gap-4 flex-wrap">
                        <Link to="/auth/login" className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 overflow-hidden text-center min-w-[180px]">
                            <span className="relative z-10">Get Started Now</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                        </Link>
                        <button onClick={scrollToWorkflow} className="px-8 py-4 glass rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105 flex items-center gap-2">
                            <span>View Workflow</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </button>
                    </div>
                </div>

                {/* 2D Hero Visual */}
                {/* 2D Hero Visual */}
                {/* 2D Hero Visual with Carousel & Interaction */}
                <div
                    className="hero-visual hidden md:block relative w-[500px] h-[600px] flex items-center justify-center group/visual"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <div className="relative z-20 w-full h-auto transition-transform duration-500 hover:-translate-y-2">
                        {/* Carousel Images */}
                        <div className={`relative w-full h-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10 glass transition-all duration-500 ease-out ${isHovering ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                            <img
                                src={heroImages[currentImageIndex]}
                                alt="AI Career Growth"
                                className="w-full h-auto object-cover transition-opacity duration-1000"
                            />
                        </div>

                        {/* Restored Dashboard Card (Visible on Hover) */}
                        <div className={`absolute inset-0 top-0 left-0 w-full h-full glass rounded-3xl z-30 overflow-hidden shadow-2xl border border-white/10 transition-all duration-500 ease-out origin-center ${isHovering ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-105 rotate-6 pointer-events-none'}`}>
                            {/* Header */}
                            <div className="h-10 border-b border-white/10 bg-white/5 flex items-center px-4 gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            </div>
                            {/* Body */}
                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-gray-400 text-sm">Placement Score</div>
                                        <div className="text-4xl font-bold gradient-text">92%</div>
                                    </div>
                                    <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-2xl">🏆</div>
                                </div>
                                {/* Chart Area Mockup */}
                                <div className="h-32 flex items-end justify-between gap-2 opacity-80">
                                    {[40, 60, 45, 80, 55, 75, 90, 65].map((h, i) => (
                                        <div key={i} className="w-full bg-primary/50 rounded-t-sm hover:bg-primary transition-colors cursor-pointer relative group/bar" style={{ height: `${h}%` }}>
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 glass px-2 py-1 text-xs opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-30">{h}% Skill</div>
                                        </div>
                                    ))}
                                </div>

                                {/* List Area */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 glass p-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-lg">💼</div>
                                        <div className="flex-1">
                                            <div className="text-sm font-semibold">Google Application</div>
                                            <div className="text-xs text-gray-500">Software Engineer Intern</div>
                                        </div>
                                        <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">Selected</span>
                                    </div>
                                    <div className="flex items-center gap-3 glass p-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-lg">🚀</div>
                                        <div className="flex-1">
                                            <div className="text-sm font-semibold">React Certification</div>
                                            <div className="text-xs text-gray-500">Advanced Hooks & Patterns</div>
                                        </div>
                                        <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">In Progress</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements (Decorations) */}
                        <div className="absolute -top-5 -right-5 w-20 h-20 glass rounded-2xl flex items-center justify-center text-4xl shadow-lg animate-float z-30" style={{ animationDelay: '0s' }}>
                            ⚡
                        </div>
                        <div className="absolute bottom-10 -left-10 w-auto glass px-6 py-3 rounded-full shadow-lg animate-float z-30 flex items-center gap-2" style={{ animationDelay: '2s' }}>
                            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="font-semibold text-sm">New Job Match!</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 1: For Students */}
            <section ref={section1Ref} className="relative min-h-[80vh] flex items-center px-8 md:px-16 lg:px-24 z-10">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-bold mb-6">
                            Built for <span className="gradient-text">Students</span>
                        </h2>
                        <ul className="space-y-4 text-lg text-gray-300">
                            {[
                                { icon: '📄', text: 'Upload resume once', color: 'text-primary' },
                                { icon: '🧠', text: 'Get AI-based job recommendations', color: 'text-secondary' },
                                { icon: '🎯', text: 'Track applications in real time', color: 'text-accent' },
                                { icon: '📈', text: 'Understand your skill gaps', color: 'text-primary' },
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 p-3 rounded-xl transition-all">
                                    <span className={`w-10 h-10 rounded-full glass flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform ${item.color}`}>{item.icon}</span>
                                    <span className="group-hover:text-white transition-colors">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="glass p-8 rounded-3xl hover:bg-white/5 transition-colors border border-white/5">
                        <div className="grid grid-cols-2 gap-4 h-full">
                            <div className="col-span-2 bg-gradient-to-br from-primary/20 to-transparent p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
                                <div className="w-12 h-12 rounded-xl bg-primary/20 text-2xl flex items-center justify-center mb-4">📝</div>
                                <div>
                                    <div className="text-2xl font-bold">Resume Parser</div>
                                    <div className="text-sm text-gray-400">Extracts skills automatically</div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-secondary/20 to-transparent p-6 rounded-2xl border border-white/5">
                                <div className="text-3xl font-bold mb-1">95%</div>
                                <div className="text-xs text-gray-400">Accuracy</div>
                            </div>
                            <div className="bg-gradient-to-br from-accent/20 to-transparent p-6 rounded-2xl border border-white/5">
                                <div className="text-3xl font-bold mb-1">20+</div>
                                <div className="text-xs text-gray-400">ATS Templates</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: AI Skill Intelligence */}
            <section ref={section2Ref} className="relative min-h-[80vh] flex items-center px-8 md:px-16 lg:px-24 z-10">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-bold mb-6">
                            Know Your Skills. <br />
                            <span className="gradient-text">Improve What Matters.</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Our AI analyzes your resume and compares it with industry demands
                            to calculate your employability score.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {['Java', 'React', 'Python', 'SQL', 'AI/ML', 'Cloud'].map((skill, i) => (
                            <div
                                key={skill}
                                className="group relative glass p-6 rounded-2xl text-center cursor-pointer hover:-translate-y-2 transition-transform duration-300"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">💡</div>
                                <div className="font-semibold mb-2">{skill}</div>
                                <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-primary to-secondary group-hover:animate-[loading_1s_ease-in-out_infinite]" style={{ width: '70%' }}></div>
                                </div>
                                {/* Glow effect on hover */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 3: Placement Tracking */}
            <section ref={section3Ref} className="relative min-h-[80vh] flex items-center px-8 md:px-16 lg:px-24 z-10">
                <div className="max-w-6xl mx-auto w-full">
                    <h2 className="text-4xl md:text-6xl font-bold mb-16 text-center">
                        <span className="gradient-text">Transparent</span> Placement Tracking
                    </h2>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative">
                        {/* Timeline and Animated Line */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 hidden md:block -z-10"></div>
                        <div
                            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 hidden md:block -z-10 transition-all duration-[2000ms] ease-linear"
                            style={{ width: `${(travelStep / 3) * 100}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-2xl text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)] animate-pulse">
                                ➤
                            </div>
                        </div>

                        {[
                            {
                                label: 'Applied', icon: '📝', color: 'text-blue-400', border: 'border-blue-400',
                                details: ['Resume Parsing & Auto-Fill', 'Smart AI Job Matching', 'One-Click Application']
                            },
                            {
                                label: 'Shortlisted', icon: '✅', color: 'text-purple-400', border: 'border-purple-400',
                                details: ['AI Skill Screening', 'Recruiter Profile Review', 'Eligibility Verification']
                            },
                            {
                                label: 'Interview', icon: '🎯', color: 'text-orange-400', border: 'border-orange-400',
                                details: ['Automated Scheduling', 'Technical Assessments', 'Feedback Integration']
                            },
                            {
                                label: 'Selected', icon: '🎉', color: 'text-green-400', border: 'border-green-400',
                                details: ['Offer Generation', 'Digital Acceptance', 'Placement Recorded']
                            },
                        ].map((stage, i) => {
                            const isActive = i <= travelStep;
                            return (
                                <div key={stage.label} className={`group relative w-full md:w-auto flex flex-col items-center gap-4 transition-all duration-500 ${isActive ? 'scale-110' : 'scale-100 opacity-50'}`}>
                                    <div className={`w-20 h-20 rounded-full glass border-2 ${isActive ? stage.border : 'border-white/10'} flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(0,0,0,0.5)] z-10 bg-black transition-colors duration-500 ${isActive ? 'bg-white/10' : ''}`}>
                                        {stage.icon}
                                    </div>
                                    <div className={`text-xl font-bold transition-colors duration-500 ${isActive ? stage.color : 'text-gray-600'}`}>
                                        {stage.label}
                                    </div>
                                    <div className={`text-xs text-gray-400 glass px-3 py-1 rounded-full transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                                        Step {i + 1}
                                    </div>

                                    {/* Tooltip Card - Auto-show on Active OR Hover */}
                                    <div className={`absolute top-full mt-4 w-60 p-4 glass rounded-xl border border-white/10 shadow-xl transition-all duration-300 z-50 pointer-events-none group-hover:pointer-events-auto ${isActive || isHovering ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}`}>
                                        <div className={`text-sm font-bold mb-2 ${stage.color}`}>{stage.label} Process</div>
                                        <ul className="space-y-2">
                                            {stage.details.map((detail, idx) => (
                                                <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                                                    <span className="text-primary mt-0.5">▪</span>
                                                    {detail}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Section 4: For Colleges */}
            <section ref={section4Ref} className="relative min-h-[80vh] flex items-center px-8 md:px-16 lg:px-24 z-10">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Visual - Dashboard Grid */}
                    {/* Left Visual - Dashboard Grid */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-2xl rounded-full opacity-50 group-hover:opacity-75 transition-opacity"></div>
                        <img
                            src="/assets/images/analytics.png"
                            alt="Advanced Analytics Dashboard"
                            className="relative z-10 w-full h-auto rounded-2xl border border-white/10 shadow-2xl glass hover:scale-[1.02] transition-transform duration-500"
                        />
                    </div>

                    <div>
                        <h2 className="text-4xl md:text-6xl font-bold mb-6">
                            Insights for <span className="gradient-text">Institutions</span>
                        </h2>
                        <ul className="space-y-4 text-lg text-gray-300">
                            {[
                                'Student performance analytics',
                                'Skill-demand trends',
                                'Placement success metrics',
                                'Real-time reporting'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 hover:text-white transition-colors cursor-default">
                                    <span className="text-primary text-xl">✔</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button className="mt-8 px-8 py-3 glass rounded-xl hover:bg-white/10 transition-colors text-sm font-bold uppercase tracking-wide">
                            View Admin Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section ref={ctaRef} className="relative min-h-[60vh] flex items-center justify-center px-8 z-10">
                <div className="glass p-12 md:p-24 rounded-[3rem] text-center max-w-5xl w-full border border-white/10 relative overflow-hidden group">
                    {/* Background Glow inside CTA */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    <h2 className="text-5xl md:text-7xl font-bold mb-8 relative z-10">
                        Ready to Build <br />
                        <span className="gradient-text">Your Career?</span>
                    </h2>
                    <div className="flex gap-6 justify-center flex-wrap relative z-10">
                        <Link to="/auth/login" className="bg-white text-black px-12 py-5 rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                            Get Started
                        </Link>
                        <button className="glass px-12 py-5 rounded-full text-xl font-bold hover:bg-white/10 transition-colors">
                            Contact Sales
                        </button>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="relative min-h-[80vh] flex items-center justify-center px-8 z-10 py-20">
                <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-5xl font-bold mb-6">
                            Get in <span className="gradient-text">Touch</span>
                        </h2>
                        <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                            Have questions about our AI placement algorithms? <br />
                            Need support with your dashboard? We're here to help.
                        </p>

                        <div className="space-y-8">
                            {[
                                { icon: '📍', title: 'Visit Us', desc: '123 Innovation Drive, Bangalore, India' },
                                { icon: '📧', title: 'Email Us', desc: 'support@skillnova.ai' },
                                { icon: '📞', title: 'Call Us', desc: '+91 98765 43210' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-6 group cursor-pointer">
                                    <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-3xl shadow-lg group-hover:bg-primary/20 transition-colors">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{item.title}</h4>
                                        <p className="text-gray-400">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[80px] rounded-full"></div>
                        {contactSent ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-fade-in p-10 min-h-[400px]">
                                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-5xl">✅</span>
                                </div>
                                <h3 className="text-3xl font-bold text-white">Message Sent!</h3>
                                <p className="text-gray-400 text-lg">
                                    Thanks for reaching out. Our team will get back to you within 24 hours. 🚀
                                </p>
                                <button
                                    onClick={() => setContactSent(false)}
                                    className="mt-8 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-bold"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form className="space-y-6 relative z-10" onSubmit={(e) => {
                                e.preventDefault();
                                setContactSent(true);
                                e.target.reset();
                            }}>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Name</label>
                                        <input required type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Email</label>
                                        <input required type="email" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors" placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div className="space-y-2 relative">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Subject</label>
                                    <div className="relative">
                                        <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors appearance-none cursor-pointer">
                                            <option className="bg-[#1a1a1a] text-white">General Inquiry</option>
                                            <option className="bg-[#1a1a1a] text-white">Technical Support</option>
                                            <option className="bg-[#1a1a1a] text-white">Sales & Partnerships</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            ▼
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Message</label>
                                    <textarea required rows="4" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors resize-none" placeholder="How can we help you?"></textarea>
                                </div>
                                <button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors text-lg shadow-lg transform hover:scale-[1.02]">
                                    Send Message 🚀
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="glass border-t border-white/5 py-12 relative z-10">
                <div className="max-w-6xl mx-auto px-8 grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-2">
                        <h3 className="text-2xl font-bold mb-6">SkillNova AI</h3>
                        <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">
                            Empowering students with AI-driven placement solutions.
                            Bridging the gap between talent and opportunity through intelligent skill matching.
                        </p>
                        <div className="flex gap-4">
                            {['twitter', 'linkedin', 'github', 'instagram'].map(social => (
                                <a key={social} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                                    <span className="capitalize text-xs">{social[0]}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-6">Platform</h4>
                        <ul className="space-y-4 text-gray-500 text-sm">
                            <li><a href="#" className="hover:text-primary transition-colors">For Students</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">For Colleges</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">For Companies</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-6">Legal</h4>
                        <ul className="space-y-4 text-gray-500 text-sm">
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-white/5 pt-8 text-center text-gray-600 text-sm">
                    <p>© 2026 SkillNova AI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
