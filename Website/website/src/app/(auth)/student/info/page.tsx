import React from "react";
import StudentInfo from "../_components/StudentInfo";

const InfoPage: React.FC = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="flex-1 p-8">
        <StudentInfo />
      </div>
    </div>
  );
};

export default InfoPage;
