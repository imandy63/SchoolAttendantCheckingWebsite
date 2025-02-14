import { ActivityEnum } from "@/enums/activity.enum";

export interface ActivityParticipant {
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
  activity_categories: string[];
  activity_status: ActivityEnum;
  activity_host: string;
  activity_location: string;
}

export interface ActivitiesByDate {
  _id: string;
}

export interface CreateActivityPayload {
  activity_name: string;
  activity_start_date: string;
  activity_max_participants: number;
  activity_point: number;
  activity_thumb_url?: string;
  activity_duration: number;
  activity_categories: string[];
  activity_host: string;
  activity_location: string;
}

export interface CreateAndEditActivityPagePayload {
  activity_name: string;
  activity_start_datetime: string;
  activity_max_participants: number;
  activity_point: number;
  activity_file?: File | null;
  activity_duration: number;
  activity_categories: string[];
  activity_host: string;
  activity_location: string;
}

export interface CreateAndEditActivitySchema {
  activity_name: string;
  activity_start_date: string;
  activity_start_time: string;
  activity_max_participants: number;
  activity_point: number;
  activity_duration: number;
  activity_categories: string[];
  activity_host: string;
  activity_location: string;
}
