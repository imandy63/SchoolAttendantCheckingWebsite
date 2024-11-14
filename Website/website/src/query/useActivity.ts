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
} from "@/api/api.activity";
import {
  ACTIVITIES,
  ACTIVITY_PARTICIPANTS,
  ACTIVITY,
  UPCOMING_ACTIVITIES,
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
