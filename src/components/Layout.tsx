import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Plane,
  DollarSign,
  FolderKanban,
  TrendingUp,
  BarChart3,
  Bot,
  Settings,
  UtensilsCrossed,
  Clock,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function Layout() {
  const [hrmsExpanded, setHrmsExpanded] = useState(true);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    {
      name: "HRMS",
      icon: Users,
      subItems: [
        { name: "Employees", path: "/employees", icon: Users },
        { name: "Attendance", path: "/attendance", icon: Calendar },
        { name: "Leave", path: "/leave", icon: Plane },
        { name: "Payroll", path: "/payroll", icon: DollarSign },
        {
          name: "Meal & Expense",
          path: "/meal-expense",
          icon: UtensilsCrossed,
        },
        { name: "Timesheet", path: "/timesheet", icon: Clock },
      ],
    },
    { name: "Projects", icon: FolderKanban, path: "/projects" },
    { name: "Finance", icon: TrendingUp, path: "/finance" },
    { name: "Reports", icon: BarChart3, path: "/reports" },
    { name: "AI Assistant", icon: Bot, path: "/ai-assistant" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <div className="flex h-screen bg-[#f5f5f5]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2a2a2a] text-white flex flex-col shadow-xl">
        {/* Logo/Header Section */}
        <div className="p-6 border-b border-[#3a3a3a]">
          <h1 className="text-xl font-semibold text-white">HRMS Portal</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => (
            <div key={item.name}>
              {/* Main Menu Item */}
              {item.subItems ? (
                <button
                  onClick={() => setHrmsExpanded(!hrmsExpanded)}
                  className="w-full flex items-center justify-between px-6 py-3 text-left transition-colors hover:bg-[#3a3a3a] text-gray-300"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {hrmsExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              ) : (
                <Link
                  to={item.path!}
                  className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
                    isActive(item.path!)
                      ? "bg-primary text-white border-l-4 border-primary/80"
                      : "hover:bg-[#3a3a3a] text-gray-300"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )}

              {/* Sub Menu Items */}
              {item.subItems && hrmsExpanded && (
                <div className="bg-[#3a3a3a] py-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.name}
                      to={subItem.path}
                      className={`w-full flex items-center gap-3 px-6 pl-14 py-2.5 transition-colors ${
                        isActive(subItem.path)
                          ? "bg-primary text-white border-l-4 border-primary/80"
                          : "hover:bg-[#424242] text-gray-300"
                      }`}
                    >
                      <subItem.icon className="w-4 h-4" />
                      <span>{subItem.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer/User Section */}
        <div className="p-6 border-t border-[#3a3a3a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
              JD
            </div>
            <div>
              <p className="font-medium text-white">John Doe</p>
              <p className="text-sm text-gray-400">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
