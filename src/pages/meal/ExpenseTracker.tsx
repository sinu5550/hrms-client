import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Download, TrendingUp, Calendar } from 'lucide-react';

interface EmployeeExpense {
  employeeId: string;
  employeeName: string;
  totalMeals: number;
  guestMeals: number;
  totalExpense: number;
  employeeShare: number;
  companyShare: number;
  paid: number;
  balance: number;
}

export default function ExpenseTracker() {
  const [selectedMonth, setSelectedMonth] = useState('2026-02');

  const expenses: EmployeeExpense[] = [
    {
      employeeId: 'EMP001',
      employeeName: 'Sarah Johnson',
      totalMeals: 18,
      guestMeals: 3,
      totalExpense: 2700,
      employeeShare: 1125,
      companyShare: 1575,
      paid: 500,
      balance: 625
    },
    {
      employeeId: 'EMP002',
      employeeName: 'Michael Chen',
      totalMeals: 20,
      guestMeals: 2,
      totalExpense: 2850,
      employeeShare: 1275,
      companyShare: 1575,
      paid: 1275,
      balance: 0
    },
    {
      employeeId: 'EMP003',
      employeeName: 'Emma Wilson',
      totalMeals: 15,
      guestMeals: 1,
      totalExpense: 2100,
      employeeShare: 975,
      companyShare: 1125,
      paid: 300,
      balance: 675
    },
    {
      employeeId: 'EMP004',
      employeeName: 'James Brown',
      totalMeals: 22,
      guestMeals: 0,
      totalExpense: 3300,
      employeeShare: 1650,
      companyShare: 1650,
      paid: 1000,
      balance: 650
    },
  ];

  const totals = {
    totalExpense: expenses.reduce((sum, e) => sum + e.totalExpense, 0),
    totalEmployeeShare: expenses.reduce((sum, e) => sum + e.employeeShare, 0),
    totalCompanyShare: expenses.reduce((sum, e) => sum + e.companyShare, 0),
    totalPaid: expenses.reduce((sum, e) => sum + e.paid, 0),
    totalBalance: expenses.reduce((sum, e) => sum + e.balance, 0),
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/meal-expense"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Meal & Expense
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">Expense Tracker & Balance Sheet</h1>
            <p className="text-gray-600 mt-1">Track employee expenses and payment status</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a5f3f] hover:bg-[#155233] text-white rounded-lg transition-colors">
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-gray-600 text-sm">Total Expense</p>
          <p className="text-2xl font-semibold text-gray-800 mt-1">${totals.totalExpense}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-gray-600 text-sm">Employee Share</p>
          <p className="text-2xl font-semibold text-orange-600 mt-1">${totals.totalEmployeeShare}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-gray-600 text-sm">Company Share</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">${totals.totalCompanyShare}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-gray-600 text-sm">Total Paid</p>
          <p className="text-2xl font-semibold text-blue-600 mt-1">${totals.totalPaid}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-gray-600 text-sm">Outstanding</p>
          <p className="text-2xl font-semibold text-red-600 mt-1">${totals.totalBalance}</p>
        </div>
      </div>

      {/* AI Cost Analysis */}
      <div className="bg-gradient-to-r from-[#1a5f3f] to-[#2d8f5f] rounded-lg shadow-sm p-6 mb-6 text-white">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">AI Cost Anomaly Detection</h3>
            <p className="text-white/90 mb-3">
              Detected 2 unusual expense patterns: James Brown has 30% higher meal costs than average. 
              Recommend reviewing meal vendors or adjusting cost-splitting policies.
            </p>
            <div className="flex gap-6 text-sm">
              <div>
                <p className="text-white/70">Anomaly Score</p>
                <p className="font-medium">Medium Risk</p>
              </div>
              <div>
                <p className="text-white/70">Forecasted Next Month</p>
                <p className="font-medium">$11,200</p>
              </div>
              <div>
                <p className="text-white/70">Optimization Potential</p>
                <p className="font-medium">12% savings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Month Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-gray-400" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:border-transparent"
          >
            <option value="2026-02">February 2026</option>
            <option value="2026-01">January 2026</option>
            <option value="2025-12">December 2025</option>
          </select>
        </div>
      </div>

      {/* Expense Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Employee Expense Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Employee</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total Meals</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Guest Meals</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total Expense</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Employee Share</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Company Share</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Paid</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Balance</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {expenses.map((expense) => (
                <tr key={expense.employeeId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800">{expense.employeeName}</p>
                      <p className="text-sm text-gray-500">{expense.employeeId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{expense.totalMeals}</td>
                  <td className="px-6 py-4 text-gray-700">{expense.guestMeals}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">${expense.totalExpense}</td>
                  <td className="px-6 py-4 font-medium text-orange-600">${expense.employeeShare}</td>
                  <td className="px-6 py-4 font-medium text-green-600">${expense.companyShare}</td>
                  <td className="px-6 py-4 font-medium text-blue-600">${expense.paid}</td>
                  <td className="px-6 py-4">
                    {expense.balance > 0 ? (
                      <span className="font-medium text-red-600">${expense.balance}</span>
                    ) : (
                      <span className="text-green-600 flex items-center gap-1">
                        <span>✓</span> Paid
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {expense.balance > 0 && (
                      <button className="px-3 py-1 bg-[#1a5f3f] hover:bg-[#155233] text-white rounded text-sm transition-colors">
                        Record Payment
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2 border-gray-300">
              <tr className="font-semibold">
                <td className="px-6 py-4 text-gray-800">TOTAL</td>
                <td className="px-6 py-4 text-gray-800">
                  {expenses.reduce((sum, e) => sum + e.totalMeals, 0)}
                </td>
                <td className="px-6 py-4 text-gray-800">
                  {expenses.reduce((sum, e) => sum + e.guestMeals, 0)}
                </td>
                <td className="px-6 py-4 text-gray-800">${totals.totalExpense}</td>
                <td className="px-6 py-4 text-orange-600">${totals.totalEmployeeShare}</td>
                <td className="px-6 py-4 text-green-600">${totals.totalCompanyShare}</td>
                <td className="px-6 py-4 text-blue-600">${totals.totalPaid}</td>
                <td className="px-6 py-4 text-red-600">${totals.totalBalance}</td>
                <td className="px-6 py-4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
