import { getMe } from "@/api/api.auth";
import { useQuery } from "@tanstack/react-query";
import { ME } from "@/constants/query";

export const useGetMe = () => {
  return useQuery({
    queryKey: [ME],
    queryFn: () => getMe(),
  });
};
