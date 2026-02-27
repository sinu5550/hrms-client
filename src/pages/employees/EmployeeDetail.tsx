import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Edit2,
  FileText,
  Award,
  IdCard,
  Upload,
  Globe,
  MapPin,
  Clock,
  Shield,
  Download,
  Home,
  ChevronRight,
  Plus,
  X,
} from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";

export default function EmployeeDetail() {
  const { id } = useParams();
  const {
    employees: globalEmployees,
    departments: globalDepartments,
    designations: globalDesignations,
    isLoading: globalLoading,
  } = useData();
  const [employee, setEmployee] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("work");
  const [isLoading, setIsLoading] = useState(globalLoading);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [departments, setDepartments] = useState<any[]>(globalDepartments);
  const [designations, setDesignations] = useState<any[]>(globalDesignations);

  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const foundEmp = globalEmployees.find((e) => e.id === id);
    if (foundEmp) {
      setEmployee(foundEmp);
      setFormData(foundEmp);
      // Resilience check: if salaries are missing from cached object, fetch full profile
      if (!foundEmp.salaries && !globalLoading) {
        fetchEmployee();
      }
      setIsLoading(false);
    } else if (!globalLoading) {
      fetchEmployee();
    }

    setDepartments(globalDepartments);
    setDesignations(globalDesignations);
    setIsLoading(globalLoading && !foundEmp);
  }, [
    id,
    globalEmployees,
    globalLoading,
    globalDepartments,
    globalDesignations,
  ]);

  const fetchEmployee = async () => {
    try {
      setIsLoading(true);
      const data = await api.get(`/users/${id}`);
      setEmployee(data);
      setFormData(data);
    } catch (error) {
      toast.error("Failed to fetch employee details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (updateData: any, isFile = false) => {
    try {
      const resp = await api.put(`/users/${id}`, updateData, {
        isFormData: isFile,
      });
      setEmployee(resp.user);
      toast.success("Profile updated successfully");
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Update failed");
    }
  };

  const onPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("profilePhoto", file);
      setUploadLoading(true);
      await handleUpdate(formData, true);
      setUploadLoading(false);
    }
  };

  const onResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("resume", file);
      await handleUpdate(formData, true);
    }
  };

  const onCertificateUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append("certificates", f));
      await handleUpdate(formData, true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = { ...formData };
    // Remove complex objects before sending
    delete dataToSend.department;
    delete dataToSend.designation;
    delete dataToSend.salaries;
    delete dataToSend.certificates;
    handleUpdate(dataToSend);
  };

  if (isLoading)
    return (
      <div className="p-8 text-center text-gray-500">Loading profile...</div>
    );
  if (!employee)
    return (
      <div className="p-8 text-center text-red-500">Employee not found</div>
    );

  const tabs = [
    { id: "work", label: "Work", icon: Briefcase },
    { id: "resume", label: "Resume", icon: FileText },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "personal", label: "Personal", icon: IdCard },
    { id: "payroll", label: "Payroll", icon: Clock },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Employee Profile
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
            <Link to="/" className="hover:text-[#1a5f3f] transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              to="/employees"
              className="hover:text-[#1a5f3f] transition-colors"
            >
              Employee
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#1a5f3f] font-medium">Profile</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setFormData(employee);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-2 bg-[#1a5f3f] text-white rounded-lg hover:bg-[#155233] transition-colors shadow-sm font-semibold"
          >
            <Edit2 className="w-4 h-4" /> Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="h-32 bg-[#1a5f3f]/5 border-b border-gray-100" />
        <div className="px-8 pb-8 -mt-12">
          <div className="flex flex-col md:flex-row items-end gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl bg-white border-4 border-white shadow-md overflow-hidden flex items-center justify-center text-[#1a5f3f] text-4xl font-bold bg-gray-50">
                {employee.profilePhotoUrl ? (
                  <img
                    src={employee.profilePhotoUrl}
                    alt={employee.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  employee.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("") || "?"
                )}
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Upload className="w-8 h-8 text-white" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={onPhotoUpload}
                    accept="image/*"
                  />
                </label>
                {uploadLoading && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <Clock className="w-8 h-8 text-[#1a5f3f] animate-spin" />
                  </div>
                )}
              </div>
            </div>
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {employee.name}
              </h1>
              <p className="text-gray-500 flex items-center gap-2 mt-1 font-medium">
                <span className="text-[#1a5f3f]">{employee.employeeId}</span> •{" "}
                {employee.designation?.name || "Unassigned"}
              </p>
              <div className="flex flex-wrap gap-4 mt-3">
                <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 font-medium">
                  <Mail className="w-3.5 h-3.5" /> {employee.email}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 font-medium">
                  <Phone className="w-3.5 h-3.5" /> {employee.phone}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 font-medium">
                  <Briefcase className="w-3.5 h-3.5" />{" "}
                  {employee.department?.name || "Unassigned"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Tab Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-2 shadow-sm space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-[#1a5f3f] text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm min-h-[500px] overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 capitalize">
                {activeTab} Information
              </h2>
              {activeTab === "resume" && (
                <label className="flex items-center gap-2 px-4 py-2 bg-[#1a5f3f]/10 text-[#1a5f3f] rounded-lg hover:bg-[#1a5f3f]/20 transition-colors font-bold cursor-pointer text-sm">
                  <Upload className="w-4 h-4" /> Upload CV
                  <input
                    type="file"
                    className="hidden"
                    onChange={onResumeUpload}
                    accept=".pdf,.doc,.docx"
                  />
                </label>
              )}
              {activeTab === "certifications" && (
                <label className="flex items-center gap-2 px-4 py-2 bg-[#1a5f3f]/10 text-[#1a5f3f] rounded-lg hover:bg-[#1a5f3f]/20 transition-colors font-bold cursor-pointer text-sm">
                  <Plus className="w-4 h-4" /> Add Certificate
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={onCertificateUpload}
                  />
                </label>
              )}
            </div>

            <div className="p-8">
              {activeTab === "work" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <DetailGroup
                    label="Employee ID"
                    value={employee.employeeId}
                    icon={IdCard}
                  />
                  <DetailGroup
                    label="Joining Date"
                    value={
                      employee.joiningDate
                        ? new Date(employee.joiningDate).toLocaleDateString()
                        : "Not Set"
                    }
                    icon={Calendar}
                  />
                  <DetailGroup
                    label="Department"
                    value={employee.department?.name || "Unassigned"}
                    icon={Briefcase}
                  />
                  <DetailGroup
                    label="Designation"
                    value={employee.designation?.name || "Unassigned"}
                    icon={Briefcase}
                  />
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                      About Me
                    </label>
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                      {employee.about || "No professional summary added yet."}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "resume" && (
                <div className="space-y-6">
                  {employee.resumeUrl ? (
                    <div className="p-6 border border-gray-200 rounded-xl flex items-center justify-between group hover:border-[#1a5f3f] hover:bg-gray-50/50 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="bg-red-50 p-4 rounded-xl">
                          <FileText className="w-8 h-8 text-red-500" />
                        </div>
                        <div>
                          <p className="font-bold text-lg text-gray-900">
                            Curriculum_Vitae.pdf
                          </p>
                          <p className="text-sm text-gray-400">
                            Professional CV Document • Verified
                          </p>
                        </div>
                      </div>
                      <a
                        href={employee.resumeUrl}
                        target="_blank"
                        className="p-3 bg-gray-100 rounded-xl text-gray-500 hover:bg-[#1a5f3f] hover:text-white transition-all shadow-sm"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium whitespace-pre-wrap">
                        No resume uploaded yet.\nPlease upload your CV in PDF or
                        DOC format.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "certifications" && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                          Certificate Name
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {employee.certificates &&
                      employee.certificates.length > 0 ? (
                        employee.certificates.map((cert: any) => (
                          <tr
                            key={cert.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <Award className="w-5 h-5 text-[#1a5f3f]" />
                                <span className="font-semibold text-gray-700">
                                  {cert.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <a
                                href={cert.url}
                                target="_blank"
                                className="p-2 text-gray-400 hover:text-[#1a5f3f] inline-block"
                              >
                                <Download className="w-5 h-5" />
                              </a>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={2}
                            className="px-6 py-12 text-center text-gray-500"
                          >
                            No certificates found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "personal" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <DetailGroup
                    label="Date of Birth"
                    value={
                      employee.dateOfBirth
                        ? new Date(employee.dateOfBirth).toLocaleDateString()
                        : "N/A"
                    }
                    icon={Calendar}
                  />
                  <DetailGroup
                    label="Gender"
                    value={employee.gender}
                    icon={IdCard}
                  />
                  <DetailGroup
                    label="Marital Status"
                    value={employee.maritalStatus}
                    icon={Shield}
                  />
                  <DetailGroup
                    label="Nationality"
                    value={employee.nationality}
                    icon={Globe}
                  />
                  <DetailGroup
                    label="Identification No"
                    value={employee.identificationNo}
                  />
                  <DetailGroup
                    label="Passport No"
                    value={employee.passportNo}
                  />
                  <DetailGroup label="SSN No" value={employee.ssnNo} />
                  <DetailGroup
                    label="Emergency Contact"
                    value={
                      employee.emergencyContactName
                        ? `${employee.emergencyContactName} (${employee.emergencyContactPhone})`
                        : "N/A"
                    }
                    icon={Phone}
                  />
                  <div className="md:col-span-2">
                    <DetailGroup
                      label="Private Address"
                      value={employee.privateAddress}
                      icon={MapPin}
                    />
                  </div>
                  <DetailGroup
                    label="Bank Accounts"
                    value={employee.bankAccounts}
                  />
                  <DetailGroup
                    label="Place of Birth"
                    value={employee.placeOfBirth}
                  />
                </div>
              )}

              {activeTab === "payroll" && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-6 bg-gray-50 border-b border-gray-200">
                    <h3 className="font-bold text-gray-800">Salary History</h3>
                  </div>
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                          Month
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                          Net Salary
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {employee.salaries && employee.salaries.length > 0 ? (
                        employee.salaries.map((sal: any) => (
                          <tr
                            key={sal.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                              {sal.month} {sal.year}
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-[#1a5f3f]">
                              ${sal.netSalary.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Link
                                to={`/payroll/payslip/${employee.id}`}
                                className="p-2 text-[#1a5f3f] hover:underline text-sm font-bold"
                              >
                                View Slip
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-6 py-8 text-center text-gray-500"
                          >
                            No salary history available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl animate-in fade-in zoom-in duration-200 my-8">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-xl z-20">
              <h3 className="text-xl font-bold text-gray-800">
                Edit Employee Profile
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Basic Info */}
                <div className="lg:col-span-3">
                  <h4 className="text-sm font-bold text-[#1a5f3f] uppercase tracking-wider mb-4 border-b pb-2">
                    Basic Information
                  </h4>
                </div>
                <InputGroup
                  label="Full Name"
                  value={formData.name}
                  onChange={(val) => setFormData({ ...formData, name: val })}
                />
                <InputGroup
                  label="Email"
                  value={formData.email}
                  onChange={(val) => setFormData({ ...formData, email: val })}
                />
                <InputGroup
                  label="Phone"
                  value={formData.phone}
                  onChange={(val) => setFormData({ ...formData, phone: val })}
                />

                <div className="lg:col-span-3 mt-4">
                  <h4 className="text-sm font-bold text-[#1a5f3f] uppercase tracking-wider mb-4 border-b pb-2">
                    Employment Details
                  </h4>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">
                    Department
                  </label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) =>
                      setFormData({ ...formData, departmentId: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] text-sm font-medium"
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">
                    Designation
                  </label>
                  <select
                    value={formData.designationId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        designationId: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] text-sm font-medium"
                  >
                    <option value="">Select Designation</option>
                    {designations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <InputGroup
                  label="Joining Date"
                  type="date"
                  value={formData.joiningDate?.split("T")[0]}
                  onChange={(val) =>
                    setFormData({ ...formData, joiningDate: val })
                  }
                />

                <div className="lg:col-span-3 mt-4">
                  <h4 className="text-sm font-bold text-[#1a5f3f] uppercase tracking-wider mb-4 border-b pb-2">
                    Personal Details
                  </h4>
                </div>
                <InputGroup
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth?.split("T")[0]}
                  onChange={(val) =>
                    setFormData({ ...formData, dateOfBirth: val })
                  }
                />
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] text-sm font-medium"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <InputGroup
                  label="Nationality"
                  value={formData.nationality}
                  onChange={(val) =>
                    setFormData({ ...formData, nationality: val })
                  }
                />
                <InputGroup
                  label="Identification No"
                  value={formData.identificationNo}
                  onChange={(val) =>
                    setFormData({ ...formData, identificationNo: val })
                  }
                />
                <InputGroup
                  label="Passport No"
                  value={formData.passportNo}
                  onChange={(val) =>
                    setFormData({ ...formData, passportNo: val })
                  }
                />
                <InputGroup
                  label="SSN No"
                  value={formData.ssnNo}
                  onChange={(val) => setFormData({ ...formData, ssnNo: val })}
                />

                <div className="lg:col-span-3 mt-4">
                  <h4 className="text-sm font-bold text-[#1a5f3f] uppercase tracking-wider mb-4 border-b pb-2">
                    Contact & Bio
                  </h4>
                </div>
                <InputGroup
                  label="Emergency Contact Person"
                  value={formData.emergencyContactName}
                  onChange={(val) =>
                    setFormData({ ...formData, emergencyContactName: val })
                  }
                />
                <InputGroup
                  label="Emergency Contact Phone"
                  value={formData.emergencyContactPhone}
                  onChange={(val) =>
                    setFormData({ ...formData, emergencyContactPhone: val })
                  }
                />
                <div className="lg:col-span-3">
                  <InputGroup
                    label="Address"
                    value={formData.privateAddress}
                    onChange={(val) =>
                      setFormData({ ...formData, privateAddress: val })
                    }
                  />
                </div>
                <div className="lg:col-span-3">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">
                    About / Bio
                  </label>
                  <textarea
                    value={formData.about}
                    onChange={(e) =>
                      setFormData({ ...formData, about: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] text-sm font-medium"
                    placeholder="Brief professional summary..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-8 mt-8 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-[#1a5f3f] text-white rounded-lg hover:bg-[#155233] transition-colors font-bold text-sm shadow-lg shadow-green-900/10"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function InputGroup({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: any;
  onChange: (val: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] text-sm font-medium"
      />
    </div>
  );
}

function DetailGroup({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: string;
  icon?: any;
}) {
  return (
    <div className="flex gap-4 group">
      <div className="bg-gray-100 p-2.5 rounded-lg h-fit group-hover:bg-[#1a5f3f]/10 transition-colors">
        {Icon ? (
          <Icon className="w-5 h-5 text-gray-400 group-hover:text-[#1a5f3f]" />
        ) : (
          <IdCard className="w-5 h-5 text-gray-400 group-hover:text-[#1a5f3f]" />
        )}
      </div>
      <div>
        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
          {label}
        </label>
        <p
          className="text-lg font-bold text-gray-900 truncate max-w-[200px]"
          title={value}
        >
          {value || "---"}
        </p>
      </div>
    </div>
  );
}
