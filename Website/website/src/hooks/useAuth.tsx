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

export const UseUnionWorker = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  isUnionWorker()
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
