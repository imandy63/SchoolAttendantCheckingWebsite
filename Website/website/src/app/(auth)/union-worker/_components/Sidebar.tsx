import React from "react";

interface SidebarProps {
  tabs: { name: string; id: string }[];
  onSelect: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ tabs, onSelect }) => {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-lg font-semibold mb-6">Công tác viên</h2>
      <ul className="space-y-4">
        {tabs.map((tab) => (
          <li
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className="cursor-pointer hover:bg-gray-700 p-2 rounded"
          >
            {tab.name}
          </li>
        ))}
      </ul>
    </aside>
  );
};
