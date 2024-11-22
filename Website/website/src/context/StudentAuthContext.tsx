import { useGetMe } from "@/query/useAuth";
import React, { ReactNode, createContext } from "react";

interface StudentInfoContextType {
  data: any;
  isLoading: boolean;
}

const StudentInfoContext = createContext<StudentInfoContextType | undefined>(
  undefined
);

interface StudentInfoProviderProps {
  children: ReactNode;
}

export const StudentInfoProvider: React.FC<StudentInfoProviderProps> = ({
  children,
}) => {
  const { data, isLoading } = useGetMe();

  return (
    <StudentInfoContext.Provider value={{ data, isLoading }}>
      {children}
    </StudentInfoContext.Provider>
  );
};

export const useStudentInfoContext = (): StudentInfoContextType => {
  const context = React.useContext(StudentInfoContext);
  if (!context) {
    throw new Error(
      "useStudentInfoContext must be used within a StudentInfoContextProvider"
    );
  }
  return context;
};
