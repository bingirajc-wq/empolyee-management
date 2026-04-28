import { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const emptyForm = {
  FirstName: '', LastName: '', Position: '', Address: '',
  Telephone: '', Gender: '', hiredDate: '', DepartmentCode: ''
};

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchAll = () => {
    api.get('/employees').then(r => setEmployees(r.data)).catch(() => toast.error('Failed to load employees'));
    api.get('/departments').then(r => setDepartments(r.data)).catch(() => {});
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/employees/${editId}`, form);
        toast.success('Employee updated!');
      } else {
        const res = await api.post('/employees', form);
        toast.success(`Employee added! ID: ${res.data.employeeNumber}`);
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditId(null);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving employee');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (emp) => {
    setForm({
      FirstName: emp.FirstName, LastName: emp.LastName, Position: emp.Position,
      Address: emp.Address, Telephone: emp.Telephone, Gender: emp.Gender,
      hiredDate: emp.hiredDate?.split('T')[0] || '', DepartmentCode: emp.DepartmentCode || ''
    });
    setEditId(emp.employeeNumber);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm(`Delete employee ${id}?`)) return;
    try {
      await api.delete(`/employees/${id}`);
      toast.success('Employee deleted');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const filtered = employees.filter(e =>
    `${e.FirstName} ${e.LastName} ${e.employeeNumber} ${e.Position}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
          <p className="text-gray-500 text-sm">Manage employee records</p>
        </div>
        <div className="sm:ml-auto flex gap-2">
          <input
            className="form-input w-48"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            className="btn-primary whitespace-nowrap"
            onClick={() => { setShowForm(true); setForm(emptyForm); setEditId(null); }}
          >
            + Add Employee
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{editId ? 'Edit Employee' : 'Add New Employee'}</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
              </div>
              {!editId && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                  💡 A unique Employee ID (e.g. EMP-XXXXX) will be auto-generated.
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">First Name *</label>
                    <input className="form-input" value={form.FirstName} onChange={e => setForm({...form, FirstName: e.target.value})} required />
                  </div>
                  <div>
                    <label className="form-label">Last Name *</label>
                    <input className="form-input" value={form.LastName} onChange={e => setForm({...form, LastName: e.target.value})} required />
                  </div>
                </div>
                <div>
                  <label className="form-label">Position *</label>
                  <input className="form-input" value={form.Position} onChange={e => setForm({...form, Position: e.target.value})} required />
                </div>
                <div>
                  <label className="form-label">Address *</label>
                  <input className="form-input" value={form.Address} onChange={e => setForm({...form, Address: e.target.value})} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Telephone *</label>
                    <input className="form-input" value={form.Telephone} onChange={e => setForm({...form, Telephone: e.target.value})} required />
                  </div>
                  <div>
                    <label className="form-label">Gender *</label>
                    <select className="form-input" value={form.Gender} onChange={e => setForm({...form, Gender: e.target.value})} required>
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Hired Date *</label>
                    <input type="date" className="form-input" value={form.hiredDate} onChange={e => setForm({...form, hiredDate: e.target.value})} required />
                  </div>
                  <div>
                    <label className="form-label">Department</label>
                    <select className="form-input" value={form.DepartmentCode} onChange={e => setForm({...form, DepartmentCode: e.target.value})}>
                      <option value="">None</option>
                      {departments.map(d => (
                        <option key={d.DepartmentCode} value={d.DepartmentCode}>{d.DepartmentName}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-primary flex-1" disabled={loading}>
                    {loading ? 'Saving...' : editId ? 'Update Employee' : 'Add Employee'}
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="table-header">
              <tr>
                {['Emp. No.', 'Name', 'Position', 'Gender', 'Telephone', 'Department', 'Hired Date', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8 text-gray-400">No employees found</td></tr>
              ) : filtered.map(emp => (
                <tr key={emp.employeeNumber} className="table-row">
                  <td className="px-4 py-3 font-mono text-xs text-blue-700 font-semibold">{emp.employeeNumber}</td>
                  <td className="px-4 py-3 font-medium">{emp.FirstName} {emp.LastName}</td>
                  <td className="px-4 py-3 text-gray-600">{emp.Position}</td>
                  <td className="px-4 py-3 text-gray-600">{emp.Gender}</td>
                  <td className="px-4 py-3 text-gray-600">{emp.Telephone}</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                      {emp.DepartmentName || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{emp.hiredDate?.split('T')[0]}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(emp)} className="text-blue-600 hover:text-blue-800 text-xs font-semibold">Edit</button>
                      <button onClick={() => handleDelete(emp.employeeNumber)} className="text-red-500 hover:text-red-700 text-xs font-semibold">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-gray-50 border-t text-xs text-gray-500">
          {filtered.length} of {employees.length} employees
        </div>
      </div>
    </div>
  );
}
