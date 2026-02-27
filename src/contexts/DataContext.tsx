import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";
import { useSocket } from "./SocketContext";

interface DataContextType {
  employees: any[];
  departments: any[];
  designations: any[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType>({
  employees: [],
  departments: [],
  designations: [],
  isLoading: true,
  refreshData: async () => {},
});

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { socket } = useSocket();

  const fetchData = async () => {
    try {
      const [empData, deptData, desigData] = await Promise.all([
        api.get("/users"),
        api.get("/departments"),
        api.get("/designations"),
      ]);
      setEmployees(empData);
      setDepartments(deptData);
      setDesignations(desigData);
    } catch (error) {
      console.error("Failed to fetch global data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!socket) return;

    // User Listeners
    socket.on("userCreated", (newUser: any) => {
      setEmployees((prev) => [newUser, ...prev]);
    });
    socket.on("userUpdated", (updatedUser: any) => {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === updatedUser.id ? { ...emp, ...updatedUser } : emp,
        ),
      );
    });

    // Department Listeners
    socket.on("departmentCreated", (newDept: any) => {
      setDepartments((prev) => [...prev, newDept]);
    });
    socket.on("departmentUpdated", (updatedDept: any) => {
      setDepartments((prev) =>
        prev.map((d) =>
          d.id === updatedDept.id ? { ...d, ...updatedDept } : d,
        ),
      );
    });
    socket.on("departmentDeleted", (id: string) => {
      setDepartments((prev) => prev.filter((d) => d.id !== id));
    });

    // Designation Listeners
    socket.on("designationCreated", (newDesig: any) => {
      setDesignations((prev) => [...prev, newDesig]);
    });
    socket.on("designationUpdated", (updatedDesig: any) => {
      setDesignations((prev) =>
        prev.map((d) =>
          d.id === updatedDesig.id ? { ...d, ...updatedDesig } : d,
        ),
      );
    });
    socket.on("designationDeleted", (id: string) => {
      setDesignations((prev) => prev.filter((d) => d.id !== id));
    });

    // Salary Listeners
    socket.on("salaryCreated", (newSalary: any) => {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === newSalary.userId
            ? { ...emp, salaries: [newSalary, ...(emp.salaries || [])] }
            : emp,
        ),
      );
    });

    socket.on("salaryUpdated", (updatedSalary: any) => {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === updatedSalary.userId
            ? {
                ...emp,
                salaries: (emp.salaries || []).map((s: any) =>
                  s.id === updatedSalary.id ? updatedSalary : s,
                ),
              }
            : emp,
        ),
      );
    });

    return () => {
      socket.off("userCreated");
      socket.off("userUpdated");
      socket.off("departmentCreated");
      socket.off("departmentUpdated");
      socket.off("departmentDeleted");
      socket.off("designationCreated");
      socket.off("designationUpdated");
      socket.off("designationDeleted");
      socket.off("salaryCreated");
    };
  }, [socket]);

  return (
    <DataContext.Provider
      value={{
        employees,
        departments,
        designations,
        isLoading,
        refreshData: fetchData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
