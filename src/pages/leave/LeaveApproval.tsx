import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  FileText,
} from "lucide-react";

interface LeaveRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  appliedDate: string;
  status: "Pending" | "Approved" | "Rejected";
  avatar: string;
}

export default function LeaveApproval() {
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("pending");

  const [requests, setRequests] = useState<LeaveRequest[]>([
    {
      id: "1",
      employeeName: "Sarah Johnson",
      employeeId: "EMP001",
      leaveType: "Annual Leave",
      startDate: "2026-02-15",
      endDate: "2026-02-17",
      days: 3,
      reason:
        "Family vacation planned for the long weekend. Will complete all pending tasks before leaving.",
      appliedDate: "2026-02-05",
      status: "Pending",
      avatar: "SJ",
    },
    {
      id: "2",
      employeeName: "Michael Chen",
      employeeId: "EMP002",
      leaveType: "Sick Leave",
      startDate: "2026-02-10",
      endDate: "2026-02-11",
      days: 2,
      reason: "Medical appointment and recovery time needed.",
      appliedDate: "2026-02-08",
      status: "Pending",
      avatar: "MC",
    },
    {
      id: "3",
      employeeName: "Emma Wilson",
      employeeId: "EMP003",
      leaveType: "Casual Leave",
      startDate: "2026-02-20",
      endDate: "2026-02-20",
      days: 1,
      reason: "Personal work that cannot be rescheduled.",
      appliedDate: "2026-02-06",
      status: "Pending",
      avatar: "EW",
    },
    {
      id: "4",
      employeeName: "James Brown",
      employeeId: "EMP004",
      leaveType: "Annual Leave",
      startDate: "2026-01-28",
      endDate: "2026-01-30",
      days: 3,
      reason: "Attending a family function out of town.",
      appliedDate: "2026-01-20",
      status: "Approved",
      avatar: "JB",
    },
  ]);

  const handleApprove = (id: string) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: "Approved" as const } : req,
      ),
    );
  };

  const handleReject = (id: string) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: "Rejected" as const } : req,
      ),
    );
  };

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter((req) => req.status.toLowerCase() === filter);

  const pendingCount = requests.filter((r) => r.status === "Pending").length;
  const approvedCount = requests.filter((r) => r.status === "Approved").length;
  const rejectedCount = requests.filter((r) => r.status === "Rejected").length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/leave"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Leave Management
        </Link>
        <h1 className="text-3xl font-semibold text-gray-800">
          Leave Approvals
        </h1>
        <p className="text-gray-600 mt-1">
          Review and approve team leave requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Requests</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">
                {requests.length}
              </p>
            </div>
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-2xl font-semibold text-orange-600 mt-1">
                {pendingCount}
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Approved</p>
              <p className="text-2xl font-semibold text-green-600 mt-1">
                {approvedCount}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Rejected</p>
              <p className="text-2xl font-semibold text-red-600 mt-1">
                {rejectedCount}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-3 font-medium transition-colors ${
              filter === "all"
                ? "text-[#1a5f3f] border-b-2 border-[#1a5f3f]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            All Requests ({requests.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-6 py-3 font-medium transition-colors ${
              filter === "pending"
                ? "text-[#1a5f3f] border-b-2 border-[#1a5f3f]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-6 py-3 font-medium transition-colors ${
              filter === "approved"
                ? "text-[#1a5f3f] border-b-2 border-[#1a5f3f]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-6 py-3 font-medium transition-colors ${
              filter === "rejected"
                ? "text-[#1a5f3f] border-b-2 border-[#1a5f3f]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Rejected ({rejectedCount})
          </button>
        </div>
      </div>

      {/* Leave Requests */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between">
              {/* Employee Info */}
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-[#1a5f3f] flex items-center justify-center text-white font-semibold">
                  {request.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {request.employeeName}
                    </h3>
                    <span className="text-sm text-gray-500">
                      ({request.employeeId})
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        request.status === "Pending"
                          ? "bg-orange-100 text-orange-700"
                          : request.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="w-4 h-4" />
                      <span className="font-medium">{request.leaveType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(request.startDate).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" },
                        )}
                        {" - "}
                        {new Date(request.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="font-medium">
                        ({request.days} {request.days === 1 ? "day" : "days"})
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Reason:
                    </p>
                    <p className="text-gray-800">{request.reason}</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    Applied on{" "}
                    {new Date(request.appliedDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {request.status === "Pending" && (
                <div className="flex gap-3 ml-4">
                  <button
                    onClick={() => handleReject(request.id)}
                    className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="px-4 py-2 bg-[#1a5f3f] hover:bg-[#155233] text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              No {filter !== "all" ? filter : ""} leave requests found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
