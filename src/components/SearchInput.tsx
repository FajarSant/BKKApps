"use client";

import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";

const SearchInput = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <FaSearch className="w-4 h-4" />
        </span>
        <Input
          type="text"
          placeholder="Cari pekerjaan, perusahaan, atau posisi..."
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default SearchInput;
