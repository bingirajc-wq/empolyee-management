import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ employees: 0, departments: 0, salaries: 0, totalNet: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/employees'),
      api.get('/departments'),
      api.get('/salaries'),
    ]).then(([emp, dept, sal]) => {
      const totalNet = sal.data.reduce((sum, s) => sum + parseFloat(s.NetSalary || 0), 0);
      setStats({ employees: emp.data.length, departments: dept.data.length, salaries: sal.data.length, totalNet });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Total Employees', value: stats.employees, color: 'bg-blue-500', icon: '👥' },
    { label: 'Departments', value: stats.departments, color: 'bg-green-500', icon: '🏢' },
    { label: 'Salary Records', value: stats.salaries, color: 'bg-purple-500', icon: '💰' },
    { label: 'Total Net Paid (RWF)', value: stats.totalNet.toLocaleString(), color: 'bg-orange-500', icon: '📊' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome to  Employee Payroll Management System</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse h-32 bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(card => (
            <div key={card.label} className="card flex items-center gap-4">
              <div className={`${card.color} text-white text-2xl w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0`}>
                {card.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                <p className="text-xs text-gray-500">{card.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 card">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Add Employee', href: '/employees', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
            { label: 'Add Department', href: '/departments', color: 'bg-green-50 text-green-700 hover:bg-green-100' },
            { label: 'Add Salary', href: '/salaries', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
            { label: 'View Reports', href: '/reports', color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
          ].map(link => (
            <a key={link.label} href={link.href} className={`${link.color} rounded-xl p-4 text-sm font-semibold text-center transition-colors`}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
