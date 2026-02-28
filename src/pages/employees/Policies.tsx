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
  ChevronLeft,
  Calendar,
} from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";

interface Department {
  id: string;
  name: string;
}

interface Policy {
  serialNo: number;
  id: string;
  policyCode: string;
  name: string;
  description: string;
  department?: Department | null;
  status: "Active" | "Inactive";
  createdAt: string;
}

export default function Policies() {
  const { policies: globalPolicies, departments, isLoading, refreshData } = useData();
  const [policies, setPolicies] = useState<Policy[]>(globalPolicies);
  const [loading, setLoading] = useState(isLoading);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    departmentId: "",
    status: "Active",
  });

  useEffect(() => {
    setPolicies(globalPolicies);
    setLoading(isLoading);
  }, [globalPolicies, isLoading]);

  const handleOpenModal = (policy?: Policy) => {
    if (policy) {
      setEditingId(policy.id);
      setFormData({
        name: policy.name,
        description: policy.description,
        departmentId: policy.department?.id || "",
        status: policy.status,
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", description: "", departmentId: "", status: "Active" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", description: "", departmentId: "", status: "Active" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        departmentId: formData.departmentId || null,
        status: formData.status,
      };

      if (editingId) {
        await api.put(`/policies/${editingId}`, payload);
        toast.success("Policy updated successfully");
      } else {
        await api.post("/policies", payload);
        toast.success("Policy created successfully");
      }
      handleCloseModal();
      refreshData();
    } catch (error: any) {
      toast.error(error.message || "Failed to save policy");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the ${name} policy?`)) {
      try {
        await api.delete(`/policies/${id}`);
        toast.success("Policy deleted successfully");
        refreshData();
      } catch (error: any) {
        toast.error(error.message || "Failed to delete policy");
      }
    }
  };

  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch =
      policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept =
      departmentFilter === "all" ||
      (departmentFilter === "All Department" && !policy.department) ||
      policy.department?.id === departmentFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Policies</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
            <Link to="/" className="hover:text-[#1a5f3f] transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>Employee</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#1a5f3f] font-medium">Policies</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a5f3f] text-white rounded-lg hover:bg-[#155233] transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Policy
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Policies List</h2>
        </div>

        {/* Filters and Search - Matching the screenshot exactly */}
        <div className="p-4 border-b border-gray-200 flex flex-col xl:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4 w-full xl:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Row Per Page</span>
              <select className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:border-transparent text-sm">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span className="text-sm text-gray-600">Entries</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto justify-end">
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 bg-white">
               <Calendar className="w-4 h-4" />
               <span>28/02/2026 - 28/02/2026</span>
            </div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:border-transparent text-sm min-w-32.5"
            >
              <option value="all">Department</option>
              <option value="All Department">All Department</option>
              {departments.map((dept: any) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:border-transparent text-sm min-w-37.5">
              <option>Sort By : Last 7 Days</option>
              <option>Sort By : A-Z</option>
            </select>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        {/* Table Overview */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left w-12">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#1a5f3f] focus:ring-[#1a5f3f]"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  <div className="flex items-center justify-between">
                     Policy Code
                     <span className="text-gray-400 text-xs">↕</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  <div className="flex items-center justify-between">
                     Name
                     <span className="text-gray-400 text-xs">↕</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  <div className="flex items-center justify-between">
                     Department
                     <span className="text-gray-400 text-xs">↕</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-2/5">
                  <div className="flex items-center justify-between">
                     Description
                     <span className="text-gray-400 text-xs">↕</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  <div className="flex items-center justify-between">
                     Status
                     <span className="text-gray-400 text-xs">↕</span>
                  </div>
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
                    Loading policies...
                  </td>
                </tr>
              ) : filteredPolicies.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No policies found.
                  </td>
                </tr>
              ) : (
                filteredPolicies.map((policy) => (
                  <tr
                    key={policy.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#1a5f3f] focus:ring-[#1a5f3f]"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {policy.policyCode}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {policy.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {policy.department?.name || "All Department"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 truncate">
                      {policy.description}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          policy.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {policy.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <button
                          onClick={() => handleOpenModal(policy)}
                          className="text-gray-400 hover:text-[#1a5f3f] transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(policy.id, policy.name)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing 1 - {filteredPolicies.length} of {policies.length} entries
          </p>
          <div className="flex gap-2">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-4 py-2 bg-[#1a5f3f] text-white rounded-lg hover:bg-[#155233] transition-colors text-sm">
              1
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Policy Modal (Matches Department modal styles) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingId ? "Edit Policy" : "Add Policy"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Policy Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f]"
                    placeholder="e.g. Leave Policy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) =>
                      setFormData({ ...formData, departmentId: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f]"
                  >
                    <option value="">All Department</option>
                    {departments.map((dept: any) => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] resize-none h-24"
                    placeholder="Brief description of the policy..."
                  ></textarea>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1a5f3f] text-white rounded-lg hover:bg-[#155233] transition-colors"
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
      
