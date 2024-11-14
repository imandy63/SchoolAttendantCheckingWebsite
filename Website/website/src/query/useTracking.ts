import {
  getActivityTrackingDetailAPI,
  getTrackingAPI,
  updateTrackingAPI,
} from "@/api/api.tracking";
import { TRACKING } from "@/constants/query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetTracking = (id: string) => {
  return useQuery({
    queryKey: [TRACKING, id],
    queryFn: () => getTrackingAPI(id),
    enabled: !!id,
  });
};

export const useUpdateTracking = (activity_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ student_ids }: { student_ids: string[] }) =>
      updateTrackingAPI({ activity_id, student_ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRACKING, activity_id] });
    },
  });
};

export const useGetActivityTrackingDetail = (id: string) => {
  return useQuery({
    queryKey: [TRACKING, id],
    queryFn: () => getActivityTrackingDetailAPI(id),
    enabled: !!id,
  });
};
