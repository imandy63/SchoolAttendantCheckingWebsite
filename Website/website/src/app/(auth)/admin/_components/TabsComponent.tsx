import React, { useState, useCallback } from "react";
import classNames from "classnames";

interface Tab {
  name: string;
  id: string;
}

interface TabsComponentProps {
  tabs: Tab[];
  defaultTab: string;
  onTabChange: (tabId: string) => void;
}

const TabsComponent: React.FC<TabsComponentProps> = ({
  tabs,
  defaultTab,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabClick = useCallback(
    (tabId: string) => {
      setActiveTab(tabId);
      onTabChange(tabId);
    },
    [onTabChange]
  );

  return (
    <div className="flex space-x-4">
      {tabs.map(({ id, name }) => (
        <button
          key={id}
          onClick={() => handleTabClick(id)}
          className={classNames(
            "px-4 py-2 rounded-md",
            {
              "bg-white text-black shadow": activeTab === id,
              "bg-gray-200 text-gray-600 hover:bg-white hover:shadow": activeTab !== id,
            }
          )}
        >
          {name}
        </button>
      ))}
    </div>
  );
};

export default TabsComponent;