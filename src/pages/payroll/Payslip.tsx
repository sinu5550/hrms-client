import { useParams, Link } from "react-router";
import { Download, ChevronRight, Home, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";

interface CompanySettings {
  companyName: string;
  address: string;
  phone: string;
  email: string;
  logoUrl: string | null;
}

interface SalaryRecord {
  id: string;
  payslipNo: string;
  month: string;
  year: string;
  salaryMonth?: number;
  salaryYear?: number;
  salaryMonthLabel?: string;
  amount: number;
  netSalary: number;
  earnings: Record<string, number>;
  deductions: Record<string, number>;
  user: {
    id: string;
    employeeId: string;
    name: string;
    email: string;
    phone: string;
    joiningDate: string;
    designation?: { name: string };
    department?: { name: string };
  };
}

export default function Payslip() {
  const { id } = useParams();
  const [salary, setSalary] = useState<SalaryRecord | null>(null);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [salaryData, settingsData] = await Promise.all([
          api.get(`/payroll/salaries/${id}`),
          api.get("/settings"),
        ]);
        setSalary(salaryData);
        setSettings(settingsData);
      } catch (err) {
        console.error("Failed to fetch payslip data", err);
        setError("Failed to load payslip information. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a5f3f]" />
      </div>
    );
  }

  if (error || !salary) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-4">{error || "Payslip not found"}</p>
        <Link to="/payroll/salaries" className="text-[#1a5f3f] hover:underline font-medium">
          Back to Salaries
        </Link>
      </div>
    );
  }

  const earningsList = Object.entries(salary.earnings || {}).map(([name, amount]) => ({ name, amount: Number(amount) }));
  const deductionsList = Object.entries(salary.deductions || {}).map(([name, amount]) => ({ name, amount: Number(amount) }));

  const totalEarnings = earningsList.reduce((sum, e) => sum + e.amount, 0);
  const totalDeductions = deductionsList.reduce((sum, d) => sum + d.amount, 0);

  const displayMonth = salary.salaryMonthLabel || `${salary.month} ${salary.year}`;

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
            <Link to="/payroll/salaries" className="hover:text-[#1a5f3f] transition-colors">
              Payroll
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#1a5f3f] font-medium">Payslip</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] text-white rounded-lg hover:bg-black transition-colors font-semibold"
          >
            <Download className="w-4 h-4" /> Download
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12 max-w-5xl mx-auto printable-area">
        {/* Company & Payslip Header */}
        <div className="flex flex-col md:flex-row print:flex-row justify-between gap-8 mb-12">
          <div className="flex items-start gap-4">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="w-16 h-16 object-contain" />
            ) : (
              <div className="w-12 h-12 bg-[#1a5f3f] rounded-lg flex items-center justify-center text-white font-bold text-2xl uppercase">
                {settings?.companyName?.[0] || 'S'}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{settings?.companyName || 'SmartHR'}</h2>
              <p className="text-sm text-gray-500 mt-1 whitespace-pre-line">
                {settings?.address}
              </p>
            </div>
          </div>
          <div className="text-left md:text-right print:text-right">
            <h3 className="text-lg font-bold text-[#1a5f3f]">
              Payslip {salary.payslipNo}
            </h3>
            <p className="text-sm text-gray-500 font-medium">
              Salary Period :{" "}
              <span className="text-gray-900">{displayMonth}</span>
            </p>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-12 mb-12">
          <div>
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
              From
            </h4>
            <p className="font-bold text-lg text-gray-900">
              {settings?.companyName}
            </p>
            <p className="text-gray-500 mt-1">{settings?.address}</p>
            {settings?.email && <p className="text-gray-500">Email : {settings.email}</p>}
            {settings?.phone && <p className="text-gray-500">Phone : {settings.phone}</p>}
          </div>
          <div>
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
              To
            </h4>
            <p className="font-bold text-lg text-gray-900">
              {salary.user.name}
            </p>
            <p className="text-gray-500 mt-1">{salary.user.designation?.name || 'Employee'}</p>
            <p className="text-gray-500">Employee ID: {salary.user.employeeId}</p>
            <p className="text-gray-500">Joining Date: {salary.user.joiningDate ? new Date(salary.user.joiningDate).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="font-bold text-gray-900 text-lg border-b-2 border-[#1a5f3f]/20 inline-block pb-1 px-4">
            Payslip for {displayMonth}
          </p>
        </div>

        {/* Earnings & Deductions Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 print:grid-cols-2 gap-8 mb-8">
          {/* Earnings */}
          <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200/50 bg-white">
              <h4 className="font-bold text-gray-800">Earnings</h4>
            </div>
            <div className="p-2">
              <table className="w-full">
                <tbody>
                  {earningsList.map((e, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 text-gray-600 font-medium whitespace-normal">
                        {e.name}
                      </td>
                      <td className="px-4 py-3 text-right  text-gray-900 text-sm font-semibold">
                        <div className="font-black inline">৳</div>{e.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t border-gray-200 bg-white text-[#1a5f3f]">
                    <td className="px-4 py-4 font-bold">Total Earnings</td>
                    <td className="px-4 py-4 text-right font-black">
                      ৳{totalEarnings.toLocaleString()}
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
                  {deductionsList.map((d, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 text-gray-600 font-medium whitespace-normal">
                        {d.name}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-md text-gray-900 shrink-0">
                        <div className="font-black inline">৳</div>{d.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t border-gray-200 bg-white text-red-600">
                    <td className="px-4 py-4 font-bold">Total Deductions</td>
                    <td className="px-4 py-4 text-right font-black">
                      ৳{totalDeductions.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Net Salary Footer */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row print:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-gray-500 font-bold flex flex-wrap items-center gap-2">
                Net Salary :{" "}
                <span className="text-[#1a5f3f] text-2xl font-black">
                  ৳{salary.netSalary.toLocaleString()}
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

      <style>{`
        @media print {
          @page {
            margin: 10mm;
          }
          body * {
            visibility: hidden;
          }
          .printable-area, .printable-area * {
            visibility: visible;
          }
          .printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
}
