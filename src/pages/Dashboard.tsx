import { Users, Clock, Plane, AlertCircle } from "lucide-react";
import { Link } from "react-router";

export default function Dashboard() {
  const stats = [
    {
      label: "Total Employees",
      value: "248",
      icon: Users,
      color: "bg-blue-500",
      link: "/employees",
    },
    {
      label: "Present Today",
      value: "231",
      icon: Clock,
      color: "bg-green-500",
      link: "/attendance",
    },
    {
      label: "On Leave",
      value: "12",
      icon: Plane,
      color: "bg-orange-500",
      link: "/leave",
    },
    {
      label: "Pending Approvals",
      value: "8",
      icon: AlertCircle,
      color: "bg-red-500",
      link: "/leave/approval",
    },
  ];

  const recentActivities = [
    {
      name: "Sarah Johnson",
      action: "applied for sick leave",
      time: "10 mins ago",
    },
    { name: "Michael Chen", action: "checked in at", time: "25 mins ago" },
    { name: "Emma Wilson", action: "updated profile", time: "1 hour ago" },
    {
      name: "James Brown",
      action: "requested leave approval",
      time: "2 hours ago",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, here's what's happening today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.link}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-3xl font-semibold text-gray-800 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Recent Activities
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivities.map((activity, index) => (
            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                    {activity.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-gray-800">
                      <span className="font-medium">{activity.name}</span>{" "}
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
