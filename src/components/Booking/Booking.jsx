import React, { useState, useContext, useEffect } from 'react';
import './booking.css';
import { Form, FormGroup, Button, Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config';
import axios from 'axios';
import Swal from "sweetalert2";

const Booking = ({ tour, avgRating }) => {
   const { price, reviews, title } = tour;
   const [itinerary, setItinerary] = useState([]);
   const [roomCategories, setRoomCategories] = useState([]);
   const [extraFee, setExtraFee] = useState([]);
   const [selectedRooms, setSelectedRooms] = useState({});
   const [selectedExtras, setSelectedExtras] = useState([]);
   const [availableRoomCounts, setAvailableRoomCounts] = useState([]);

   const hotelId = tour._id;

   const navigate = useNavigate();
   const { user } = useContext(AuthContext);

   const today = new Date();
   const tomorrow = new Date(today);
   tomorrow.setDate(tomorrow.getDate() + 1);

   const formatDate = (date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
   };
   const [booked, setBooked] = useState([]);
   const [booking, setBooking] = useState({
      userId: user ? user._id : null,
      roomIds: [],
      extraIds: [],
      name: '',
      phone: '',
      email: '', // Add email field here
      adult: 1,
      children: 0,
      baby: 0,
      bookAt: formatDate(today),
      checkOut: formatDate(tomorrow),
      status: 'pending',
      totalAmount: 0,
   });

   const [errors, setErrors] = useState({
      adult: '',
      children: '',
      baby: '',
      bookAt: '',
      checkOut: '',
      roomQuantity: '',
      email: '' // Add email validation error here
   });

   useEffect(() => {
      if (!hotelId) return;

      const fetchData = async () => {
         try {
            const [responseRC, responseET, responseAvailability] = await Promise.all([
               axios.get(`${BASE_URL}/roomCategory/hotel/${hotelId}`, { withCredentials: true }),
               axios.get(`${BASE_URL}/extraFee/hotel/${hotelId}`, { withCredentials: true }),
               axios.get(`${BASE_URL}/booking/availability/${hotelId}/${booking.bookAt}/${booking.checkOut}`, { withCredentials: true }),
            ]);

            setRoomCategories(responseRC.data);
            setExtraFee(responseET.data.data);
            setAvailableRoomCounts(responseAvailability.data.availableRooms);
         } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
         }
      };

      fetchData();
   }, [hotelId, booking.bookAt, booking.checkOut]);

   const handleChange = e => {
      const { id, value } = e.target;
      const today = new Date();
      const selectedDate = new Date(value);
      const bookAtDate = new Date(booking.bookAt);
      const checkOutDate = new Date(booking.checkOut);

      setBooking(prev => ({ ...prev, [id]: value }));

      if (id === 'email') {
         const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
         if (!emailPattern.test(value)) {
            setErrors(prev => ({ ...prev, email: 'Email không hợp lệ.' }));
         } else {
            setErrors(prev => ({ ...prev, email: '' }));
         }
      }

      // Validation for date fields
      if (id === 'bookAt') {
         if (selectedDate < today.setHours(0, 0, 0, 0)) {
            setErrors(prev => ({ ...prev, bookAt: 'Ngày đặt phòng không được trong quá khứ.' }));
         } else {
            setErrors(prev => ({ ...prev, bookAt: '' }));
         }
      }

      if (id === 'checkOut') {
         const diffTime = selectedDate - bookAtDate;
         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Số ngày chênh lệch
         if (diffDays < 1) {
            setErrors(prev => ({ ...prev, checkOut: 'Ngày trả phòng phải sau ngày đặt ít nhất 1 ngày.' }));
         } else {
            setErrors(prev => ({ ...prev, checkOut: '' }));
         }
      }

      if (id === 'name') {
         const namePattern = /^[a-zA-ZÀ-ỹ\s]+$/u; // Full name should only contain letters and spaces
         if (!namePattern.test(value)) {
            setErrors(prev => ({ ...prev, name: 'Full name must contain only letters and spaces.' }));
         } else if (value.trim().length < 3) {
            setErrors(prev => ({ ...prev, name: 'Full name must be at least 3 characters long.' }));
         } else {
            setErrors(prev => ({ ...prev, name: '' }));
         }
      }

      if (id === 'phone') {
         const phonePattern = /^0\d{9}$/; // Vietnamese phone number format
         if (!phonePattern.test(value)) {
            setErrors(prev => ({ ...prev, phone: 'Phone number must start with 0 and have 10 digits.' }));
         } else {
            setErrors(prev => ({ ...prev, phone: '' }));
         }
      }

      if (['adult', 'children', 'baby'].includes(id)) {
         if (value < 0) {
            setErrors(prev => ({ ...prev, [id]: `${id} must be at least 0.` }));
         } else {
            setErrors(prev => ({ ...prev, [id]: '' }));
         }
      }
   };


   const handleSelectRoomChange = (roomId, quantity) => {
      const parsedQuantity = parseInt(quantity, 10);
      if (!isNaN(parsedQuantity) && parsedQuantity >= 0) {
         setSelectedRooms(prev => ({
            ...prev,
            [roomId]: parsedQuantity
         }));
      }
   };

   const handleExtraFeeChange = (extraId, isChecked) => {
      if (isChecked) {
         setSelectedExtras(prev => [...prev, extraId]);
      } else {
         setSelectedExtras(prev => prev.filter(id => id !== extraId));
      }
   };

   const calculateTotalAmount = () => {
      // Tính số đêm giữa checkOut và bookAt
      const checkInDate = new Date(booking.bookAt);
      const checkOutDate = new Date(booking.checkOut);
      const diffTime = Math.abs(checkOutDate - checkInDate);
      const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // số ngày chênh lệch

      let total = 0;

      // Tính tổng tiền cho các phòng
      Object.entries(selectedRooms).forEach(([roomId, quantity]) => {
         const room = roomCategories.find(room => room._id === roomId);
         total += (room.roomPrice * quantity * nights); // giá phòng * số lượng phòng * số đêm
      });

      // Tính tổng tiền cho các dịch vụ thêm
      selectedExtras.forEach(extraId => {
         const extra = extraFee.find(fee => fee._id === extraId);
         total += extra.extraPrice;
      });

      return total;
   };
   const handlePayment = async (booking) => {
      console.log(booking._id, user.role)
      try {
         const response = await axios.post(
            `${BASE_URL}/payment/create-payment-link`,
            {
               amount: booking.totalAmount,
               bookingId: booking._id,
               role: user.role
            },
            { withCredentials: true }
         );

         if (response.status === 200) {
            const { checkoutUrl } = response.data;
            Swal.fire({
               icon: "info",
               title: "Redirecting to Payment",
               text: "You will be redirected to the payment page.",
               showConfirmButton: false,
               timer: 2000,
            });
            window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
         } else {
            console.error("Failed to create payment link");
         }
      } catch (error) {
         console.error("Error creating payment link:", error);
         Swal.fire({
            icon: "error",
            title: "Payment Link Error",
            text: "There was an error creating the payment link. Please try again.",
         });
      }
   };

   const handleClick = async (e) => {
      e.preventDefault();

      if (validateBeforeSubmit()) {
         try {
            if (!user) {
               return alert('Please sign in');
            }

            const totalAmount = calculateTotalAmount();
            let roomIds = [];

            Object.entries(selectedRooms).forEach(([roomId, quantity]) => {
               for (let i = 0; i < quantity; i++) {
                  roomIds.push(roomId);
               }
            });

            // Tạo biến bookingTemp để lưu giá trị booking
            const bookingTemp = {
               ...booking,
               hotelId,          // Cập nhật hotelId
               roomIds,          // Cập nhật roomIds
               extraIds: selectedExtras,  // Cập nhật extraIds bằng selectedExtras
               totalAmount       // Cập nhật tổng số tiền
            };

            // Gửi request với bookingTemp

            const res = await axios.post(`${BASE_URL}/booking`, bookingTemp);
            const result = res.data.data;


            console.log(result)
            // Điều hướng sau khi tạo booking thành công
            // navigate('/thank-you');
            // navigate('/my-booking');
            handlePayment(result);
         } catch (error) {
            alert(error.message);
         }
      }
   };


   const validateBeforeSubmit = () => {
      if (booking.adult < 1) {
         alert('At least one adult must be included.');
         return false;
      }
      if (!booking.bookAt || !booking.checkOut) {
         alert('Please select booking and check-out dates.');
         return false;
      }
      return true;
   };

   return (
      <div className='booking'>
         <div className="booking__top d-flex align-items-center justify-content-between">
            <h3>{title} </h3>
            <span className="tour__rating d-flex align-items-center">
               <i className='ri-star-fill' style={{ color: 'var(--secondary-color)' }}></i>
               {avgRating === 0 ? null : avgRating} ({reviews?.length})
            </span>
         </div>

         <div className="booking__form">
            <h5>Information</h5>
            <Form className='booking__info-form' onSubmit={handleClick}>
               <FormGroup>
                  <input type="text" placeholder='Full Name' id='name' required onChange={handleChange} />
                  {errors.name && <span className="error">{errors.name}</span>}
               </FormGroup>

               <FormGroup>
                  <input type="tel" placeholder='Phone' id='phone' required onChange={handleChange} />
                  {errors.phone && <span className="error">{errors.phone}</span>}
               </FormGroup>

               <FormGroup>
                  <input type="email" placeholder='Email' id='email' required onChange={handleChange} />
                  {errors.email && <span className="error">{errors.email}</span>}
               </FormGroup>

               <FormGroup>
                  <Row>
                     <Col className="d-flex align-items-center justify-content-evenly">
                        <strong>Adult</strong>
                        <input className='m-0 w-50' type="number" id='adult' value={booking.adult} onChange={handleChange} min="1" required />
                     </Col>
                     <Col className="d-flex align-items-center justify-content-evenly">

                        <strong>Children </strong>
                        <input className='m-0 w-50' type="number" id='children' value={booking.children} onChange={handleChange} min="0" />
                     </Col>
                     <Col className="d-flex align-items-center justify-content-evenly">

                        <strong>Baby </strong>
                        <input className='m-0 w-50' type="number" id='baby' value={booking.baby} onChange={handleChange} min="0" />
                     </Col>
                  </Row>

                  {errors.adult && <span className="error">{errors.adult}</span>}
                  {errors.children && <span className="error">{errors.children}</span>}
                  {errors.baby && <span className="error">{errors.baby}</span>}
               </FormGroup>
               <Row>
                  <Col>
                     <FormGroup className="d-flex align-items-center justify-content-evenly">
                        <strong>BookAt</strong>
                        <input
                           className='m-0 w-50'
                           type="date"
                           id="bookAt"
                           onChange={handleChange}
                           required
                           defaultValue={booking.bookAt}
                        />

                     </FormGroup>

                  </Col>
                  <Col>
                     <FormGroup className="d-flex align-items-center justify-content-evenly">
                        <strong>CheckOut</strong>
                        <input
                           className='m-0 w-50'
                           type="date"
                           id="checkOut"
                           onChange={handleChange}
                           required
                           defaultValue={booking.checkOut}
                        />

                     </FormGroup>

                  </Col>
                  {errors.bookAt && <span className="error text-danger">{errors.bookAt}</span>}
                  {errors.checkOut && <span className="error text-danger">{errors.checkOut}</span>}
               </Row>

               <FormGroup>
                  <h6>Chọn Phòng</h6>
                  {roomCategories.length > 0 && roomCategories.map(room => {
                     const availableRoomCount = availableRoomCounts.find(rc => rc.roomId === room._id)?.availableCount || 0;
                     return (
                        <div key={room._id} className="d-flex align-items-center justify-content-around">
                           <label>
                              {room.roomName} - ${room.roomPrice}
                              <span style={{ marginLeft: '10px', fontStyle: 'italic', color: 'gray' }}>
                                 (Còn lại: {availableRoomCount} phòng)
                              </span>
                           </label>

                           {/* Kiểm tra nếu số phòng còn lại là 0, hiển thị thông báo "Hết phòng" */}
                           {availableRoomCount === 0 ? (
                              <span className="text-danger">Hết phòng</span>
                           ) : (
                              <input
                                 className='m-0 w-25'
                                 type="number"
                                 min="0"
                                 max={availableRoomCount}
                                 placeholder="Số lượng"
                                 onChange={(e) => handleSelectRoomChange(room._id, e.target.value)}
                              />
                           )}
                        </div>
                     );
                  })}
               </FormGroup>

               <FormGroup>
                  <h6>Chọn dịch vụ thêm</h6>
                  {extraFee.length > 0 && extraFee.map(fee => (
                     <div key={fee._id}>
                        <label className="d-flex align-items-center">
                           <input
                              className='m-0'
                              style={{ width: '25px' }}
                              type="checkbox"
                              onChange={(e) => handleExtraFeeChange(fee._id, e.target.checked)}
                           />
                           <span>{fee.extraName} - ${fee.extraPrice}</span>
                        </label>
                     </div>
                  ))}
               </FormGroup>
               <FormGroup>
                  <h6>Tổng số tiền: ${calculateTotalAmount()}</h6>
               </FormGroup>
               <Button type='submit' color='primary' className='btn primary__btn w-100 mt-4'>Book Now</Button>
            </Form>
         </div>
      </div>
   );
};

export default Booking;