import {
  getPastAssignedActivities,
  getUpcomingAssignedActivities,
} from "@/api/api.checking";
import { ACTIVITIES } from "@/constants/query";
import { useQuery } from "@tanstack/react-query";

export const useGetPastAssignedActivities = () => {
  return useQuery({
    queryKey: [ACTIVITIES, "past"],
    queryFn: () => getPastAssignedActivities(),
  });
};

export const useGetUpcomingAssignedActivities = () => {
  return useQuery({
    queryKey: [ACTIVITIES, "upcoming"],
    queryFn: () => getUpcomingAssignedActivities(),
  });
};
