import React, { useState, useEffect } from "react";
import { Button, FormControl, InputGroup, Modal, Table } from "react-bootstrap";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/config";

import "./table.css";

function TableBooking({ data }) {
  const [filteredData, setFilteredData] = useState(data);
  const [filterText, setFilterText] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hotel, setHotel] = useState(null);
  const [payments, setPayments] = useState({}); // Lưu trạng thái thanh toán dưới dạng object
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundDetails, setRefundDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const bookingsPerPage = 10;
  const navigate = useNavigate();

  // Lấy trạng thái thanh toán cho từng booking khi component được render
  useEffect(() => {
    const fetchPayments = async () => {
      const paymentStatus = {};
      for (const booking of data) {
        try {
          const response = await axios.get(`${BASE_URL}/payment/${booking._id}`);
          paymentStatus[booking._id] = response.data.data ? response.data.data.status : 'No payment'; // Nếu không có payment, set 'No payment'
        } catch (error) {
          console.error(`Error fetching payment for booking ${booking._id}:`, error);
          paymentStatus[booking._id] = 'Error fetching payment'; // Thông báo lỗi nếu không lấy được payment
        }
      }
      setPayments(paymentStatus); // Cập nhật trạng thái thanh toán
    };

    fetchPayments();
  }, [data]);

  const handleToggleStatus = async (id, currentStatus) => {
    let newStatus = currentStatus === "pending" ? "confirmed" : currentStatus === "confirmed" ? "cancelled" : "pending";

    try {
      const response = await axios.put(`${BASE_URL}/booking/${id}`, { status: newStatus });
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

    try {
      const responseHotel = await axios.get(`${BASE_URL}/hotels/${hotelId}`);
      setHotel(responseHotel.data);
    } catch (error) {
      console.error("Error fetching hotel or restaurant data:", error);
    }
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleRefundDetails = async (bookingId) => {
    try {
      const response = await axios.get(`${BASE_URL}/refund/bookingId/${bookingId}`);
      if (response.data.length === 0) {
        toast.info("Booking has no refund.");
      } else {
        setRefundDetails(response.data[0]);
      }
      setShowRefundModal(true);
    } catch (error) {
      console.error("Error fetching refund details:", error);
    }
  };

  const handleAcceptRefund = async () => {
    if (!refundDetails) return;

    const bookingId = refundDetails.paymentId.bookingId; // Giả sử `paymentId` chứa thông tin về bookingId

    try {
      const response = await axios.put(`${BASE_URL}/booking/${bookingId}`, { status: "cancelled" });
      if (response.data.success) {
        setFilteredData((prevData) =>
          prevData.map((booking) =>
            booking._id === bookingId ? { ...booking, status: "cancelled" } : booking
          )
        );
        toast.success("Booking status updated to cancelled");
      } else {
        toast.error("Failed to update booking status");
      }
      setShowRefundModal(false); // Đóng modal refund sau khi thành công
    } catch (error) {
      console.error("Error updating booking status to cancelled:", error);
      toast.error("An error occurred while updating the booking status");
    }
  };



  const handlePaymentSuccess = () => {
    toast.success("Thành công, vui lòng chờ quản lý duyệt booking của bạn.");
    navigate("/booking-management");
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
                <th>Payment Status</th> {/* Thêm cột trạng thái thanh toán */}
                <th>Refund</th>
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
                  <td

                    style={{
                      backgroundColor: payments[booking._id] === "confirmed" ? "blue" : "transparent",
                      color: payments[booking._id] === "confirmed" ? "white" : "black",
                    }}
                  >
                    {payments[booking._id] || "Loading..."}
                  </td> {/* Hiển thị trạng thái thanh toán */}
                  <td>
                    {payments[booking._id] === "confirmed" && booking.status === "pending" ? (
                      <Button variant="info" onClick={(e) => { e.stopPropagation(); handleRefundDetails(booking._id); }}>
                        View Refund
                      </Button>
                    ) : (
                      <span>N/A</span>
                    )}
                  </td>
                  <td>
                    <div className="three-way-toggle">
                      <div
                        className={`toggle-switch ${booking.status === "cancelled" ? "left" : booking.status === "confirmed" ? "right" : "middle"}`}
                        onClick={(e) => { e.stopPropagation(); handleToggleStatus(booking._id, booking.status); }}
                      >
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
              <p>
                <strong>Room:</strong>
                {Object.entries(selectedBooking.roomIds.reduce((acc, room) => { acc[room.roomName] = (acc[room.roomName] || 0) + 1; return acc; }, {}))
                  .map(([roomName, count], index) => (<span key={index}>{" "}{roomName} (x{count}){index < Object.entries(selectedBooking.roomIds).length - 1 ? ", " : ""}</span>))}
              </p>
              <p>
                <strong>Extra Fees:</strong>
                {selectedBooking.extraIds.length > 0 ? (
                  selectedBooking.extraIds.map((extra, index) => (
                    <span key={index}>
                      {" "}
                      {extra.extraName}
                      {index < selectedBooking.extraIds.length - 1 ? ", " : ""}
                    </span>
                  ))
                ) : (
                  " None"
                )}
              </p>
              <p><strong>Total Price:</strong> {selectedBooking.totalAmount}</p>
              <p><strong>Booking Date:</strong> {new Date(selectedBooking.bookAt).toLocaleString("VN", { year: "numeric", month: "2-digit", day: "2-digit" })}</p>
              <p><strong>Booking CheckOut:</strong> {new Date(selectedBooking.checkOut).toLocaleString("VN", { year: "numeric", month: "2-digit", day: "2-digit" })}</p>
              {hotel && (
                <>
                  <p><strong>Hotel Name:</strong> {hotel.title}</p>
                  <p><strong>Hotel Address:</strong> {hotel.address}</p>
                  <p><strong>Hotel Price:</strong> {hotel.cheapestPrice}</p>
                </>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {/* <button className="btn btn-primary" onClick={handlePaymentSuccess}>Thanh toán</button> */}
          <button className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
        </Modal.Footer>
      </Modal>
      {/* Modal Refund Details */}
      <Modal show={showRefundModal} onHide={() => setShowRefundModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Refund Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {refundDetails ? (
            <div>
              <p><strong>Refund Amount:</strong> {refundDetails.paymentId.amount} VND</p>
              <p><strong>Banking:</strong> {refundDetails.bankName}</p>
              <p><strong>STK:</strong> {refundDetails.bankNumber}</p>
              <p><strong>CTK:</strong> {refundDetails.name}</p>
              <p><strong>Reason:</strong> {refundDetails.reasons}</p>
              <p><strong>Refund Date:</strong> {new Date(refundDetails.createdAt).toLocaleString("VN", { year: "numeric", month: "2-digit", day: "2-digit" })}</p>
              {/* Nút Accept */}
              <Button variant="success" onClick={handleAcceptRefund}>Accept</Button>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRefundModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TableBooking;