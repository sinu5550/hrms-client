import { useParams, Link } from "react-router";
import { Download, ChevronRight, Home } from "lucide-react";

export default function Payslip() {
  useParams();

  const payslip = {
    payslipNo: "#PS4283",
    salaryMonth: "October 2024",
    employeeId: "EMP-001",
    employeeName: "Anthony Lewis",
    designation: "Web Designer",
    department: "Engineering",
    joiningDate: "2024-09-12",
    companyName: "XYZ Technologies",
    companyAddress: "2077 Chicago Avenue Orosi, CA 93647",
    companyEmail: "xyztech@example.com",
    companyPhone: "+1 987 654 3210",

    earnings: [
      { name: "Basic Salary", amount: 3000 },
      { name: "House Rent Allowance (H.R.A.)", amount: 1000 },
      { name: "Conveyance", amount: 200 },
      { name: "Other Allowance", amount: 100 },
    ],

    deductions: [
      { name: "Tax Deducted at Source (T.D.S.)", amount: 200 },
      { name: "Provident Fund", amount: 300 },
      { name: "ESI", amount: 150 },
      { name: "Loan", amount: 50 },
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Payslip</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
            <Link to="/" className="hover:text-[#1a5f3f] transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>Payroll</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#1a5f3f] font-medium">Payslip</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] text-white rounded-lg hover:bg-black transition-colors font-semibold">
            <Download className="w-4 h-4" /> Download
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12 max-w-5xl mx-auto">
        {/* Company & Payslip Header */}
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#1a5f3f] rounded-full flex items-center justify-center text-white font-bold text-2xl">
              S
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">SmartHR</h2>
              <p className="text-sm text-gray-400 mt-1">
                3099 Kennedy Court Framingham, MA 01702
              </p>
            </div>
          </div>
          <div className="text-left md:text-right">
            <h3 className="text-lg font-bold text-[#1a5f3f]">
              Payslip No {payslip.payslipNo}
            </h3>
            <p className="text-sm text-gray-500 font-medium">
              Salary Month :{" "}
              <span className="text-gray-900">{payslip.salaryMonth}</span>
            </p>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
              From
            </h4>
            <p className="font-bold text-lg text-gray-900">
              {payslip.companyName}
            </p>
            <p className="text-gray-500 mt-1">{payslip.companyAddress}</p>
            <p className="text-gray-500">Email : {payslip.companyEmail}</p>
            <p className="text-gray-500">Phone : {payslip.companyPhone}</p>
          </div>
          <div>
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
              To
            </h4>
            <p className="font-bold text-lg text-gray-900">
              {payslip.employeeName}
            </p>
            <p className="text-gray-500 mt-1">{payslip.designation}</p>
            <p className="text-gray-500">Email : anthony@example.com</p>
            <p className="text-gray-500">Phone : +1 458 268 4739</p>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="font-bold text-gray-900 text-lg border-b-2 border-[#1a5f3f]/20 inline-block pb-1 px-4">
            Payslip for the month of {payslip.salaryMonth}
          </p>
        </div>

        {/* Earnings & Deductions Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Earnings */}
          <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200/50 bg-white">
              <h4 className="font-bold text-gray-800">Earnings</h4>
            </div>
            <div className="p-2">
              <table className="w-full">
                <tbody>
                  {payslip.earnings.map((e, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 text-gray-600 font-medium">
                        {e.name}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">
                        ${e.amount}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t border-gray-200 bg-white text-[#1a5f3f]">
                    <td className="px-4 py-4 font-bold">Total Earnings</td>
                    <td className="px-4 py-4 text-right font-black">
                      ${totalEarnings}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Deductions */}
          <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200/50 bg-white">
              <h4 className="font-bold text-gray-800">Deductions</h4>
            </div>
            <div className="p-2">
              <table className="w-full">
                <tbody>
                  {payslip.deductions.map((d, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 text-gray-600 font-medium">
                        {d.name}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">
                        ${d.amount}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t border-gray-200 bg-white text-red-600">
                    <td className="px-4 py-4 font-bold">Total Deductions</td>
                    <td className="px-4 py-4 text-right font-black">
                      ${totalDeductions}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Net Salary Footer */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-gray-500 font-bold flex items-center gap-2">
                Net Salary :{" "}
                <span className="text-[#1a5f3f] text-2xl font-black">
                  ${netSalary}
                </span>
                <span className="text-sm font-medium text-gray-400 ml-2">
                  (Three thousand six hundred only)
                </span>
              </p>
            </div>
            <div className="text-gray-400 text-xs text-center md:text-right font-medium">
              <p>This is a computer generated payslip</p>
              <p>and does not require a signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
