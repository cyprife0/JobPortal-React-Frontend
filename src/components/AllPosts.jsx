import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AllPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8080/jobposts')
            .then(response => {
                setPosts(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this job?')) {
            try {
                await axios.delete(`http://localhost:8080/jobposts/${id}`);
                const response = await axios.get('http://localhost:8080/jobposts');
                setPosts(response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    if (loading) {
        return <h2 style={{ color: 'white', textAlign: 'center' }}>Loading...</h2>;
    }

    if (posts.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px', color: 'white' }}>
                <h2>No jobs found</h2>
                <Link to="/create" className="btn btn-primary">Post a Job</Link>
            </div>
        );
    }

    return (
        <div>
            <div className="jobs-header">
                <h2>All Job Openings</h2>
                <span style={{ color: 'white', background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '20px' }}>
                    {posts.length} jobs
                </span>
            </div>
            {posts.map((job) => (
                <div key={job.postId} className="job-card">
                    <div className="job-header">
                        <h3>{job.postProfile}</h3>
                        <span className="experience">{job.reqExperience} years</span>
                    </div>
                    <p className="job-desc">{job.postDesc}</p>
                    <div className="tech-stack">
                        {job.postTechStack && job.postTechStack.map((tech, index) => (
                            <span key={index} className="tech-tag">{tech}</span>
                        ))}
                    </div>
                    <div className="job-actions">
                        <Link to={`/edit/${job.postId}`} className="btn btn-success">Edit</Link>
                        <button className="btn btn-danger" onClick={() => handleDelete(job.postId)}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AllPosts;