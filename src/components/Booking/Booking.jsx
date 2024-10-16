import React, { useState, useContext, useEffect } from 'react';
import './booking.css';
import { Form, FormGroup, Button, Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config';
import axios from 'axios';

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

   const [booking, setBooking] = useState({
      userId: user ? user._id : null,
      roomIds: [],
      extraIds: [],
      name: '',
      phone: '',
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
      name: '',
      phone: '',
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
            console.error("Lỗi khi lấy dữ liệu:", error.response ? error.response.data : error.message);
         }
      };

      fetchData();
   }, [hotelId, booking.bookAt, booking.checkOut]);

   const handleChange = (e) => {
      const { id, value } = e.target;
      const today = new Date();
      const selectedDate = new Date(value);
      const bookAtDate = new Date(booking.bookAt);
      const checkOutDate = new Date(booking.checkOut);

      setBooking(prev => ({ ...prev, [id]: value }));

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
            setErrors(prev => ({ ...prev, name: 'Tên phải chỉ chứa chữ cái và khoảng trắng.' }));
         } else if (value.trim().length < 3) {
            setErrors(prev => ({ ...prev, name: 'Tên phải có ít nhất 3 ký tự.' }));
         } else {
            setErrors(prev => ({ ...prev, name: '' }));
         }
      }

      if (id === 'phone') {
         const phonePattern = /^0\d{9}$/; // Vietnamese phone number format
         if (!phonePattern.test(value)) {
            setErrors(prev => ({ ...prev, phone: 'Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số.' }));
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

            const res = await fetch(`${BASE_URL}/booking`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json'
               },
               credentials: 'include',
               body: JSON.stringify({
                  ...booking,
                  hotelId,
                  roomIds,
                  extraIds: selectedExtras,
                  totalAmount
               })
            });

            const result = await res.json();

            if (!res.ok) {
               return alert(result.message);
            }

            navigate('/my-booking');
         } catch (error) {
            alert(error.message);
         }
      }
   };

   const validateBeforeSubmit = () => {
      if (booking.adult < 1) {
         alert('Phải có ít nhất một người lớn.');
         return false;
      }
      if (!booking.bookAt || !booking.checkOut) {
         alert('Vui lòng chọn ngày đặt và ngày trả.');
         return false;
      }
      return true;
   };

   return (
      <div className='booking'>
         <div className="booking__top d-flex align-items-center justify-content-between">
            <h3>{title}</h3>
            <span className="tour__rating d-flex align-items-center">
               <i className='ri-star-fill' style={{ color: 'var(--secondary-color)' }}></i>
               {avgRating === 0 ? null : avgRating} ({reviews?.length})
            </span>
         </div>

         <div className="booking__form">
            <h5>Thông tin</h5>
            <Form className='booking__info-form' onSubmit={handleClick}>
               <Row>
                  <Col md="6">
                     <FormGroup>
                        <input type="text" placeholder='Họ và tên' id="name" value={booking.name} onChange={handleChange} />
                        {errors.name && <span className='error'>{errors.name}</span>}
                     </FormGroup>
                  </Col>
                  <Col md="6">
                     <FormGroup>
                        <input type="text" placeholder='Số điện thoại' id="phone" value={booking.phone} onChange={handleChange} />
                        {errors.phone && <span className='error'>{errors.phone}</span>}
                     </FormGroup>
                  </Col>
               </Row>
               <Row>
                  <Col md="4">
                     <FormGroup>
                        <input type="number" min="1" id="adult" placeholder='Người lớn' value={booking.adult} onChange={handleChange} />
                        {errors.adult && <span className='error'>{errors.adult}</span>}
                     </FormGroup>
                  </Col>
                  <Col md="4">
                     <FormGroup>
                        <input type="number" min="0" id="children" placeholder='Trẻ em' value={booking.children} onChange={handleChange} />
                        {errors.children && <span className='error'>{errors.children}</span>}
                     </FormGroup>
                  </Col>
                  <Col md="4">
                     <FormGroup>
                        <input type="number" min="0" id="baby" placeholder='Em bé' value={booking.baby} onChange={handleChange} />
                        {errors.baby && <span className='error'>{errors.baby}</span>}
                     </FormGroup>
                  </Col>
               </Row>
               <Row>
                  <Col md="6">
                     <FormGroup>
                        <input type="date" id="bookAt" value={booking.bookAt} onChange={handleChange} min={formatDate(today)} />
                        {errors.bookAt && <span className='error'>{errors.bookAt}</span>}
                     </FormGroup>
                  </Col>
                  <Col md="6">
                     <FormGroup>
                        <input type="date" id="checkOut" value={booking.checkOut} onChange={handleChange} min={formatDate(tomorrow)} />
                        {errors.checkOut && <span className='error'>{errors.checkOut}</span>}
                     </FormGroup>
                  </Col>
               </Row>

               <h5>Chọn phòng</h5>
               {roomCategories.map((room) => (
                  <FormGroup key={room._id}>
                     <div className='room'>
                        <h6>{room.roomName} - {room.roomPrice} VND/đêm</h6>
                        <input type="number" min="0" placeholder='Số lượng' onChange={(e) => handleSelectRoomChange(room._id, e.target.value)} />
                     </div>
                  </FormGroup>
               ))}

               <h5>Dịch vụ thêm</h5>
               {extraFee.map((fee) => (
                  <FormGroup key={fee._id}>
                     <input type="checkbox" id={fee._id} onChange={(e) => handleExtraFeeChange(fee._id, e.target.checked)} />
                     <label htmlFor={fee._id}>{fee.extraName} - {fee.extraPrice} VND</label>
                  </FormGroup>
               ))}

               <Button type='submit'>Đặt phòng</Button>
            </Form>
         </div>
      </div>
   );
};

export default Booking;
