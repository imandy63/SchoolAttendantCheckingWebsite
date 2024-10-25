import { ReactNode } from "react";
import { Button } from "../components/Button";
import { StudentParticipatedActivity } from "@/interfaces/student.interface"; // Assuming there's an interface for activities
import { useEffect, useState } from "react";
import { getStudentActivitiesAPI } from "@/api/api.student";
import { getActivityParticipantsAPI } from "@/api/api.activity";
import { ActivityParticipant } from "@/interfaces/activity.interface";

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

export const StudentActivities: React.FC<StudentActivitiesProps> = ({
  studentId,
}) => {
  const [activities, setActivities] = useState<StudentParticipatedActivity[]>(
    []
  );

  const fetchStudentActivities = async (studentId: string) => {
    const data = await getStudentActivitiesAPI(studentId);
    console.log(data);
    setActivities(data.student_participated_activities);
  };

  useEffect(() => {
    fetchStudentActivities(studentId);
  }, [studentId]);

  return (
    <ul className="space-y-2">
      {activities.length > 0 ? (
        activities.map((activity, index) => (
          <li key={index} className="mb-2">
            <strong>{activity.name}</strong> - {activity.point} -{" "}
            {activity.status}
          </li>
        ))
      ) : (
        <p>No activities found</p>
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
  const [participants, setParticipants] = useState<ActivityParticipant[]>([]);

  const fetchActivityParticipants = async (activityId: string) => {
    const data = await getActivityParticipantsAPI(activityId);
    console.log(data);
    setParticipants(data.activity_participants);
  };

  useEffect(() => {
    fetchActivityParticipants(activityId);
  }, [activityId]);

  return (
    <ul className="space-y-2">
      {participants.length > 0 ? (
        participants.map((participant, index) => (
          <li key={index} className="mb-2">
            <strong>{participant.student_id}</strong> -{" "}
            {participant.student_name}
          </li>
        ))
      ) : (
        <p>No participants found</p>
      )}
    </ul>
  );
};
