import { useEffect, useMemo, useState } from "react";
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
  SlidersHorizontal,
} from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";

type SalaryValue = number | "";
type SalaryMap = Record<string, SalaryValue>;

interface PayrollItem {
  id: string;
  name: string;
  category: string;
}

interface SalaryRecord {
  id: string;
  userId: string;
  amount: number;
  netSalary: number;
  salaryMonth: number;
  salaryYear: number;
  salaryMonthLabel?: string;
  month?: string;
  year?: string;
  earnings?: Record<string, number>;
  deductions?: Record<string, number>;
  user: {
    id: string;
    name: string;
    email: string;
    employeeId: string;
    profilePhotoUrl?: string;
    designation?: { name: string };
  };
}

interface Employee {
  id: string;
  name: string;
  email: string;
  employeeId: string;
}

const BASIC_FIELD = "Basic";
const DEFAULT_YEAR = new Date().getFullYear();
const DEFAULT_MONTH = new Date().getMonth() + 1;
const MONTH_OPTIONS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const isDeductionItem = (category: string) => {
  const c = category.toLowerCase();
  return c.includes("deduction") || c.includes("statutory");
};

const toLegacyFieldKey = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+?$/g, "");

const readSavedValue = (
  saved: Record<string, number> | undefined,
  fieldName: string,
) => {
  if (!saved) return undefined;
  if (Object.prototype.hasOwnProperty.call(saved, fieldName)) {
    return Number(saved[fieldName]);
  }
  const legacyKey = toLegacyFieldKey(fieldName);
  if (Object.prototype.hasOwnProperty.call(saved, legacyKey)) {
    return Number(saved[legacyKey]);
  }
  return undefined;
};

const createEmptyMap = (items: PayrollItem[], includeBasic = false) =>
  items.reduce<SalaryMap>(
    (acc, item) => ({ ...acc, [item.name]: "" }),
    includeBasic ? { [BASIC_FIELD]: "" } : {},
  );

const normalizeMap = (values: SalaryMap) =>
  Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, Number(value || 0)]),
  );

const buildValuesFromSalary = (
  items: PayrollItem[],
  saved: Record<string, number> | undefined,
  includeBasic = false,
) =>
  items.reduce<SalaryMap>(
    (acc, item) => ({
      ...acc,
      [item.name]: readSavedValue(saved, item.name) ?? "",
    }),
    includeBasic
      ? { [BASIC_FIELD]: readSavedValue(saved, BASIC_FIELD) ?? "" }
      : {},
  );

const buildMonthLabel = (row: SalaryRecord) => {
  if (row.salaryMonthLabel) return row.salaryMonthLabel;
  if (row.salaryMonth && row.salaryYear) {
    const label =
      MONTH_OPTIONS.find((m) => m.value === row.salaryMonth)?.label || "";
    return label ? `${label}, ${row.salaryYear}` : "-";
  }
  if (row.month && row.year) return `${row.month}, ${row.year}`;
  return "-";
};

const getMonthNumberFromRow = (row: SalaryRecord) => {
  if (row.salaryMonth) return Number(row.salaryMonth);
  if (row.month) {
    const idx = MONTH_OPTIONS.findIndex(
      (m) => m.label.toLowerCase() === String(row.month).toLowerCase(),
    );
    if (idx >= 0) return MONTH_OPTIONS[idx].value;
  }
  return DEFAULT_MONTH;
};

const getYearNumberFromRow = (row: SalaryRecord) => {
  if (row.salaryYear) return Number(row.salaryYear);
  const parsed = Number(row.year);
  if (Number.isInteger(parsed) && parsed > 0) return parsed;
  return DEFAULT_YEAR;
};

export default function EmployeeSalary() {
  const { employees: allEmployees, isLoading, refreshData } = useData();
  const employees = (allEmployees || []) as Employee[];

  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState<SalaryRecord[]>([]);
  const [isRowsLoading, setIsRowsLoading] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [draftFilterMonth, setDraftFilterMonth] = useState("");
  const [draftFilterYear, setDraftFilterYear] = useState("");
  const [draftMinSalary, setDraftMinSalary] = useState("");
  const [draftMaxSalary, setDraftMaxSalary] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedSalaryMonth, setSelectedSalaryMonth] = useState(
    String(DEFAULT_MONTH),
  );
  const [selectedSalaryYear, setSelectedSalaryYear] = useState(
    String(DEFAULT_YEAR),
  );

  const [payrollItems, setPayrollItems] = useState<PayrollItem[]>([]);
  const [isItemsLoading, setIsItemsLoading] = useState(false);
  const [earnings, setEarnings] = useState<SalaryMap>({});
  const [deductions, setDeductions] = useState<SalaryMap>({});

  const additionItems = useMemo(
    () =>
      payrollItems.filter(
        (item) =>
          !isDeductionItem(item.category) &&
          item.name.toLowerCase() !== BASIC_FIELD.toLowerCase(),
      ),
    [payrollItems],
  );

  const deductionItems = useMemo(
    () => payrollItems.filter((item) => isDeductionItem(item.category)),
    [payrollItems],
  );

  const totalEarnings = useMemo(
    () =>
      Object.values(earnings).reduce<number>(
        (acc, curr) => acc + Number(curr || 0),
        0,
      ),
    [earnings],
  );
  const totalDeductions = useMemo(
    () =>
      Object.values(deductions).reduce<number>(
        (acc, curr) => acc + Number(curr || 0),
        0,
      ),
    [deductions],
  );
  const netSalary = totalEarnings - totalDeductions;

  const yearOptions = useMemo(() => {
    const years = new Set<number>();
    for (let y = DEFAULT_YEAR - 2; y <= DEFAULT_YEAR + 5; y += 1) years.add(y);
    rows.forEach((row) => years.add(Number(row.salaryYear)));
    return Array.from(years).sort((a, b) => b - a);
  }, [rows]);

  const resetForm = () => {
    setSelectedUser("");
    setSelectedSalaryMonth(String(DEFAULT_MONTH));
    setSelectedSalaryYear(String(DEFAULT_YEAR));
    setEarnings(createEmptyMap(additionItems, true));
    setDeductions(createEmptyMap(deductionItems));
  };

  const openFilterModal = () => {
    setDraftFilterMonth(filterMonth);
    setDraftFilterYear(filterYear);
    setDraftMinSalary(minSalary);
    setDraftMaxSalary(maxSalary);
    setIsFilterModalOpen(true);
  };

  const applyFilters = () => {
    setFilterMonth(draftFilterMonth);
    setFilterYear(draftFilterYear);
    setMinSalary(draftMinSalary);
    setMaxSalary(draftMaxSalary);
    setIsFilterModalOpen(false);
  };

  const clearFilters = () => {
    setDraftFilterMonth("");
    setDraftFilterYear("");
    setDraftMinSalary("");
    setDraftMaxSalary("");
    setFilterMonth("");
    setFilterYear("");
    setMinSalary("");
    setMaxSalary("");
    setIsFilterModalOpen(false);
  };

  const openForExistingSalary = (row: SalaryRecord) => {
    setSelectedUser(row.userId);
    setSelectedSalaryMonth(String(getMonthNumberFromRow(row)));
    setSelectedSalaryYear(String(getYearNumberFromRow(row)));
    setIsModalOpen(true);
  };

  const openForNewSalary = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleAddSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return toast.error("Please select an employee");
    const salaryMonth = Number(selectedSalaryMonth);
    const salaryYear = Number(selectedSalaryYear);
    if (!Number.isInteger(salaryMonth) || salaryMonth < 1 || salaryMonth > 12) {
      return toast.error("Please select a valid salary month");
    }
    if (!Number.isInteger(salaryYear) || salaryYear < 1900) {
      return toast.error("Please select a valid salary year");
    }
    if (netSalary <= 0) {
      return toast.error("Net salary must be a positive number");
    }
    try {
      await api.post("/payroll/salaries", {
        userId: selectedUser,
        amount: totalEarnings,
        salaryMonth,
        salaryYear,
        earnings: normalizeMap(earnings),
        deductions: normalizeMap(deductions),
        netSalary,
      });
      toast.success("Salary saved successfully");
      setIsModalOpen(false);
      resetForm();
      refreshData();
      setReloadToken((prev) => prev + 1);
    } catch (error: any) {
      toast.error(error?.message || "Failed to save salary");
    }
  };

  useEffect(() => {
    const fetchPayrollItems = async () => {
      try {
        setIsItemsLoading(true);
        const data = await api.get("/payroll/items");
        setPayrollItems(data || []);
      } catch {
        toast.error("Failed to fetch payroll items");
      } finally {
        setIsItemsLoading(false);
      }
    };
    fetchPayrollItems();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      try {
        setIsRowsLoading(true);
        const params = new URLSearchParams();
        if (searchTerm.trim()) params.set("search", searchTerm.trim());
        if (filterMonth) params.set("salary_month", filterMonth);
        if (filterYear) params.set("salary_year", filterYear);
        if (minSalary.trim()) params.set("min_salary", minSalary.trim());
        if (maxSalary.trim()) params.set("max_salary", maxSalary.trim());
        const query = params.toString();
        const endpoint = query ? `/payroll/salaries?${query}` : "/payroll/salaries";
        const data = await api.get(endpoint);
        setRows(data || []);
      } catch {
        toast.error("Failed to fetch salaries");
      } finally {
        setIsRowsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterMonth, filterYear, minSalary, maxSalary, reloadToken]);

  useEffect(() => {
    let isCancelled = false;

    const preloadSalary = async () => {
      if (!isModalOpen || isItemsLoading) return;
      if (!selectedUser || !selectedSalaryMonth || !selectedSalaryYear) return;
      const salaryMonth = Number(selectedSalaryMonth);
      const salaryYear = Number(selectedSalaryYear);
      if (!Number.isInteger(salaryMonth) || !Number.isInteger(salaryYear)) return;

      try {
        const data = (await api.get(
          `/payroll/salaries?user_id=${encodeURIComponent(selectedUser)}&salary_month=${salaryMonth}&salary_year=${salaryYear}`,
        )) as SalaryRecord[];
        if (isCancelled) return;
        const row =
          data?.find(
            (item) =>
              getMonthNumberFromRow(item) === salaryMonth &&
              getYearNumberFromRow(item) === salaryYear,
          ) || data?.[0];
        if (row) {
          setEarnings(buildValuesFromSalary(additionItems, row.earnings, true));
          setDeductions(buildValuesFromSalary(deductionItems, row.deductions));
        } else {
          setEarnings(createEmptyMap(additionItems, true));
          setDeductions(createEmptyMap(deductionItems));
        }
      } catch {
        if (isCancelled) return;
        toast.error("Failed to load selected salary data");
      }
    };

    preloadSalary();

    return () => {
      isCancelled = true;
    };
  }, [
    isModalOpen,
    isItemsLoading,
    selectedUser,
    selectedSalaryMonth,
    selectedSalaryYear,
    additionItems,
    deductionItems,
  ]);

  return (
    <div className="p-8">
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
            onClick={openForNewSalary}
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
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={openFilterModal}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white font-medium hover:bg-gray-50"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </button>
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 text-left">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Emp ID</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Employee Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Designation</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Month</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Salary</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-center">Payslip</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading || isRowsLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    Loading salaries...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No salary records found.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-[#1a5f3f] font-bold">
                      {row.user?.employeeId || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1a5f3f] flex items-center justify-center text-white font-bold text-xs shadow-sm overflow-hidden">
                          {row.user?.profilePhotoUrl ? (
                            <img src={row.user.profilePhotoUrl} className="w-full h-full object-cover" />
                          ) : (
                            row.user?.name?.split(" ").map((n: string) => n[0]).join("") || "?"
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{row.user?.name || "-"}</p>
                          <p className="text-xs text-gray-500">{row.user?.email || "-"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{row.user?.email || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                      {row.user?.designation?.name || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{buildMonthLabel(row)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-bold">
                      <div className="flex items-center gap-1">
                        <span className="text-md font-black ">৳</span>
                        <span>{Number(row.netSalary).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        to={`/payroll/payslip/${row.userId}`}
                        className="px-4 py-1.5 bg-[#2a2a2a] text-white rounded-lg text-xs font-bold hover:bg-black transition-all inline-block"
                      >
                        Generate Slip
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => openForExistingSalary(row)}
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
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white">
          <p className="text-sm text-gray-600 font-medium">
            Showing 1 - {rows.length} of {rows.length} entries
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

      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">Filter Salaries</h3>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Month
                </label>
                <select
                  value={draftFilterMonth}
                  onChange={(e) => setDraftFilterMonth(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f]"
                >
                  <option value="">All</option>
                  {MONTH_OPTIONS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Year
                </label>
                <select
                  value={draftFilterYear}
                  onChange={(e) => setDraftFilterYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f]"
                >
                  <option value="">All</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Min Salary
                </label>
                <input
                  type="number"
                  min={0}
                  value={draftMinSalary}
                  onChange={(e) => setDraftMinSalary(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Max Salary
                </label>
                <input
                  type="number"
                  min={0}
                  value={draftMaxSalary}
                  onChange={(e) => setDraftMaxSalary(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f]"
                />
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Clear
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-[#1a5f3f] text-white rounded-lg hover:bg-[#155233]"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Employee Name
                  </label>
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
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
                    Salary Month
                  </label>
                  <select
                    value={selectedSalaryMonth}
                    onChange={(e) => setSelectedSalaryMonth(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:bg-white transition-all font-medium text-sm"
                  >
                    {MONTH_OPTIONS.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Salary Year
                  </label>
                  <select
                    value={selectedSalaryYear}
                    onChange={(e) => setSelectedSalaryYear(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:bg-white transition-all font-medium text-sm"
                  >
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Net Salary
                  </label>
                  <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg font-bold text-gray-800 text-sm flex items-center gap-1">
                    <span className="text-md font-black ">৳</span>
                    <span>{netSalary.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-[#1a5f3f] flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Earnings
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {isItemsLoading ? (
                    <p className="text-sm text-gray-500 col-span-full">
                      Loading payroll items...
                    </p>
                  ) : (
                    <>
                      <SalaryInput
                        label={BASIC_FIELD}
                        value={earnings[BASIC_FIELD] ?? ""}
                        onChange={(val) =>
                          setEarnings((prev) => ({ ...prev, [BASIC_FIELD]: val }))
                        }
                      />
                      {additionItems.map((item) => (
                        <SalaryInput
                          key={item.id}
                          label={item.name}
                          value={earnings[item.name] ?? ""}
                          onChange={(val) =>
                            setEarnings((prev) => ({ ...prev, [item.name]: val }))
                          }
                        />
                      ))}
                    </>
                  )}
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-red-600 flex items-center gap-2">
                    <X className="w-4 h-4" /> Deductions
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {isItemsLoading ? (
                    <p className="text-sm text-gray-500 col-span-full">
                      Loading payroll items...
                    </p>
                  ) : deductionItems.length === 0 ? (
                    <p className="text-sm text-gray-500 col-span-full">
                      No deduction payroll items found.
                    </p>
                  ) : (
                    deductionItems.map((item) => (
                      <SalaryInput
                        key={item.id}
                        label={item.name}
                        value={deductions[item.name] ?? ""}
                        onChange={(val) =>
                          setDeductions((prev) => ({ ...prev, [item.name]: val }))
                        }
                      />
                    ))
                  )}
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
                  Save Employee Salary
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
  value: SalaryValue;
  onChange: (val: SalaryValue) => void;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">
        {label}
      </label>
      <input
        type="number"
        value={value === "" ? "" : value}
        onChange={(e) =>
          onChange(e.target.value === "" ? "" : Number(e.target.value))
        }
        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:bg-white transition-all text-sm font-semibold"
        placeholder="0.00"
      />
    </div>
  );
}
