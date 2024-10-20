import { ActivityParticipantStatus } from "@/enums/activityParticipant.enum";

export interface ActivityParticipationTracking {
  _id: string;
  activity_id: string;
  user_id: string;
  participation_date: Date;
  status: ActivityParticipantStatus;
  note: string;
}
