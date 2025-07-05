import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminHomeEdit = () => {
    const [form, setForm] = useState({
        Motto: '',
        Description: '',
        TextAlign: 'center',
        FontColor: '#ffffff',
        BackgroundColor: 'rgba(0,0,0,0.5)'
    });
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            const res = await axios.get('http://localhost:5000/home/get-home');
            if (res.data) {
                setForm({
                    Motto: res.data.Motto || '',
                    Description: res.data.Description || ''
                });
            }
        };
        fetch();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            alert("Please select a banner image.");
            return;
        }

        const formData = new FormData();
        formData.append("banner", selectedFile);
        formData.append("Motto", form.Motto);
        formData.append("Description", form.Description);

        try {
            await axios.post('http://localhost:5000/home/update-home', formData);
            alert('✅ Home content updated successfully!');
        } catch (err) {
            console.error(err);
            alert('❌ Failed to update content.');
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="card shadow p-4">
                <h2 className="mb-4 text-primary text-center">Home Page Content Control</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">

                    <div className="mb-3">
                        <label className="form-label">Banner Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="form-control"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Motto</label>
                        <input
                            type="text"
                            name="Motto"
                            value={form.Motto}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter your college motto"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                            name="Description"
                            value={form.Description}
                            onChange={handleChange}
                            className="form-control"
                            rows="4"
                            placeholder="Enter a brief description"
                        ></textarea>
                    </div>


                    <label>Text Alignment</label>
                    <select
                        name="TextAlign"
                        className="form-select mb-3"
                        value={form.TextAlign}
                        onChange={handleChange}
                    >
                        <option value="">Select A Option</option>
                        <option value="center">Center</option>
                        <option value="top-left">Top Left</option>
                        <option value="top-right">Top Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="bottom-right">Bottom Right</option>
                    </select>
                    

                    <button type="submit" className="btn btn-success w-100">
                        Update Home Page
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminHomeEdit;
