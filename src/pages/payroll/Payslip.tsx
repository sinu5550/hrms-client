import { useParams, Link } from "react-router";
import { ArrowLeft, Download, Building, DollarSign } from "lucide-react";

export default function Payslip() {
  // id is available for data fetching if needed
  useParams();

  const payslip = {
    employeeId: "EMP001",
    employeeName: "Sarah Johnson",
    designation: "Senior Software Engineer",
    department: "Engineering",
    joiningDate: "2022-03-15",
    bankAccount: "**** **** **** 4523",
    month: "February 2026",
    paymentDate: "2026-03-01",
    workingDays: 20,
    presentDays: 20,
    leaveDays: 0,
    weekends: 8,
    holidays: 2,
    overtimeHours: 5,

    earnings: [
      { name: "Basic Salary", amount: 5000, taxable: true },
      { name: "House Rent Allowance", amount: 2000, taxable: true },
      { name: "Transport Allowance", amount: 500, taxable: false },
      { name: "Medical Allowance", amount: 300, taxable: false },
      { name: "Special Allowance", amount: 1000, taxable: true },
      { name: "Overtime Pay", amount: 187.5, taxable: true },
    ],

    deductions: [
      { name: "Provident Fund", amount: 840 },
      { name: "Income Tax", amount: 1050 },
      { name: "Professional Tax", amount: 200 },
      { name: "Meal Deduction", amount: 225 },
    ],
  };

  const totalEarnings = payslip.earnings.reduce((sum, e) => sum + e.amount, 0);
  const totalDeductions = payslip.deductions.reduce(
    (sum, d) => sum + d.amount,
    0,
  );
  const netSalary = totalEarnings - totalDeductions;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/payroll/processing"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Payroll Processing
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">Payslip</h1>
            <p className="text-gray-600 mt-1">
              Salary statement for {payslip.month}
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a5f3f] hover:bg-[#155233] text-white rounded-lg transition-colors">
            <Download className="w-5 h-5" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Payslip */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#1a5f3f] to-[#2d8f5f] p-8 text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Building className="w-8 h-8" />
                <h2 className="text-2xl font-bold">HRMS Portal</h2>
              </div>
              <p className="text-white/80">
                123 Business Street, San Francisco, CA 94105
              </p>
              <p className="text-white/80">contact@hrmsportal.com</p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-semibold mb-1">PAYSLIP</h3>
              <p className="text-white/80">{payslip.month}</p>
            </div>
          </div>
        </div>

        {/* Employee Information */}
        <div className="p-8 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Employee Name</p>
                <p className="font-semibold text-gray-800">
                  {payslip.employeeName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Employee ID</p>
                <p className="font-semibold text-gray-800">
                  {payslip.employeeId}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Designation</p>
                <p className="font-semibold text-gray-800">
                  {payslip.designation}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-semibold text-gray-800">
                  {payslip.department}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Joining Date</p>
                <p className="font-semibold text-gray-800">
                  {payslip.joiningDate}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bank Account</p>
                <p className="font-semibold text-gray-800">
                  {payslip.bankAccount}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Date</p>
                <p className="font-semibold text-gray-800">
                  {payslip.paymentDate}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="p-8 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-4">
            Attendance Summary
          </h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500">Working Days</p>
              <p className="text-xl font-semibold text-gray-800">
                {payslip.workingDays}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500">Present Days</p>
              <p className="text-xl font-semibold text-green-600">
                {payslip.presentDays}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500">Leave Days</p>
              <p className="text-xl font-semibold text-orange-600">
                {payslip.leaveDays}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500">Overtime Hours</p>
              <p className="text-xl font-semibold text-blue-600">
                {payslip.overtimeHours}
              </p>
            </div>
          </div>
        </div>

        {/* Earnings and Deductions */}
        <div className="p-8">
          <div className="grid grid-cols-2 gap-8">
            {/* Earnings */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Earnings
              </h3>
              <div className="space-y-3">
                {payslip.earnings.map((earning, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <div>
                      <p className="text-gray-700">{earning.name}</p>
                      {earning.taxable && (
                        <p className="text-xs text-gray-500">Taxable</p>
                      )}
                    </div>
                    <p className="font-medium text-gray-800">
                      ${earning.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between items-center py-3 border-t-2 border-gray-300 font-semibold">
                  <p className="text-gray-800">Total Earnings</p>
                  <p className="text-green-600">${totalEarnings.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-red-600" />
                Deductions
              </h3>
              <div className="space-y-3">
                {payslip.deductions.map((deduction, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <p className="text-gray-700">{deduction.name}</p>
                    <p className="font-medium text-gray-800">
                      ${deduction.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between items-center py-3 border-t-2 border-gray-300 font-semibold">
                  <p className="text-gray-800">Total Deductions</p>
                  <p className="text-red-600">${totalDeductions.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Net Salary */}
        <div className="bg-gradient-to-r from-[#1a5f3f] to-[#2d8f5f] p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white/80 mb-1">Net Salary</p>
              <p className="text-4xl font-bold">${netSalary.toFixed(2)}</p>
              <p className="text-white/80 mt-2 text-sm">
                (In words:{" "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(netSalary)}
                )
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">
                This is a computer-generated payslip
              </p>
              <p className="text-white/80 text-sm">
                and does not require a signature
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-6 bg-gray-50 text-center text-sm text-gray-600">
          <p>
            For any queries regarding this payslip, please contact HR at
            hr@hrmsportal.com
          </p>
        </div>
      </div>
    </div>
  );
}
