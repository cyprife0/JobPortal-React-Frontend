import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Create = () => {
    const navigate = useNavigate();
    const [job, setJob] = useState({
        postProfile: '',
        postDesc: '',
        reqExperience: '',
        postTechStack: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setJob({
            ...job,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        const techArray = job.postTechStack.split(',').map(item => item.trim());

        const newJob = {
            postProfile: job.postProfile,
            postDesc: job.postDesc,
            reqExperience: parseInt(job.reqExperience),
            postTechStack: techArray
        };

        console.log('Sending:', newJob); // Check what's being sent

        axios.post('http://localhost:8080/jobposts', newJob)
            .then(() => {
                setSubmitting(false);
                navigate('/');
            })
            .catch(error => {
                console.error('Error:', error.response?.data || error.message);
                setSubmitting(false);
            });
    };

    return (
        <div className="form-container">
            <h2>Post a <span>New Job</span></h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Job Title</label>
                    <input
                        type="text"
                        name="postProfile"
                        value={job.postProfile}
                        onChange={handleChange}
                        placeholder="e.g., Senior Java Developer"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Job Description</label>
                    <textarea
                        name="postDesc"
                        rows="4"
                        value={job.postDesc}
                        onChange={handleChange}
                        placeholder="Describe the job responsibilities..."
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Experience (years)</label>
                        <input
                            type="number"
                            name="reqExperience"
                            value={job.reqExperience}
                            onChange={handleChange}
                            placeholder="e.g., 3"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Tech Stack</label>
                        <input
                            type="text"
                            name="postTechStack"
                            value={job.postTechStack}
                            onChange={handleChange}
                            placeholder="Java, Spring, SQL"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={submitting}
                >
                    {submitting ? 'Posting...' : 'Post Job'}
                </button>
            </form>
        </div>
    );
};

export default Create;