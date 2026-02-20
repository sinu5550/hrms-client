import { useState } from "react";
import { Link } from "react-router";
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit2,
  MoreVertical,
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  joiningDate: string;
  status: "Active" | "Inactive";
  avatar: string;
}

export default function EmployeeList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] =
    useState("all");

  const employees: Employee[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      department: "Engineering",
      designation: "Senior Software Engineer",
      joiningDate: "2022-03-15",
      status: "Active",
      avatar: "SJ",
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael.chen@company.com",
      department: "Marketing",
      designation: "Marketing Manager",
      joiningDate: "2021-07-20",
      status: "Active",
      avatar: "MC",
    },
    {
      id: "3",
      name: "Emma Wilson",
      email: "emma.wilson@company.com",
      department: "HR",
      designation: "HR Manager",
      joiningDate: "2020-01-10",
      status: "Active",
      avatar: "EW",
    },
    {
      id: "4",
      name: "James Brown",
      email: "james.brown@company.com",
      department: "Engineering",
      designation: "DevOps Engineer",
      joiningDate: "2023-05-12",
      status: "Active",
      avatar: "JB",
    },
    {
      id: "5",
      name: "Olivia Martinez",
      email: "olivia.martinez@company.com",
      department: "Sales",
      designation: "Sales Executive",
      joiningDate: "2022-11-08",
      status: "Active",
      avatar: "OM",
    },
    {
      id: "6",
      name: "Robert Lee",
      email: "robert.lee@company.com",
      department: "Finance",
      designation: "Accountant",
      joiningDate: "2019-09-25",
      status: "Inactive",
      avatar: "RL",
    },
  ];

  const departments = [
    "all",
    "Engineering",
    "Marketing",
    "HR",
    "Sales",
    "Finance",
  ];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      emp.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      emp.designation
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesDepartment =
      filterDepartment === "all" ||
      emp.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Employee Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage employee profiles and information
          </p>
        </div>
        <Link
          to="/employees/new"
          className="bg-[#1a5f3f] hover:bg-[#155233] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
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
                placeholder="Search by name, email, or designation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:border-transparent"
              />
            </div>
          </div>

          {/* Department Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterDepartment}
              onChange={(e) =>
                setFilterDepartment(e.target.value)
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:border-transparent appearance-none bg-white"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === "all" ? "All Departments" : dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
          <button className="text-gray-700 hover:text-[#1a5f3f] flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="text-gray-700 hover:text-[#1a5f3f] flex items-center gap-2 text-sm">
            <Upload className="w-4 h-4" />
            Import Data
          </button>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Employee
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Department
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Designation
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Joining Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr
                  key={employee.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1a5f3f] flex items-center justify-center text-white font-semibold">
                        {employee.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {employee.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {employee.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {employee.department}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {employee.designation}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {employee.joiningDate}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        employee.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {employee.status}
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Results Info */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {filteredEmployees.length} of{" "}
            {employees.length} employees
          </p>
        </div>
      </div>
    </div>
  );
}