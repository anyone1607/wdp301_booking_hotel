import React, { useState, useContext, useEffect } from 'react';
import './booking.css';
import { Form, FormGroup, Button, Row } from 'reactstrap';
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
   const [selectedExtras, setSelectedExtras] = useState([]); // State for selected extra fees

   const tourId = tour._id;
   const navigate = useNavigate();
   const { user } = useContext(AuthContext);

   const [booking, setBooking] = useState({
      userId: user && user._id,
      roomIds: [],
      extraIds: [], // Initialize extraIds
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

   // Handle selecting extra fees
   const handleExtraFeeChange = (extraId, isChecked) => {
      if (isChecked) {
         setSelectedExtras(prev => [...prev, extraId]);
      } else {
         setSelectedExtras(prev => prev.filter(id => id !== extraId));
      }
   };

   const handleClick = async e => {
      e.preventDefault();

      if (validateBeforeSubmit()) {
         try {
            if (!user) {
               return alert('Please sign in');
            }
            const totalAmount = 10; // Calculation for total cost, example
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
                  extraIds: selectedExtras, // Include selected extra fees
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

               {roomCategories.length > 0 && (
                  <FormGroup>
                     <h6>Select Rooms and Quantity</h6>
                     {roomCategories.map(room => (
                        <div key={room._id}>
                           <label>
                              {room.roomName}
                              <input
                                 type="number"
                                 min="0"
                                 placeholder="Quantity"
                                 onChange={(e) => handleSelectRoomChange(room._id, parseInt(e.target.value))}
                              />
                           </label>
                        </div>
                     ))}
                  </FormGroup>
               )}

               {extraFee.length > 0 && (
                  <FormGroup className="extra-service-group">
                     <h6>Select Extra Services</h6>
                     {extraFee.map(extra => (
                        <div key={extra._id} className="extra-service-item d-flex">
                           <Row className=''>
                              <input
                                 type="checkbox"
                                 value={extra._id}
                                 onChange={(e) => handleExtraFeeChange(extra._id, e.target.checked)}
                              />
                              <p>{extra.extraName} (${extra.extraPrice})</p>
                           </Row>
                        </div>
                     ))}
                  </FormGroup>
               )}


               <FormGroup className='d-flex align-items-center gap-3'>
                  <input type="date" placeholder='' id='bookAt' required onChange={handleChange} />
                  <p className='text-danger'>{errors.bookAt && <small>{errors.bookAt}</small>}</p>
               </FormGroup>
               <FormGroup className='d-flex align-items-center gap-3'>
                  <input type="date" placeholder='' id='checkOut' required onChange={handleChange} />
                  <p className='text-danger'>{errors.checkOut && <small>{errors.checkOut}</small>}</p>
               </FormGroup>
               <FormGroup className='d-flex align-items-center gap-3'>
                  <label>Adult
                     <input type="number" placeholder='Adult' id='adult' required value={booking.adult} onChange={handleChange} />
                  </label>
                  <label>Children
                     <input type="number" placeholder='Children' id='children' required value={booking.children} onChange={handleChange} />
                  </label>
                  <label>Baby
                     <input type="number" placeholder='Baby' id='baby' required value={booking.baby} onChange={handleChange} />
                  </label>
               </FormGroup>

               <Button type="submit" className='btn-book'>Book Now</Button>
            </Form>
         </div>
      </div>
   );
};

export default Booking;
