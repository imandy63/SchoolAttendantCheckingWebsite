export interface IPayload {
  userId: string;
  studentId: string;
}

export interface StudentExcelRow {
  student_id: string;
  student_name: string;
  student_avatar_url?: string;
  student_address?: string;
  class_name?: string;
  faculty?: string;
  student_activity_point?: number;
  subscribed_categories?: string; // comma separated
  password: string;
}
