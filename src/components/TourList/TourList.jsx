import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import TourCard from "../../shared/TourCard";

const TourList = () => {
  const { city } = useParams();
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set default dates for bookAt and checkOut
  const today = new Date();
  const defaultBookAt = today.toISOString().split("T")[0];
  const defaultCheckOut = new Date(today.setDate(today.getDate() + 5)).toISOString().split("T")[0];

  const [bookAt, setBookAt] = useState(defaultBookAt);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);

  // State for price range and hotel name
  const [priceRange, setPriceRange] = useState("all"); // "all", "100-200", "200-300", "300-400", "400+"
  const [hotelNameFilter, setHotelNameFilter] = useState(""); // New state for hotel name filter

  // Function to handle date changes
  const handleDateChange = (type, value) => {
    if (type === "bookAt") {
      setBookAt(value);
      if (new Date(value) >= new Date(checkOut)) {
        const newCheckOut = new Date(value);
        newCheckOut.setDate(newCheckOut.getDate() + 1);
        setCheckOut(newCheckOut.toISOString().split("T")[0]);
      }
    } else if (type === "checkOut") {
      if (new Date(value) > new Date(bookAt)) {
        setCheckOut(value);
      } else {
        alert("Check-out date must be after check-in date.");
      }
    }
  };

  useEffect(() => {
    const fetchTours = async () => {
      if (!bookAt || !checkOut) return;

      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/tours/city/${city}?bookAt=${bookAt}&checkOut=${checkOut}`
        );

        const availableHotels = await Promise.all(
          response.data.map(async (hotel) => {
            const availabilityResponse = await axios.get(
              `http://localhost:8000/api/v1/booking/availability/${hotel._id}/${bookAt}/${checkOut}`
            );
            const availableRooms = availabilityResponse.data.availableRooms;
            return {
              ...hotel,
              availableRooms,
            };
          })
        );

        // Apply filter for featured hotels
        const featuredHotels = availableHotels.filter(
          (hotel) => hotel.featured === true
        );

        setHotels(featuredHotels);
        setFilteredHotels(featuredHotels); // Initialize filtered hotels to only featured ones
      } catch (err) {
        console.error("Error fetching tours:", err);
        setError("Failed to fetch tours");
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [city, bookAt, checkOut]);


  // Lọc ra các tours có featured là true
  // const filteredHotelActive = hotels.filter((hotel) => hotel.featured === true);
  // Function to filter hotels based on selected price range and hotel name
  const filterHotels = () => {
    const filtered = hotels.filter(hotel => {
      const matchesPriceRange = priceRange === "all" || hotel.availableRooms.some(room => {
        if (priceRange === "400+") {
          return room.price >= 400; // Check if room price is 400 or above
        }
        const [minPrice, maxPrice] = priceRange.split("-").map(Number);
        return room.price >= minPrice && room.price < maxPrice; // Check if room price falls within the range
      });

      const matchesHotelName = hotel.title.toLowerCase().includes(hotelNameFilter.toLowerCase()); // Check hotel name filter

      return matchesPriceRange && matchesHotelName; // Combine both filters
    });

    setFilteredHotels(filtered);
  };

  // Effect to apply filtering whenever hotels, price range, or hotel name changes
  useEffect(() => {
    filterHotels();
  }, [hotels, priceRange, hotelNameFilter]);

  // Function to filter rooms based on selected price range
  const filterRoomsByPriceRange = (rooms) => {
    if (priceRange === "all") {
      return rooms; // Return all rooms if no filter is selected
    }

    return rooms.filter(room => {
      if (priceRange === "400+") {
        return room.price >= 400; // Check if room price is 400 or above
      }
      const [minPrice, maxPrice] = priceRange.split("-").map(Number);
      return room.price >= minPrice && room.price < maxPrice; // Check if room price falls within the range
    });
  };

  if (loading) {
    return <p className="text-center text-lg">Loading hotels...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-center mb-6">Hotels in {city}</h2>

      {/* Input fields for bookAt and checkOut */}
      <div className="mb-4 text-center">
        <label className="mr-2">Check-in:</label>
        <input
          type="date"
          value={bookAt}
          onChange={(e) => handleDateChange("bookAt", e.target.value)}
          className="border rounded px-2 py-1"
        />

        <label className="ml-4 mr-2">Check-out:</label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => handleDateChange("checkOut", e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>

      {/* Price Range Filter */}
      <div className="mb-4 text-center">
        <span className="mr-2">Price Range:</span>
        <label>
          <input
            type="radio"
            value="all"
            checked={priceRange === "all"}
            onChange={(e) => {
              setPriceRange(e.target.value);
              filterHotels(); // Update filter immediately
            }}
          />
          All
        </label>
        <label className="ml-4">
          <input
            type="radio"
            value="100-200"
            checked={priceRange === "100-200"}
            onChange={(e) => {
              setPriceRange(e.target.value);
              filterHotels(); // Update filter immediately
            }}
          />
          100 - 200
        </label>
        <label className="ml-4">
          <input
            type="radio"
            value="200-300"
            checked={priceRange === "200-300"}
            onChange={(e) => {
              setPriceRange(e.target.value);
              filterHotels(); // Update filter immediately
            }}
          />
          200 - 300
        </label>
        <label className="ml-4">
          <input
            type="radio"
            value="300-400"
            checked={priceRange === "300-400"}
            onChange={(e) => {
              setPriceRange(e.target.value);
              filterHotels(); // Update filter immediately
            }}
          />
          300 - 400
        </label>
        <label className="ml-4">
          <input
            type="radio"
            value="400+"
            checked={priceRange === "400+"}
            onChange={(e) => {
              setPriceRange(e.target.value);
              filterHotels(); // Update filter immediately
            }}
          />
          400+
        </label>
      </div>

      {/* Hotel Name Filter */}
      <div className="mb-4 text-center">

        <input
          placeholder="Search Hotel by Name"
          type="text"
          value={hotelNameFilter}
          onChange={(e) => {
            setHotelNameFilter(e.target.value);
            filterHotels(); // Update filter immediately
          }}
          className="border rounded px-2 py-1"
        />
      </div>


      <div className="grid gap-6 md:grid-cols-3">
        {filteredHotels.length > 0 ? (
          filteredHotels.map((hotel) => (
            <div key={hotel._id} className="relative">
              <TourCard tour={hotel} />

              {/* Availability table below each card */}
              <div className="mt-4">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="border px-2 py-1">Room Type</th>
                      <th className="border px-2 py-1">Available</th>
                      <th className="border px-2 py-1">Price</th> {/* New Price column */}
                    </tr>
                  </thead>
                  <tbody>
                    {filterRoomsByPriceRange(hotel.availableRooms).map((room) => (
                      <tr key={room.roomId} className={room.availableCount === 0 ? "bg-red-200" : ""}>
                        <td className="border px-2 py-1">{room.name}</td>
                        <td className={`border px-2 py-1 ${room.availableCount === 0 ? "text-red-600" : ""}`}>
                          {room.availableCount > 0 ? room.availableCount : "Unavailable"}
                        </td>
                        <td className="border px-2 py-1">{room.price.toLocaleString()} VND</td> {/* Price display */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No hotels available for this city</p>
        )}
      </div>
    </div>
  );
};

export default TourList;
