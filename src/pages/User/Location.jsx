import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { MdTour } from "react-icons/md";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Location = () => {
  const [searchQuery, setSearchQuery] = useState("");
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

  const settings = {
    dots: true,
    infinite: false, // Tắt chế độ lặp lại item
    autoplay: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
        },
      },
    ],
  };

  if (loading) {
    return <p>Loading locations...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const filteredLocations = locations.filter(
    (location) =>
      location.title &&
      location.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      {/* Search Section */}
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-2xl font-bold mb-4">Tìm kiếm địa điểm</h1>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center bg-white rounded-full p-2 shadow-md max-w-lg w-full"
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
      </div>

      {/* Slider Section */}
      {filteredLocations.length > 0 ? (
        <Slider {...settings}>
          {filteredLocations.map((location) => (
            <div
              key={location._id}
              className="bg-white rounded-lg shadow-lg p-4 transition-transform transform hover:scale-105"
              style={{ maxWidth: "350px", height: "450px", margin: "0 auto" }}
            >
              {/* Header */}
              <div className="flex items-center mb-4">
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
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full mr-2">
                    Giảm 12%
                  </span>
                  <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    Voucher áp dụng toàn quốc
                  </span>
                </div>
                <p className="text-gray-600 text-sm overflow-hidden" style={{ maxHeight: "100px" }}>
                  {location.description || "Thưởng thức cà phê phong cách Sài Gòn"}
                </p>
              </div>

              {/* Images */}
              <div className="flex items-center justify-center mb-4 space-x-2">
                {location.images?.slice(0, 3).map((image, idx) => (
                  <img
                    key={idx}
                    src={image}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-1/3 h-20 object-cover rounded-md"
                  />
                ))}
              </div>

              {/* Footer with Link */}
              <div className="flex items-center justify-between">
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
        </Slider>
      ) : (
        <p className="text-center text-gray-500">No locations found for your search.</p>
      )}
    </div>
  );
};

export default Location;
