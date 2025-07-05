import React, { useEffect, useState } from 'react';
import axios from 'axios';


const AddSectionForm = () => {
  const [degrees, setDegrees] = useState([]);
  const [allFields, setAllFields] = useState([]);
  const [fieldsByDegree, setFieldsByDegree] = useState([]);
  const [fetchs, setfetch] = useState([])
  const [form, setForm] = useState({
    DegreeID: '',
    FieldID: '',
    AcademicYear: '',
    Yearofstudy: '',
    SectionRoman: ''
  });
  const [editId, setEditId] = useState(null);


  useEffect(() => {
    fetchDegrees();
    fetchclasssection();
    fetchAllFields();
  }, []);

  const fetchDegrees = async () => {
    const res = await axios.get('http://localhost:5000/degree/degreeget');
    setDegrees(res.data);
  };
  const fetchAllFields = async () => {
    const res = await axios.get('http://localhost:5000/field/fieldget');
    console.log('All fields:', res.data); 
    setAllFields(res.data);
  };
  const fetchFieldsByDegree = async (degreeId) => {
    const res = await axios.get(`http://localhost:5000/degree/fieldbydegree/${degreeId}`);
    setFieldsByDegree(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'DegreeID') {
      fetchFieldsByDegree(value);
      setForm((prev) => ({ ...prev, FieldID: '' })); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/allocation/update-section/${editId}`, form);
        alert('Class Section updated successfully');
      } else {
        await axios.post('http://localhost:5000/allocation/add-section', form);
        alert('Class Section added successfully');
      }
      setForm({
        DegreeID: '',
        FieldID: '',
        Academicyear: '',
        Yearofstudy: '',
        SectionRoman: ''
      });
      setEditId(null);
      fetchclasssection();
    } catch (err) {
      console.error(err);
      alert('Error submitting class section');
    }
  };

  const handleEdit = (section) => {
    setForm({
      DegreeID: section.DegreeID,
      FieldID: section.FieldID,
      Academicyear: section.AcademicYear,
      Yearofstudy: section.Yearofstudy,
      SectionRoman: section.SectionRoman
    });
    setEditId(section.SectionID);
    fetchFieldsByDegree(section.DegreeID); 
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        await axios.delete(`http://localhost:5000/allocation/delete-section/${id}`);
        alert('Section deleted successfully');
        fetchclasssection();
      } catch (err) {
        console.error(err);
        alert('Error deleting section');
      }
    }
  };


  const fetchclasssection = async () => {
    try {
      const res = await axios.get('http://localhost:5000/allocation/getsection');
      setfetch(res.data)
    }
    catch (err) {
      console.error('error fetxhing section', err);
      setfetch([]);
    }
  }

  const getDegreeName = (id) => {
    const degree = degrees.find((d) => d.DegreeID === id);
    return degree ? degree.DegreeName : id;
  };

  const getFieldName = (id) => {
    const field = allFields.find((f) => parseInt(f.FieldId) === parseInt(id));
    return field ? field.FieldName : id;
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Add Class Section</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Degree</label>
              <select
                className="form-select"
                name="DegreeID"
                value={form.DegreeID}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Degree --</option>
                {degrees.map((deg) => (
                  <option key={deg.DegreeID} value={deg.DegreeID}>
                    {deg.DegreeName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Field</label>
              <select
                className="form-select"
                name="FieldID"
                value={form.FieldID}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Field --</option>
                {fieldsByDegree.map((field) => (
                  <option key={field.FieldID} value={field.FieldID}>
                    {field.FieldName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Academic Year</label>
              <input
                type="text"
                className="form-control"
                name="AcademicYear"
                value={form.AcademicYear}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Year of Study</label>
              <select
                className="form-select"
                name="Yearofstudy"
                value={form.Yearofstudy}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Year --</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Section (Roman)</label>
              <input
                type="text"
                className="form-control"
                name="SectionRoman"
                value={form.SectionRoman}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100">
              {editId ? 'Update Section' : 'Add Section'}
            </button>

          </form>
        </div>
      </div>
      <div className="mt-4">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Degree Name</th>
              <th>Field Name</th>
              <th>Academic Year</th>
              <th>Year of Study</th>
              <th>Section</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(fetchs) && fetchs.length > 0 ? (
              fetchs.map((f, index) => (
                <tr key={index}>
                  <td>{getDegreeName(f.DegreeID)}</td>
                  <td>{getFieldName(f.FieldID)}</td>
                  <td>{f.AcademicYear}</td>
                  <td>{f.Yearofstudy}</td>
                  <td>{f.SectionRoman}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(f)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(f.SectionID)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No sections available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddSectionForm;
