import { Link } from 'react-router';
import { Users, DollarSign, TrendingUp, AlertTriangle, FileText, Play, Settings } from 'lucide-react';

export default function Payroll() {
  const stats = {
    totalEmployees: 248,
    totalPayroll: 2450000,
    processed: 240,
    pending: 8,
    averageSalary: 9879,
  };

  const recentPayrolls = [
    { month: 'January 2026', processed: 248, amount: 2450000, status: 'Completed', date: '2026-02-01' },
    { month: 'December 2025', processed: 245, amount: 2425000, status: 'Completed', date: '2026-01-01' },
    { month: 'November 2025', processed: 242, amount: 2398000, status: 'Completed', date: '2025-12-01' },
  ];

  const upcomingTasks = [
    { task: 'Process February Payroll', dueDate: '2026-03-01', priority: 'High' },
    { task: 'Review Overtime Claims', dueDate: '2026-02-25', priority: 'Medium' },
    { task: 'Update Salary Structures', dueDate: '2026-02-28', priority: 'Low' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Payroll Management</h1>
          <p className="text-gray-600 mt-1">Manage salary structures, process payroll, and generate payslips</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/payroll/structure"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
            Salary Structure
          </Link>
          <Link
            to="/payroll/processing"
            className="flex items-center gap-2 px-4 py-2 bg-[#1a5f3f] hover:bg-[#155233] text-white rounded-lg transition-colors"
          >
            <Play className="w-5 h-5" />
            Process Payroll
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Employees</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">{stats.totalEmployees}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Payroll</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">${stats.totalPayroll.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Processed</p>
              <p className="text-2xl font-semibold text-green-600 mt-1">{stats.processed}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-2xl font-semibold text-orange-600 mt-1">{stats.pending}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avg Salary</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">${stats.averageSalary}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-[#1a5f3f] to-[#2d8f5f] rounded-lg shadow-sm p-6 mb-6 text-white">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">AI Payroll Insights</h3>
            <p className="text-white/90 mb-3">
              Detected 2 potential salary anomalies requiring review. Overtime costs are 18% higher than last month. 
              Predicted payroll for next month: $2,520,000 (2.9% increase).
            </p>
            <div className="flex gap-6 text-sm">
              <div>
                <p className="text-white/70">Anomaly Detection</p>
                <p className="font-medium">2 flagged entries</p>
              </div>
              <div>
                <p className="text-white/70">Error Prediction</p>
                <p className="font-medium">Low risk (5%)</p>
              </div>
              <div>
                <p className="text-white/70">Cost Forecast</p>
                <p className="font-medium">+2.9% next month</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Payroll Processing */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Recent Payroll Processing</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentPayrolls.map((payroll, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{payroll.month}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>{payroll.processed} employees processed</span>
                      <span>•</span>
                      <span className="font-medium">${payroll.amount.toLocaleString()}</span>
                      <span>•</span>
                      <span>Processed on {new Date(payroll.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {payroll.status}
                    </span>
                    <button className="text-[#1a5f3f] hover:text-[#155233] text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Upcoming Tasks</h2>
          </div>
          <div className="p-6 space-y-4">
            {upcomingTasks.map((task, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-800">{task.task}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    task.priority === 'High' ? 'bg-red-100 text-red-700' :
                    task.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/payroll/processing"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#1a5f3f] hover:bg-[#1a5f3f]/5 transition-all text-center"
          >
            <Play className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="font-medium text-gray-800">Process Payroll</p>
            <p className="text-sm text-gray-500 mt-1">Run monthly payroll</p>
          </Link>
          <Link
            to="/payroll/structure"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#1a5f3f] hover:bg-[#1a5f3f]/5 transition-all text-center"
          >
            <Settings className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="font-medium text-gray-800">Salary Structure</p>
            <p className="text-sm text-gray-500 mt-1">Manage salary components</p>
          </Link>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#1a5f3f] hover:bg-[#1a5f3f]/5 transition-all text-center">
            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="font-medium text-gray-800">View Payslips</p>
            <p className="text-sm text-gray-500 mt-1">Access all payslips</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#1a5f3f] hover:bg-[#1a5f3f]/5 transition-all text-center">
            <DollarSign className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="font-medium text-gray-800">Loan Management</p>
            <p className="text-sm text-gray-500 mt-1">Track loans & advances</p>
          </button>
        </div>
      </div>
    </div>
  );
}
