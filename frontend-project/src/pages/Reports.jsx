import { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Reports() {
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/salaries/months/distinct')
      .then(r => setMonths(r.data))
      .catch(() => toast.error('Failed to load months'));
  }, []);

  const fetchReport = async () => {
    if (!selectedMonth) return toast.error('Please select a month');
    setLoading(true);
    try {
      const res = await api.get(`/salaries/report/${selectedMonth}`);
      setReport(res.data);
      if (res.data.length === 0) toast('No records found for this month', { icon: 'ℹ️' });
    } catch (err) {
      toast.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  const totalGross = report.reduce((s, r) => s + parseFloat(r.GlossSalary || 0), 0);
  const totalDeduction = report.reduce((s, r) => s + parseFloat(r.TotalDeduction || 0), 0);
  const totalNet = report.reduce((s, r) => s + parseFloat(r.NetSalary || 0), 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Monthly Payroll Report</h1>
        <p className="text-gray-500 text-sm">Generate employee payroll reports by month</p>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="form-label">Select Month</label>
            <select
              className="form-input"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
            >
              <option value="">-- Select a month --</option>
              {months.map(m => (
                <option key={m.month} value={m.month}>{m.month}</option>
              ))}
            </select>
          </div>
          <button onClick={fetchReport} className="btn-primary" disabled={loading}>
            {loading ? 'Loading...' : 'Generate Report'}
          </button>
          {report.length > 0 && (
            <button onClick={handlePrint} className="btn-secondary">
              🖨️ Print
            </button>
          )}
        </div>
      </div>

      {report.length > 0 && (
        <div className="card overflow-hidden p-0" id="print-area">
          {/* Report header for print */}
          <div className="p-6 border-b">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800">Employee- Monthly Payroll Report</h2>
              <p className="text-gray-500 text-sm">Period: {selectedMonth}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="table-header">
                <tr>
                  {['#', 'First Name', 'Last Name', 'Position', 'Department', 'Gross Salary', 'Deduction', 'Net Salary'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {report.map((row, i) => (
                  <tr key={i} className="table-row">
                    <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3 font-medium">{row.FirstName}</td>
                    <td className="px-4 py-3 font-medium">{row.LastName}</td>
                    <td className="px-4 py-3 text-gray-600">{row.Position}</td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                        {row.DepartmentName || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{Number(row.GlossSalary).toLocaleString()}</td>
                    <td className="px-4 py-3 text-red-600">-{Number(row.TotalDeduction).toLocaleString()}</td>
                    <td className="px-4 py-3 font-bold text-green-700">{Number(row.NetSalary).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr className="font-bold text-gray-800">
                  <td colSpan={5} className="px-4 py-3 text-right">TOTALS:</td>
                  <td className="px-4 py-3">{totalGross.toLocaleString()}</td>
                  <td className="px-4 py-3 text-red-600">-{totalDeduction.toLocaleString()}</td>
                  <td className="px-4 py-3 text-green-700">{totalNet.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="p-4 bg-gray-50 text-xs text-gray-400 text-right">
            Generated by EPMS —PayRoll, Rubavu District, Rwanda
          </div>
        </div>
      )}
    </div>
  );
}
