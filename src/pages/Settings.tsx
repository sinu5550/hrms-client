import { useState } from "react";
import { X, Settings as SettingsIcon, Building2, PanelLeftOpen } from "lucide-react";
import OrganizationProfile from "./settings/OrganizationProfile";
import { Button } from "../components/ui/button";

type SettingTab = "profile" | null;

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingTab>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: "profile", name: "Organization Profile", icon: Building2 },
  ];

  return (
    <div className="flex h-full bg-white overflow-hidden relative">
      {/* Secondary Sidebar */}
      {isSidebarOpen ? (
        <aside className="w-72 border-r border-gray-200 flex flex-col bg-white shadow-sm z-10 animate-in slide-in-from-left duration-300">
          <div className="p-5 flex justify-between items-center border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Settings</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
              title="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as SettingTab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? "bg-primary/10 text-primary border-r-4 border-primary shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className={`w-5 h-5 ${activeTab === item.id ? "text-primary" : "text-gray-400"}`} />
                {item.name}
              </button>
            ))}
          </nav>
        </aside>
      ) : (
        <div className="absolute top-8 left-4 z-20">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-full shadow-md hover:shadow-lg transition-all"
            title="Open Sidebar"
          >
            <PanelLeftOpen className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#fafafa]">
        <div className="p-8 h-full">
          {activeTab === "profile" ? (
            <div className="max-w-4xl mx-auto">
              <OrganizationProfile />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 animate-in zoom-in duration-500">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6 shadow-inner">
                <SettingsIcon className="w-12 h-12 text-gray-400 animate-spin-slow" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Settings</h2>
              <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                Select a category from the sidebar to manage your organization's configuration and preferences.
              </p>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
}
