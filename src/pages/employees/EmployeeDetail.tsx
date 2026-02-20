import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Edit2,
  FileText,
  Award,
  IdCard,
} from "lucide-react";

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock employee data
  const employee = {
    id: id,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    phone: "+1 (555) 123-4567",
    department: "Engineering",
    designation: "Senior Software Engineer",
    joiningDate: "2022-03-15",
    dateOfBirth: "1992-08-20",
    address: "123 Tech Street, San Francisco, CA 94105",
    employeeId: "EMP001",
    employmentType: "Full-time",
    reportingManager: "Michael Chen",
    status: "Active",
    avatar: "SJ",
    skills: ["React", "TypeScript", "Node.js", "Python", "AWS"],
    workHistory: [
      {
        company: "Tech Corp",
        position: "Software Engineer",
        period: "2019-2022",
      },
      {
        company: "StartUp Inc",
        position: "Junior Developer",
        period: "2017-2019",
      },
    ],
    documents: [
      { name: "National ID", uploaded: true, date: "2022-03-10" },
      { name: "Resume", uploaded: true, date: "2022-03-10" },
      { name: "Bachelor's Degree", uploaded: true, date: "2022-03-10" },
      { name: "Certification - AWS", uploaded: true, date: "2023-06-15" },
    ],
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/employees")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Employees
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-[#1a5f3f] flex items-center justify-center text-white text-2xl font-semibold">
                {employee.avatar}
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">
                  {employee.name}
                </h1>
                <p className="text-gray-600">{employee.designation}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    {employee.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    ID: {employee.employeeId}
                  </span>
                </div>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1a5f3f] hover:bg-[#155233] text-white rounded-lg transition-colors">
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-800">{employee.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-gray-800">{employee.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="text-gray-800">{employee.department}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Joining Date</p>
              <p className="text-gray-800">{employee.joiningDate}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
                <p className="text-gray-800">{employee.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Employment Type</p>
                <p className="text-gray-800">{employee.employmentType}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Address</p>
                <p className="text-gray-800">{employee.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Reporting Manager</p>
                <p className="text-gray-800">{employee.reportingManager}</p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Skills & Expertise
              </h2>
              <span className="text-xs bg-[#1a5f3f]/10 text-[#1a5f3f] px-2 py-1 rounded">
                AI Extracted
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {employee.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Work History */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Employment History
            </h2>
            <div className="space-y-4">
              {employee.workHistory.map((work, index) => (
                <div key={index} className="flex gap-4">
                  <div className="bg-[#1a5f3f] w-2 rounded-full"></div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium text-gray-800">{work.position}</p>
                    <p className="text-gray-600">{work.company}</p>
                    <p className="text-sm text-gray-500 mt-1">{work.period}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Documents */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Digital File Cabinet
            </h2>
            <div className="space-y-3">
              {employee.documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-[#1a5f3f] p-2 rounded">
                      {doc.name.includes("ID") ? (
                        <IdCard className="w-4 h-4 text-white" />
                      ) : doc.name.includes("Resume") ? (
                        <FileText className="w-4 h-4 text-white" />
                      ) : (
                        <Award className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Uploaded: {doc.date}
                      </p>
                    </div>
                  </div>
                  <button className="text-[#1a5f3f] hover:text-[#155233] text-sm">
                    View
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 px-4 py-2 border border-[#1a5f3f] text-[#1a5f3f] rounded-lg hover:bg-[#1a5f3f] hover:text-white transition-colors">
              Upload New Document
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Stats
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Attendance Rate</span>
                  <span className="text-sm font-medium text-gray-800">96%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#1a5f3f] h-2 rounded-full"
                    style={{ width: "96%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Leave Balance</span>
                  <span className="text-sm font-medium text-gray-800">
                    12 days
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
