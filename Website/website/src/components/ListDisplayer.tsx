import React from "react";

interface ScrollableListProps {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  maxHeight?: string;
}

const ScrollableList: React.FC<ScrollableListProps> = ({
  items,
  renderItem,
  maxHeight = "300px",
}) => {
  return (
    <div
      className="overflow-y-auto border h-full w-full border-gray-300 rounded-lg p-4"
      style={{ maxHeight }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="border border-gray-200 p-3 mb-3 rounded-md shadow-sm last:mb-0"
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
};

export default ScrollableList;
