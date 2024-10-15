import React, { useState } from "react";
import { FormControl, InputGroup, Modal, Table } from "react-bootstrap";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify"; // Thêm toastify
import { useNavigate } from "react-router-dom"; // Sử dụng useNavigate
import "./table.css"; // Import file CSS chứa phần styling cho Switch

function TableBooking({ data }) {
  const [filteredData, setFilteredData] = useState(data);
  const [filterText, setFilterText] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hotel, setHotel] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const bookingsPerPage = 10; // Hiển thị 10 hàng mỗi trang
  const navigate = useNavigate(); // Khởi tạo navigate

  // Toggle trạng thái giữa 'pending', 'confirmed' và 'cancelled'
  const handleToggleStatus = async (id, currentStatus) => {
    let newStatus;
    if (currentStatus === "pending") {
      newStatus = "confirmed";
    } else if (currentStatus === "confirmed") {
      newStatus = "cancelled";
    } else {
      newStatus = "pending";
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/api/v1/booking/${id}`,
        { status: newStatus }
      );
      if (response.data.success) {
        setFilteredData((prevData) =>
          prevData.map((booking) =>
            booking._id === id ? { ...booking, status: newStatus } : booking
          )
        );
        console.log(`Booking status changed to ${newStatus}`);
      } else {
        console.error(`Failed to update booking status to ${newStatus}`);
      }
    } catch (error) {
      console.error(`Error updating booking status to ${newStatus}:`, error);
    }
  };

  // Lọc dữ liệu theo Booking ID
  const handleFilterChange = (e) => {
    const text = e.target.value;
    setFilterText(text);
    const filtered = data.filter((booking) =>
      booking._id.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Đóng modal hiển thị chi tiết booking
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  // Hiển thị chi tiết booking khi nhấn vào hàng trong bảng
  const handleShowDetails = async (booking) => {
    const hotelId = booking.hotelId;
    const restaurantId = booking.restaurantId;

    try {
      const responseHotel = await axios.get(
        `http://localhost:8000/api/v1/hotels/${hotelId}`,
        {
          withCredentials: true,
        }
      );
      setHotel(responseHotel.data);

      const responseRestaurant = await axios.get(
        `http://localhost:8000/api/v1/restaurants/${restaurantId}`,
        {
          withCredentials: true,
        }
      );
      setRestaurant(responseRestaurant.data);
    } catch (error) {
      console.error("Error fetching hotel or restaurant data:", error);
    }

    setSelectedBooking(booking);
    setShowModal(true);
  };

  // Hàm xử lý thanh toán thành công
  const handlePaymentSuccess = () => {
    toast.success("Thành công, vui lòng chờ quản lý duyệt booking của bạn.");
    navigate("/my-booking"); // Chuyển hướng về /my-booking
  };

  // Phân trang
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
                <th>Tour Name</th>
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
                <tr
                  key={booking._id}
                  onClick={() => handleShowDetails(booking)}
                  style={{ cursor: "pointer" }}
                >
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
                  <td>{booking.price}</td>
                  <td>
                    {/* Switch 3 trạng thái */}
                    <div className="three-way-toggle">
                      <div
                        className={`toggle-switch ${
                          booking.status === "cancelled"
                            ? "left"
                            : booking.status === "confirmed"
                            ? "right"
                            : "middle"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(booking._id, booking.status);
                        }}
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

      {/* Modal hiển thị chi tiết booking */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <div>
              <p>
                <strong>ID:</strong> {selectedBooking._id}
              </p>
              <p>
                <strong>Tour Name:</strong> {selectedBooking.tourName}
              </p>
              <p>
                <strong>Full Name:</strong> {selectedBooking.fullName}
              </p>
              <p>
                <strong>Email:</strong> {selectedBooking.userEmail}
              </p>
              <p>
                <strong>Group Size:</strong> {selectedBooking.adult}-adult ||{" "}
                {selectedBooking.children}-children || {selectedBooking.baby}
                -baby
              </p>
              <p>
                <strong>Phone:</strong> 0{selectedBooking.phone}
              </p>
              <p>
                <strong>Hotel:</strong> {hotel ? hotel.name : "Not available"}
              </p>
              <p>
                <strong>Restaurant:</strong>{" "}
                {restaurant ? restaurant.name : "Not available"}
              </p>
              <p>
                <strong>Room:</strong> {selectedBooking.roomQuantity} +{" "}
                {selectedBooking.extraBed}(extraBed)
              </p>
              <p>
                <strong>Booking Date:</strong>{" "}
                {new Date(selectedBooking.bookAt).toLocaleString("VN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </p>
              <p>
                <strong>Price:</strong> {selectedBooking.price}
              </p>
              <p>
                <strong>Status:</strong> {selectedBooking.status}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseModal}>
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={handlePaymentSuccess}
          >
            Confirm Payment
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TableBooking;
