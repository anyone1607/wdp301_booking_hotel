// src/pages/MyBookings.js
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Pagination,
} from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL } from "../../utils/config";
import Swal from "sweetalert2";
import "../../styles/mybooking.css";
import { format } from "date-fns";
import CommonSection from "../../shared/CommonSection";

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [tours, setTours] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundData, setRefundData] = useState({
    bankNumber: "",
    bankName: "",
    reasons: "",
    name: "",
    paymentId: "",
  });
  const [errors, setErrors] = useState({
    bankName: "",
    bankNumber: "",
    name: "",
    reasons: "",
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 6; // Number of bookings per page

  const userId = user ? user._id : null;
const bankList = [
  { name: "Ngân hàng Ngoại thương Việt Nam (Vietcombank)", code: "VCB" },
  { name: "Ngân hàng Đầu tư và Phát triển Việt Nam (BIDV)", code: "BID" },
  { name: "Ngân hàng Kỹ thương Việt Nam (Techcombank)", code: "TCB" },
  { name: "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam (Agribank)", code: "AGB" },
  { name: "Ngân hàng Quân đội (MB Bank)", code: "MBB" },
  { name: "Ngân hàng Việt Nam Thịnh Vượng (VPBank)", code: "VPB" },
  { name: "Ngân hàng Sài Gòn Thương Tín (Sacombank)", code: "STB" },
  { name: "Ngân hàng HSBC Việt Nam", code: "HSBC" },
  { name: "Ngân hàng Tiên Phong (TPBank)", code: "TPB" },
  { name: "Ngân hàng Shinhan", code: "SHB" },
  { name: "Ngân hàng Xuất Nhập Khẩu Việt Nam (Eximbank)", code: "EIB" },
  { name: "Ngân hàng ANZ Việt Nam", code: "ANZ" },
  { name: "Ngân hàng Phương Đông (OCB)", code: "OCB" },
  { name: "Ngân hàng Bản Việt (Viet Capital Bank)", code: "VBB" },
  { name: "Ngân hàng Hàng Hải Việt Nam (Maritime Bank)", code: "MSB" },
  { name: "Ngân hàng Quốc dân (NCB)", code: "NCB" },
  { name: "Ngân hàng Sài Gòn Công thương (Saigonbank)", code: "SGI" },
  { name: "Ngân hàng TMCP Việt Á (Viet A Bank)", code: "VAB" },
  { name: "Ngân hàng TMCP Đông Á (DongABank)", code: "DAB" },
  { name: "Ngân hàng Liên Việt Post Bank", code: "LPB" },
  { name: "Ngân hàng Việt Nam Thương Tín (VietBank)", code: "VietBank" },
  { name: "Ngân hàng Hàng hải (MSB)", code: "MSB" },
  { name: "Ngân hàng Bản Việt", code: "VBB" },
  { name: "Ngân hàng Saigon – Hà Nội (SHB)", code: "SHB" },
  { name: "Ngân hàng Vietcapital Bank", code: "VCB" },
  { name: "Ngân hàng TMCP Bắc Á (Bac A Bank)", code: "BAB" },
  { name: "Ngân hàng Quốc tế (VIB)", code: "VIB" },
  { name: "Ngân hàng Hàng không (Vietjet Bank)", code: "VJB" },
  { name: "Ngân hàng Bảo Việt (Bao Viet Bank)", code: "BVB" },
  { name: "Ngân hàng TMCP Sài Gòn", code: "SCB" },
  { name: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)", code: "BID" },
  { name: "Ngân hàng PVcomBank", code: "PVCOMBANK" },
  { name: "Ngân hàng An Bình (ABBANK)", code: "ABB" },
  { name: "Ngân hàng Hàng hải (Maritime Bank)", code: "MSB" },
  { name: "Ngân hàng Việt Nam Thịnh Vượng (VPBank)", code: "VPB" },
  { name: "Ngân hàng Tài chính cổ phần", code: "HDB" },
];


  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const [bookingsResponse, toursResponse] = await Promise.all([
          axios.get(`${BASE_URL}/booking/user/${userId}`, {
            withCredentials: true,
          }),
          axios.get(`${BASE_URL}/tours`, { withCredentials: true }),
        ]);

        setBookings(bookingsResponse.data.data);
        setTours(toursResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user, userId]);

  const handleShowRefundModal = async (booking) => {
    setSelectedBooking(booking);
    setRefundData({
      bankNumber: "",
      name: "",
      bankName: "",
      reasons: "",
      paymentId: "", // Reset paymentId here
    });

    // Fetch the paymentId from the API
    try {
      const paymentResponse = await axios.get(
        `${BASE_URL}/payment/${booking._id}`,
        { withCredentials: true }
      );
      setRefundData((prevData) => ({
        ...prevData,
        paymentId: paymentResponse.data.data._id, // Set paymentId from response
      }));
    } catch (error) {
      console.error("Error fetching paymentId:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not fetch payment ID. Please try again later.",
      });
    }

    setShowRefundModal(true);
  };

  const handleCloseRefundModal = () => {
    setShowRefundModal(false);
    setSelectedBooking(null);
  };
  const validateForm = () => {
    const newErrors = {};

    if (!refundData.bankName) {
      newErrors.bankName = "Please select a bank.";
    }
    if (!refundData.bankNumber) {
      newErrors.bankNumber = "Bank account number is required.";
    } else if (!/^\d+$/.test(refundData.bankNumber)) {
      // Kiểm tra định dạng số
      newErrors.bankNumber = "Bank account number must be numeric.";
    }
    if (!refundData.name) {
      newErrors.name = "Account holder name is required.";
    }
    if (!refundData.reasons) {
      newErrors.reasons = "Reason for refund is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };

  const handleRefundSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Nếu có lỗi, không gửi form
    }

    try {
      const response = await axios.post(`${BASE_URL}/refund/`, refundData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Refund request created successfully",
          showConfirmButton: true,
          confirmButtonText: "OK",
          confirmButtonColor: "#3085d6",
          timer: 1500,
        });
        handleCloseRefundModal();
      }
    } catch (error) {
      console.error("Error creating refund request:", error);
      Swal.fire({
        icon: "error",
        title: "Refund Error",
        text: "There was an error creating the refund request. Please try again.",
      });
    }
  };

  const mapBookingToTour = (booking) => {
    const tourInfo = tours.find((tour) => tour.title === booking.tourName);
    return { ...booking, tourInfo: tourInfo || null };
  };

  const bookingsWithTourInfo = bookings.map(mapBookingToTour);

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/booking/cancel/${bookingId}`,
        null,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId
              ? { ...booking, status: "cancelled" }
              : booking
          )
        );
        Swal.fire({
          icon: "success",
          title: "Booking cancelled successfully",
          showConfirmButton: true,
          confirmButtonText: "OK",
          confirmButtonColor: "#3085d6",
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      Swal.fire({
        icon: "error",
        title: "Cancellation Error",
        text: "There was an error cancelling the booking. Please try again.",
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  // Pagination logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookingsWithTourInfo.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );
  const totalPages = Math.ceil(bookingsWithTourInfo.length / bookingsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <CommonSection title="My Bookings" />
      <Container>
        <br />
        <br />
        {currentBookings.length === 0 ? (
          <p>You don't have any booked tours yet.</p>
        ) : (
          <>
            <Row>
              {currentBookings.map((booking) => (
                <Col lg="4" md="6" sm="6" className="mb-4" key={booking._id}>
                  <Card style={{ width: "100%", height: "100%" }}>
                    <Card.Body>
                      <Card.Title>{booking.hotelId.title}</Card.Title>
                      {booking.hotelId.photo && (
                        <Card.Img
                          variant="top"
                          src={booking.hotelId.photo}
                          alt="Hotel"
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <Card.Text>
                        <strong>Name:</strong> {booking.name}
                        <br />
                        <strong>Phone:</strong> {booking.phone}
                        <br />
                        <strong>Email:</strong> {booking.email}
                        <br />
                        <strong>Check-in Date:</strong>{" "}
                        {format(new Date(booking.bookAt), "dd-MM-yyyy")}
                        <br />
                        <strong>Check-out Date:</strong>{" "}
                        {format(new Date(booking.checkOut), "dd-MM-yyyy")}
                        <br />
                        <strong>Total Amount:</strong> {booking.totalAmount} VND
                        <br />
                        <strong>Room(s):</strong>
                        <ul>
                          {Object.entries(
                            booking.roomIds.reduce((acc, room) => {
                              acc[room.roomName] =
                                (acc[room.roomName] || 0) + 1;
                              return acc;
                            }, {})
                          ).map(([roomName, quantity]) => (
                            <li key={roomName}>
                              {roomName} (x{quantity})
                            </li>
                          ))}
                        </ul>
                        <strong>Extras:</strong>
                        <ul>
                          {booking.extraIds.length > 0 ? (
                            booking.extraIds.map((extra) => (
                              <li key={extra._id}>{extra.extraName}</li>
                            ))
                          ) : (
                            <li>No extras added</li>
                          )}
                        </ul>
                        <strong>Status:</strong>
                        <span className={booking.status}>{booking.status}</span>
                      </Card.Text>
                      {booking.status === "confirmed" && (
                        <Button
                          variant="warning"
                          onClick={() => handleShowRefundModal(booking)}
                        >
                          Refund
                        </Button>
                      )}

                      {/* {booking.status === "pending" && (
                      <>
                        <Button className="mx-2" variant="danger" onClick={() => handleCancelBooking(booking._id)}>
                          Cancel Booking
                        </Button>
                      </>
                    )} */}
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
                      {booking.status === "pending" && (
                        <Button variant="warning" disabled>
                          Refund processing
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            {/* Pagination Component */}
            <Pagination className="justify-content-center mt-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </>
        )}

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Booking Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedBooking && (
              <>
                <p>
                  <strong>Hotel Name:</strong> {selectedBooking.hotelId.title}
                </p>
                <p>
                  <strong>Book Date:</strong>{" "}
                  {format(new Date(selectedBooking.bookAt), "dd-MM-yyyy")}
                </p>
                <p>
                  <strong>Check Out:</strong>{" "}
                  {format(new Date(selectedBooking.checkOut), "dd-MM-yyyy")}
                </p>
                <p>
                  <strong>Name:</strong> {selectedBooking.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedBooking.email}
                </p>
                <p>
                  <strong>Group Size:</strong> {selectedBooking.adult} Adult ||{" "}
                  {selectedBooking.children} Children || {selectedBooking.baby}{" "}
                  Baby
                </p>
                <p>
                  <strong>Phone:</strong> {selectedBooking.phone}
                </p>
                <p>
                  <strong>Rooms:</strong>
                  <ul>
                    {Object.entries(
                      selectedBooking.roomIds.reduce((acc, room) => {
                        acc[room.roomName] = (acc[room.roomName] || 0) + 1;
                        return acc;
                      }, {})
                    ).map(([roomName, quantity]) => (
                      <li key={roomName}>
                        {roomName} (x{quantity})
                      </li>
                    ))}
                  </ul>
                </p>
                <p>
                  <strong>Extras:</strong>
                  <ul>
                    {selectedBooking.extraIds.length > 0 ? (
                      selectedBooking.extraIds.map((extra) => (
                        <li key={extra._id}>{extra.extraName}</li>
                      ))
                    ) : (
                      <li>No extras added</li>
                    )}
                  </ul>
                </p>
                <p>
                  <strong>Total Amount:</strong> {selectedBooking.totalAmount}{" "}
                  VND
                </p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showRefundModal} onHide={handleCloseRefundModal}>
          <Modal.Header closeButton>
            <Modal.Title>Request Refund</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleRefundSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Payment ID</Form.Label>
                <Form.Control
                  type="text"
                  value={refundData.paymentId}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Bank Name</Form.Label>
                <Form.Select
                  value={refundData.bankName}
                  onChange={(e) =>
                    setRefundData({ ...refundData, bankName: e.target.value })
                  }
                >
                  <option value="">Select Bank</option>
                  {bankList.map((bank, index) => (
                    <option key={index} value={bank}>
                      {bank.name}
                    </option>
                  ))}
                </Form.Select>
                {errors.bankName && (
                  <span className="text-danger">{errors.bankName}</span>
                )}{" "}
                {/* Hiển thị thông báo lỗi */}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Bank Account Number</Form.Label>
                <Form.Control
                  type="text"
                  value={refundData.bankNumber}
                  onChange={(e) =>
                    setRefundData({ ...refundData, bankNumber: e.target.value })
                  }
                />
                {errors.bankNumber && (
                  <span className="text-danger">{errors.bankNumber}</span>
                )}{" "}
                {/* Hiển thị thông báo lỗi */}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Account Holder Name</Form.Label>
                <Form.Control
                  type="text"
                  value={refundData.name}
                  onChange={(e) =>
                    setRefundData({ ...refundData, name: e.target.value })
                  }
                />
                {errors.name && (
                  <span className="text-danger">{errors.name}</span>
                )}{" "}
                {/* Hiển thị thông báo lỗi */}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Reason for Refund</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={refundData.reasons}
                  onChange={(e) =>
                    setRefundData({ ...refundData, reasons: e.target.value })
                  }
                />
                {errors.reasons && (
                  <span className="text-danger">{errors.reasons}</span>
                )}{" "}
                {/* Hiển thị thông báo lỗi */}
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit Refund Request
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default MyBookings;
