import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  TrendingUp,
  AlertTriangle,
  Target,
  Calendar,
  Download,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ProductivityReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Productivity data over time
  const productivityData = [
    { date: "Week 1", productivity: 82, utilization: 88, hours: 38 },
    { date: "Week 2", productivity: 85, utilization: 92, hours: 42 },
    { date: "Week 3", productivity: 88, utilization: 90, hours: 40 },
    { date: "Week 4", productivity: 87, utilization: 91, hours: 45 },
  ];

  // Project distribution
  const projectData = [
    { name: "HRMS Portal", hours: 120, value: 65 },
    { name: "Client Dashboard", hours: 35, value: 19 },
    { name: "Mobile App", hours: 20, value: 11 },
    { name: "Internal Tools", hours: 10, value: 5 },
  ];

  // Task distribution
  const taskData = [
    { name: "Development", hours: 85 },
    { name: "Code Review", hours: 30 },
    { name: "Meetings", hours: 25 },
    { name: "Testing", hours: 20 },
    { name: "Documentation", hours: 15 },
    { name: "Bug Fixing", hours: 10 },
  ];

  const COLORS = ["#1a5f3f", "#2d8f5f", "#4caf50", "#81c784", "#a5d6a7"];

  const stats = {
    avgProductivity: 87,
    totalHours: 185,
    billablePercentage: 78,
    burnoutRisk: 18,
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/timesheet"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Timesheet
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              Productivity Reports & Analytics
            </h1>
            <p className="text-gray-600 mt-1">
              Track productivity metrics and performance insights
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a5f3f] hover:bg-[#155233] text-white rounded-lg transition-colors">
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-gray-400" />
          <div className="flex gap-2">
            {["week", "month", "quarter", "year"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedPeriod === period
                    ? "bg-[#1a5f3f] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Avg Productivity</p>
            <TrendingUp className="w-5 h-5 text-[#1a5f3f]" />
          </div>
          <p className="text-3xl font-semibold text-[#1a5f3f]">
            {stats.avgProductivity}%
          </p>
          <p className="text-sm text-gray-500 mt-1">+5% from last period</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Total Hours</p>
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-800">
            {stats.totalHours}h
          </p>
          <p className="text-sm text-gray-500 mt-1">Target: 160h</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Billable %</p>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-semibold text-green-600">
            {stats.billablePercentage}%
          </p>
          <p className="text-sm text-gray-500 mt-1">Above target (75%)</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Burnout Risk</p>
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-semibold text-orange-600">
            {stats.burnoutRisk}%
          </p>
          <p className="text-sm text-gray-500 mt-1">Low risk level</p>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-[#1a5f3f] to-[#2d8f5f] rounded-lg shadow-sm p-6 mb-6 text-white">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">
              AI Productivity Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-white/70 mb-1">Peak Productivity Hours</p>
                <p className="font-medium">9:00 AM - 12:00 PM</p>
                <p className="text-white/80 text-xs mt-1">
                  87% avg productivity
                </p>
              </div>
              <div>
                <p className="text-white/70 mb-1">Task Efficiency</p>
                <p className="font-medium">2.3 hours/task</p>
                <p className="text-white/80 text-xs mt-1">
                  15% faster than team avg
                </p>
              </div>
              <div>
                <p className="text-white/70 mb-1">Burnout Detection</p>
                <p className="font-medium">Low Risk (18%)</p>
                <p className="text-white/80 text-xs mt-1">
                  Recommend: Take breaks
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Productivity Trend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            Productivity & Utilization Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="productivity"
                stroke="#1a5f3f"
                strokeWidth={2}
                name="Productivity %"
              />
              <Line
                type="monotone"
                dataKey="utilization"
                stroke="#2d8f5f"
                strokeWidth={2}
                name="Utilization %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Project Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            Project Time Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {projectData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Task Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            Task Category Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="#1a5f3f" name="Hours" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Hours */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            Weekly Hours Logged
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="#2d8f5f" name="Hours Logged" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            Productivity Score Breakdown
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">
                  Task Completion Rate
                </span>
                <span className="text-sm font-medium text-gray-800">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#1a5f3f] h-2 rounded-full"
                  style={{ width: "92%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">On-time Delivery</span>
                <span className="text-sm font-medium text-gray-800">88%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#1a5f3f] h-2 rounded-full"
                  style={{ width: "88%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Code Quality</span>
                <span className="text-sm font-medium text-gray-800">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#1a5f3f] h-2 rounded-full"
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Collaboration</span>
                <span className="text-sm font-medium text-gray-800">90%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#1a5f3f] h-2 rounded-full"
                  style={{ width: "90%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            AI Recommendations
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="font-medium text-green-800 mb-1">
                ✓ Excellent Work Pattern
              </p>
              <p className="text-sm text-green-700">
                Your productivity is 15% above team average. Maintain your
                morning focus blocks.
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="font-medium text-blue-800 mb-1">
                💡 Optimization Tip
              </p>
              <p className="text-sm text-blue-700">
                Consider batching code reviews together. Current avg: 30
                min/review, optimal: 20 min/review.
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="font-medium text-orange-800 mb-1">
                ⚠️ Burnout Prevention
              </p>
              <p className="text-sm text-orange-700">
                Take a longer break this Friday afternoon. Your stress
                indicators are slightly elevated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
