import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'

export default function HrDashboard() {
    const [job, setJob] = useState({ title: '', companyName: '', description: '', location: '', salaryRange: '', requiredSkills: '' })

    const handleChange = (e) => setJob({ ...job, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem('token')
        try {
            await fetch('http://localhost:8080/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(job)
            })
            alert('Job Posted Successfully!')
        } catch (err) {
            alert('Error posting job')
        }
    }

    return (
        <DashboardLayout role="hr">
            <h2 className="text-3xl font-bold mb-6">HR Portal</h2>

            <div className="glass p-8 rounded-3xl max-w-2xl mx-auto border border-white/10">
                <h3 className="text-xl font-bold mb-6">Post a New Job</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-1">Job Title</label>
                        <input name="title" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="e.g. Software Engineer" />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Company Name</label>
                        <input name="companyName" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="e.g. Tech Corp" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 mb-1">Location</label>
                            <input name="location" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="Remote / NY" />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Salary Range</label>
                            <input name="salaryRange" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="$100k - $120k" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Description</label>
                        <textarea name="description" onChange={handleChange} rows="4" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="Job details..." />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Required Skills</label>
                        <input name="requiredSkills" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="Java, React, Python" />
                    </div>

                    <button className="w-full bg-primary py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors mt-4">
                        Post Job
                    </button>
                </form>
            </div>
        </DashboardLayout>
    )
}
