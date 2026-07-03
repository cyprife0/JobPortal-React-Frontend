import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Edit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [experience, setExperience] = useState("");
    const [techstack, setTechstack] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:8080/jobposts/${id}`)
            .then(resp => resp.json())
            .then(data => {
                setTitle(data.postProfile);
                setDescription(data.postDesc);
                setExperience(data.reqExperience);
                setTechstack(data.postTechStack.join(", "));
                setLoading(false);
            })
            .catch(err => console.error("Error fetching job:", err));
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        const updatedJob = {
            postId: parseInt(id),
            postProfile: title,
            postDesc: description,
            reqExperience: parseInt(experience),
            postTechStack: [techstack]
        };

        try {
            const response = await fetch(`http://localhost:8080/jobposts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedJob)
            });

            if (response.ok) {
                alert("Job updated successfully!");
                navigate('/');
            } else {
                alert("Failed to update job");
            }
        } catch (error) {
            console.error("Error updating:", error);
        }
    };

    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '50px'
        },
        card: {
            background: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            width: '600px'
        },
        inputGroup: {
            marginBottom: '15px'
        },
        label: {
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold'
        },
        input: {
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            boxSizing: 'border-box'
        },
        button: {
            width: '100%',
            padding: '12px',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '10px'
        }
    };

    if (loading) return <div style={{textAlign: 'center', marginTop: '50px', fontSize: '20px'}}>Loading Job Data...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Edit Job</h2>
                <form onSubmit={handleUpdate}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Job Title</label>
                        <input type="text" style={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Job Description</label>
                        <textarea style={{...styles.input, height: '80px'}} rows="3" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{...styles.inputGroup, flex: 1}}>
                            <label style={styles.label}>Experience (years)</label>
                            <input type="number" style={styles.input} value={experience} onChange={(e) => setExperience(e.target.value)} required />
                        </div>
                        <div style={{...styles.inputGroup, flex: 1}}>
                            <label style={styles.label}>Tech Stack</label>
                            <input type="text" style={styles.input} value={techstack} onChange={(e) => setTechstack(e.target.value)} required />
                        </div>
                    </div>
                    <button type="submit" style={styles.button}>Update Job</button>
                </form>
            </div>
        </div>
    );
};

export default Edit;