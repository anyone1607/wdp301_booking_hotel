import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdTour } from "react-icons/md";
import { Link } from "react-router-dom";

const HotelCard = ({ searchQuery }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/locations/getlocation"
        );
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
    <div>
      <div className="grid gap-4 md:grid-cols-3">
        {filteredLocations?.map((location) => (
          <div
            key={location._id}
            className="max-w-md bg-white rounded-lg shadow-md overflow-hidden mb-4"
          >
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
                {location.description ||
                  "Thưởng thức cà phê phong cách Sài Gòn"}
              </p>
            </div>

            <div className="flex items-center px-4 py-2 space-x-2">
              {location.images?.length > 0 ? (
                <>
                  <img
                    src={location.images[0]}
                    alt="Thumbnail 1"
                    className="w-1/3 h-20 object-cover rounded-md"
                  />
                  <img
                    src={location.images[1]}
                    alt="Thumbnail 2"
                    className="w-1/3 h-20 object-cover rounded-md"
                  />
                  <img
                    src={location.images[2]}
                    alt="Thumbnail 3"
                    className="w-1/3 h-20 object-cover rounded-md"
                  />
                </>
              ) : (
                <p>No images available</p>
              )}
            </div>

            <div className="relative px-4 py-2 flex items-center justify-between">
              <div className="flex items-center text-xs text-gray-500">
                <FaMapMarkerAlt className="text-yellow-600 mr-1" />
                <span>
                  {location.distance
                    ? `${location.distance} km`
                    : "Unknown distance"}
                </span>
              </div>
              <Link
                to={`/tours/city/${location.city}`}
                className="flex items-center text-blue-600 hover:underline hover:bg-white hover:text-black"
              >
                <MdTour />
                <span className="ml-1 italic">Xem các tour liên quan</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelCard;
