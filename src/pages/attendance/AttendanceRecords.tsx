import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Calendar, Download, Filter, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';

interface AttendanceRecord {
  date: string;
  checkIn: string;
  checkOut: string;
  workHours: string;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day';
  location: string;
}

export default function AttendanceRecords() {
  const [selectedMonth, setSelectedMonth] = useState('2026-02');

  const records: AttendanceRecord[] = [
    {
      date: '2026-02-07',
      checkIn: '09:00 AM',
      checkOut: '06:00 PM',
      workHours: '9h 0m',
      status: 'Present',
      location: 'Office - Verified'
    },
    {
      date: '2026-02-06',
      checkIn: '09:05 AM',
      checkOut: '06:10 PM',
      workHours: '9h 5m',
      status: 'Present',
      location: 'Office - Verified'
    },
    {
      date: '2026-02-05',
      checkIn: '09:30 AM',
      checkOut: '06:00 PM',
      workHours: '8h 30m',
      status: 'Late',
      location: 'Office - Verified'
    },
    {
      date: '2026-02-04',
      checkIn: '09:00 AM',
      checkOut: '06:05 PM',
      workHours: '9h 5m',
      status: 'Present',
      location: 'Office - Verified'
    },
    {
      date: '2026-02-03',
      checkIn: '-',
      checkOut: '-',
      workHours: '-',
      status: 'Absent',
      location: '-'
    },
    {
      date: '2026-02-01',
      checkIn: '09:00 AM',
      checkOut: '02:00 PM',
      workHours: '5h 0m',
      status: 'Half Day',
      location: 'Office - Verified'
    },
  ];

  const stats = {
    totalDays: 20,
    present: 18,
    absent: 1,
    late: 3,
    attendanceRate: 90,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present':
        return 'bg-green-100 text-green-700';
      case 'Absent':
        return 'bg-red-100 text-red-700';
      case 'Late':
        return 'bg-orange-100 text-orange-700';
      case 'Half Day':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/attendance"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Attendance
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">Attendance Records</h1>
            <p className="text-gray-600 mt-1">View your attendance history and patterns</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a5f3f] hover:bg-[#155233] text-white rounded-lg transition-colors">
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Days</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">{stats.totalDays}</p>
            </div>
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Present</p>
              <p className="text-2xl font-semibold text-green-600 mt-1">{stats.present}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Absent</p>
              <p className="text-2xl font-semibold text-red-600 mt-1">{stats.absent}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Late</p>
              <p className="text-2xl font-semibold text-orange-600 mt-1">{stats.late}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Attendance Rate</p>
              <p className="text-2xl font-semibold text-[#1a5f3f] mt-1">{stats.attendanceRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-[#1a5f3f]" />
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-[#1a5f3f] to-[#2d8f5f] rounded-lg shadow-sm p-6 mb-6 text-white">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">AI Attendance Analysis</h3>
            <p className="text-white/90 mb-3">
              Your attendance pattern shows consistent presence with 90% attendance rate. You tend to arrive on time 
              most days, with occasional delays on Mondays.
            </p>
            <div className="flex gap-4 text-sm">
              <div>
                <p className="text-white/70">Predicted Next Absence</p>
                <p className="font-medium">Feb 15, 2026 (Low confidence)</p>
              </div>
              <div>
                <p className="text-white/70">Most Productive Hours</p>
                <p className="font-medium">9:00 AM - 12:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
          </div>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:border-transparent"
          >
            <option value="2026-02">February 2026</option>
            <option value="2026-01">January 2026</option>
            <option value="2025-12">December 2025</option>
          </select>
          <button className="px-4 py-2 text-sm text-gray-700 hover:text-[#1a5f3f]">
            All Status
          </button>
          <button className="px-4 py-2 text-sm text-gray-700 hover:text-[#1a5f3f]">
            This Week
          </button>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Check In</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Check Out</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Work Hours</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {records.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {new Date(record.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{record.checkIn}</td>
                  <td className="px-6 py-4 text-gray-700">{record.checkOut}</td>
                  <td className="px-6 py-4 text-gray-700">{record.workHours}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{record.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">Showing {records.length} records</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm">
              Previous
            </button>
            <button className="px-3 py-1 bg-[#1a5f3f] text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Correction Request */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Need to correct an attendance record?</h3>
        <p className="text-gray-600 mb-4">
          If you notice any discrepancies in your attendance records, you can submit a correction request.
        </p>
        <button className="px-4 py-2 border border-[#1a5f3f] text-[#1a5f3f] rounded-lg hover:bg-[#1a5f3f] hover:text-white transition-colors">
          Submit Correction Request
        </button>
      </div>
    </div>
  );
}
