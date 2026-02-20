import { useState } from 'react';
import { Link } from 'react-router';
import { Plus, Calendar, DollarSign, Users, AlertTriangle, TrendingDown, Download } from 'lucide-react';

interface MealEntry {
  id: string;
  date: string;
  employeeName: string;
  employeeId: string;
  mealCount: number;
  guestCount: number;
  costSplit: '50/50' | '100%';
  totalCost: number;
  employeeCost: number;
  status: 'Paid' | 'Pending';
}

export default function MealExpense() {
  const [selectedMonth, setSelectedMonth] = useState('2026-02');

  const mealEntries: MealEntry[] = [
    {
      id: '1',
      date: '2026-02-07',
      employeeName: 'Sarah Johnson',
      employeeId: 'EMP001',
      mealCount: 2,
      guestCount: 1,
      costSplit: '50/50',
      totalCost: 450,
      employeeCost: 225,
      status: 'Pending'
    },
    {
      id: '2',
      date: '2026-02-07',
      employeeName: 'Michael Chen',
      employeeId: 'EMP002',
      mealCount: 3,
      guestCount: 0,
      costSplit: '50/50',
      totalCost: 450,
      employeeCost: 225,
      status: 'Pending'
    },
    {
      id: '3',
      date: '2026-02-06',
      employeeName: 'Emma Wilson',
      employeeId: 'EMP003',
      mealCount: 2,
      guestCount: 0,
      costSplit: '50/50',
      totalCost: 300,
      employeeCost: 150,
      status: 'Paid'
    },
  ];

  const stats = {
    totalMealsThisMonth: 45,
    totalGuestsThisMonth: 8,
    totalExpense: 6750,
    averageCostPerMeal: 150,
    pendingPayments: 2250,
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Meal & Expense Management</h1>
          <p className="text-gray-600 mt-1">Track daily meals, guest entries, and manage expenses</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/meal-expense/tracker"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <DollarSign className="w-5 h-5" />
            Expense Tracker
          </Link>
          <Link
            to="/meal-expense/entry"
            className="flex items-center gap-2 px-4 py-2 bg-[#1a5f3f] hover:bg-[#155233] text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Meal Entry
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Meals</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">{stats.totalMealsThisMonth}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Guest Meals</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">{stats.totalGuestsThisMonth}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Expense</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">${stats.totalExpense}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avg Cost/Meal</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">${stats.averageCostPerMeal}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingDown className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Payments</p>
              <p className="text-2xl font-semibold text-red-600 mt-1">${stats.pendingPayments}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-[#1a5f3f] to-[#2d8f5f] rounded-lg shadow-sm p-6 mb-6 text-white">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">AI Expense Optimization</h3>
            <p className="text-white/90 mb-3">
              Your meal expenses are 15% higher than average this month. Consider optimizing guest meals 
              or adjusting cost-splitting ratios. Detected anomaly: 3 unusual high-cost entries.
            </p>
            <div className="flex gap-6 text-sm">
              <div>
                <p className="text-white/70">Budget Forecast (Next Month)</p>
                <p className="font-medium">$7,200 - $7,500</p>
              </div>
              <div>
                <p className="text-white/70">Recommended Budget</p>
                <p className="font-medium">$6,500</p>
              </div>
              <div>
                <p className="text-white/70">Potential Savings</p>
                <p className="font-medium">$1,000/month</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Month Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
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
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-[#1a5f3f] transition-colors">
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Meal Entries Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Meal Entries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Employee</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Meals</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Guests</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cost Split</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total Cost</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Employee Cost</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mealEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800">{entry.employeeName}</p>
                      <p className="text-sm text-gray-500">{entry.employeeId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{entry.mealCount}</td>
                  <td className="px-6 py-4 text-gray-700">{entry.guestCount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      entry.costSplit === '50/50' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {entry.costSplit}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium">${entry.totalCost}</td>
                  <td className="px-6 py-4 text-gray-700 font-medium">${entry.employeeCost}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      entry.status === 'Paid' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Cost Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">50/50 Split Meals</span>
              <span className="font-semibold text-gray-800">$4,500</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '67%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">100% Company Paid</span>
              <span className="font-semibold text-gray-800">$2,250</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '33%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Balance Sheet</h3>
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-600">Total Revenue (Employee Share)</span>
              <span className="font-semibold text-gray-800">$3,375</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-600">Total Paid</span>
              <span className="font-semibold text-green-600">$1,125</span>
            </div>
            <div className="flex justify-between p-3 bg-orange-50 rounded border border-orange-200">
              <span className="text-gray-600 font-medium">Outstanding Balance</span>
              <span className="font-semibold text-orange-600">$2,250</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
