import { useEffect, useState } from "react";
import TableBooking from "../../components/TableBooking/table";
import BookingModal from "../../components/BookingModal";
import { Button } from "react-bootstrap";
import axios from "axios";

function BookingManagement() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        userId: "",
        userEmail: "",
        tourName: "",
        fullName: "",
        adult: 0,
        children: 0,
        baby: 0,
        guestSize: 0,
        phone: "",
        bookAt: "",
        hotel: "",
        extraBed: 0,
        roomQuantity: 0,
        restaurant: "",
        amount: 0, // Thêm trường amount
    });
    const [editingBooking, setEditingBooking] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("accessToken");

        try {
            const url = editingBooking
                ? `http://localhost:8000/api/v1/payment/${editingBooking._id}`
                : "http://localhost:8000/api/v1/payment"; // Cập nhật URL

            const response = await axios.post(url, {
                bookingId: editingBooking ? editingBooking._id : null, // Nếu có đang chỉnh sửa, gửi bookingId
                amount: formData.amount, // Gửi amount
                ...formData, // Gửi các thông tin khác
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            // Cập nhật bookings sau khi thanh toán thành công
            if (editingBooking) {
                setBookings(
                    bookings.map((booking) =>
                        booking._id === editingBooking._id ? response.data.payment : booking
                    )
                );
            } else {
                setBookings([...bookings, response.data.payment]);
            }

            // Reset form
            resetFormData();
            setEditingBooking(null);
            setShowModal(false);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const resetFormData = () => {
        setFormData({
            userId: "",
            userEmail: "",
            tourName: "",
            fullName: "",
            adult: 0,
            children: 0,
            baby: 0,
            guestSize: 0,
            phone: "",
            bookAt: "",
            hotel: "",
            extraBed: 0,
            roomQuantity: 0,
            restaurant: "",
            amount: 0, // Reset amount
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                const response = await axios.get("http://localhost:8000/api/v1/booking", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBookings(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching bookings:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
            <Button onClick={() => setShowModal(true)}>Add Booking</Button>
            <BookingModal
                show={showModal}
                handleClose={() => {
                    setShowModal(false);
                    resetFormData();
                }}
                handleSubmit={handleSubmit}
                formData={formData}
                handleInputChange={handleInputChange}
                editingBooking={editingBooking}
            />
        </div>
    );
}

export default BookingManagement;
