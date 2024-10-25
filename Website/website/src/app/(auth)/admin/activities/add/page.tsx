"use client";

import { Sidebar } from "../../components/Sidebar";
import { AddActivityForm } from "../../components/AddActivityForm";

export default function AddActivityPage() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-4">Thêm Hoạt Động Mới</h1>
        <AddActivityForm />
      </main>
    </div>
  );
}
