import { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const emptyForm = { employeeNumber: '', GlossSalary: '', TotalDeduction: '', month: '' };

export default function Salaries() {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [netPreview, setNetPreview] = useState(null);

  const fetchAll = () => {
    api.get('/salaries').then(r => setSalaries(r.data)).catch(() => toast.error('Failed to load salaries'));
    api.get('/employees').then(r => setEmployees(r.data)).catch(() => {});
  };

  useEffect(() => { fetchAll(); }, []);

  useEffect(() => {
    if (form.GlossSalary && form.TotalDeduction) {
      setNetPreview(parseFloat(form.GlossSalary) - parseFloat(form.TotalDeduction));
    } else {
      setNetPreview(null);
    }
  }, [form.GlossSalary, form.TotalDeduction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/salaries/${editId}`, form);
        toast.success('Salary updated!');
      } else {
        await api.post('/salaries', form);
        toast.success('Salary record added!');
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditId(null);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving salary');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sal) => {
    setForm({
      employeeNumber: sal.employeeNumber,
      GlossSalary: sal.GlossSalary,
      TotalDeduction: sal.TotalDeduction,
      month: sal.month
    });
    setEditId(sal.SalaryID);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this salary record?')) return;
    try {
      await api.delete(`/salaries/${id}`);
      toast.success('Salary deleted');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Salary</h1>
          <p className="text-gray-500 text-sm">Manage employee salary records</p>
        </div>
        <button
          className="btn-primary sm:ml-auto"
          onClick={() => { setShowForm(true); setForm(emptyForm); setEditId(null); }}
        >
          + Add Salary Record
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{editId ? 'Edit Salary' : 'Add Salary Record'}</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="form-label">Employee *</label>
                  <select className="form-input" value={form.employeeNumber} onChange={e => setForm({...form, employeeNumber: e.target.value})} required>
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp.employeeNumber} value={emp.employeeNumber}>
                        {emp.employeeNumber} — {emp.FirstName} {emp.LastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Month *</label>
                  <input type="month" className="form-input" value={form.month} onChange={e => setForm({...form, month: e.target.value})} required />
                </div>
                <div>
                  <label className="form-label">Gross Salary (RWF) *</label>
                  <input type="number" min="0" className="form-input" value={form.GlossSalary} onChange={e => setForm({...form, GlossSalary: e.target.value})} required />
                </div>
                <div>
                  <label className="form-label">Total Deduction (RWF) *</label>
                  <input type="number" min="0" className="form-input" value={form.TotalDeduction} onChange={e => setForm({...form, TotalDeduction: e.target.value})} required />
                </div>
                {netPreview !== null && (
                  <div className="p-3 bg-green-50 rounded-lg text-sm">
                    <span className="text-gray-600">Net Salary: </span>
                    <span className="font-bold text-green-700">{netPreview.toLocaleString()} RWF</span>
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-primary flex-1" disabled={loading}>
                    {loading ? 'Saving...' : editId ? 'Update' : 'Add Salary'}
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="table-header">
              <tr>
                {['Employee', 'Month', 'Gross Salary', 'Deduction', 'Net Salary', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {salaries.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">No salary records found</td></tr>
              ) : salaries.map(sal => (
                <tr key={sal.SalaryID} className="table-row">
                  <td className="px-4 py-3">
                    <div className="font-medium">{sal.FirstName} {sal.LastName}</div>
                    <div className="text-xs text-gray-400">{sal.employeeNumber}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{sal.month}</td>
                  <td className="px-4 py-3 text-gray-700">{Number(sal.GlossSalary).toLocaleString()}</td>
                  <td className="px-4 py-3 text-red-600">-{Number(sal.TotalDeduction).toLocaleString()}</td>
                  <td className="px-4 py-3 font-bold text-green-700">{Number(sal.NetSalary).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(sal)} className="text-blue-600 hover:text-blue-800 text-xs font-semibold">Edit</button>
                      <button onClick={() => handleDelete(sal.SalaryID)} className="text-red-500 hover:text-red-700 text-xs font-semibold">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
