import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Play, Download, AlertTriangle, CheckCircle } from 'lucide-react';

interface EmployeePayroll {
  employeeId: string;
  employeeName: string;
  department: string;
  basicSalary: number;
  allowances: number;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  workingDays: number;
  presentDays: number;
  overtime: number;
  status: 'Ready' | 'Issue' | 'Processed';
}

export default function PayrollProcessing() {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState('2026-02');
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  const employees: EmployeePayroll[] = [
    {
      employeeId: 'EMP001',
      employeeName: 'Sarah Johnson',
      department: 'Engineering',
      basicSalary: 5000,
      allowances: 2000,
      grossSalary: 7000,
      deductions: 1400,
      netSalary: 5600,
      workingDays: 20,
      presentDays: 20,
      overtime: 5,
      status: 'Ready'
    },
    {
      employeeId: 'EMP002',
      employeeName: 'Michael Chen',
      department: 'Marketing',
      basicSalary: 4500,
      allowances: 1800,
      grossSalary: 6300,
      deductions: 1260,
      netSalary: 5040,
      workingDays: 20,
      presentDays: 18,
      overtime: 0,
      status: 'Issue'
    },
    {
      employeeId: 'EMP003',
      employeeName: 'Emma Wilson',
      department: 'HR',
      basicSalary: 4800,
      allowances: 1920,
      grossSalary: 6720,
      deductions: 1344,
      netSalary: 5376,
      workingDays: 20,
      presentDays: 20,
      overtime: 2,
      status: 'Ready'
    },
  ];

  const stats = {
    totalEmployees: employees.length,
    readyToProcess: employees.filter(e => e.status === 'Ready').length,
    issues: employees.filter(e => e.status === 'Issue').length,
    totalPayroll: employees.reduce((sum, e) => sum + e.netSalary, 0),
  };

  const handleProcessPayroll = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setProcessed(true);
    }, 3000);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/payroll"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Payroll
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">Monthly Payroll Processing</h1>
            <p className="text-gray-600 mt-1">Review and process employee salaries for the month</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
              <Download className="w-5 h-5" />
              Export Report
            </button>
            <button
              onClick={handleProcessPayroll}
              disabled={processing || processed}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                processed
                  ? 'bg-green-600 text-white cursor-not-allowed'
                  : processing
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-[#1a5f3f] hover:bg-[#155233] text-white'
              }`}
            >
              {processing ? (
                <>Processing...</>
              ) : processed ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Processed
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Process Payroll
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Month Selector & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f]"
          >
            <option value="2026-02">February 2026</option>
            <option value="2026-01">January 2026</option>
            <option value="2025-12">December 2025</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-gray-600 text-sm">Total Employees</p>
          <p className="text-2xl font-semibold text-gray-800 mt-1">{stats.totalEmployees}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-gray-600 text-sm">Ready to Process</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">{stats.readyToProcess}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-gray-600 text-sm">Issues Found</p>
          <p className="text-2xl font-semibold text-red-600 mt-1">{stats.issues}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-gray-600 text-sm">Total Payroll</p>
          <p className="text-2xl font-semibold text-[#1a5f3f] mt-1">${stats.totalPayroll.toFixed(2)}</p>
        </div>
      </div>

      {/* Issues Alert */}
      {stats.issues > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">Action Required</p>
            <p className="text-sm text-red-600 mt-1">
              {stats.issues} employee(s) have attendance or calculation issues that need to be resolved before processing payroll.
            </p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {processed && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-medium text-green-800">Payroll Processed Successfully</p>
            <p className="text-sm text-green-600 mt-1">
              Payroll for {employees.length} employees has been processed. Payslips have been generated and are ready for distribution.
            </p>
          </div>
        </div>
      )}

      {/* Payroll Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Employee Payroll Details</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Employee</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Attendance</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Basic</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Allowances</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Gross</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Deductions</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Net Salary</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.employeeId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800">{employee.employeeName}</p>
                      <p className="text-sm text-gray-500">{employee.employeeId}</p>
                      <p className="text-sm text-gray-500">{employee.department}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-700">{employee.presentDays}/{employee.workingDays} days</p>
                    {employee.overtime > 0 && (
                      <p className="text-sm text-blue-600">+{employee.overtime}h OT</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-700">${employee.basicSalary}</td>
                  <td className="px-6 py-4 text-gray-700">${employee.allowances}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">${employee.grossSalary}</td>
                  <td className="px-6 py-4 text-red-600">${employee.deductions}</td>
                  <td className="px-6 py-4 font-semibold text-[#1a5f3f]">${employee.netSalary}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      employee.status === 'Ready' ? 'bg-green-100 text-green-700' :
                      employee.status === 'Issue' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/payroll/payslip/${employee.employeeId}`)}
                      className="text-[#1a5f3f] hover:text-[#155233] text-sm font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2 border-gray-300">
              <tr className="font-semibold">
                <td className="px-6 py-4 text-gray-800" colSpan={4}>TOTAL</td>
                <td className="px-6 py-4 text-gray-800">
                  ${employees.reduce((sum, e) => sum + e.grossSalary, 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-red-600">
                  ${employees.reduce((sum, e) => sum + e.deductions, 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-[#1a5f3f]">
                  ${stats.totalPayroll.toFixed(2)}
                </td>
                <td className="px-6 py-4" colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
