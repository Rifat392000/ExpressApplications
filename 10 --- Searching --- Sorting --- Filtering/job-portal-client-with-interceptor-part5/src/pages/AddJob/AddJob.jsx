import React from 'react';
// import axios from 'axios';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const AddJob = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const handleAddJob = e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const initialData = Object.fromEntries(formData.entries());
        const { min, max, currency, ...newJob } = initialData;

        newJob.salaryRange = { min: parseInt(min), max:parseInt(max), currency };
        newJob.requirements = newJob.requirements.split('\n');
        newJob.responsibilities = newJob.responsibilities.split('\n');
        console.log(newJob);
        

        axiosSecure.post(`${import.meta.env.VITE_urlLink}/jobs`, newJob)
            .then(res => {
                if (res.data.insertedId) {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Job Has been added.",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    navigate('/myPostedJobs');
                }
            });
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-base-100 shadow-xl rounded-2xl">
            <h2 className="text-4xl font-bold mb-8 text-center text-primary">Post a New Job</h2>
            <form onSubmit={handleAddJob} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                        <label className="label font-semibold">Job Title</label>
                        <input type="text" name="title" placeholder="Job Title" className="input input-bordered w-full" required />
                    </div>

                    <div className="form-control">
                        <label className="label font-semibold">Job Location</label>
                        <input type="text" name="location" placeholder="Job Location" className="input input-bordered w-full" required />
                    </div>

                    <div className="form-control">
                        <label className="label font-semibold">Job Type</label>
                        <select name="type" defaultValue="" className="select select-bordered w-full" required>
                            <option disabled value="">Pick a Job type</option>
                            <option>Full-time</option>
                            <option>Intern</option>
                            <option>Part-time</option>
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label font-semibold">Job Field</label>
                        <select name="field" defaultValue="" className="select select-bordered w-full" required>
                            <option disabled value="">Pick a Job Field</option>
                            <option>Engineering</option>
                            <option>Marketing</option>
                            <option>Finance</option>
                            <option>Teaching</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="label font-semibold">Salary Range</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="number" name="min" placeholder="Min" className="input input-bordered w-full" required />
                        <input type="number" name="max" placeholder="Max" className="input input-bordered w-full" required />
                        <select name="currency" defaultValue="" className="select select-bordered w-full" required>
                            <option disabled value="">Currency</option>
                            <option>BDT</option>
                            <option>USD</option>
                            <option>INR</option>
                        </select>
                    </div>
                </div>

                <div className="form-control">
                    <label className="label font-semibold">Job Description</label>
                    <textarea name="description" placeholder="Job Description" className="textarea textarea-bordered" rows={4} required></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                        <label className="label font-semibold">Company Name</label>
                        <input type="text" name="company" placeholder="Company Name" className="input input-bordered w-full" required />
                    </div>

                    <div className="form-control">
                        <label className="label font-semibold">Company Logo URL</label>
                        <input type="text" name="company_logo" placeholder="Logo URL" className="input input-bordered w-full" required />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                        <label className="label font-semibold">HR Name</label>
                        <input type="text" name="hr_name" placeholder="HR Name" className="input input-bordered w-full" required />
                    </div>

                    <div className="form-control">
                        <label className="label font-semibold">HR Email</label>
                        <input type="email" name="hr_email" defaultValue={user?.email} readOnly className="input input-bordered w-full" required />
                    </div>
                </div>

                <div className="form-control">
                    <label className="label font-semibold">Application Deadline</label>
                    <input type="date" name="applicationDeadline" className="input input-bordered w-full" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                        <label className="label font-semibold">Job Requirements</label>
                        <textarea name="requirements" placeholder="Put each requirement in a new line" className="textarea textarea-bordered" rows={4} required></textarea>
                    </div>

                    <div className="form-control">
                        <label className="label font-semibold">Job Responsibilities</label>
                        <textarea name="responsibilities" placeholder="Write each responsibility in a new line" className="textarea textarea-bordered" rows={4} required></textarea>
                    </div>
                </div>

                <div className="form-control mt-8">
                    <button className="btn btn-primary w-full text-lg">Submit Job</button>
                </div>
            </form>
        </div>
    );
};

export default AddJob;
