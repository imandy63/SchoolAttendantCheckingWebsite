import { useState } from "react";

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border px-4 py-2"
        placeholder="Tìm kiếm..."
      />
      <button onClick={handleSearch} className="px-4 py-2 bg-gray-800 text-white rounded">
        🔍
      </button>
    </div>
  );
};
