import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL } from "../../utils/config";
import Swal from "sweetalert2";
import "../../styles/mybooking.css";
import { format } from "date-fns";
import TourCardBooking from "../../components/Tourdetail-mybooking/TourCard";
import CommonSection from "../../shared/CommonSection";

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [tours, setTours] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [hotel, setHotel] = useState(null);
    const [restaurant, setRestaurant] = useState(null);
    const userId = user ? user._id : null;

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                return; // Do not fetch if user is not logged in
            }

            try {
                const bookingsResponse = await axios.get(`${BASE_URL}/booking/user/${userId}`, {
                    withCredentials: true,
                });
                const toursResponse = await axios.get(`${BASE_URL}/tours`, {
                    withCredentials: true,
                });
                setBookings(bookingsResponse.data.data);
                setTours(toursResponse.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [user, userId]);

    const mapBookingToTour = (booking) => {
        const tourInfo = tours.find((tour) => tour.title === booking.tourName);
        return { ...booking, tourInfo: tourInfo || null };
    };

    const bookingsWithTourInfo = bookings.map(mapBookingToTour);

    const handleCancelBooking = async (bookingId) => {
        try {
            const response = await axios.put(`${BASE_URL}/booking/cancel/${bookingId}`, null, {
                withCredentials: true,
            });

            if (response.status === 200) {
                const updatedBookings = bookings.map((booking) =>
                    booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
                );
                setBookings(updatedBookings);
                Swal.fire({
                    icon: "success",
                    title: "Booking cancelled successfully",
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                    confirmButtonColor: "#3085d6",
                    timer: 1500,
                });
            } else {
                console.error("Failed to cancel booking");
            }
        } catch (error) {
            console.error("Error cancelling booking:", error);
        }
    };

    const handleShowDetails = async (booking) => {
        const hotelId = booking.hotelId; // Assuming booking contains hotel and restaurant IDs
        const restaurantId = booking.restaurantId;

        try {
            const responseHotel = await axios.get(`${BASE_URL}/hotels/${hotelId}`, {
                withCredentials: true,
            });
            setHotel(responseHotel.data);

            const responseRestaurant = await axios.get(`${BASE_URL}/restaurants/${restaurantId}`, {
                withCredentials: true,
            });
            setRestaurant(responseRestaurant.data);
        } catch (error) {
            console.error("Error fetching hotel or restaurant data:", error);
        }

        setSelectedBooking(booking);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBooking(null);
    };

    const handlePayment = async (booking) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/payment/create-payment-link`,
                {
                    amount: booking.price,
                    bookingId: booking._id, // Pass booking ID to link it with payment
                },
                { withCredentials: true }
            );

            if (response.status === 200) {
                const { checkoutUrl } = response.data;
                window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
            } else {
                console.error("Failed to create payment link");
            }
        } catch (error) {
            console.error("Error creating payment link:", error);
        }
    };

    return (
        <>
        <CommonSection title="My Bookings" />
        <Container>
            <br/>
            <br/>
            {bookingsWithTourInfo.length === 0 ? (
                <p>You don't have any booked tours yet.</p>
            ) : (
                <Row>
                    {bookingsWithTourInfo.map((booking) => (
                        <Col lg="4" md="6" sm="6" className="mb-4" key={booking._id}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        {booking.tourName || "Tour not found"}
                                    </Card.Title>
                                    {booking.tourInfo ? (
                                        <TourCardBooking tour={booking.tourInfo} />
                                    ) : (
                                        <p>Tour information not available</p>
                                    )}
                                    <Card.Text>
                                        <strong>Date:</strong> {format(new Date(booking.bookAt), "dd-MM-yyyy")}
                                        <br />
                                        <strong>Status:</strong> <span className={
                                            booking.status === 'pending' ? 'status-pending' :
                                                booking.status === 'confirmed' ? 'status-confirmed' :
                                                    booking.status === 'cancelled' ? 'status-cancelled' : ''
                                        }>{booking.status}</span>
                                    </Card.Text>

                                    <Button variant="primary" onClick={() => handleShowDetails(booking)}>
                                        Details
                                    </Button>
                                    {booking.status === "pending" && (
                                        <>
                                            <Button className="mx-2"
                                                variant="danger"
                                                onClick={() => handleCancelBooking(booking._id)}
                                            >
                                                Cancel Booking
                                            </Button>

                                            <Button
                                                variant="success"
                                                onClick={() => handlePayment(booking)}
                                            >
                                                Pay Now
                                            </Button>
                                        </>
                                    )}
                                    {booking.status === "confirmed" && (
                                        <Button variant="info" disabled>
                                            Payment Completed
                                        </Button>
                                    )}
                                    {booking.status === "cancelled" && (
                                        <Button variant="secondary" disabled>
                                            Booking Cancelled
                                        </Button>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Booking Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBooking && (
                        <>
                            <p><strong>Tour Name:</strong> {selectedBooking.tourName}</p>
                            <p><strong>Book Date:</strong> {format(new Date(selectedBooking.bookAt), "dd-MM-yyyy")}</p>
                            <p><strong>Full Name:</strong> {selectedBooking.fullName}</p>
                            <p><strong>Email:</strong> {selectedBooking.userEmail}</p>
                            <p><strong>Group Size:</strong> {selectedBooking.adult}-adult || {selectedBooking.children}-children || {selectedBooking.baby}-baby</p>
                            <p><strong>Phone:</strong> {selectedBooking.phone}</p>
                            <p><strong>Hotel:</strong> {hotel ? hotel.name : "Not available"}</p>
                            <p><strong>Restaurant:</strong> {restaurant ? restaurant.name : "Not available"}</p>
                            <p><strong>Room:</strong> {selectedBooking.roomQuantity} + {selectedBooking.extraBed}(extraBed)</p>
                            <p><strong>Status:</strong> <span className={
                                selectedBooking.status === 'pending' ? 'status-pending' :
                                    selectedBooking.status === 'confirmed' ? 'status-confirmed' :
                                        selectedBooking.status === 'cancelled' ? 'status-cancelled' : ''
                            }>{selectedBooking.status}</span></p>
                            <p><strong>Total:</strong> ${selectedBooking.price}</p>

                            {selectedBooking.tourInfo && (
                                <>
                                    <h5>Tour Information</h5>
                                    <TourCardBooking tour={selectedBooking.tourInfo} />
                                </>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
        </>
    );
};

export default MyBookings;
