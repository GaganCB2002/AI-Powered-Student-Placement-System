import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
)

export default function PlacementDashboard() {
    const [stats, setStats] = useState({
        totalStudents: 1200,
        placed: 850,
        unplaced: 350,
        avgPackage: '₹8.5 LPA'
    })

    // Mock Data for Table
    const applicants = [
        { id: 1, name: "Rahul Sharma", dept: "CSE", cgpa: 9.2, aiScore: 95, status: "Eligible", predictedPackage: "₹12 LPA" },
        { id: 2, name: "Priya Patel", dept: "ECE", cgpa: 8.8, aiScore: 88, status: "Eligible", predictedPackage: "₹10 LPA" },
        { id: 3, name: "Amit Singh", dept: "Mech", cgpa: 7.5, aiScore: 65, status: "Needs Training", predictedPackage: "₹6 LPA" },
        { id: 4, name: "Sneha Gupta", dept: "CSE", cgpa: 9.5, aiScore: 98, status: "High Potential", predictedPackage: "₹18 LPA" },
        { id: 5, name: "Vikram Raj", dept: "Civil", cgpa: 6.8, aiScore: 55, status: "At Risk", predictedPackage: "₹4 LPA" },
    ]

    return (
        <DashboardLayout role="officer">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <span className="text-primary">🎓</span> Principal & Placement Overview
            </h2>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="glass-card p-6 rounded-2xl border-l-4 border-blue-500">
                    <p className="text-gray-400 text-sm">Total Students</p>
                    <p className="text-3xl font-bold text-white">{stats.totalStudents}</p>
                </div>
                <div className="glass-card p-6 rounded-2xl border-l-4 border-green-500">
                    <p className="text-gray-400 text-sm">Successfully Placed</p>
                    <p className="text-3xl font-bold text-green-400">{stats.placed}</p>
                </div>
                <div className="glass-card p-6 rounded-2xl border-l-4 border-red-500">
                    <p className="text-gray-400 text-sm">Pending Placement</p>
                    <p className="text-3xl font-bold text-red-400">{stats.unplaced}</p>
                </div>
                <div className="glass-card p-6 rounded-2xl border-l-4 border-purple-500">
                    <p className="text-gray-400 text-sm">Avg. Package (INR)</p>
                    <p className="text-3xl font-bold text-purple-400">{stats.avgPackage}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Placement Trend Chart */}
                <div className="glass-card p-6 rounded-3xl">
                    <h3 className="text-xl font-bold mb-6">Placement Trends (2025-26)</h3>
                    <Line data={{
                        labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
                        datasets: [{
                            label: 'Students Placed',
                            data: [50, 120, 250, 400, 650, 850],
                            borderColor: '#00f2ea',
                            backgroundColor: 'rgba(0, 242, 234, 0.2)',
                            tension: 0.4,
                            fill: true
                        }]
                    }} options={{ plugins: { legend: { labels: { color: 'white' } } }, scales: { y: { ticks: { color: 'gray' }, grid: { color: '#333' } }, x: { ticks: { color: 'gray' } } } }} />
                </div>

                {/* Dept-wise Breakdown */}
                <div className="glass-card p-6 rounded-3xl flex flex-col items-center">
                    <h3 className="text-xl font-bold mb-6">DepartmentWise Breakdown</h3>
                    <div className="w-full h-64 flex justify-center">
                        <Doughnut data={{
                            labels: ['CSE', 'ECE', 'Mech', 'Civil', 'Other'],
                            datasets: [{
                                data: [450, 300, 200, 150, 100],
                                backgroundColor: ['#00f2ea', '#ff0050', '#7f56d9', '#f59e0b', '#10b981'],
                                borderWidth: 0
                            }]
                        }} options={{ plugins: { legend: { position: 'right', labels: { color: 'white' } } } }} />
                    </div>
                </div>

                {/* skill Gap Analysis (New Advanced Feature) */}
                <div className="glass-card p-6 rounded-3xl col-span-1 lg:col-span-2">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="text-red-400">⚠️</span> Batch Skill Gaps (Critical)
                    </h3>
                    <div className="h-64">
                        <Bar data={{
                            labels: ['System Design', 'Docker/K8s', 'GraphQL', 'Advanced Python', 'Cybersecurity'],
                            datasets: [{
                                label: 'Students Lacking Skill',
                                data: [450, 600, 300, 500, 420],
                                backgroundColor: 'rgba(239, 68, 68, 0.5)',
                                borderColor: '#ef4444',
                                borderWidth: 1
                            }]
                        }} options={{
                            maintainAspectRatio: false,
                            plugins: { legend: { labels: { color: 'white' } } },
                            scales: { y: { ticks: { color: 'gray' }, grid: { color: '#333' } }, x: { ticks: { color: 'gray' } } }
                        }} />
                    </div>
                </div>
            </div>

            {/* AI Recommendations Table */}
            <div className="glass-card p-8 rounded-3xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">AI Candidate Recommendations & Eligibility</h3>
                    <button className="px-4 py-2 bg-primary/20 text-primary rounded-xl font-bold hover:bg-primary hover:text-black transition-colors">
                        Export Report 📥
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-gray-400 border-b border-white/10">
                                <th className="p-4">Student Name</th>
                                <th className="p-4">Department</th>
                                <th className="p-4">CGPA</th>
                                <th className="p-4">AI Score 🤖</th>
                                <th className="p-4">AI Status</th>
                                <th className="p-4">Predicted Pkg</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applicants.map((student) => (
                                <tr key={student.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-bold">{student.name}</td>
                                    <td className="p-4">{student.dept}</td>
                                    <td className="p-4">{student.cgpa}</td>
                                    <td className="p-4 text-primary font-mono">{student.aiScore}/100</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${student.status === 'Eligible' ? 'bg-green-500/20 text-green-400' :
                                            student.status === 'High Potential' ? 'bg-purple-500/20 text-purple-400' :
                                                'bg-red-500/20 text-red-400'
                                            }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="p-4">{student.predictedPackage}</td>
                                    <td className="p-4">
                                        <button className="text-sm text-secondary hover:underline">View Profile</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    )
}
