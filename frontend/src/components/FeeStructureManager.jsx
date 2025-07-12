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
    const seenNames = new Set();

    for (let comp of res.data) {
      if (!seenNames.has(comp.ComponentName)) {
        unique.push(comp);
        seenNames.add(comp.ComponentName);
      }
    }

    setAllComponents(unique); // only unique component names
  };

  const fetchFieldsByDegree = async (degreeId) => {
    const res = await axios.get(`http://localhost:5000/degree/fieldbydegree/${degreeId}`);
    setFieldsByDegree(res.data);
  };

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    if (name === 'MandatoryComponentIDs') {
      const id = parseInt(value);
      const updated = checked
        ? [...formData.MandatoryComponentIDs, id]
        : formData.MandatoryComponentIDs.filter(item => item !== id);

      setFormData(prev => ({ ...prev, MandatoryComponentIDs: updated }));
      return;
    }

    setFormData((prev) => ({
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
      TotalAnnualFee: calculateTotalFee(),
      MandatoryComponentIDs: formData.MandatoryComponentIDs.join(',')
    };

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/fee/feestructure/${editId}`, payload);
        toast.success("Fee structure updated!");
      } else {
        await axios.post('http://localhost:5000/fee/feestructure', payload);
        toast.success("Fee structure added!");
      }

      fetchFeeStructures();
      resetForm();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error saving fee structure:", error);
    }
  };

  const handleEdit = async (item) => {
    const selectedIds = item.MandatoryComponentIDs
      ? [...new Set(item.MandatoryComponentIDs.split(',').map(id => parseInt(id)))]
      : [];

    setFormData({
      DegreeID: item.DegreeID,
      FieldID: item.FieldID,
      YearOfStudy: item.YearOfStudy,
      FirstYearFee: item.FirstYearFee,
      SecondYearFee: item.SecondYearFee,
      ThirdYearFee: item.ThirdYearFee,
      IsActive: item.IsActive,
      MandatoryComponentIDs: selectedIds
    });
    setEditId(item.FeeStructureID);
    await fetchFieldsByDegree(item.DegreeID);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete?")) {
      await axios.delete(`http://localhost:5000/fee/deletefeestructure/${id}`);
      toast.success("Deleted successfully!");
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
    const selectedIds = [...new Set((ids?.split(',').map(id => parseInt(id.trim()))) || [])];

    const selectedNames = allComponents
      .filter(c => selectedIds.includes(c.ComponentID))
      .map(c => c.ComponentName);

    const uniqueNames = [...new Set(selectedNames)];

    return uniqueNames.join(', ');
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">🎓 Fee Structure Manager</h3>

      <form className="border p-4 rounded bg-light shadow-sm" onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Degree</label>
            <select name="DegreeID" className="form-select" value={formData.DegreeID} onChange={handleChange} required>
              <option value="">-- Select Degree --</option>
              {degrees.map(d => (
                <option key={d.DegreeID} value={d.DegreeID}>{d.DegreeName}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Field</label>
            <select name="FieldID" className="form-select" value={formData.FieldID} onChange={handleChange} required>
              <option value="">-- Select Field --</option>
              {fieldsByDegree.map((field) => (
                <option key={field.FieldID} value={field.FieldID}>{field.FieldName}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Year of Study</label>
            <input type="number" name="YearOfStudy" className="form-control" value={formData.YearOfStudy} onChange={handleChange} required />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-3">
            <label className="form-label">1st Year Fee</label>
            <input type="number" name="FirstYearFee" className="form-control" value={formData.FirstYearFee} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <label className="form-label">2nd Year Fee</label>
            <input type="number" name="SecondYearFee" className="form-control" value={formData.SecondYearFee} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <label className="form-label">3rd Year Fee</label>
            <input type="number" name="ThirdYearFee" className="form-control" value={formData.ThirdYearFee} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Total Fee (Auto)</label>
            <input type="number" className="form-control" value={calculateTotalFee()} readOnly />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Mandatory Fee Components</label>
          <div className="row">
            {allComponents.map(comp => (
              <div className="col-md-4" key={comp.ComponentID}>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="MandatoryComponentIDs"
                    value={comp.ComponentID}
                    checked={formData.MandatoryComponentIDs.includes(comp.ComponentID)}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">{comp.ComponentName}</label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-check mb-3">
          <input type="checkbox" name="IsActive" className="form-check-input" checked={formData.IsActive} onChange={handleChange} />
          <label className="form-check-label">Is Active</label>
        </div>

        <button type="submit" className="btn btn-primary">{editId ? 'Update' : 'Add'} Fee Structure</button>
        {editId && (
          <button type="button" onClick={resetForm} className="btn btn-secondary ms-2">Cancel</button>
        )}
      </form>

      <table className="table table-bordered table-hover mt-4 shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>S.no</th>
            <th>Degree</th>
            <th>Field</th>
            <th>Year</th>
            <th>1st Yr</th>
            <th>2nd Yr</th>
            <th>3rd Yr</th>
            <th>Total</th>
            <th>Components</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {feeStructures.length === 0 ? (
            <tr><td colSpan="11" className="text-center">No data available</td></tr>
          ) : (
            feeStructures.map((fs, i) => (
              <tr key={fs.FeeStructureID}>
                <td>{i + 1}</td>
                <td>{getDegreeName(fs.DegreeID)}</td>
                <td>{getFieldName(fs.FieldID)}</td>
                <td>{fs.YearOfStudy}</td>
                <td>{fs.FirstYearFee || '-'}</td>
                <td>{fs.SecondYearFee || '-'}</td>
                <td>{fs.ThirdYearFee || '-'}</td>
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
