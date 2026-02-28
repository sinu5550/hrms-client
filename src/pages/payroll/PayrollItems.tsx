import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Plus,
  Edit,
  Trash2,
  Home,
  ChevronRight,
  Download,
  Settings,
  ChevronLeft,
  MinusCircle,
  Search,
} from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "sonner";

type PayrollTab = "additions" | "deductions";

interface PayrollItem {
  id: string;
  name: string;
  category: string;
  amountType: string;
  defaultValue: number;
}

interface PayrollItemForm {
  name: string;
  amountType: string;
  defaultValue: string;
}

const TAB_TO_CATEGORY: Record<PayrollTab, string> = {
  additions: "Addition",
  deductions: "Deduction",
};

const getTabFromItem = (item: PayrollItem): PayrollTab => {
  const category = item.category.toLowerCase();
  if (category.includes("deduction") || category.includes("statutory")) {
    return "deductions";
  }
  return "additions";
};

export default function PayrollItems() {
  const [activeTab, setActiveTab] = useState<PayrollTab>("additions");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allItems, setAllItems] = useState<PayrollItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PayrollItemForm>({
    name: "",
    amountType: "Fixed",
    defaultValue: "",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const data = await api.get("/payroll/items");
      setAllItems(data || []);
    } catch (error) {
      toast.error("Failed to fetch payroll items");
    } finally {
      setIsLoading(false);
    }
  };

  const visibleItems = useMemo(
    () =>
      allItems.filter((item) => {
        const inTab = getTabFromItem(item) === activeTab;
        const q = searchTerm.toLowerCase();
        const matchesSearch =
          !q ||
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.amountType.toLowerCase().includes(q);
        return inTab && matchesSearch;
      }),
    [allItems, activeTab, searchTerm],
  );

  const handleOpenModal = (item?: PayrollItem) => {
    if (item) {
      setEditingItemId(item.id);
      setFormData({
        name: item.name,
        amountType: item.amountType || "Fixed",
        defaultValue: String(item.defaultValue ?? ""),
      });
    } else {
      setEditingItemId(null);
      setFormData({
        name: "",
        amountType: "Fixed",
        defaultValue: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItemId(null);
    setFormData({ name: "", amountType: "Fixed", defaultValue: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const payload = {
        name: formData.name.trim(),
        category: TAB_TO_CATEGORY[activeTab],
        amountType: formData.amountType,
        defaultValue: Number(formData.defaultValue || 0),
      };

      if (editingItemId) {
        await api.put(`/payroll/items/${editingItemId}`, payload);
        toast.success("Payroll item updated");
      } else {
        await api.post("/payroll/items", payload);
        toast.success("Payroll item created");
      }

      handleCloseModal();
      fetchItems();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save payroll item");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item: PayrollItem) => {
    if (!confirm(`Delete "${item.name}" from ${activeTab}?`)) return;
    try {
      await api.delete(`/payroll/items/${item.id}`);
      toast.success("Payroll item deleted");
      fetchItems();
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete payroll item");
    }
  };

  const tabs = [
    { id: "additions", label: "Additions", icon: Plus },
    { id: "deductions", label: "Deductions", icon: MinusCircle },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Payroll Items
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
            <Link to="/" className="hover:text-[#1a5f3f] transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>Payroll</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#1a5f3f] font-medium">Payroll Items</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors bg-white">
            <Download className="w-4 h-4" /> Export
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a5f3f] text-white rounded-lg hover:bg-[#155233] transition-colors shadow-sm font-semibold"
          >
            <Plus className="w-4 h-4" /> Add {activeTab.slice(0, -1)}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-gray-800 capitalize">
            {activeTab} List
          </h2>
        </div>

        {/* Tab Selection */}
        <div className="p-4 border-b border-gray-200 bg-gray-50/30">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as PayrollTab)}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-[#1a5f3f] text-white shadow-sm"
                    : "bg-white text-gray-500 hover:text-gray-800 border border-gray-200"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Row Per Page</span>
              <select className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] text-sm bg-white font-medium">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span className="text-sm text-gray-600">Entries</span>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
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
            <button className="bg-[#1a5f3f] p-2 rounded-lg text-white hover:bg-[#155233] transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 text-left">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                  Name
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                  Category
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                  Default / Unit Amount
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
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : visibleItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No payroll items found.
                  </td>
                </tr>
              ) : (
                visibleItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-bold">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1a5f3f] font-bold">
                      {item.amountType === "Percentage"
                        ? `${item.defaultValue}%`
                        : `$${item.defaultValue}`}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 font-semibold">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="text-gray-400 hover:text-[#1a5f3f] transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
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
            Showing 1 - {visibleItems.length} of {visibleItems.length} entries
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingItemId
                  ? `Edit ${activeTab.slice(0, -1)}`
                  : `Add ${activeTab.slice(0, -1)}`}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f]"
                    placeholder={`e.g. ${activeTab === "deductions" ? "TDS" : "Basic Allowance"}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount Type
                  </label>
                  <select
                    value={formData.amountType}
                    onChange={(e) =>
                      setFormData({ ...formData, amountType: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f]"
                  >
                    <option value="Fixed">Fixed</option>
                    <option value="Hourly">Hourly</option>
                    <option value="Percentage">Percentage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default / Unit Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.defaultValue}
                    onChange={(e) =>
                      setFormData({ ...formData, defaultValue: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f]"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#1a5f3f] text-white rounded-lg hover:bg-[#155233] disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
