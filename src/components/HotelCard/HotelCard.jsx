import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdTour } from "react-icons/md";
import { Link } from "react-router-dom";

const HotelCard = ({ searchQuery }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/locations/");
        setLocations(response.data);
      } catch (err) {
        setError("Failed to fetch locations");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (loading) {
    return <p>Loading locations...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const filteredLocations = locations.filter((location) =>
    location.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredLocations?.map((location) => (
          <div
            key={location._id}
            className="max-w-md bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
          >
            {/* Header */}
            <div className="flex items-center p-4">
              <img
                src={location.logo}
                alt="Logo"
                className="w-12 h-12 rounded-full object-cover mr-3"
              />
              <div>
                <h2 className="text-lg font-semibold">{location.title}</h2>
                <span className="text-sm text-gray-500">{location.city}</span>
              </div>
            </div>

            {/* Discount and Description */}
            <div className="px-4 py-2">
              <div className="flex items-center mb-2">
                <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full mr-2">
                  Giảm 12%
                </span>
                <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  Voucher áp dụng toàn quốc
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">
                {location.description || "Thưởng thức cà phê phong cách Sài Gòn"}
              </p>
            </div>

            {/* Images */}
            <div className="flex items-center justify-center px-4 py-2 space-x-2">
              {location.images?.length > 0 ? (
                location.images.slice(0, 3).map((image, idx) => (
                  <img
                    key={idx}
                    src={image}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-1/3 h-20 object-cover rounded-md"
                  />
                ))
              ) : (
                <p className="text-sm text-gray-400">No images available</p>
              )}
            </div>

            {/* Footer with Link */}
            <div className="relative px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <Link
                to={`/tours/city/${location.city}`}
                className="flex items-center text-blue-600 hover:underline"
              >
                <MdTour className="mr-1" />
                <span className="italic text-sm">Xem các tour liên quan</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelCard;
