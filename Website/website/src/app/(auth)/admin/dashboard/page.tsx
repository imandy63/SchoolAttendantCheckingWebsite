"use client";

import React, { useState } from "react";
import TabsComponent from "../_components/TabsComponent";
import { OverviewTab } from "../_components/OverviewTab";
import StatisticsTab from "../_components/StatisticsTab";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <main className="flex-1 h-[100vh] overflow-y-auto p-8 bg-gray-100">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-black">Dashboard Admin</h1>
        <p className="text-gray-600">Thống kê và quản lý các hoạt động</p>
      </header>

      {/* Nội dung theo tab */}
      <div className="mt-6">
        <OverviewTab />
      </div>
    </main>
  );
}
