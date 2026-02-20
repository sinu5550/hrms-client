import { Link } from 'react-router';
import { Plus, Clock, Target, TrendingUp, Calendar, AlertCircle, BarChart3 } from 'lucide-react';

interface TimesheetEntry {
  id: string;
  date: string;
  project: string;
  task: string;
  hours: number;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
}

export default function Timesheet() {
  const entries: TimesheetEntry[] = [
    {
      id: '1',
      date: '2026-02-07',
      project: 'HRMS Portal',
      task: 'Employee Module Development',
      hours: 8,
      status: 'Submitted'
    },
    {
      id: '2',
      date: '2026-02-06',
      project: 'HRMS Portal',
      task: 'Attendance System Integration',
      hours: 7.5,
      status: 'Approved'
    },
    {
      id: '3',
      date: '2026-02-05',
      project: 'Client Dashboard',
      task: 'UI Design Review',
      hours: 4,
      status: 'Approved'
    },
    {
      id: '4',
      date: '2026-02-05',
      project: 'HRMS Portal',
      task: 'Bug Fixes',
      hours: 4,
      status: 'Approved'
    },
  ];

  const stats = {
    weeklyHours: 45.5,
    monthlyHours: 156,
    productivity: 87,
    utilization: 92,
    pendingApprovals: 1,
  };

  const projects = [
    { name: 'HRMS Portal', hours: 35.5, percentage: 78 },
    { name: 'Client Dashboard', hours: 10, percentage: 22 },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Timesheet & Productivity</h1>
          <p className="text-gray-600 mt-1">Track time, manage tasks, and monitor productivity</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/timesheet/productivity"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            Productivity Report
          </Link>
          <Link
            to="/timesheet/entry"
            className="flex items-center gap-2 px-4 py-2 bg-[#1a5f3f] hover:bg-[#155233] text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Log Time
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">This Week</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">{stats.weeklyHours}h</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">This Month</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">{stats.monthlyHours}h</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Productivity</p>
              <p className="text-2xl font-semibold text-[#1a5f3f] mt-1">{stats.productivity}%</p>
            </div>
            <div className="bg-[#1a5f3f]/10 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-[#1a5f3f]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Utilization</p>
              <p className="text-2xl font-semibold text-purple-600 mt-1">{stats.utilization}%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-2xl font-semibold text-orange-600 mt-1">{stats.pendingApprovals}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* AI Productivity Insights */}
      <div className="bg-gradient-to-r from-[#1a5f3f] to-[#2d8f5f] rounded-lg shadow-sm p-6 mb-6 text-white">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">AI Productivity Analysis</h3>
            <p className="text-white/90 mb-3">
              Your productivity is 15% higher than team average. Most productive hours: 9 AM - 12 PM. 
              Burnout risk detected: Low. Recommended break: Take Friday afternoon off.
            </p>
            <div className="flex gap-6 text-sm">
              <div>
                <p className="text-white/70">Productivity Score</p>
                <p className="font-medium">87/100 (Excellent)</p>
              </div>
              <div>
                <p className="text-white/70">Task Completion</p>
                <p className="font-medium">Est. 2.5 hrs/task</p>
              </div>
              <div>
                <p className="text-white/70">Burnout Risk</p>
                <p className="font-medium">Low (18%)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Timesheet Entries */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Recent Time Entries</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {entries.map((entry) => (
              <div key={entry.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-800">{entry.project}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        entry.status === 'Approved' ? 'bg-green-100 text-green-700' :
                        entry.status === 'Submitted' ? 'bg-blue-100 text-blue-700' :
                        entry.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {entry.status}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{entry.task}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {entry.hours} hours
                      </span>
                    </div>
                  </div>
                  <button className="text-[#1a5f3f] hover:text-[#155233] text-sm font-medium">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Time Distribution */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Project Time Distribution</h3>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-700">{project.name}</span>
                    <span className="text-sm font-medium text-gray-800">{project.hours}h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#1a5f3f] h-2 rounded-full"
                      style={{ width: `${project.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Goal */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Weekly Goal</h3>
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#1a5f3f"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(stats.weeklyHours / 40) * 351.86} 351.86`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute">
                  <p className="text-2xl font-bold text-gray-800">{stats.weeklyHours}</p>
                  <p className="text-sm text-gray-600">/ 40 hrs</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                {(stats.weeklyHours / 40 * 100).toFixed(0)}% of weekly goal achieved
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-medium text-blue-800 mb-2">💡 Quick Tip</p>
            <p className="text-sm text-blue-700">
              Log your time daily to maintain accurate productivity metrics and project tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
