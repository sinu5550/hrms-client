import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { ArrowLeft, Calendar, AlertCircle, Sparkles } from "lucide-react";

export default function LeaveApplication() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    halfDay: false,
    emergencyContact: "",
  });

  const [leaveDays, setLeaveDays] = useState(0);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);

  const leaveTypes = [
    { value: "annual", label: "Annual Leave", balance: 12 },
    { value: "sick", label: "Sick Leave", balance: 8 },
    { value: "casual", label: "Casual Leave", balance: 5 },
    { value: "maternity", label: "Maternity Leave", balance: 90 },
    { value: "paternity", label: "Paternity Leave", balance: 10 },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });

    // Calculate leave days when dates change
    if (name === "startDate" || name === "endDate") {
      calculateLeaveDays(
        name === "startDate" ? value : formData.startDate,
        name === "endDate" ? value : formData.endDate,
      );
    }

    // Trigger AI analysis when dates are set
    if (
      (name === "endDate" && formData.startDate && value) ||
      (name === "startDate" && formData.endDate && value)
    ) {
      setTimeout(() => {
        analyzeLeaveImpact(formData.startDate, formData.endDate);
      }, 500);
    }
  };

  const calculateLeaveDays = (start: string, end: string) => {
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setLeaveDays(diffDays);
    }
  };

  const analyzeLeaveImpact = (_start: string, _end: string) => {
    // Simulate AI analysis
    const approvalProbability = Math.floor(Math.random() * 30) + 70; // 70-100%
    const teamImpact =
      approvalProbability > 85
        ? "Low"
        : approvalProbability > 70
          ? "Medium"
          : "High";

    setAiSuggestion({
      approvalProbability,
      teamImpact,
      recommendation:
        approvalProbability > 85
          ? "This is a good time to take leave. Minimal team impact expected."
          : "Consider coordinating with your team before finalizing these dates.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    navigate("/leave");
  };

  const selectedLeaveType = leaveTypes.find(
    (lt) => lt.value === formData.leaveType,
  );

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
          Apply for Leave
        </h1>
        <p className="text-gray-600 mt-1">Submit a new leave request</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="space-y-6">
              {/* Leave Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:border-transparent"
                >
                  <option value="">Select Leave Type</option>
                  {leaveTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label} ({type.balance} days available)
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    min={
                      formData.startDate ||
                      new Date().toISOString().split("T")[0]
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Leave Days Display */}
              {leaveDays > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    <span className="font-semibold">{leaveDays}</span>{" "}
                    {leaveDays === 1 ? "day" : "days"} of leave requested
                  </p>
                </div>
              )}

              {/* Half Day Option */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="halfDay"
                  name="halfDay"
                  checked={formData.halfDay}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#1a5f3f] border-gray-300 rounded focus:ring-[#1a5f3f]"
                />
                <label
                  htmlFor="halfDay"
                  className="text-sm font-medium text-gray-700"
                >
                  This is a half-day leave
                </label>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Leave <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Please provide a brief reason for your leave request..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:border-transparent"
                />
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact (Optional)
                </label>
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:border-transparent"
                />
              </div>

              {/* Important Notice */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-orange-800">
                  <p className="font-medium mb-1">Important Information</p>
                  <ul className="list-disc ml-4 space-y-1">
                    <li>
                      Leave requests should be submitted at least 3 days in
                      advance
                    </li>
                    <li>
                      Approval is subject to team workload and manager
                      discretion
                    </li>
                    <li>
                      You will receive a notification once your request is
                      processed
                    </li>
                  </ul>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/leave")}
                  className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-[#1a5f3f] hover:bg-[#155233] text-white rounded-lg transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Suggestion */}
          {aiSuggestion && (
            <div className="bg-gradient-to-r from-[#1a5f3f] to-[#2d8f5f] rounded-lg shadow-sm p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-semibold">AI Analysis</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-white/70 text-sm">Approval Probability</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-white/20 rounded-full h-2">
                      <div
                        className="bg-white h-2 rounded-full"
                        style={{
                          width: `${aiSuggestion.approvalProbability}%`,
                        }}
                      ></div>
                    </div>
                    <span className="font-semibold">
                      {aiSuggestion.approvalProbability}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Team Impact</p>
                  <p className="font-semibold mt-1">
                    {aiSuggestion.teamImpact}
                  </p>
                </div>
                <div className="pt-3 border-t border-white/20">
                  <p className="text-sm text-white/90">
                    {aiSuggestion.recommendation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Leave Balance */}
          {selectedLeaveType && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Leave Balance
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Available</span>
                  <span className="font-semibold text-[#1a5f3f]">
                    {selectedLeaveType.balance} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Requesting</span>
                  <span className="font-semibold text-gray-800">
                    {leaveDays || 0} days
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-gray-600">Remaining</span>
                  <span className="font-semibold text-gray-800">
                    {selectedLeaveType.balance - (leaveDays || 0)} days
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Holidays */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-800">Upcoming Holidays</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">Independence Day</p>
                <p className="text-sm text-gray-600">March 26, 2026</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">Victory Day</p>
                <p className="text-sm text-gray-600">December 16, 2026</p>
              </div>
            </div>
            <Link
              to="/leave/holidays"
              className="block mt-4 text-[#1a5f3f] hover:text-[#155233] text-sm font-medium"
            >
              View Full Calendar →
            </Link>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-medium text-blue-800 mb-2">
              💡 Tips for Leave Requests
            </p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Plan around project deadlines</li>
              <li>• Inform your team in advance</li>
              <li>• Check holiday calendar first</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
