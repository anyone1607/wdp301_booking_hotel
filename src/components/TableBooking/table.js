import React, { useState } from "react";
import { Button, FormControl, InputGroup, Modal } from "react-bootstrap";
import axios from 'axios';

function TableBooking({ data, handleDelete }) {
    const [filteredData, setFilteredData] = useState(data);
    const [filterText, setFilterText] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [hotel, setHotel] = useState(null);
    const [restaurant, setRestaurant] = useState(null);
    const handleConfirm = async (id) => {
        try {
            const response = await axios.put(`http://localhost:8000/api/v1/booking/confirm-and-send-email/${id}`, { status: 'confirmed' });
            if (response.data.success) {
                // Update the status in the local state
                setFilteredData((prevData) =>
                    prevData.map((booking) =>
                        booking._id === id ? { ...booking, status: 'confirmed' } : booking
                    )
                );
                console.log("Booking confirmed and email sent successfully");
            } else {
                console.error("Failed to confirm booking and send email");
            }
        } catch (error) {
            console.error("Error confirming booking and sending email:", error);
        }
    };

    const handleCancel = async (id) => {
        try {
            const response = await axios.put(`http://localhost:8000/api/v1/booking/${id}`, { status: 'cancelled' });
            if (response.data.success) {
                // Update the status in the local state
                setFilteredData((prevData) =>
                    prevData.map((booking) =>
                        booking._id === id ? { ...booking, status: 'cancelled' } : booking
                    )
                );
                console.log("Booking cancelled successfully");
            } else {
                console.error("Failed to cancel booking");
            }
        } catch (error) {
            console.error("Error cancelling booking:", error);
        }
    };

    const handleFilterChange = (e) => {
        const text = e.target.value;
        setFilterText(text);
        const filtered = data.filter((booking) =>
            booking._id.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBooking(null);
    };


    const handleShowDetails = async (booking) => {
        const hotelId = booking.hotelId; // Assuming booking contains hotel and restaurant IDs
        const restaurantId = booking.restaurantId;

        try {
            const responseHotel = await axios.get(`http://localhost:8000/api/v1/hotels/${hotelId}`, {
                withCredentials: true,
            });
            setHotel(responseHotel.data);

            const responseRestaurant = await axios.get(`http://localhost:8000/api/v1/restaurants/${restaurantId}`, {
                withCredentials: true,
            });
            setRestaurant(responseRestaurant.data);
        } catch (error) {
            console.error("Error fetching hotel or restaurant data:", error);
        }

        setSelectedBooking(booking);
        setShowModal(true);
    };

    return (
        <div className="card" style={{ width: "100%" }}>
            <div className="card-body">
                <InputGroup className="mb-3">
                    <FormControl
                        placeholder="Filter by Booking ID"
                        value={filterText}
                        onChange={handleFilterChange}
                    />
                </InputGroup>
                <div className="table-responsive">
                    <table className="table">
                        <thead className="text-primary">
                            <tr>
                                <th>ID</th>
                                <th>Tour Name</th>
                                <th>Full Name</th>
                                <th>Guest Size</th>
                                <th>Phone</th>
                                <th>Booking Date</th>
                                <th>Status</th>
                                <th>Price</th>
                                <th>Actions</th>
                                <th>Cancel</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((booking) => (
                                <tr key={booking._id} onClick={() => handleShowDetails(booking)} style={{ cursor: "pointer" }}>
                                    <td>{booking._id}</td>
                                    <td>{booking.tourName}</td>
                                    <td>{booking.fullName}</td>
                                    <td>{booking.adult + booking.children + booking.baby}</td>
                                    <td>0{booking.phone}</td>
                                    <td>
                                        {new Date(booking.bookAt).toLocaleString("VN", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                        })}
                                    </td>
                                    <td>{booking.status}</td>
                                    <td>{booking.price}</td>
                                    <td>
                                        {booking.status === 'pending' && (
                                            <Button
                                                variant="success"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent row click event from firing
                                                    handleConfirm(booking._id);
                                                }}
                                            >
                                                Confirm
                                            </Button>
                                        )}
                                    </td>
                                    <td>
                                        {booking.status === 'pending' && (
                                            <Button
                                                variant="danger"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent row click event from firing
                                                    handleCancel(booking._id);
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for booking details */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Booking Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBooking && (
                        <div>
                            <p><strong>ID:</strong> {selectedBooking._id}</p>
                            <p><strong>Tour Name:</strong> {selectedBooking.tourName}</p>
                            <p><strong>Full Name:</strong> {selectedBooking.fullName}</p>
                            <p><strong>Email:</strong> {selectedBooking.userEmail}</p>
                            <p><strong>Group Size:</strong> {selectedBooking.adult}-adult || {selectedBooking.children}-children || {selectedBooking.baby}-baby</p>
                            <p><strong>Phone:</strong> 0{selectedBooking.phone}</p>
                            <p><strong>Hotel:</strong> {hotel ? hotel.name : "Not available"}</p>
                            <p><strong>Restaurant:</strong> {restaurant ? restaurant.name : "Not available"}</p>
                            <p><strong>Room:</strong> {selectedBooking.roomQuantity} + {selectedBooking.extraBed}(extraBed)</p>
                            <p><strong>Booking Date:</strong> {new Date(selectedBooking.bookAt).toLocaleString("VN", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                            })}</p>
                            <p><strong>Status:</strong> {selectedBooking.status}</p>
                            <p><strong>Price:</strong> {selectedBooking.price}</p>
                           
                        
                           
                            {/* Display Itinerary Details */}
                            {selectedBooking.itinerary && (
                                <div>
                                    <p><strong>Itinerary:</strong></p>
                                    <ul>
                                        {selectedBooking.itinerary.map((item, index) => (
                                            <li key={index}>
                                                <p><strong>Day {item.day}:</strong> {item.detail}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default TableBooking;
