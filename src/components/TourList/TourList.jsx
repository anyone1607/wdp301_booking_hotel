import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, useParams } from "react-router-dom";
import TourCard from "../../shared/TourCard";
import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  FormGroup,
  Input,
  Row,
} from "reactstrap";
import {
  FaDollarSign,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaSearch,
  FaUserFriends,
} from "react-icons/fa";

const TourList = () => {
  const { city } = useParams();
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredHotelId, setHoveredHotelId] = useState(null);

  // Set default dates for bookAt and checkOut
  const today = new Date();
  const defaultBookAt = today.toISOString().split("T")[0];
  const defaultCheckOut = new Date(today.setDate(today.getDate() + 5))
    .toISOString()
    .split("T")[0];

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
    const filtered = hotels.filter((hotel) => {
      const matchesPriceRange =
        priceRange === "all" ||
        hotel.availableRooms.some((room) => {
          if (priceRange === "400+") {
            return room.price >= 400; // Check if room price is 400 or above
          }
          const [minPrice, maxPrice] = priceRange.split("-").map(Number);
          return room.price >= minPrice && room.price < maxPrice; // Check if room price falls within the range
        });

      const matchesHotelName = hotel.title
        .toLowerCase()
        .includes(hotelNameFilter.toLowerCase()); // Check hotel name filter

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

    return rooms.filter((room) => {
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
      <h2 className="text-2xl font-semibold text-center mb-6">
        Hotels in {city}
      </h2>

      <div
  className="mb-4 text-center"
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    backgroundColor: "#ffffff",
    padding: "12px 20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
    margin: "0 auto",
  }}
>
  <div style={{ textAlign: "left" }}>
    <label
      style={{
        fontWeight: "600",
        color: "#555",
        fontSize: "0.9rem",
        marginRight: "8px",
      }}
    >
      Check-in:
    </label>
    <input
      type="date"
      value={bookAt}
      onChange={(e) => handleDateChange("bookAt", e.target.value)}
      style={{
        border: "1px solid #ddd",
        borderRadius: "5px",
        padding: "8px 10px",
        fontSize: "0.9rem",
        color: "#333",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        transition: "border-color 0.3s",
      }}
      onFocus={(e) => (e.target.style.borderColor = "#007bff")}
      onBlur={(e) => (e.target.style.borderColor = "#ddd")}
    />
  </div>

  <div style={{ textAlign: "left" }}>
    <label
      style={{
        fontWeight: "600",
        color: "#555",
        fontSize: "0.9rem",
        marginRight: "8px",
      }}
    >
      Check-out:
    </label>
    <input
      type="date"
      value={checkOut}
      onChange={(e) => handleDateChange("checkOut", e.target.value)}
      style={{
        border: "1px solid #ddd",
        borderRadius: "5px",
        padding: "8px 10px",
        fontSize: "0.9rem",
        color: "#333",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        transition: "border-color 0.3s",
      }}
      onFocus={(e) => (e.target.style.borderColor = "#007bff")}
      onBlur={(e) => (e.target.style.borderColor = "#ddd")}
    />
  </div>
</div>


      {/* Price Range Filter */}
      <div
  className="mb-4 text-center"
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    backgroundColor: "#ffffff",
    padding: "10px 20px",
    borderRadius: "10px",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
    margin: "0 auto",
  }}
>
  <span style={{ fontWeight: "600", color: "#333", fontSize: "1rem" }}>
    Price Range:
  </span>

  {["all", "100-200", "200-300", "300-400", "400+"].map((value, index) => (
    <label
      key={value}
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#f1f1f1",
        padding: "8px 12px",
        borderRadius: "20px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow:
          priceRange === value ? "0 4px 12px rgba(0, 123, 255, 0.2)" : "none",
      }}
    >
      <input
        type="radio"
        value={value}
        checked={priceRange === value}
        onChange={(e) => {
          setPriceRange(e.target.value);
          filterHotels();
        }}
        style={{
          accentColor: "#007bff",
          marginRight: "8px",
          width: "16px",
          height: "16px",
          cursor: "pointer",
        }}
      />
      <span
        style={{
          color: priceRange === value ? "#007bff" : "#555",
          fontWeight: priceRange === value ? "bold" : "normal",
        }}
      >
        {value === "all" ? "All" : value}
      </span>
    </label>
  ))}
</div>

      
      <div className="d-flex justify-content-center my-4">
  <FormGroup
    className="d-flex align-items-center"
    style={{
      backgroundColor: "#fff",
      border: "1px solid #e0e0e0",
      borderRadius: "30px",
      padding: "8px 16px",
      width: "70%",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    }}
  >
    {/* Icon Search */}
    <span
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffba00",
        fontSize: "1.2rem",
        marginRight: "10px",
      }}
    >
      <FaSearch />
    </span>

  

    <div style={{ flexGrow: 1 }}>
      <h6
        style={{
          fontSize: "0.9rem",
          fontWeight: 600,
          color: "#333",
          marginBottom: "3px",
        }}
      >
        Hotel
      </h6>
      <Input
        type="text"
        placeholder="Search hotels"
        value={hotelNameFilter}
        onChange={(e) => {
          setHotelNameFilter(e.target.value);
          filterHotels();
        }}
        style={{
          width: "100%",
          border: "none",
          outline: "none",
          padding: "6px 0",
          fontSize: "0.9rem",
          borderBottom: "1px solid transparent",
          transition: "border-color 0.3s",
        }}
        onFocus={(e) => (e.target.style.borderBottomColor = "#ffba00")}
        onBlur={(e) => (e.target.style.borderBottomColor = "transparent")}
      />
    </div>
  </FormGroup>
</div>


      <div className="grid gap-6 md:grid-cols-3 relative">
        {filteredHotels.length > 0 ? (
          filteredHotels.map((hotel) => (
            <div
              key={hotel._id}
              className="relative bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105"
              onMouseEnter={() => setHoveredHotelId(hotel._id)}
              onMouseLeave={() => setHoveredHotelId(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Hiển thị TourCard */}
              <TourCard tour={hotel} />

              {/* Hiển thị danh sách phòng (Room Categories) khi hover */}
              {hoveredHotelId === hotel._id && (
                <div
                  className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-90 p-4 z-10 rounded-lg shadow-lg overflow-auto"
                  style={{ minHeight: "100%", width: "100%" }}
                >
                  <h4
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "600",
                      marginBottom: "1rem",
                      color: "#333",
                      textAlign: "center",
                    }}
                  >
                    Hotel
                  </h4>

                  {/* Hiển thị TourCard bên trong phần Room Categories */}
                  <TourCard tour={hotel} />

                  {/* Thêm tiêu đề Rooms in Hotel bên trong Room Categories */}
                  <h5
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#333",
                      textAlign: "center",
                      marginTop: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    Rooms in Hotel
                  </h5>

                  <Row className="room-category-list">
                    {hotel.availableRooms.length > 0 ? (
                      hotel.availableRooms.map((category, index) => (
                        <Col
                          lg="12"
                          md="12"
                          sm="12"
                          key={index}
                          className="mb-4"
                        >
                          <Card
                            className="shadow-sm border-light"
                            style={{
                              borderRadius: "10px",
                              overflow: "hidden",
                              transition: "transform 0.3s",
                            }}
                          >
                            <CardBody style={{ padding: "15px" }}>
                              <div className="text-center">
                                <CardTitle
                                  tag="h5"
                                  className="font-weight-bold"
                                  style={{
                                    fontSize: "1.2rem",
                                    color: "#333",
                                    marginBottom: "10px",
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {category.name}
                                </CardTitle>

                                <img
                                  src={
                                    category.photo ||
                                    "/path/to/default-image.jpg"
                                  }
                                  alt="Room"
                                  style={{
                                    width: "100%",
                                    height: "140px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    marginBottom: "10px",
                                  }}
                                />
                              </div>

                              <CardText
                                style={{
                                  fontSize: "0.9rem",
                                  color: "#555",
                                  lineHeight: "1.5",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginBottom: "8px",
                                    justifyContent: "center",
                                  }}
                                >
                                  <FaDollarSign style={{ color: "#28a745" }} />{" "}
                                  {category.price.toLocaleString()} VND
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginBottom: "8px",
                                    justifyContent: "center",
                                  }}
                                >
                                  <FaUserFriends style={{ color: "#007bff" }} />
                                  {category.availableCount} persons / room
                                </div>
                              </CardText>
                            </CardBody>
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <p
                        className="text-center"
                        style={{
                          fontSize: "0.9rem",
                          color: "#888",
                          marginTop: "15px",
                        }}
                      >
                        No room categories available for this hotel.
                      </p>
                    )}
                  </Row>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No hotels available for this city
          </p>
        )}
      </div>
    </div>
  );
};

export default TourList;
