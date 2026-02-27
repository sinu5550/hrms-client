import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import {
  Upload,
  Eye,
  EyeOff,
  FileText,
  Award,
  Home,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "sonner";

interface Department {
  id: string;
  name: string;
}

interface Designation {
  id: string;
  name: string;
  departmentId: string;
}

export default function EmployeeCreate() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [nextEmpId, setNextEmpId] = useState("EMP-0001");

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>("");
  const [resume, setResume] = useState<File | null>(null);
  const [certificates, setCertificates] = useState<FileList | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    employeeId: "",
    joiningDate: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    company: "",
    departmentId: "",
    designationId: "",
    about: "",
    // Personal Fields
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    nationality: "",
    identificationNo: "",
    ssnNo: "",
    passportNo: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    privateAddress: "",
    dependentChildren: "0",
    placeOfBirth: "",
    visaNo: "",
    workPermitNo: "",
    privateEmail: "",
    privatePhone: "",
    bankAccounts: "",
    certificateLevel: "",
    fieldOfStudy: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [depts, desigs, users] = await Promise.all([
          api.get("/departments"),
          api.get("/designations"),
          api.get("/users"),
        ]);
        setDepartments(depts || []);
        setDesignations(desigs || []);

        // Calculate next EMP ID properly from backend data
        const empUsers =
          users?.filter((u: any) => u.employeeId?.startsWith("EMP-")) || [];
        if (empUsers.length > 0) {
          const lastEmp = empUsers.sort((a: any, b: any) => {
            const numA = parseInt(a.employeeId.replace("EMP-", ""), 10);
            const numB = parseInt(b.employeeId.replace("EMP-", ""), 10);
            return numB - numA;
          })[0];

          if (lastEmp && lastEmp.employeeId) {
            const num = parseInt(lastEmp.employeeId.replace("EMP-", ""), 10);
            setNextEmpId(`EMP-${String(num + 1).padStart(4, "0")}`);
          }
        }
      } catch (error) {
        console.error("Failed to fetch form data", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      setProfilePhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setIsLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });
      data.append("role", "EMPLOYEE");
      data.append("employeeId", nextEmpId); // Use the calculated ID

      if (profilePhoto) data.append("profilePhoto", profilePhoto);
      if (resume) data.append("resume", resume);
      if (certificates) {
        Array.from(certificates).forEach((file) => {
          data.append("certificates", file);
        });
      }

      await api.post("/users", data, { isFormData: true });
      toast.success("Employee created successfully");
      navigate("/employees");
    } catch (error: any) {
      toast.error(error.message || "Failed to create employee");
    } finally {
      setIsLoading(false);
    }
  };

  const nextTab = () => {
    const currentIndex = tabs.findIndex((t) => t.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const prevTab = () => {
    const currentIndex = tabs.findIndex((t) => t.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic" },
    { id: "personal", label: "Personal" },
    { id: "documents", label: "Documents" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between text-gray-800">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Add New Employee
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
              Employees
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#1a5f3f] font-medium">Add New</span>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-2 rounded-lg border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">
            Employee ID :{" "}
            <span className="text-[#1a5f3f] font-bold">{nextEmpId}</span>
          </p>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex gap-8 px-8 border-b border-gray-100 bg-gray-50/30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 pt-6 px-2 font-bold transition-colors relative whitespace-nowrap text-sm uppercase tracking-wider ${
                activeTab === tab.id
                  ? "text-[#1a5f3f]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label} Information
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#1a5f3f] rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {activeTab === "basic" && (
            <div className="space-y-8">
              {/* Profile Image Section */}
              <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 flex items-center gap-8 shadow-sm">
                <div className="relative w-28 h-28 bg-white border-4 border-white rounded-2xl shadow-md flex items-center justify-center text-[#1a5f3f] overflow-hidden group">
                  {profilePhotoPreview ? (
                    <img
                      src={profilePhotoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload className="w-8 h-8 opacity-20" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    Upload Profile Photo
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Allowed JPG, GIF or PNG. Max size of 4MB
                  </p>
                  <div className="flex gap-3">
                    <label className="px-6 py-2 bg-[#1a5f3f] text-white rounded-lg hover:bg-[#155233] transition-colors font-bold text-sm cursor-pointer shadow-sm">
                      Choose Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setProfilePhoto(null);
                        setProfilePhotoPreview("");
                      }}
                      className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-bold text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <InputGroup
                  label="First Name"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="e.g. John"
                />
                <InputGroup
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="e.g. Doe"
                />
                <InputGroup
                  label="Username"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="johndoe"
                />
                <InputGroup
                  label="Email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                />

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide text-xs">
                    Password (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide text-xs">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <InputGroup
                  label="Joining Date"
                  name="joiningDate"
                  type="date"
                  required
                  value={formData.joiningDate}
                  onChange={handleInputChange}
                />
                <InputGroup
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                />

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide text-xs">
                    Department
                  </label>
                  <select
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] bg-white"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide text-xs">
                    Designation
                  </label>
                  <select
                    name="designationId"
                    value={formData.designationId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] bg-white"
                  >
                    <option value="">Select Designation</option>
                    {designations
                      .filter(
                        (d) =>
                          !formData.departmentId ||
                          d.departmentId === formData.departmentId,
                      )
                      .map((desig) => (
                        <option key={desig.id} value={desig.id}>
                          {desig.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide text-xs">
                    Professional Summary
                  </label>
                  <textarea
                    name="about"
                    rows={4}
                    value={formData.about}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] resize-none"
                    placeholder="Enter employee background and skills..."
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "personal" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputGroup
                label="Birth Date"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
              />
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide text-xs">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] bg-white"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide text-xs">
                  Nationality
                </label>
                <input
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f]"
                />
              </div>
              <InputGroup
                label="Personal Email"
                name="privateEmail"
                type="email"
                value={formData.privateEmail}
                onChange={handleInputChange}
              />
              <InputGroup
                label="Identification No"
                name="identificationNo"
                value={formData.identificationNo}
                onChange={handleInputChange}
              />
              <InputGroup
                label="Passport No"
                name="passportNo"
                value={formData.passportNo}
                onChange={handleInputChange}
              />
              <div className="md:col-span-2">
                <InputGroup
                  label="Current Address"
                  name="privateAddress"
                  value={formData.privateAddress}
                  onChange={handleInputChange}
                />
              </div>
              <InputGroup
                label="Emergency Contact"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleInputChange}
              />
            </div>
          )}

          {activeTab === "documents" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center text-center">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                  <FileText className="w-10 h-10 text-[#1a5f3f]" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Resume / CV</h4>
                <p className="text-sm text-gray-500 mb-6 font-medium">
                  Upload PDF, DOC or DOCX (Max 5MB)
                </p>
                <label className="px-6 py-2.5 bg-[#1a5f3f] text-white rounded-lg hover:bg-[#155233] cursor-pointer font-bold text-sm">
                  Select File
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResume(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
                {resume && (
                  <p className="mt-4 text-xs font-bold text-[#1a5f3f]">
                    {resume.name}
                  </p>
                )}
              </div>

              <div className="p-8 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center text-center">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                  <Award className="w-10 h-10 text-[#1a5f3f]" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Certifications</h4>
                <p className="text-sm text-gray-500 mb-6 font-medium">
                  Upload multiple JPG, PNG or PDF
                </p>
                <label className="px-6 py-2.5 bg-[#1a5f3f] border border-[#1a5f3f] text-white rounded-lg hover:bg-[#155233] cursor-pointer font-bold text-sm">
                  Choose Files
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setCertificates(e.target.files)}
                    className="hidden"
                  />
                </label>
                {certificates && (
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {Array.from(certificates).map((f, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-white border border-gray-100 rounded text-[10px] font-bold text-gray-600 shadow-sm"
                      >
                        {f.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
            <div>
              {activeTab !== "basic" && (
                <button
                  type="button"
                  onClick={prevTab}
                  className="px-8 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-bold text-sm shadow-sm flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/employees")}
                className="px-8 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-bold text-sm shadow-sm"
              >
                Cancel
              </button>
              {activeTab !== "documents" ? (
                <button
                  type="button"
                  onClick={nextTab}
                  className="px-8 py-2.5 bg-[#1a5f3f] text-white rounded-lg hover:bg-[#155233] transition-colors font-bold text-sm shadow-sm flex items-center gap-2"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-2.5 bg-[#1a5f3f] text-white rounded-lg hover:bg-[#155233] transition-colors font-bold text-sm shadow-sm flex items-center gap-2"
                >
                  {isLoading ? "Saving..." : "Create Employee"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputGroup({
  label,
  name,
  type = "text",
  required = false,
  value,
  onChange,
  placeholder,
}: any) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide text-xs">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] transition-all"
      />
    </div>
  );
}
