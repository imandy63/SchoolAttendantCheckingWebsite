import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changeSubscribeCategoriesAPI,
  getAllStudentsAPI,
  getPastActivities,
  getStudentActivitiesAPI,
} from "@/api/api.student";
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

export const useChangeSubscribedCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categories: string[]) =>
      changeSubscribeCategoriesAPI({ categories }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STUDENT_ACTIVITIES] });
    },
  });
};

export const useGetPastActivities = () => {
  return useQuery({
    queryKey: [STUDENT_ACTIVITIES, "past"],
    queryFn: () => getPastActivities(),
  });
};
