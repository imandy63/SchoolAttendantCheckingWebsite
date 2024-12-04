import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  getAllActivitiesAPI,
  getActivityParticipantsAPI,
  getActivityAPI,
  createActivityAPI,
  updateActivityAPI,
  getActivitiesByDateAPI,
  getUpcomingActivitiesGroupByDateAPI,
  participateActivityAPI,
  getActivityForStudent,
  getActivityCategoriesAPI,
  getAssignableActivitiesAPI,
  assignCheckingAPI,
  getAssignedActivitiesByWorkerAPI,
  removeCheckingAssignmentAPI,
  getStatistics,
  getTimeRange,
  getYearStatistics,
  leaveActivityAPI,
} from "@/api/api.activity";
import {
  ACTIVITIES,
  ACTIVITY_PARTICIPANTS,
  ACTIVITY,
  UPCOMING_ACTIVITIES,
  STUDENT_ACTIVITIES,
} from "@/constants/query";

export const useGetAllActivities = (page: number, search: string = "") => {
  return useQuery({
    queryKey: [ACTIVITIES, page, search],
    queryFn: () => getAllActivitiesAPI(page, search),
  });
};

export const useGetActivitiesByDate = (date: string) => {
  return useQuery({
    queryKey: [ACTIVITIES, date],
    queryFn: () => getActivitiesByDateAPI(date),
    retry: false,
  });
};

export const useGetActivityCategories = () => {
  return useQuery({
    queryKey: [ACTIVITIES, "categories"],
    queryFn: () => getActivityCategoriesAPI(),
  });
};

export const useGetUpcomingActivitiesGroupByDate = (searchParam = "") => {
  return useInfiniteQuery({
    queryKey: [UPCOMING_ACTIVITIES, searchParam],
    queryFn: ({ pageParam = 1 }: { pageParam: number }) =>
      getUpcomingActivitiesGroupByDateAPI(pageParam, searchParam),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 10) {
        return undefined;
      }
      return pages.length + 1;
    },
    initialPageParam: 1,
  });
};

export const useGetActivityParticipants = (activityId: string) => {
  return useQuery({
    queryKey: [ACTIVITY_PARTICIPANTS, activityId],
    queryFn: () => getActivityParticipantsAPI(activityId),
  });
};

export const useGetActivity = (activityId: string) => {
  return useQuery({
    queryKey: [ACTIVITY, activityId],
    queryFn: () => getActivityAPI(activityId),
  });
};

export const useCreateActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createActivityAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACTIVITIES] });
    },
  });
};

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateActivityAPI,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [ACTIVITIES] });
      queryClient.invalidateQueries({ queryKey: [ACTIVITY, variables.id] });
    },
  });
};

export const useGetActivityForStudent = (id: string) => {
  return useQuery({
    queryKey: [ACTIVITY, id],
    queryFn: () => getActivityForStudent(id),
    enabled: !!id,
  });
};

export const useParticipateActivity = (activityId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => participateActivityAPI(activityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACTIVITY, activityId] });
    },
  });
};

export const useLeaveActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (activityId: string) => leaveActivityAPI(activityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STUDENT_ACTIVITIES, "past"] });
    },
  });
};

export const useGetAssignableActivity = (id: string) => {
  return useQuery({
    queryKey: [ACTIVITIES, "assignable"],
    queryFn: () => getAssignableActivitiesAPI(id),
  });
};

export const useAssignChecking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      activity_id,
      student_id,
    }: {
      activity_id: string;
      student_id: string;
    }) => assignCheckingAPI({ activity_id, student_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACTIVITIES, "assignable"] });
      queryClient.invalidateQueries({ queryKey: [ACTIVITIES, "assigned"] });
    },
  });
};

export const useRemoveCheckingAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      activity_id,
      student_id,
    }: {
      activity_id: string;
      student_id: string;
    }) => removeCheckingAssignmentAPI({ activity_id, student_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACTIVITIES, "assignable"] });
      queryClient.invalidateQueries({ queryKey: [ACTIVITIES, "assigned"] });
    },
  });
};

export const useGetAssignedActivities = (id: string) => {
  return useQuery({
    queryKey: [ACTIVITIES, "assigned"],
    queryFn: () => getAssignedActivitiesByWorkerAPI(id),
  });
};

export const useGetTimeRange = () => {
  return useQuery({
    queryKey: [ACTIVITIES, "time-range"],
    queryFn: () => getTimeRange(),
  });
};

export const useGetStatistics = ({
  month,
  year,
}: {
  month: number;
  year: number;
}) => {
  return useQuery({
    queryKey: [ACTIVITIES, "statistics", month, year],
    queryFn: () => getStatistics(month, year),
  });
};

export const useGetYearStatistics = ({ year }: { year: number }) => {
  return useQuery({
    queryKey: [ACTIVITIES, "year-statistics", year],
    queryFn: () => getYearStatistics(year),
  });
};
