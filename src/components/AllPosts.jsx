import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

const AllPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");

    const location = useLocation();

    const fetchJobs = async (searchTerm = "") => {
        setLoading(true);

        try {
            const url =
                searchTerm.trim() === ""
                    ? "http://localhost:8080/jobposts"
                    : `http://localhost:8080/jobposts/search/${searchTerm}`;

            console.log("Fetching:", url);

            const response = await axios.get(url);

            setPosts(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Load all jobs when page opens
    useEffect(() => {
        fetchJobs();
    }, []);

    // Live search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchJobs(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Whenever user returns to Home, clear search
    useEffect(() => {
        if (location.pathname === "/") {
            setQuery("");
            fetchJobs();
        }
    }, [location]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this job?")) return;

        try {
            await axios.delete(`http://localhost:8080/jobposts/${id}`);

            fetchJobs(query);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>

            {/* SEARCH BAR */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: "20px 0"
                }}
            >
                <div
                    style={{
                        position: "relative",
                        width: "80%",
                        maxWidth: "600px"
                    }}
                >
                    <span
                        style={{
                            position: "absolute",
                            left: "15px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            fontSize: "20px"
                        }}
                    >
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search jobs..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "15px 15px 15px 50px",
                            borderRadius: "30px",
                            border: "none",
                            outline: "none",
                            fontSize: "16px"
                        }}
                    />
                </div>
            </div>

            {/* HEADER */}

            <div className="jobs-header">
                <h2>All Job Openings</h2>

                <span
                    style={{
                        color: "white",
                        background: "rgba(255,255,255,.2)",
                        padding: "8px 16px",
                        borderRadius: "20px"
                    }}
                >
                    {posts.length} Jobs
                </span>
            </div>

            {/* LOADING */}

            {loading ? (
                <h2
                    style={{
                        color: "white",
                        textAlign: "center"
                    }}
                >
                    Loading...
                </h2>
            ) : posts.length === 0 ? (
                <div
                    style={{
                        textAlign: "center",
                        marginTop: "50px",
                        color: "white"
                    }}
                >
                    <h2>No jobs found</h2>

                    <p>Try another keyword.</p>

                    <button
                        className="btn btn-light"
                        onClick={() => {
                            setQuery("");
                            fetchJobs();
                        }}
                    >
                        Show All Jobs
                    </button>
                </div>
            ) : (
                posts.map((job) => (
                    <div key={job.postId} className="job-card">
                        <div className="job-header">
                            <h3>{job.postProfile}</h3>

                            <span className="experience">
                                {job.reqExperience} years
                            </span>
                        </div>

                        <p className="job-desc">{job.postDesc}</p>

                        <div className="tech-stack">
                            {job.postTechStack?.map((tech, index) => (
                                <span key={index} className="tech-tag">
                                    {tech}
                                </span>
                            ))}
                        </div>

                        <div className="job-actions">
                            <Link
                                to={`/edit/${job.postId}`}
                                className="btn btn-success"
                            >
                                Edit
                            </Link>

                            <button
                                className="btn btn-danger"
                                onClick={() => handleDelete(job.postId)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default AllPosts;