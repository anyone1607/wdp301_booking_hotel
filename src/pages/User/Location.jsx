import React, { useState } from "react";
import HotelCard from "../../components/HotelCard/HotelCard";

const Location = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Tìm kiếm địa điểm</h1>

        <form
          onSubmit={handleSearch}
          className="flex items-center bg-white rounded-full p-2 shadow-md max-w-lg w-full mb-16"
        >
          <span className="text-gray-400 pl-4">📍</span>
          <input
            type="text"
            placeholder="Nhập tên thành phố hoặc địa điểm..."
            className="flex-grow bg-transparent outline-none px-4 text-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
          >
            Tìm kiếm
          </button>
        </form>
        <HotelCard searchQuery={searchQuery} />
      </div>
    </>
  );
};

export default Location;
