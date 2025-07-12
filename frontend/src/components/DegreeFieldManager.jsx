import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/DegreeFieldManager.css';
import { getdegreepending, getfieldpending, getdegreesuccess, getfieldsuccess } from '../Redux/DegreeFieldslice'
import { useDispatch, useSelector } from 'react-redux';

const DegreeFieldManager = () => {
  // const [degrees, setDegrees] = useState([]);
  const [fields, setFields] = useState([]);
  const [newDegree, setNewDegree] = useState('');
  const [selectedDegreeId, setSelectedDegreeId] = useState('');
  const [newField, setNewField] = useState('');


  const dispatch = useDispatch();
  const { degree, Field } = useSelector((state) => state.course);  //Getting  value from Store using Saga

  useEffect(() => {
    dispatch(getdegreepending());
    dispatch(getfieldpending())
  }, [dispatch])


const handleAddDegree = async () => {
  if (!newDegree.trim()) return toast.warn('Enter a degree name');
  try {
    await axios.post('http://localhost:5000/degree/degreepost', { name: newDegree });

    // ✅ Re-fetch from DB after successful insert
    dispatch(getdegreepending());

    toast.success('Degree added');
    setNewDegree('');
  } catch (error) {
    toast.error('Error adding degree');
  }
};

const handleAddField = async () => {
  if (!newField.trim() || !selectedDegreeId) {
    return toast.warn('Select a degree and enter field name');
  }
  try {
    await axios.post('http://localhost:5000/Field/fieldpost', {
      name: newField,
      degreeId: selectedDegreeId
    });

    // ✅ Re-fetch from DB after successful insert
    dispatch(getfieldpending());

    toast.success('Field added');
    setNewField('');
    setSelectedDegreeId('');
  } catch (error) {
    toast.error('Error adding field');
  }
};

  const handleEditDegree = async (selectedDegree) => {
    const newName = prompt('Edit Degree Name:', selectedDegree.DegreeName);
    if (newName) {
      try {
        await axios.put(`http://localhost:5000/degree/degreeupdate/${selectedDegree.DegreeID}`, { name: newName });
        // Use the 'degree' array from Redux state
        dispatch(getdegreesuccess(
          degree.map(d => d.DegreeID === selectedDegree.DegreeID ? { ...d, DegreeName: newName } : d ) ));
        toast.success('Degree updated');
      } catch (error) {
        toast.error('Error updating degree');
      }
    }
  };

  const handleDeleteDegree = async (id) => {
    if (window.confirm('Are you sure you want to delete this degree?')) {
      try {
        await axios.delete(`http://localhost:5000/degree/degreedelete/${id}`);
        dispatch(getdegreesuccess(degree.filter(d => d.DegreeID !== id)));
        toast.success('Degree deleted');
      } catch (error) {
        toast.error('Error deleting degree');
      }
    }
  };

  const handleEditField = async (field) => {
    const newName = prompt('Edit Field Name:', field.FieldName);
    if (newName) {
      try {
        await axios.put(`http://localhost:5000/Field/fieldupdate/${field.FieldId}`, {
          name: newName,
          degreeId: field.DegreeId
        });
        dispatch(getfieldsuccess(
          Field.map(f => f.FieldId === field.FieldId ? { ...f, FieldName: newName } : f)
        ));
        toast.success('Field updated');
        // fetchFields();
      } catch (error) {
        toast.error('Error updating field');
      }
    }
  };

  const handleDeleteField = async (id) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      try {
        await axios.delete(`http://localhost:5000/Field/fielddelete/${id}`);
        dispatch(getfieldsuccess(Field.filter(f => f.FieldId !== id)));
        toast.success('Field deleted');
        // fetchFields();
      } catch (error) {
        toast.error('Error deleting field');
      }
    }
  };


  return (
    <div className="df-container">
      <ToastContainer position="top-right" />
      <h2><span role="img" aria-label="graduation cap">🎓</span> Degree & Field Manager</h2>

      <div className="df-section">
        <div className="df-form">
          <h3>Add New Degree</h3>
          <input
            type="text"
            placeholder="Enter degree name (e.g. B.Tech)"
            value={newDegree}
            onChange={(e) => setNewDegree(e.target.value)}
          />
          <button onClick={handleAddDegree}>
            <i className="fas fa-plus icon"></i> Add Degree
          </button>
        </div>

        <div className="df-form">
          <h3>Add New Field</h3>
          <select
            value={selectedDegreeId}
            onChange={(e) => setSelectedDegreeId(e.target.value)}
          >
            <option value="">Select Degree</option>
            {degree.map(deg => (
              <option key={deg.DegreeID} value={deg.DegreeID}>{deg.DegreeName}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Enter field (e.g. Computer Science)"
            value={newField}
            onChange={(e) => setNewField(e.target.value)}
          />
          <button onClick={handleAddField}>
            <i className="fas fa-plus icon"></i> Add Field
          </button>
        </div>
      </div>

      <div className="df-table-container">
        <h3><span role="img" aria-label="clipboard">📋</span> Degrees and Their Fields</h3>
        <table className="df-table">
          <thead>
            <tr>
              <th>Degree Name</th>
              <th>Fields</th>
            </tr>
          </thead>
          <tbody>
            {degree.map((deg) => {
              const relatedFields = fields.filter(field => field.DegreeId === deg.DegreeID);
              return (
                <tr key={deg.DegreeID}>
                  <td>
                    <div className="degree-header">
                      <span className="degree-title">{deg.DegreeName}</span>
                      <div className="degree-actions">
                        <button
                          className="btn btn-edit"
                          onClick={() => handleEditDegree(deg)}>
                          <i className="fas fa-edit icon"></i> Edit
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={() => handleDeleteDegree(deg.DegreeID)}
                        >
                          <i className="fas fa-trash icon"></i> Delete
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>
                    {Field.filter(field => field.DegreeId === deg.DegreeID).length > 0 ? (
                      <ul className="field-list">
                        {Field.filter(field => field.DegreeId === deg.DegreeID).map(field => (
                          <li key={field.FieldId} className="field-item">
                            <span className="field-name">{field.FieldName}</span>
                            <div className="field-actions">
                              <button
                                className="btn btn-edit"
                                onClick={() => handleEditField(field)}
                              >
                                <i className="fas fa-edit icon"></i> Edit
                              </button>
                              <button
                                className="btn btn-delete"
                                onClick={() => handleDeleteField(field.FieldId)}
                              >
                                <i className="fas fa-trash icon"></i> Delete
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="empty-fields">No Fields Added</span>
                    )}
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DegreeFieldManager;
