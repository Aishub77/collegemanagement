// ✅ Complete FeeStructureManager.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FeeStructureManager = () => {
  const [feeStructures, setFeeStructures] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [allFields, setAllFields] = useState([]);
  const [fieldsByDegree, setFieldsByDegree] = useState([]);
  const [allComponents, setAllComponents] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    DegreeID: '',
    FieldID: '',
    YearOfStudy: '',
    FirstYearFee: '',
    SecondYearFee: '',
    ThirdYearFee: '',
    IsActive: true,
    MandatoryComponentIDs: []
  });

  useEffect(() => {
    fetchFeeStructures();
    fetchDegrees();
    fetchAllFields();
    fetchAllComponents();
  }, []);

  const fetchFeeStructures = async () => {
    const res = await axios.get('http://localhost:5000/fee/getfeestructure');
    setFeeStructures(res.data);
  };

  const fetchDegrees = async () => {
    const res = await axios.get('http://localhost:5000/degree/degreeget');
    setDegrees(res.data);
  };

  const fetchAllFields = async () => {
    const res = await axios.get('http://localhost:5000/Field/fieldget');
    setAllFields(res.data);
  };

  const fetchAllComponents = async () => {
    const res = await axios.get('http://localhost:5000/fee/components');
    const unique = [];
    const seen = new Set();
    for (let comp of res.data) {
      if (!seen.has(comp.ComponentName)) {
        unique.push(comp);
        seen.add(comp.ComponentName);
      }
    }
    setAllComponents(unique);
  };

  const fetchFieldsByDegree = async (degreeId) => {
    const res = await axios.get(`http://localhost:5000/degree/fieldbydegree/${degreeId}`);
    setFieldsByDegree(res.data);
  };

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'MandatoryComponentIDs') {
      const id = parseInt(value);
      const updated = checked
        ? [...formData.MandatoryComponentIDs, id]
        : formData.MandatoryComponentIDs.filter(cid => cid !== id);
      setFormData(prev => ({ ...prev, MandatoryComponentIDs: updated }));
      return;
    }
    const newValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
      ...(name === 'DegreeID' ? { FieldID: '' } : {})
    }));
    if (name === 'DegreeID') await fetchFieldsByDegree(value);
  };

  const calculateTotalFee = () => {
    const { FirstYearFee = 0, SecondYearFee = 0, ThirdYearFee = 0 } = formData;
    return Number(FirstYearFee || 0) + Number(SecondYearFee || 0) + Number(ThirdYearFee || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      MandatoryComponentIDs: formData.MandatoryComponentIDs.join(',')
    };
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/fee/feestructure/${editId}`, payload);
        toast.success('Updated successfully');
      } else {
        await axios.post('http://localhost:5000/fee/feestructure', payload);
        toast.success('Added successfully');
      }
      resetForm();
      fetchFeeStructures();
    } catch (err) {
      console.error(err);
      toast.error('Error saving fee structure');
    }
  };

  const handleEdit = async (item) => {
    const selected = item.MandatoryComponentIDs?.split(',').map(id => parseInt(id)) || [];
    setFormData({
      DegreeID: item.DegreeID,
      FieldID: item.FieldID,
      YearOfStudy: item.YearOfStudy,
      FirstYearFee: item.FirstYearFee,
      SecondYearFee: item.SecondYearFee,
      ThirdYearFee: item.ThirdYearFee,
      IsActive: item.IsActive,
      MandatoryComponentIDs: selected
    });
    setEditId(item.FeeStructureID);
    await fetchFieldsByDegree(item.DegreeID);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure to delete?')) {
      await axios.delete(`http://localhost:5000/fee/deletefeestructure/${id}`);
      toast.success('Deleted successfully');
      fetchFeeStructures();
    }
  };

  const resetForm = () => {
    setFormData({
      DegreeID: '',
      FieldID: '',
      YearOfStudy: '',
      FirstYearFee: '',
      SecondYearFee: '',
      ThirdYearFee: '',
      IsActive: true,
      MandatoryComponentIDs: []
    });
    setEditId(null);
    setFieldsByDegree([]);
  };

  const getDegreeName = (id) => degrees.find(d => d.DegreeID === id)?.DegreeName || '--';
  const getFieldName = (id) => allFields.find(f => f.FieldId === id)?.FieldName || '--';
  const getComponentNames = (ids) => {
    const idsArray = ids?.split(',').map(id => parseInt(id.trim())) || [];
    return allComponents
      .filter(c => idsArray.includes(c.ComponentID))
      .map(c => c.ComponentName)
      .join(', ');
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">🎓 Fee Structure Manager</h3>
      <form className="border p-4 bg-light rounded shadow-sm" onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-4">
            <label>Degree</label>
            <select name="DegreeID" className="form-select" value={formData.DegreeID} onChange={handleChange} required>
              <option value="">-- Select Degree --</option>
              {degrees.map(d => <option key={d.DegreeID} value={d.DegreeID}>{d.DegreeName}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label>Field</label>
            <select name="FieldID" className="form-select" value={formData.FieldID} onChange={handleChange} required>
              <option value="">-- Select Field --</option>
              {fieldsByDegree.map(f => <option key={f.FieldID} value={f.FieldID}>{f.FieldName}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label>Year</label>
            <input name="YearOfStudy" className="form-control" value={formData.YearOfStudy} onChange={handleChange} required />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-3">
            <label>1st Year Fee</label>
            <input type="number" name="FirstYearFee" className="form-control" value={formData.FirstYearFee} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <label>2nd Year Fee</label>
            <input type="number" name="SecondYearFee" className="form-control" value={formData.SecondYearFee} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <label>3rd Year Fee</label>
            <input type="number" name="ThirdYearFee" className="form-control" value={formData.ThirdYearFee} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <label>Total Fee (Auto)</label>
            <input className="form-control" readOnly value={calculateTotalFee()} />
          </div>
        </div>

        <div className="mb-3">
          <label>Mandatory Components</label>
          <div className="row">
            {allComponents.map(comp => (
              <div className="col-md-4" key={comp.ComponentID}>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" name="MandatoryComponentIDs" value={comp.ComponentID} checked={formData.MandatoryComponentIDs.includes(comp.ComponentID)} onChange={handleChange} />
                  <label className="form-check-label">{comp.ComponentName}</label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" name="IsActive" checked={formData.IsActive} onChange={handleChange} />
          <label className="form-check-label">Is Active</label>
        </div>

        <button className="btn btn-primary" type="submit">{editId ? 'Update' : 'Add'} Fee Structure</button>
        {editId && <button className="btn btn-secondary ms-2" type="button" onClick={resetForm}>Cancel</button>}
      </form>

      <table className="table table-bordered table-striped mt-4">
        <thead className="table-dark">
          <tr>
            <th>#</th><th>Degree</th><th>Field</th><th>Year</th>
            <th>1st Yr</th><th>2nd Yr</th><th>3rd Yr</th><th>Total</th>
            <th>Components</th><th>Active</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {feeStructures.length === 0 ? <tr><td colSpan="11" className="text-center">No data</td></tr> : (
            feeStructures.map((fs, i) => (
              <tr key={fs.FeeStructureID}>
                <td>{i + 1}</td>
                <td>{getDegreeName(fs.DegreeID)}</td>
                <td>{getFieldName(fs.FieldID)}</td>
                <td>{fs.YearOfStudy}</td>
                <td>{fs.FirstYearFee}</td>
                <td>{fs.SecondYearFee}</td>
                <td>{fs.ThirdYearFee}</td>
                <td>{fs.TotalAnnualFee}</td>
                <td>{getComponentNames(fs.MandatoryComponentIDs)}</td>
                <td>{fs.IsActive ? '✅' : '❌'}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-1" onClick={() => handleEdit(fs)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(fs.FeeStructureID)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default FeeStructureManager;
