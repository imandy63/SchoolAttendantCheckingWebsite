import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  registerNotificationTokenAPI,
  getUnreadCountAPI,
  deleteNotificationTokenAPI,
  pullNotificationAPI,
  readNotification,
  readAllNotification,
} from "@/api/api.notification";
import { NOTIFICATIONS } from "@/constants/query";

export const useGetNotifications = (page: number) => {
  return useInfiniteQuery({
    queryKey: [NOTIFICATIONS, page],
    queryFn: ({ pageParam = 1 }: { pageParam: number }) =>
      pullNotificationAPI(pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data.length < 10) {
        return undefined;
      }
      return pages.length + 1;
    },
    initialPageParam: 1,
  });
};

export const useReadNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await readNotification(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS] });
    },
  });
};

export const useReadAllNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await readAllNotification();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS] });
    },
  });
};

export const useGetUnreadCount = () => {
  return useQuery({
    queryKey: [NOTIFICATIONS],
    queryFn: () => getUnreadCountAPI(),
  });
};

export const useRegisterNotificationToken = () => {
  return useMutation({
    mutationFn: (fcmToken: string) => registerNotificationTokenAPI(fcmToken),
  });
};

export const useRemoveNotificationToken = () => {
  return useMutation({
    mutationFn: (fcmToken: string) => deleteNotificationTokenAPI(fcmToken),
  });
};
