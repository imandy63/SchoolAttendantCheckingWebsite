interface StudentClass {
  class_name: string;
  faculty: string;
}

interface StudentParticipatedActivity {
  name: string;
  status: string;
  point: number;
}

export interface Student {
  _id: string;
  student_id: string;
  student_name: string;
  student_avatar_url: string;
  student_address: string;
  student_class: StudentClass;
  student_activity_point: number;
  student_participated_activities: StudentParticipatedActivity[];
  subscribed_categories: string[];
}
