import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Home,
  ChevronRight,
  Download,
  Settings,
  ChevronLeft,
  X,
} from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "sonner";

interface Department {
  id: string;
  name: string;
  departmentCode: string;
}

interface Designation {
  serialNo: number;
  id: string;
  designationCode: string;
  name: string;
  departmentCode: string;
  departmentName: string;
  employeeCount: number;
  status: "Active" | "Inactive";
}

export default function Designations() {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    departmentId: "",
    status: "Active" as "Active" | "Inactive",
  });

  const fetchDesignations = async () => {
    try {
      setLoading(true);
      const data = await api.get("/designations");
      setDesignations(data);
    } catch (error) {
      toast.error("Failed to fetch designations");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await api.get("/departments");
      setDepartments(data);
    } catch (error) {
      console.error("Failed to fetch departments", error);
    }
  };

  useEffect(() => {
    fetchDesignations();
    fetchDepartments();
  }, []);

  const handleOpenModal = (designation?: Designation) => {
    if (designation) {
      setEditingId(designation.id);
      // Find department ID by code
      const deptId =
        departments.find((d) => d.departmentCode === designation.departmentCode)
          ?.id || "";
      setFormData({
        name: designation.name,
        departmentId: deptId,
        status: designation.status,
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", departmentId: "", status: "Active" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", departmentId: "", status: "Active" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.departmentId) {
      return toast.error("Please fill all required fields");
    }

    try {
      if (editingId) {
        await api.put(`/designations/${editingId}`, formData);
        toast.success("Designation updated successfully");
      } else {
        await api.post("/designations", formData);
        toast.success("Designation created successfully");
      }
      handleCloseModal();
      fetchDesignations();
    } catch (error: any) {
      toast.error(error.message || "Failed to save designation");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the ${name} designation?`)) {
      try {
        await api.delete(`/designations/${id}`);
        toast.success("Designation deleted successfully");
        fetchDesignations();
      } catch (error: any) {
        toast.error(error.message || "Failed to delete designation");
      }
    }
  };

  const filteredDesignations = designations.filter((des) => {
    const matchesSearch =
      des.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      des.designationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      des.departmentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || des.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Designations</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
            <Link to="/" className="hover:text-[#1a5f3f] transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>Employee</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#1a5f3f] font-medium">Designations</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors bg-white">
            <Download className="w-4 h-4" /> Export
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a5f3f] text-white rounded-lg hover:bg-[#155233] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Designation
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-gray-800">
            Designation List
          </h2>
        </div>

        {/* Filters and Search */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Row Per Page</span>
              <select className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] text-sm bg-white">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span className="text-sm text-gray-600">Entries</span>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] text-sm bg-white min-w-[120px]"
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] text-sm bg-white"
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
                  Serial No
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                  Designation Code
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                  Designation Name
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                  Dept Code
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                  No of Employees
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading designations...
                  </td>
                </tr>
              ) : filteredDesignations.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No designations found.
                  </td>
                </tr>
              ) : (
                filteredDesignations.map((des) => (
                  <tr
                    key={des.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {des.serialNo}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1a5f3f] font-semibold">
                      {des.designationCode}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {des.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {des.departmentCode}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-semibold">
                      {String(des.employeeCount).padStart(2, "0")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center gap-1.5 ${
                          des.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${des.status === "Active" ? "bg-green-500" : "bg-red-500"}`}
                        ></div>
                        {des.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 font-semibold">
                        <button
                          onClick={() => handleOpenModal(des)}
                          className="text-gray-400 hover:text-[#1a5f3f] transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(des.id, des.name)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
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

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white">
          <p className="text-sm text-gray-600">
            Showing 1 - {filteredDesignations.length} of{" "}
            {filteredDesignations.length} entries
          </p>
          <div className="flex gap-2">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-4 py-2 bg-[#1a5f3f] text-white rounded-lg hover:bg-[#155233] transition-colors text-sm font-semibold">
              1
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Designation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? "Edit Designation" : "Add Designation"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Designation Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] transition-all"
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.departmentId}
                  onChange={(e) =>
                    setFormData({ ...formData, departmentId: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] transition-all bg-white"
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
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] transition-all bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-[#1a5f3f] text-white rounded-xl hover:bg-[#155233] font-semibold transition-colors shadow-lg shadow-[#1a5f3f]/20"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
