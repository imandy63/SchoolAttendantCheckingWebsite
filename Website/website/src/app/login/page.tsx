// src/app/login/page.tsx
"use client";
import { Header } from "../../components/Header";
import { LoginForm } from "../../components/LoginForm";

import { Notification } from "../../components/Notification";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto py-8 flex">
        <div className="flex-1 mr-8">
          <Notification />
        </div>
        <div className="w-1/3">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
