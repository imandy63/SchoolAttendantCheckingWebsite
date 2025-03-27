import { verifyUser, isAdmin, isUnionWorker } from "@/api/api.auth";
import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation"; // Ensure you have this import

export const UseAuth = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  verifyUser()
    .then((data) => {
      const { status } = data;
      if (status) {
        setIsLoading(false);
      } else {
        router.push("/login");
      }
    })
    .catch(() => {
      router.push("/login");
    });

  return isLoading ? <></> : <>{children}</>;
};

export const UseAdmin = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  isAdmin()
    .then((data) => {
      const { status } = data;
      if (status) {
        // Kiểm tra role từ localStorage
        const userRole = localStorage.getItem('userRole');
        if (userRole === 'ADMIN') {
          setIsLoading(false);
        } else {
          // Nếu role không phải ADMIN, chuyển hướng đến trang tương ứng
          if (userRole === 'UNION_WORKER') {
            router.push('/union-worker');
          } else {
            router.push('/student/main');
          }
        }
      } else {
        router.push("/login");
      }
    })
    .catch(() => {
      router.push("/login");
    });

  return isLoading ? <></> : <>{children}</>;
};

export const UseUnionWorker = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  isUnionWorker()
    .then((data) => {
      const { status } = data;
      if (status) {
        // Kiểm tra role từ localStorage
        const userRole = localStorage.getItem('userRole');
        if (userRole === 'UNION_WORKER') {
          setIsLoading(false);
        } else {
          // Nếu role không phải UNION_WORKER, chuyển hướng đến trang tương ứng
          if (userRole === 'ADMIN') {
            router.push('/admin/students');
          } else {
            router.push('/student/main');
          }
        }
      } else {
        router.push("/login");
      }
    })
    .catch(() => {
      router.push("/login");
    });

  return isLoading ? <></> : <>{children}</>;
};
