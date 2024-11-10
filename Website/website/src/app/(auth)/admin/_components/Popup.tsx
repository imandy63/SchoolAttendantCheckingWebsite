import { ReactNode } from "react";
import { Button } from "./Button";
import { useGetActivityParticipants } from "@/query/useActivity";
import { useStudentActivities } from "@/query/useStudent";
import { Skeleton } from "./SkeletonField";
import {
  ActivityTracking_status,
  Participation_Status,
} from "@/enums/activityParticipant.enum";
import { useGetActivityTrackingDetail } from "@/query/useTracking";

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

  // Check if data exists and has activities
  const activities = data?.student_participated_activities;

  return (
    <div className="space-y-4">
      {activities && activities.length > 0 ? (
        <ul className="space-y-3">
          {activities.map(
            (activity: {
              _id: string;
              name: string;
              point: number;
              status: Participation_Status;
            }) => (
              <li
                key={activity._id}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                <h3 className="font-semibold text-lg">{activity.name}</h3>
                <p className="text-sm text-gray-600">
                  Point: {activity.point || 0}
                </p>
                <p className={`text-sm `}>
                  Status:{" "}
                  <span
                    className={`${
                      activity.status === Participation_Status.REJECTED
                        ? "text-red-600"
                        : activity.status === Participation_Status.REGISTERED
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {activity.status === Participation_Status.REGISTERED
                      ? "Chờ điểm danh"
                      : activity.status === Participation_Status.REJECTED
                      ? "Vắng"
                      : "Có mặt"}
                  </span>
                </p>
              </li>
            )
          )}
        </ul>
      ) : (
        <p className="text-center text-gray-500">Không có hoạt động</p>
      )}
    </div>
  );
};
interface ActivityParticipantsProps {
  activityId: string;
}

export const ActivityParticipants: React.FC<ActivityParticipantsProps> = ({
  activityId,
}) => {
  const { data, error, isLoading } = useGetActivityParticipants(activityId);

  console.log(data);

  if (isLoading) return <Skeleton count={5} />;
  if (error) return <p>Error loading participants: {error.message}</p>;

  return (
    <ul className="space-y-2">
      {data.activity_participants && data.activity_participants.length > 0 ? (
        data.activity_participants.map((participant, index) => (
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

export const ActivityAttendance: React.FC<ActivityParticipantsProps> = ({
  activityId,
}) => {
  const { data, error, isLoading } = useGetActivityTrackingDetail(activityId);

  if (isLoading) return <Skeleton count={5} />;
  if (error) return <p>Error loading participants: {error.message}</p>;

  return (
    <ul className="space-y-2">
      {data && data.length > 0 ? (
        data.map((student, index) => (
          <li key={student.student_id}>
            <p>{student.student_name}</p>
            <p>
              Status:{" "}
              <span
                className={`${
                  student.activity_status === ActivityTracking_status.ABSENT
                    ? "text-red-600"
                    : student.activity_status ===
                      ActivityTracking_status.PENDING
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {student.activity_status === ActivityTracking_status.ABSENT
                  ? "Vắng"
                  : student.activity_status === ActivityTracking_status.PENDING
                  ? "Chờ điểm danh"
                  : "Có mặt"}
              </span>
            </p>
          </li>
        ))
      ) : (
        <p>Chưa có dữ liệu điểm danh</p>
      )}
    </ul>
  );
};
