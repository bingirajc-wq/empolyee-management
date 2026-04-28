import { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const emptyForm = { DepartmentCode: '', DepartmentName: '', GrossSalary: '' };

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editCode, setEditCode] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAll = () => {
    api.get('/departments').then(r => setDepartments(r.data)).catch(() => toast.error('Failed to load departments'));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editCode) {
        await api.put(`/departments/${editCode}`, form);
        toast.success('Department updated!');
      } else {
        await api.post('/departments', form);
        toast.success('Department added!');
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditCode(null);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving department');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (dept) => {
    setForm({ DepartmentCode: dept.DepartmentCode, DepartmentName: dept.DepartmentName, GrossSalary: dept.GrossSalary });
    setEditCode(dept.DepartmentCode);
    setShowForm(true);
  };

  const handleDelete = async (code) => {
    if (!confirm(`Delete department ${code}?`)) return;
    try {
      await api.delete(`/departments/${code}`);
      toast.success('Department deleted');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Departments</h1>
          <p className="text-gray-500 text-sm">Manage department records</p>
        </div>
        <button
          className="btn-primary sm:ml-auto"
          onClick={() => { setShowForm(true); setForm(emptyForm); setEditCode(null); }}
        >
          + Add Department
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{editCode ? 'Edit Department' : 'Add Department'}</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="form-label">Department Code *</label>
                  <input
                    className="form-input uppercase"
                    placeholder="e.g. HR"
                    value={form.DepartmentCode}
                    onChange={e => setForm({...form, DepartmentCode: e.target.value.toUpperCase()})}
                    disabled={!!editCode}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Department Name *</label>
                  <input className="form-input" value={form.DepartmentName} onChange={e => setForm({...form, DepartmentName: e.target.value})} required />
                </div>
                <div>
                  <label className="form-label">Gross Salary (RWF) *</label>
                  <input type="number" className="form-input" value={form.GrossSalary} onChange={e => setForm({...form, GrossSalary: e.target.value})} required />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-primary flex-1" disabled={loading}>
                    {loading ? 'Saving...' : editCode ? 'Update' : 'Add Department'}
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.length === 0 ? (
          <div className="col-span-3 card text-center text-gray-400 py-12">No departments found</div>
        ) : departments.map(dept => (
          <div key={dept.DepartmentCode} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">{dept.DepartmentCode}</span>
                <h3 className="font-semibold text-gray-800 mt-2">{dept.DepartmentName}</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(dept)} className="text-blue-500 hover:text-blue-700 text-sm">Edit</button>
                <button onClick={() => handleDelete(dept.DepartmentCode)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
              </div>
            </div>
            <div className="mt-3 p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-gray-500">Gross Salary</p>
              <p className="text-xl font-bold text-green-700">{Number(dept.GrossSalary).toLocaleString()} <span className="text-sm font-normal">RWF</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
