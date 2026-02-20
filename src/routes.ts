import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import EmployeeList from "./pages/employees/EmployeeList";
import EmployeeCreate from "./pages/employees/EmployeeCreate";
import EmployeeDetail from "./pages/employees/EmployeeDetail";
import Attendance from "./pages/attendance/Attendance";
import AttendanceRecords from "./pages/attendance/AttendanceRecords";
import LeaveManagement from "./pages/leave/LeaveManagement";
import LeaveApplication from "./pages/leave/LeaveApplication";
import LeaveApproval from "./pages/leave/LeaveApproval";
import HolidayCalendar from "./pages/leave/HolidayCalendar";
import MealExpense from "./pages/meal/MealExpense";
import MealEntry from "./pages/meal/MealEntry";
import ExpenseTracker from "./pages/meal/ExpenseTracker";
import Payroll from "./pages/payroll/Payroll";
import PayrollProcessing from "./pages/payroll/PayrollProcessing";
import SalaryStructure from "./pages/payroll/SalaryStructure";
import Payslip from "./pages/payroll/Payslip";
import Timesheet from "./pages/timesheet/Timesheet";
import TimesheetEntry from "./pages/timesheet/TimesheetEntry";
import ProductivityReports from "./pages/timesheet/ProductivityReports";
import Projects from "./pages/Projects";
import Finance from "./pages/Finance";
import Reports from "./pages/Reports";
import AIAssistant from "./pages/AIAssistant";
import Settings from "./pages/Settings";
import AuthLayout from "./components/AuthLayout";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "employees", Component: EmployeeList },
      { path: "employees/new", Component: EmployeeCreate },
      { path: "employees/:id", Component: EmployeeDetail },
      { path: "attendance", Component: Attendance },
      { path: "attendance/records", Component: AttendanceRecords },
      { path: "leave", Component: LeaveManagement },
      { path: "leave/apply", Component: LeaveApplication },
      { path: "leave/approval", Component: LeaveApproval },
      { path: "leave/holidays", Component: HolidayCalendar },
      { path: "meal-expense", Component: MealExpense },
      { path: "meal-expense/entry", Component: MealEntry },
      { path: "meal-expense/tracker", Component: ExpenseTracker },
      { path: "payroll", Component: Payroll },
      { path: "payroll/processing", Component: PayrollProcessing },
      { path: "payroll/structure", Component: SalaryStructure },
      { path: "payroll/payslip/:id", Component: Payslip },
      { path: "timesheet", Component: Timesheet },
      { path: "timesheet/entry", Component: TimesheetEntry },
      { path: "timesheet/productivity", Component: ProductivityReports },
      { path: "projects", Component: Projects },
      { path: "finance", Component: Finance },
      { path: "reports", Component: Reports },
      { path: "ai-assistant", Component: AIAssistant },
      { path: "settings", Component: Settings },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { path: "signin", Component: SignIn },
      { path: "register", Component: Register },
    ],
  },
]);
