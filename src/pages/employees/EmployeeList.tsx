import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit2,
  MoreVertical,
  Plus,
  X,
  EyeOff,
  Home,
  ChevronRight,
} from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  profilePhotoUrl?: string;
  department?: { name: string };
  designation?: { name: string };
  joiningDate: string;
  status: "Active" | "Inactive";
  role: string;
}

const isNonEmptyString = (value: string | undefined): value is string =>
  Boolean(value);

const ROLE_OPTIONS = [
  { value: "EMPLOYEE", label: "Employee" },
  { value: "SUPERVISOR", label: "Supervisor" },
  { value: "ADMIN", label: "Admin" },
];

const getRoleLabel = (value: string) =>
  ROLE_OPTIONS.find((option) => option.value === value)?.label ||
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

export default function EmployeeList() {
  const {
    employees: globalEmployees,
    departments,
    designations,
    isLoading,
    refreshData,
  } = useData();
  const [employees, setEmployees] = useState<Employee[]>(globalEmployees);
  const [loading, setLoading] = useState(isLoading);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [departmentNames, setDepartmentNames] = useState<string[]>(["all"]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [nextEmpId, setNextEmpId] = useState("EMP-0001");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    joiningDate: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    company: "",
    departmentId: "",
    designationId: "",
    about: "",
  });

  const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : "Failed to create employee";

  useEffect(() => {
    setEmployees(globalEmployees);
    setLoading(isLoading);

    if (globalEmployees.length > 0) {
      setDepartmentNames([
        "all",
        ...Array.from(
          new Set(
            globalEmployees
              .map((e: Employee) => e.department?.name)
              .filter(isNonEmptyString),
          ),
        ),
      ]);

      // Calculate next EMP ID
      const lastEmp = globalEmployees
        .filter((u: Employee) => u.employeeId?.startsWith("EMP-"))
        .sort((a: Employee, b: Employee) => {
          const numA = parseInt(a.employeeId.replace("EMP-", ""), 10);
          const numB = parseInt(b.employeeId.replace("EMP-", ""), 10);
          return numB - numA;
        })[0];

      if (lastEmp && lastEmp.employeeId) {
        const num = parseInt(lastEmp.employeeId.replace("EMP-", ""), 10);
        setNextEmpId(`EMP-${String(num + 1).padStart(4, "0")}`);
      }
    }
  }, [globalEmployees, isLoading]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setIsSaving(true);
    try {
      await api.post("/users", {
        ...formData,
        role: "EMPLOYEE",
      });
      toast.success("Employee created successfully");
      setIsModalOpen(false);
      setFormData({
        firstName: "",
        lastName: "",
        joiningDate: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        company: "",
        departmentId: "",
        designationId: "",
        about: "",
      });
      refreshData();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const [pendingRoleChange, setPendingRoleChange] = useState<{
    employee: Employee;
    newRole: string;
  } | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isRoleUpdating, setIsRoleUpdating] = useState(false);

  const closeRoleDialog = () => {
    setIsRoleDialogOpen(false);
    setPendingRoleChange(null);
  };

  const handleRoleSelect = (employee: Employee, newRole: string) => {
    if (newRole === employee.role) return;
    setPendingRoleChange({ employee, newRole });
    setIsRoleDialogOpen(true);
  };

  const applyRoleChange = async () => {
    if (!pendingRoleChange) return;
    setIsRoleUpdating(true);
    try {
      await api.put(`/users/${pendingRoleChange.employee.id}/role`, {
        role: pendingRoleChange.newRole,
      });
      toast.success(
        `${pendingRoleChange.employee.name} is now ${getRoleLabel(
          pendingRoleChange.newRole,
        )}`,
      );
      await refreshData();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsRoleUpdating(false);
      closeRoleDialog();
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.designation?.name &&
        emp.designation.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDepartment =
      filterDepartment === "all" || emp.department?.name === filterDepartment;

    return (matchesSearch || !searchQuery) && matchesDepartment;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Employee Management
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
            <Link to="/" className="hover:text-[#1a5f3f] transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#1a5f3f] font-medium">Employees</span>
          </div>
        </div>
        <Link
          to="/employees/create"
          className="flex items-center gap-2 px-4 py-2 bg-[#1a5f3f] text-white rounded-lg hover:bg-[#155233] transition-colors shadow-sm font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add Employee
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, ID or designation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Department Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:border-transparent appearance-none bg-white font-medium"
            >
              {departmentNames.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === "all" ? "All Departments" : dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
          <button className="text-gray-700 hover:text-[#1a5f3f] flex items-center gap-2 text-sm font-medium">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="text-gray-700 hover:text-[#1a5f3f] flex items-center gap-2 text-sm font-medium">
            <Upload className="w-4 h-4" />
            Import Data
          </button>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-900">
                  Employee ID
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-900">
                  Employee Name
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-900">
                  Role
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-900">
                  Department
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-900">
                  Designation
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-900">
                  Joining Date
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading employees...
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No employees found.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-700 font-semibold">
                      {employee.employeeId || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1a5f3f] flex items-center justify-center text-white font-bold text-xs shadow-sm overflow-hidden">
                          {employee.profilePhotoUrl ? (
                            <img
                              src={employee.profilePhotoUrl}
                              alt={employee.name || "Employee"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            employee.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "?"
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {employee.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {employee.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 w-52.5">
                      <Select
                        value={employee.role}
                        onValueChange={(value) => handleRoleSelect(employee, value)}
                      >
                        <SelectTrigger size="sm">
                          <SelectValue placeholder={getRoleLabel(employee.role)} />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {employee.department?.name || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {employee.designation?.name || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {employee.joiningDate
                        ? new Date(employee.joiningDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          employee.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {employee.status || "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/employees/${employee.id}`}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </Link>
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="More"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Results Info */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 font-medium">
          <p className="text-sm text-gray-600">
            Showing {filteredEmployees.length} of {employees.length} employees
          </p>
        </div>
      </div>

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Add New Employee
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Employee ID:{" "}
                  <span className="font-semibold text-[#1a5f3f]">
                    {nextEmpId}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={handleSubmit}
              className="p-8 max-h-[calc(100vh-10rem)] overflow-y-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Joining Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="joiningDate"
                    required
                    value={formData.joiningDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] transition-all bg-white"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Designation
                  </label>
                  <select
                    name="designationId"
                    value={formData.designationId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] transition-all bg-white"
                  >
                    <option value="">Select Designation</option>
                    {designations
                      .filter(
                        (d) =>
                          !formData.departmentId ||
                          String(d.departmentId) ===
                            String(formData.departmentId),
                      )
                      .map((desig) => (
                        <option key={desig.id} value={desig.id}>
                          {desig.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    About <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="about"
                    required
                    rows={3}
                    value={formData.about}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] transition-all resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-8 border-t border-gray-100 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-10 py-3 bg-[#1a5f3f] text-white rounded-xl hover:bg-[#155233] transition-colors font-semibold shadow-lg shadow-[#1a5f3f]/20 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Dialog
        open={isRoleDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeRoleDialog();
          } else {
            setIsRoleDialogOpen(true);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Role Change</DialogTitle>
            <DialogDescription>
              {pendingRoleChange
                ? `Are you sure you want to change ${pendingRoleChange.employee.name}'s role to ${getRoleLabel(
                    pendingRoleChange.newRole,
                  )}?`
                : "Select a role to update the employee's permissions."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row-reverse gap-2">
            <Button
              onClick={applyRoleChange}
              disabled={isRoleUpdating}
              className="w-full sm:w-auto"
            >
              {isRoleUpdating ? "Updating..." : "Confirm Role"}
            </Button>
            <Button
              variant="outline"
              onClick={closeRoleDialog}
              disabled={isRoleUpdating}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
