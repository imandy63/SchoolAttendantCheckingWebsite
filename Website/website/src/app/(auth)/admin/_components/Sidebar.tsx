import Link from "next/link";
import { useState } from "react";

export const Sidebar = () => {
  const [active, setActive] = useState("dashboard");

  const menuItems = [
    { name: "Dashboard", icon: "📊", href: "/admin/dashboard" },
    { name: "Sinh viên", icon: "👨‍🎓", href: "/admin/students" },
    { name: "Hoạt động", icon: "⚡", href: "/admin/activities" },
    { name: "Bài viết", icon: "📝", href: "/admin/posts" },
    { name: "Công tác viên", icon: "👥", href: "/admin/union-worker" },
  ];

  return (
    <aside className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-lg font-semibold mb-6">Admin Panel</h2>
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li key={item.name} className="flex items-center p-2 cursor-pointer">
            <Link
              href={item.href}
              className="flex items-center hover:bg-gray-700 px-2 py-1 rounded w-full"
            >
              <span className="mr-3">{item.icon}</span>
              <span
                onClick={() => setActive(item.name)}
                className={`${active === item.name ? "bg-gray-700" : ""}`}
              >
                {item.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};
