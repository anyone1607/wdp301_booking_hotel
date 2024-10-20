import React, { useState } from "react";
import { FormControl, InputGroup, Modal, Table } from "react-bootstrap";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./table.css";

function TableBooking({ data }) {
  const [filteredData, setFilteredData] = useState(data);
  const [filterText, setFilterText] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hotel, setHotel] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const bookingsPerPage = 10;
  const navigate = useNavigate();

  const handleToggleStatus = async (id, currentStatus) => {
    let newStatus = currentStatus === "pending" ? "confirmed" : currentStatus === "confirmed" ? "cancelled" : "pending";

    try {
      const response = await axios.put(`http://localhost:8000/api/v1/booking/${id}`, { status: newStatus });
      if (response.data.success) {
        setFilteredData((prevData) =>
          prevData.map((booking) =>
            booking._id === id ? { ...booking, status: newStatus } : booking
          )
        );
      } else {
        console.error("Failed to update booking status");
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
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
    const hotelId = booking.hotelId;
    const restaurantId = booking.restaurantId;

    try {
      const responseHotel = await axios.get(`http://localhost:8000/api/v1/hotels/${hotelId}`);
      setHotel(responseHotel.data);

      const responseRestaurant = await axios.get(`http://localhost:8000/api/v1/restaurants/${restaurantId}`);
      setRestaurant(responseRestaurant.data);
    } catch (error) {
      console.error("Error fetching hotel or restaurant data:", error);
    }

    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handlePaymentSuccess = () => {
    toast.success("Thành công, vui lòng chờ quản lý duyệt booking của bạn.");
    navigate("/my-booking");
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const offset = currentPage * bookingsPerPage;
  const currentBookings = filteredData.slice(offset, offset + bookingsPerPage);
  const pageCount = Math.ceil(filteredData.length / bookingsPerPage);

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
          <Table>
            <thead className="text-primary">
              <tr>
                <th>ID</th>
                <th>Hotel Name</th>
                <th>Room Quantity</th>
                <th>Full Name</th>
                <th>Guest Size</th>
                <th>Phone</th>
                <th>Booking Date</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.map((booking) => (
                <tr key={booking._id} onClick={() => handleShowDetails(booking)} style={{ cursor: "pointer" }}>
                  <td>{booking._id}</td>
                  <td>{booking.hotelId.title}</td>
                  <td>{Array.isArray(booking.roomIds) ? booking.roomIds.length : 0}</td>
                  <td>{booking.name}</td>
                  <td>{booking.adult + booking.children + booking.baby}</td>
                  <td>0{booking.phone}</td>
                  <td>{new Date(booking.bookAt).toLocaleString("VN", { year: "numeric", month: "2-digit", day: "2-digit" })}</td>
                  <td>{booking.totalAmount}</td>
                  <td>
                    <div className="three-way-toggle">
                      <div className={`toggle-switch ${booking.status === "cancelled" ? "left" : booking.status === "confirmed" ? "right" : "middle"}`} onClick={(e) => { e.stopPropagation(); handleToggleStatus(booking._id, booking.status); }}>
                        <span className="toggle-label">Cancelled</span>
                        <span className="toggle-label">Pending</span>
                        <span className="toggle-label">Confirmed</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            previousLinkClassName={"page-link"}
            nextLinkClassName={"page-link"}
            disabledClassName={"disabled"}
            activeClassName={"active"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
          />
        </div>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <div>
              <p><strong>ID:</strong> {selectedBooking._id}</p>
              <p><strong>Hotel Name:</strong> {selectedBooking.hotelId.title}</p>
              <p><strong>Full Name:</strong> {selectedBooking.name}</p>
              <p><strong>Email:</strong> {selectedBooking.email}</p>
              <p><strong>Group Size:</strong> {selectedBooking.adult}-adult || {selectedBooking.children}-children || {selectedBooking.baby}-baby</p>
              <p><strong>Phone:</strong> 0{selectedBooking.phone}</p>
              <p><strong>Room:</strong> {Object.entries(selectedBooking.roomIds.reduce((acc, room) => { acc[room.roomName] = (acc[room.roomName] || 0) + 1; return acc; }, {})).map(([roomName, count], index) => (<span key={index}>{roomName} (x{count}){index < Object.entries(selectedBooking.roomIds).length - 1 ? ", " : ""}</span>))}</p>
              <p><strong>Booking Date:</strong> {new Date(selectedBooking.bookAt).toLocaleString("VN", { year: "numeric", month: "2-digit", day: "2-digit" })}</p>
              <p><strong>Price:</strong> {selectedBooking.totalAmount}</p>
              <p><strong>Status:</strong> {selectedBooking.status}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
          <button className="btn btn-primary" onClick={handlePaymentSuccess}>Confirm Payment</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TableBooking;
