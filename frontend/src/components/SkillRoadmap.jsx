import { useState, useEffect } from 'react'

export default function SkillRoadmap({ analysis }) {
    if (!analysis) return null

    return (
        <div className="space-y-8 animate-fade-in">
            {/* 1. Top Section: Trending Score & Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Market Value Score (Centered Text Fix) */}
                <div className="glass-card p-6 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <h3 className="text-gray-400 font-bold mb-4 uppercase tracking-widest text-xs relative z-10">Market Value Score</h3>
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="56" stroke="gray" strokeWidth="12" fill="transparent" className="opacity-20" />
                            <circle cx="64" cy="64" r="56" stroke="#00f2ea" strokeWidth="12" fill="transparent"
                                strokeDasharray={351}
                                strokeDashoffset={351 - (351 * analysis.trendingScore) / 100}
                                className="transition-all duration-1000 ease-out shadow-[0_0_20px_#00f2ea]"
                            />
                        </svg>
                        {/* Force Center Alignment with Absolute Positioning */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-bold text-white shadow-black drop-shadow-lg leading-none">{analysis.trendingScore}</span>
                        </div>
                    </div>
                    <p className={`mt-4 text-sm font-bold px-3 py-1 rounded-full ${analysis.trendingScore > 70 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {analysis.trendingScore > 70 ? `High Demand 🔥 (${analysis.trendingScore}/100)` : `Growing 📈 (${analysis.trendingScore}/100)`}
                    </p>
                </div>

                {/* Skill Gap Analysis (Pie Chart) */}
                <div className="glass-card p-6 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group">
                    <h3 className="text-gray-400 font-bold mb-4 uppercase tracking-widest text-xs relative z-10">Skill Gap Analysis</h3>

                    <div className="relative w-32 h-32 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                        style={{
                            background: `conic-gradient(#10b981 ${analysis.skillGap?.acquired || 65}%, #ef4444 0)`
                        }}
                    >
                        <div className="absolute w-24 h-24 bg-[#1a1a1a] rounded-full flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-white mb-0 leading-none">{analysis.skillGap?.acquired || 65}%</span>
                            <span className="text-[10px] text-gray-400">Acquired</span>
                        </div>
                    </div>

                    <div className="mt-4 flex gap-4 text-xs font-bold">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> You</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Missing</div>
                    </div>
                </div>

                {/* Future Radar (Predictions) - Expanded Interactive Grid */}
                <div className="md:col-span-2 glass-card p-6 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🔮</div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-purple-400">🔮</span> Future Skills Prediction
                        <span className="text-xs font-normal text-gray-500 ml-2">(Click cards for details)</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {(analysis.futurePredictions && analysis.futurePredictions.length > 0 ? analysis.futurePredictions : [
                            { skill: "Data Analysis", reason: "Standard baseline skill", status: "Stable", domains: ["Analytics", "Finance"] },
                            { skill: "Cloud Basics", reason: "Required for modern deployment", status: "Growing", domains: ["DevOps", "IT"] },
                            { skill: "Soft Skills", reason: "Crucial for team collaboration", status: "Stable", domains: ["Management", "Sales"] }
                        ]).map((pred, i) => (
                            <div key={i}
                                className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 hover:border-primary/30 transition-all group h-full cursor-pointer relative overflow-hidden"
                                onClick={() => alert(`Domains for ${pred.skill}:\n• ` + (pred.domains?.join('\n• ') || "General Application"))}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-white group-hover:text-primary transition-colors">{pred.skill}</span>
                                    {pred.status === 'Exploding' && <span className="text-[10px] bg-red-500 text-white px-2 rounded-full animate-pulse">HOT</span>}
                                    {pred.status === 'Critical' && <span className="text-[10px] bg-yellow-500 text-black px-2 rounded-full">CORE</span>}
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed mb-3">{pred.reason}</p>

                                {/* Mini Domain Preview Tag */}
                                <div className="flex flex-wrap gap-1">
                                    {pred.domains?.slice(0, 2).map((dom, idx) => (
                                        <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">
                                            {dom}
                                        </span>
                                    ))}
                                    {pred.domains?.length > 2 && <span className="text-[9px] text-gray-500">+{pred.domains.length - 2}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. The Roadmap Timeline */}
            <div className="glass-card p-8 rounded-3xl">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <span className="text-3xl">🗺️</span>
                    <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">Your Personalized Roadmap</span>
                </h3>

                <div className="relative border-l-2 border-white/10 ml-4 space-y-10">
                    {analysis.roadmap?.map((step, index) => (
                        <div key={index} className="relative pl-8 group">
                            {/* Timeline Dot */}
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-black border-2 border-primary group-hover:bg-primary group-hover:scale-125 transition-all shadow-[0_0_10px_rgba(0,242,234,0.5)]"></div>

                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                {/* Week/Phase Badge */}
                                <div className="min-w-[100px]">
                                    <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Week {step.week}</span>
                                    <span className="inline-block px-3 py-1 rounded bg-white/5 border border-white/10 text-xs text-primary font-bold">{step.phase}</span>
                                </div>

                                {/* Content Card */}
                                <div className="flex-1 bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-all w-full relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    <h4 className="text-lg font-bold text-white mb-2">{step.topic}</h4>
                                    <p className="text-sm text-gray-300 mb-4">{step.description}</p>

                                    {/* Expert Tip & Resource */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5">
                                        <div className="flex gap-3">
                                            <span className="text-xl">💡</span>
                                            <div>
                                                <div className="text-xs text-gray-500 font-bold uppercase mb-1">Pro Tip</div>
                                                <p className="text-xs text-gray-300 italic">"{step.tip}"</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-xl">🎓</span>
                                            <div>
                                                <div className="text-xs text-gray-500 font-bold uppercase mb-1">Free Resource</div>
                                                <a href={step.freeResource.link} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                                                    {step.freeResource.title} ↗
                                                </a>
                                                <span className="text-[10px] text-gray-500">{step.freeResource.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
