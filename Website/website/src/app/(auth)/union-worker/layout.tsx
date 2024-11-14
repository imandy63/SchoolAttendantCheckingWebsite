"use client";
import { UseUnionWorker } from "@/hooks/useAuth";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
<<<<<<< HEAD:Website/website/src/app/union-worker/layout.tsx
  return (
      <UseUnionWorker>
          {children}
      </UseUnionWorker>
  );
=======
  return <UseUnionWorker>{children}</UseUnionWorker>;
>>>>>>> 048045414570bb941a4e46c66cfb452629a41a06:Website/website/src/app/(auth)/union-worker/layout.tsx
}


