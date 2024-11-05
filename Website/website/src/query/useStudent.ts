import { useQuery } from "@tanstack/react-query";
import { getAllStudentsAPI, getStudentActivitiesAPI } from "@/api/api.student";
import { STUDENT_ACTIVITIES, STUDENTS } from "@/constants/query";

export const useStudents = (page: number, search = "") => {
  return useQuery({
    queryKey: [STUDENTS, page, search],
    queryFn: () => getAllStudentsAPI(page, search),
    enabled: !!page,
  });
};

export const useStudentActivities = (studentId: string) => {
  return useQuery({
    queryKey: [STUDENT_ACTIVITIES, studentId],
    queryFn: () => getStudentActivitiesAPI(studentId),
    enabled: !!studentId,
  });
};
