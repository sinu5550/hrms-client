import { useState, useEffect } from "react";
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
  Clock,
  MinusCircle,
  Search,
} from "lucide-react";
import { toast } from "sonner";

export default function PayrollItems() {
  const [activeTab, setActiveTab] = useState("additions");
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      // Mock data for now based on image
      const mockData: any = {
        additions: [
          {
            id: 1,
            name: "Leave Balance Amount",
            category: "Monthly Remuneration",
            amount: 5,
          },
          {
            id: 2,
            name: "Arrears of Salary",
            category: "Additional Remuneration",
            amount: 8,
          },
          {
            id: 3,
            name: "Gratuity",
            category: "Monthly Remuneration",
            amount: 20,
          },
        ],
        overtime: [
          {
            id: 1,
            name: "Normal Day Overtime",
            category: "Hourly",
            amount: 15,
          },
          { id: 2, name: "Holiday Overtime", category: "Fixed", amount: 50 },
        ],
        deductions: [
          { id: 1, name: "TDS", category: "Statutory", amount: 200 },
          { id: 2, name: "ESI", category: "Statutory", amount: 150 },
          {
            id: 3,
            name: "Professional Tax",
            category: "Statutory",
            amount: 100,
          },
        ],
      };
      setItems(mockData[activeTab] || []);
    } catch (error) {
      toast.error("Failed to fetch payroll items");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "additions", label: "Additions", icon: Plus },
    { id: "overtime", label: "Overtime", icon: Clock },
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
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a5f3f] text-white rounded-lg hover:bg-[#155233] transition-colors shadow-sm font-semibold">
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
                onClick={() => setActiveTab(tab.id)}
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
              ) : (
                items.map((item) => (
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
                      ${item.amount}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 font-semibold">
                        <button className="text-gray-400 hover:text-[#1a5f3f] transition-colors">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button className="text-gray-400 hover:text-red-500 transition-colors">
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
            Showing 1 - {items.length} of {items.length} entries
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
    </div>
  );
}
