import { ActivityEnum } from "@/enums/activity.enum";

interface ActivityParticipant {
  student_id: string;
  student_name: string;
}

export interface Activity {
  _id: string;
  activity_name: string;
  activity_start_date: Date;
  activity_participants: ActivityParticipant[];
  activity_max_participants: number;
  activity_point: number;
  activity_thumb_url: string;
  activity_duration: number;
  created_by: string;
  activity_categories: string[];
  activity_status: ActivityEnum;
  activity_host: string;
}
