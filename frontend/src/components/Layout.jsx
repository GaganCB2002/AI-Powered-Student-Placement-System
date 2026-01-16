import { useState, useEffect } from 'react'

export default function Layout({ children }) {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e
            const x = (clientX / window.innerWidth - 0.5) * 20
            const y = (clientY / window.innerHeight - 0.5) * 20
            setMousePos({ x, y })

            document.body.style.setProperty('--cursor-x', `${clientX}px`)
            document.body.style.setProperty('--cursor-y', `${clientY}px`)
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <div className="min-h-screen relative overflow-hidden bg-black text-white selection:bg-primary selection:text-white">
            {/* Interactive Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div
                    className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full mix-blend-screen animate-pulse"
                    style={{ transform: `translate(${mousePos.x * -2}px, ${mousePos.y * 2}px)` }}
                />
                <div
                    className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-secondary/20 blur-[120px] rounded-full mix-blend-screen"
                    style={{ transform: `translate(${mousePos.x * 2}px, ${mousePos.y * -2}px)` }}
                />
                <div className="cursor-glow fixed w-[400px] h-[400px] bg-white/5 blur-[80px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 top-[var(--cursor-y)] left-[var(--cursor-x)] mix-blend-overlay transition-transform duration-75 ease-out" />
            </div>

            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}
