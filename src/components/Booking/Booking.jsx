import React, { useState, useContext, useEffect } from 'react';
import './booking.css';
import { Form, FormGroup, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config';
import axios from 'axios';

const Booking = ({ tour, avgRating }) => {
   const { price, reviews, title } = tour;
   const [itinerary, setItinerary] = useState([]);
   const [hotels, setHotels] = useState([]);
   const [roomCategories, setRoomCategories] = useState([]);
   const [extraFee, setExtraFee] = useState([]);
   const [selectedRooms, setSelectedRooms] = useState({});
   const [selectedExtras, setSelectedExtras] = useState([]);
   const [availableRoomCounts, setAvailableRoomCounts] = useState([]);

   const tourId = tour._id;
   const navigate = useNavigate();
   const { user } = useContext(AuthContext);

   const [booking, setBooking] = useState({
      userId: user && user._id,
      roomIds: [],
      extraIds: [],
      name: '',
      phone: '',
      adult: 1,
      children: 0,
      baby: 0,
      bookAt: '',
      checkOut: '',
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
   });

   useEffect(() => {
      const fetchData = async () => {
         try {
            const itineraryResponse = await axios.get(`${BASE_URL}/itinerary/tour/${tourId}`, { withCredentials: true });
            const hotelResponse = await axios.get(`${BASE_URL}/hotels/tour/${tourId}`, { withCredentials: true });

            setItinerary(itineraryResponse.data);
            setHotels(hotelResponse.data);
         } catch (error) {
            console.error("Error fetching data:", error);
         }
      };

      fetchData();
   }, [tourId]);

   const handleChange = e => {
      const { id, value } = e.target;
      setBooking(prev => ({ ...prev, [id]: value }));

      if (id === 'adult' || id === 'children' || id === 'baby') {
         if (value < 0) {
            setErrors(prev => ({ ...prev, [id]: `${id} must be at least 0.` }));
         } else {
            setErrors(prev => ({ ...prev, [id]: '' }));
         }
      }

      if (id === 'bookAt') {
         const bookingDate = new Date(value);
         const today = new Date();
         today.setHours(0, 0, 0, 0);

         if (bookingDate < today) {
            setErrors(prev => ({ ...prev, bookAt: 'Booking date cannot be in the past.' }));
         } else {
            setErrors(prev => ({ ...prev, bookAt: '' }));
         }

         // Gọi API để lấy số lượng phòng trống sau khi thay đổi ngày
         const hotelId = booking.hotelId; // Lấy hotelId từ booking
         if (hotelId) {
            axios.get(`${BASE_URL}/availableRoomCount?hotelId=${hotelId}&bookAt=${value}&checkOut=${booking.checkOut}`, { withCredentials: true })
               .then(response => {
                  setAvailableRoomCounts(response.data.data);
               })
               .catch(error => {
                  console.error("Error fetching available room count:", error);
               });
         }
      }

      if (id === 'checkOut') {
         const checkOutDate = new Date(value);
         const bookAtDate = new Date(booking.bookAt);

         if (checkOutDate <= bookAtDate) {
            setErrors(prev => ({ ...prev, checkOut: 'Check-out date must be after booking date.' }));
         } else {
            setErrors(prev => ({ ...prev, checkOut: '' }));
         }

         // Gọi API để lấy số lượng phòng trống sau khi thay đổi ngày
         const hotelId = booking.hotelId; // Lấy hotelId từ booking
         if (hotelId) {
            axios.get(`${BASE_URL}/availableRoomCount?hotelId=${hotelId}&bookAt=${booking.bookAt}&checkOut=${value}`, { withCredentials: true })
               .then(response => {
                  setAvailableRoomCounts(response.data.data);
               })
               .catch(error => {
                  console.error("Error fetching available room count:", error);
               });
         }
      }
   };

   const handleSelectHotelChange = async (e) => {
      const hotelId = e.target.value;
      setBooking(prev => ({ ...prev, hotelId }));

      try {
         const responseRC = await axios.get(`${BASE_URL}/roomCategory/hotel/${hotelId}`, { withCredentials: true });
         setRoomCategories(responseRC.data);
         const responseET = await axios.get(`${BASE_URL}/extraFee/hotel/${hotelId}`, { withCredentials: true });
         setExtraFee(responseET.data.data);

         // Gọi API để lấy số lượng phòng trống
         if (booking.bookAt && booking.checkOut) {
            const availableRoomCountResponse = await axios.get(`${BASE_URL}/availableRoomCount?hotelId=${hotelId}&bookAt=${booking.bookAt}&checkOut=${booking.checkOut}`, { withCredentials: true });
            setAvailableRoomCounts(availableRoomCountResponse.data.data);
         }
      } catch (error) {
         console.error("Error fetching room categories and extra fees:", error);
      }
   };

   const handleSelectRoomChange = (roomId, quantity) => {
      setSelectedRooms(prev => ({
         ...prev,
         [roomId]: quantity
      }));
   };

   const handleExtraFeeChange = (extraId, isChecked) => {
      if (isChecked) {
         setSelectedExtras(prev => [...prev, extraId]);
      } else {
         setSelectedExtras(prev => prev.filter(id => id !== extraId));
      }
   };

   const calculateTotalAmount = () => {
      let total = 0;

      // Calculate room costs
      Object.entries(selectedRooms).forEach(([roomId, quantity]) => {
         const room = roomCategories.find(room => room._id === roomId);
         total += (room.roomPrice * quantity);
      });

      // Add extra fees
      selectedExtras.forEach(extraId => {
         const extra = extraFee.find(fee => fee._id === extraId);
         total += extra.extraPrice;
      });

      return total;
   };

   const handleClick = async e => {
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
               method: 'post',
               headers: {
                  'Content-Type': 'application/json'
               },
               credentials: 'include',
               body: JSON.stringify({
                  ...booking,
                  roomIds: roomIds,
                  extraIds: selectedExtras,
                  totalAmount: totalAmount
               })
            });

            const result = await res.json();

            if (!res.ok) {
               return alert(result.message);
            }
            navigate('/thank-you');
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
            <h3>${price} <span>/per person</span></h3>
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
               </FormGroup>
               <FormGroup>
                  <input type="tel" placeholder='Phone' id='phone' required onChange={handleChange} />
               </FormGroup>
               <FormGroup>
                  <select name="hotelId" id="hotelId" onChange={handleSelectHotelChange} required>
                     <option value="">Select Hotel</option>
                     {hotels.map(hotel => (
                        <option key={hotel._id} value={hotel._id}>{hotel.name}</option>
                     ))}
                  </select>
               </FormGroup>
               <FormGroup>
                  <input type="date" placeholder='Check-in Date' id='bookAt' onChange={handleChange} required />
                  {errors.bookAt && <span className="error">{errors.bookAt}</span>}
               </FormGroup>
               <FormGroup>
                  <input type="date" placeholder='Check-out Date' id='checkOut' onChange={handleChange} required />
                  {errors.checkOut && <span className="error">{errors.checkOut}</span>}
               </FormGroup>
               <FormGroup>
                  <input type="number" id='adult' value={booking.adult} onChange={handleChange} min="1" required />
                  <input type="number" id='children' value={booking.children} onChange={handleChange} min="0" />
                  <input type="number" id='baby' value={booking.baby} onChange={handleChange} min="0" />
                  {errors.adult && <span className="error">{errors.adult}</span>}
                  {errors.children && <span className="error">{errors.children}</span>}
                  {errors.baby && <span className="error">{errors.baby}</span>}
               </FormGroup>
               <FormGroup>
                  <h6>Available Rooms</h6>
                  {availableRoomCounts.length > 0 && availableRoomCounts.map(room => (
                     <div key={room.roomId}>
                        <label>
                           {room.roomName}: {room.availableCount} available
                        </label>
                     </div>
                  ))}
               </FormGroup>
               <FormGroup>
                  <h6>Room Selection</h6>
                  {roomCategories.length > 0 && roomCategories.map(room => (
                     <div key={room._id}>
                        <label>{room.roomName} - ${room.roomPrice}</label>
                        <input type="number" min="0" placeholder="Quantity" onChange={(e) => handleSelectRoomChange(room._id, e.target.value)} />
                     </div>
                  ))}
               </FormGroup>
               <FormGroup>
                  <h6>Extra Fees</h6>
                  {extraFee.length > 0 && extraFee.map(extra => (
                     <div key={extra._id}>
                        <label>
                           <input type="checkbox" onChange={(e) => handleExtraFeeChange(extra._id, e.target.checked)} /> {extra.extraName} - ${extra.extraPrice}
                        </label>
                     </div>
                  ))}
               </FormGroup>
               <div className="total__amount">
                  <h5>Total Amount: ${calculateTotalAmount()}</h5>
               </div>
               <Button type='submit' color='primary'>Book Now</Button>
            </Form>
         </div>
      </div>
   );
};

export default Booking;
