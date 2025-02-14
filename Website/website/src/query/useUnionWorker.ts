import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllUnionWorkersAPI,
  disableUnionWorkerAPI,
  enableUnionWorkerAPI,
} from "@/api/api.union-worker";
import { STUDENTS, UNION_WORKERS } from "@/constants/query";
import {
  resetUnionWorkerPasswordAPI,
  createUnionWorkerAPI,
} from "@/api/api.auth";
import { toUnionWorkerAPI } from "@/api/api.student";
export const useGetUnionWorkers = (page: number, search = "") => {
  return useQuery({
    queryKey: [UNION_WORKERS, page, search],
    queryFn: () => getAllUnionWorkersAPI(page, search),
    enabled: !!page,
  });
};

export const useToUnionWorker = (currentPage: number, searchQuery: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toUnionWorkerAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [STUDENTS, currentPage, searchQuery],
      });
    },
  });
};

export const useCreateUnionWorker = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      student_id,
      password,
      student_name,
    }: {
      student_id: string;
      student_name: string;
      password: string;
    }) => createUnionWorkerAPI({ student_id, password, student_name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UNION_WORKERS] });
    },
  });
};

export const useDisableUnionWorker = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => disableUnionWorkerAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UNION_WORKERS] });
    },
  });
};

export const useEnableUnionWorker = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => enableUnionWorkerAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UNION_WORKERS] });
    },
  });
};

export const useResetUnionWorkerPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      resetUnionWorkerPasswordAPI(id, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UNION_WORKERS] });
    },
  });
};
