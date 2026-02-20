import { Link } from 'react-router';
import { Plus, Calendar, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react';

interface LeaveBalance {
  type: string;
  total: number;
  used: number;
  available: number;
  color: string;
}

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
}

export default function LeaveManagement() {
  const leaveBalances: LeaveBalance[] = [
    { type: 'Annual Leave', total: 20, used: 8, available: 12, color: 'blue' },
    { type: 'Sick Leave', total: 10, used: 2, available: 8, color: 'green' },
    { type: 'Casual Leave', total: 8, used: 3, available: 5, color: 'purple' },
    { type: 'Maternity Leave', total: 90, used: 0, available: 90, color: 'pink' },
  ];

  const recentRequests: LeaveRequest[] = [
    {
      id: '1',
      type: 'Annual Leave',
      startDate: '2026-02-15',
      endDate: '2026-02-17',
      days: 3,
      status: 'Pending',
      reason: 'Family vacation'
    },
    {
      id: '2',
      type: 'Sick Leave',
      startDate: '2026-02-03',
      endDate: '2026-02-03',
      days: 1,
      status: 'Approved',
      reason: 'Medical appointment'
    },
    {
      id: '3',
      type: 'Casual Leave',
      startDate: '2026-01-28',
      endDate: '2026-01-29',
      days: 2,
      status: 'Approved',
      reason: 'Personal work'
    },
  ];

  const upcomingHolidays = [
    { name: 'Independence Day', date: '2026-03-26', daysLeft: 47 },
    { name: 'Victory Day', date: '2026-12-16', daysLeft: 312 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      case 'Pending':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4" />;
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Leave Management</h1>
          <p className="text-gray-600 mt-1">Manage your leave requests and view balances</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/leave/holidays"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <Calendar className="w-5 h-5" />
            Holiday Calendar
          </Link>
          <Link
            to="/leave/apply"
            className="flex items-center gap-2 px-4 py-2 bg-[#1a5f3f] hover:bg-[#155233] text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Apply for Leave
          </Link>
        </div>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {leaveBalances.map((balance, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">{balance.type}</h3>
              <div className={`w-3 h-3 rounded-full bg-${balance.color}-500`}></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available</span>
                <span className="font-semibold text-[#1a5f3f]">{balance.available} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Used</span>
                <span className="font-medium text-gray-700">{balance.used} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total</span>
                <span className="font-medium text-gray-700">{balance.total} days</span>
              </div>
              {/* Progress Bar */}
              <div className="pt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-${balance.color}-500 h-2 rounded-full`}
                    style={{ width: `${(balance.used / balance.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-[#1a5f3f] to-[#2d8f5f] rounded-lg shadow-sm p-6 mb-6 text-white">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">AI Leave Insights</h3>
            <p className="text-white/90 mb-3">
              Based on your leave patterns and team workload, we recommend taking time off in early March. 
              Your team will have minimal impact during this period.
            </p>
            <div className="flex gap-6 text-sm">
              <div>
                <p className="text-white/70">Optimal Leave Period</p>
                <p className="font-medium">March 5-9, 2026</p>
              </div>
              <div>
                <p className="text-white/70">Team Impact</p>
                <p className="font-medium">Low</p>
              </div>
              <div>
                <p className="text-white/70">Approval Probability</p>
                <p className="font-medium">95%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leave Requests */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Recent Leave Requests</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentRequests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-800">{request.type}</h3>
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(request.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {request.startDate !== request.endDate && (
                          <> - {new Date(request.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</>
                        )}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {request.days} {request.days === 1 ? 'day' : 'days'}
                      </p>
                      <p className="text-gray-700 mt-2">{request.reason}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <Link to="/leave/apply" className="text-[#1a5f3f] hover:text-[#155233] text-sm font-medium">
              View All Requests →
            </Link>
          </div>
        </div>

        {/* Upcoming Holidays */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Upcoming Holidays</h2>
          </div>
          <div className="p-6 space-y-4">
            {upcomingHolidays.map((holiday, index) => (
              <div key={index} className="p-4 bg-[#1a5f3f]/5 rounded-lg border border-[#1a5f3f]/10">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{holiday.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(holiday.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-[#1a5f3f]">{holiday.daysLeft}</p>
                    <p className="text-xs text-gray-500">days left</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <Link 
              to="/leave/holidays" 
              className="text-[#1a5f3f] hover:text-[#155233] text-sm font-medium"
            >
              View Full Calendar →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/leave/apply"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#1a5f3f] hover:bg-[#1a5f3f]/5 transition-all text-center"
          >
            <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="font-medium text-gray-800">Apply for Leave</p>
            <p className="text-sm text-gray-500 mt-1">Submit a new leave request</p>
          </Link>
          <Link
            to="/leave/approval"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#1a5f3f] hover:bg-[#1a5f3f]/5 transition-all text-center"
          >
            <CheckCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="font-medium text-gray-800">Pending Approvals</p>
            <p className="text-sm text-gray-500 mt-1">Review team leave requests</p>
          </Link>
          <Link
            to="/leave/holidays"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#1a5f3f] hover:bg-[#1a5f3f]/5 transition-all text-center"
          >
            <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="font-medium text-gray-800">Holiday Calendar</p>
            <p className="text-sm text-gray-500 mt-1">View all company holidays</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
