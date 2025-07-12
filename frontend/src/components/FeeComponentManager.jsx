import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FeeComponentManager = () => {
  const [form, setForm] = useState({
    ComponentID: null,
    FeeStructureCode: '',
    ComponentName: '',
    Amount: '',
    IsMandatory: false,
    Description: '',
  });

  const [components, setComponents] = useState([]);
  const [feeStructures, setFeeStructures] = useState([]);

  useEffect(() => {
    fetchComponents();
    fetchFeeStructures();
  }, []);

  const fetchComponents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/fee/components');
      setComponents(res.data);
    } catch (error) {
      toast.error('Error fetching components');
    }
  };

  const fetchFeeStructures = async () => {
    try {
      const res = await axios.get('http://localhost:5000/fee/getfeestructure');
      setFeeStructures(res.data);
    } catch (error) {
      toast.error('Error fetching fee structures');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.ComponentID) {
        await axios.put(`http://localhost:5000/fee/component/${form.ComponentID}`, form);
        toast.success('Component updated');
      } else {
        await axios.post('http://localhost:5000/fee/component', form);
        toast.success('Component added');
      }

      setForm({ ComponentID: null, FeeStructureCode: '', ComponentName: '', Amount: '', IsMandatory: false, Description: '' });
      fetchComponents();
    } catch (err) {
      toast.error('Error saving component');
    }
  };

  const handleEdit = (comp) => {
    setForm({ ...comp });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      try {
        await axios.delete(`http://localhost:5000/fee/component/${id}`);
        toast.success('Component deleted');
        fetchComponents();
      } catch (err) {
        toast.error('Error deleting component');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center">💼 Fee Components</h3>
      <form className="border p-4 shadow-sm rounded bg-light" onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col">
            <label>Fee Structure Code</label>
            <select
              name="FeeStructureCode"
              value={form.FeeStructureCode}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">-- Select Fee Structure --</option>
              {feeStructures.map((fs) => (
                <option key={fs.FeeStructureID} value={fs.FeeStructureCode}>
                  {fs.FeeStructureCode}
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <label>Component Name</label>
            <input type="text" name="ComponentName" value={form.ComponentName} onChange={handleChange} className="form-control" required />
          </div>
          <div className="col">
            <label>Amount</label>
            <input type="number" name="Amount" value={form.Amount} onChange={handleChange} className="form-control" required />
          </div>
        </div>

        <div className="mb-3">
          <label>Description</label>
          <input type="text" name="Description" value={form.Description} onChange={handleChange} className="form-control" />
        </div>

        <div className="form-check mb-3">
          <input type="checkbox" name="IsMandatory" className="form-check-input" checked={form.IsMandatory} onChange={handleChange} />
          <label className="form-check-label">Is Mandatory</label>
        </div>

        <button type="submit" className="btn btn-primary">{form.ComponentID ? 'Update' : 'Add'} Component</button>
      </form>

      <h5 className="mt-4">📋 Component List</h5>
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>FeeStructureCode</th>
            <th>Name</th>
            <th>Amount</th>
            <th>Mandatory</th>
            <th>Description</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {components.map((comp, idx) => (
            <tr key={comp.ComponentID}>
              <td>{idx + 1}</td>
              <td>{comp.FeeStructureCode}</td>
              <td>{comp.ComponentName}</td>
              <td>{comp.Amount}</td>
              <td>{comp.IsMandatory ? '✅' : '❌'}</td>
              <td>{comp.Description || '--'}</td>
              <td>{new Date(comp.CreatedDate).toLocaleDateString()}</td>
              <td>
                <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(comp)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(comp.ComponentID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default FeeComponentManager;
