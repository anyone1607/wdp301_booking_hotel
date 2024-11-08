import { useEffect, useState } from "react";
import TableBooking from "../../components/TableBooking/table";
import BookingModal from "../../components/BookingModal";
import Booking from "../../components/Booking/Booking";
import { Button, Form } from "react-bootstrap";
import axios from "axios";

function BookingManagement() {
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [hotels, setHotels] = useState([]);
    const [selectHotels, setSelectHotels] = useState(null);  // Changed to hold a single selected hotel

    const handleDelete = async (id) => {
        const token = localStorage.getItem("accessToken");
        try {
            await axios.delete(`http://localhost:8000/api/v1/booking/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBookings(bookings.filter((booking) => booking._id !== id));
        } catch (error) {
            console.error("Error deleting booking:", error);
        }
    };

    // Fetch bookings
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                const response = await axios.get("http://localhost:8000/api/v1/booking", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                // Sort bookings by createdAt in descending order
                const sortedBookings = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
                setBookings(sortedBookings);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching bookings:", error);
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);
    

    // Fetch hotels/tours
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                const response = await axios.get("http://localhost:8000/api/v1/tours", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setHotels(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching tours:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle hotel selection
    const handleHotelSelect = (e) => {
        const selectedHotelId = e.target.value;
        const selectedHotel = hotels.find(hotel => hotel._id === selectedHotelId);
        setSelectHotels(selectedHotel);  // Set selected hotel data
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="tours-container">
            <h2>Bookings Management</h2>
            <TableBooking
                data={bookings}
                handleDelete={handleDelete}
            />

            {/* Hotel Selection Dropdown */}
            <Form.Group controlId="selectHotel">
                <Form.Label><strong>Select a hotel for Booking</strong></Form.Label>
                <Form.Control as="select" onChange={handleHotelSelect}>
                    <option value="">Select a hotel for Booking</option>
                    {hotels.map(hotel => (
                        <option key={hotel._id} value={hotel._id}>
                            {hotel.title}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>

            {/* Pass selected hotel to Booking component */}
            {selectHotels && <Booking tour={selectHotels} avgRating={selectHotels.avgRating} />}
        </div>
    );
}

export default BookingManagement;
