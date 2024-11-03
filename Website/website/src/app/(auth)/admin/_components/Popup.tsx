import { ReactNode } from "react";
import { Button } from "./Button";
import { useGetActivityParticipants } from "@/query/useActivity";
import { useStudentActivities } from "@/query/useStudent";
import { Skeleton } from "./SkeletonField";

interface PopupProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export const Popup: React.FC<PopupProps> = ({
  isOpen,
  title,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-lg w-1/2 max-h-[80vh]">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="mb-4 overflow-y-auto max-h-[50vh]">{children}</div>
        <div className="flex justify-end">
          <Button label="Close" onClick={onClose} variant="secondary" />
        </div>
      </div>
    </div>
  );
};

interface StudentActivitiesProps {
  studentId: string;
}

interface StudentActivitiesProps {
  studentId: string;
}

export const StudentActivities: React.FC<StudentActivitiesProps> = ({
  studentId,
}) => {
  const { data, error, isLoading } = useStudentActivities(studentId);

  if (isLoading) return <Skeleton count={5} />;
  if (error) return <p>Error loading activities: {error.message}</p>;

  return (
    <ul className="space-y-2">
      {data && data.length > 0 ? (
        data.map((activity, index) => (
          <li key={index} className="mb-2">
            <strong>{activity.name}</strong> - {activity.point} -{" "}
            {activity.status}
          </li>
        ))
      ) : (
        <p>Không có hoạt động</p>
      )}
    </ul>
  );
};

interface ActivityParticipantsProps {
  activityId: string;
}

export const ActivityParticipants: React.FC<ActivityParticipantsProps> = ({
  activityId,
}) => {
  const { data, error, isLoading } = useGetActivityParticipants(activityId);

  if (isLoading) return <Skeleton count={5} />;
  if (error) return <p>Error loading participants: {error.message}</p>;

  return (
    <ul className="space-y-2">
      {data && data.length > 0 ? (
        data.map((participant, index) => (
          <li key={index} className="mb-2">
            <strong>{participant.student_id}</strong> -{" "}
            {participant.student_name}
          </li>
        ))
      ) : (
        <p>Không có sinh viên</p>
      )}
    </ul>
  );
};
