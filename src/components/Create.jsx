import React, { useState } from 'react';
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        // 1. Convert Tech Stack string to an Array
        const techArray = job.postTechStack.split(',').map(item => item.trim());

        // 2. Handle Number safely - Convert empty strings to 0
        const expValue = job.reqExperience.trim() === '' ? '0' : job.reqExperience;
        const expNumber = parseInt(expValue);
        const finalExp = isNaN(expNumber) ? 0 : expNumber;

        // 3. Build the JSON Object (Matching Java Model perfectly)
        const newJob = {
            postProfile: job.postProfile,
            postDesc: job.postDesc,
            reqExperience: finalExp,
            postTechStack: techArray
        };

        console.log("SENDING TO JAVA:", JSON.stringify(newJob, null, 2));

        try {
            const response = await fetch('http://localhost:8080/jobposts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newJob)
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Java Response:", result);
                alert(`SUCCESS: "${result.postProfile}" posted successfully!`);
                navigate('/');
            } else {
                // Read the exact error from Java
                const errorText = await response.text();
                console.error("Java Rejected:", errorText);
                alert(`Java Rejected Data: ${errorText}`);
            }
        } catch (error) {
            console.error("Network Error:", error);
            alert(`Network Error: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
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