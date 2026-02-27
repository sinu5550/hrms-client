import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import {
  Search,
  Download,
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  Home,
  ChevronLeft,
  X,
} from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";

export default function EmployeeSalary() {
  const { employees: allEmployees, isLoading, refreshData } = useData();
  const [employees, setEmployees] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");

  useEffect(() => {
    setEmployees(allEmployees.filter((u: any) => u.role === "EMPLOYEE"));
  }, [allEmployees]);

  const [earnings, setEarnings] = useState({
    basic: 0,
    da: 0,
    hra: 0,
    conveyance: 0,
    allowance: 0,
    medical: 0,
    others: 0,
  });

  const [deductions, setDeductions] = useState({
    tds: 0,
    esi: 0,
    pf: 0,
    leave: 0,
    profTax: 0,
    labourWelfare: 0,
    others: 0,
  });

  const totalEarnings = useMemo(() => {
    return Object.values(earnings).reduce((acc, curr) => acc + Number(curr), 0);
  }, [earnings]);

  const totalDeductions = useMemo(() => {
    return Object.values(deductions).reduce(
      (acc, curr) => acc + Number(curr),
      0,
    );
  }, [deductions]);

  const netSalary = totalEarnings - totalDeductions;

  const handleAddSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return toast.error("Please select an employee");

    try {
      await api.post("/payroll/salaries", {
        userId: selectedUser,
        amount: totalEarnings,
        month: new Date().toLocaleString("default", { month: "long" }),
        year: new Date().getFullYear().toString(),
        earnings,
        deductions,
        netSalary,
      });
      toast.success("Salary added successfully");
      setIsModalOpen(false);
      resetForm();
      refreshData();
    } catch (error) {
      toast.error("Failed to add salary");
    }
  };

  const handleUserChange = (userId: string) => {
    setSelectedUser(userId);
    if (!userId) {
      resetForm();
      return;
    }

    const emp = employees.find((e) => e.id === userId);
    const latestSalary = emp?.salaries?.[0];

    if (latestSalary) {
      setEarnings(latestSalary.earnings || earnings);
      setDeductions(latestSalary.deductions || deductions);
    } else {
      resetForm();
      // Keep the selected user after reset
      setSelectedUser(userId);
    }
  };

  const handleEdit = (emp: any) => {
    setSelectedUser(emp.id);
    const latestSalary = emp.salaries?.[0];
    if (latestSalary) {
      setEarnings(latestSalary.earnings || earnings);
      setDeductions(latestSalary.deductions || deductions);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEarnings({
      basic: 0,
      da: 0,
      hra: 0,
      conveyance: 0,
      allowance: 0,
      medical: 0,
      others: 0,
    });
    setDeductions({
      tds: 0,
      esi: 0,
      pf: 0,
      leave: 0,
      profTax: 0,
      labourWelfare: 0,
      others: 0,
    });
    setSelectedUser("");
  };

  const filteredEmployees = employees.filter((emp) => {
    const nameStr = emp.name || "";
    const idStr = emp.employeeId || "";
    const matchesSearch =
      nameStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idStr.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Employee Salary
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
            <Link to="/" className="hover:text-[#1a5f3f] transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>Payroll</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#1a5f3f] font-medium">Employee Salary</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors bg-white font-semibold shadow-sm">
            <Download className="w-4 h-4" /> Export
          </button>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a5f3f] text-white rounded-lg hover:bg-[#155233] transition-colors shadow-sm font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Salary
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-gray-800">
            Employee Salary List
          </h2>
        </div>

        {/* Filters and Search */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white text-sm">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Row Per Page</span>
              <select className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] bg-white font-medium">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span className="text-gray-600">Entries</span>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] bg-white min-w-[120px] font-medium"
            >
              <option value="all">Status (All)</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <div className="relative w-full sm:w-64">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f]"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 text-left">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                  Emp ID
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                  Employee Name
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                  Designation
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                  Salary
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-center">
                  Payslip
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading employees...
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No employees found.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => {
                  const latestSalary = emp.salaries?.[0];
                  return (
                    <tr
                      key={emp.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-[#1a5f3f] font-bold">
                        {emp.employeeId}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#1a5f3f] flex items-center justify-center text-white font-bold text-xs shadow-sm overflow-hidden">
                            {emp.profilePhotoUrl ? (
                              <img
                                src={emp.profilePhotoUrl}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              emp.name
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("") || "?"
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {emp.name}
                            </p>
                            <p className="text-xs text-gray-500">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {emp.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                        {emp.designation?.name || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-bold">
                        {latestSalary
                          ? `$${latestSalary.netSalary.toLocaleString()}`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          to={`/payroll/payslip/${emp.id}`}
                          className="px-4 py-1.5 bg-[#2a2a2a] text-white rounded-lg text-xs font-bold hover:bg-black transition-all inline-block"
                        >
                          Generate Slip
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleEdit(emp)}
                            className="p-1.5 text-gray-400 hover:text-[#1a5f3f] hover:bg-green-50 rounded-lg transition-all"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white">
          <p className="text-sm text-gray-600 font-medium">
            Showing 1 - {filteredEmployees.length} of {employees.length} entries
          </p>
          <div className="flex gap-2">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-4 py-2 bg-[#1a5f3f] text-white rounded-lg hover:bg-[#155233] transition-colors text-sm font-bold">
              1
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Salary Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl animate-in fade-in zoom-in duration-200 mt-20 mb-20">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-xl z-10">
              <h3 className="text-xl font-bold text-gray-800">
                Add Employee Salary
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSalary} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Employee Name
                  </label>
                  <select
                    value={selectedUser}
                    onChange={(e) => handleUserChange(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:bg-white transition-all font-medium text-sm"
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.employeeId})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Net Salary
                  </label>
                  <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg font-bold text-gray-800 text-sm">
                    ${netSalary.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Earnings Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-[#1a5f3f] flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Earnings
                  </h4>
                  <button
                    type="button"
                    className="text-[11px] font-bold text-[#1a5f3f] hover:underline uppercase"
                  >
                    + Add New
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <SalaryInput
                    label="Basic"
                    value={earnings.basic}
                    onChange={(val) => setEarnings({ ...earnings, basic: val })}
                  />
                  <SalaryInput
                    label="DA(40%)"
                    value={earnings.da}
                    onChange={(val) => setEarnings({ ...earnings, da: val })}
                  />
                  <SalaryInput
                    label="HRA(15%)"
                    value={earnings.hra}
                    onChange={(val) => setEarnings({ ...earnings, hra: val })}
                  />
                  <SalaryInput
                    label="Conveyance"
                    value={earnings.conveyance}
                    onChange={(val) =>
                      setEarnings({ ...earnings, conveyance: val })
                    }
                  />
                  <SalaryInput
                    label="Allowance"
                    value={earnings.allowance}
                    onChange={(val) =>
                      setEarnings({ ...earnings, allowance: val })
                    }
                  />
                  <SalaryInput
                    label="Medical Allowance"
                    value={earnings.medical}
                    onChange={(val) =>
                      setEarnings({ ...earnings, medical: val })
                    }
                  />
                  <SalaryInput
                    label="Others"
                    value={earnings.others}
                    onChange={(val) =>
                      setEarnings({ ...earnings, others: val })
                    }
                  />
                </div>
              </div>

              {/* Deductions Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-red-600 flex items-center gap-2">
                    <X className="w-4 h-4" /> Deductions
                  </h4>
                  <button
                    type="button"
                    className="text-[11px] font-bold text-red-600 hover:underline uppercase"
                  >
                    + Add New
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <SalaryInput
                    label="TDS"
                    value={deductions.tds}
                    onChange={(val) =>
                      setDeductions({ ...deductions, tds: val })
                    }
                  />
                  <SalaryInput
                    label="ESI"
                    value={deductions.esi}
                    onChange={(val) =>
                      setDeductions({ ...deductions, esi: val })
                    }
                  />
                  <SalaryInput
                    label="PF"
                    value={deductions.pf}
                    onChange={(val) =>
                      setDeductions({ ...deductions, pf: val })
                    }
                  />
                  <SalaryInput
                    label="Leave"
                    value={deductions.leave}
                    onChange={(val) =>
                      setDeductions({ ...deductions, leave: val })
                    }
                  />
                  <SalaryInput
                    label="Prof.Tax"
                    value={deductions.profTax}
                    onChange={(val) =>
                      setDeductions({ ...deductions, profTax: val })
                    }
                  />
                  <SalaryInput
                    label="Labour Welfare"
                    value={deductions.labourWelfare}
                    onChange={(val) =>
                      setDeductions({ ...deductions, labourWelfare: val })
                    }
                  />
                  <SalaryInput
                    label="Others"
                    value={deductions.others}
                    onChange={(val) =>
                      setDeductions({ ...deductions, others: val })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-[#1a5f3f] text-white rounded-lg hover:bg-[#155233] transition-colors font-bold text-sm shadow-lg shadow-green-900/10"
                >
                  Add Employee Salary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SalaryInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">
        {label}
      </label>
      <input
        type="number"
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:bg-white transition-all text-sm font-semibold"
        placeholder="0.00"
      />
    </div>
  );
}
