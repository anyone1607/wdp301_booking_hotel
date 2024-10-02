import React, { useState, useContext, useEffect } from 'react';
import './booking.css';
import { Form, FormGroup, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config';
import axios from 'axios';

const Booking = ({ tour, avgRating }) => {
   const { price, reviews, title } = tour;
   const [itinerary, setItinerary] = useState([]);
   const [hotels, setHotels] = useState([]);
   const [restaurants, setRestaurants] = useState([]);
   const tourId = tour._id;
   const navigate = useNavigate();
   const { user } = useContext(AuthContext);

   const [booking, setBooking] = useState({
      userId: user && user._id,
      userEmail: user && user.email,
      tourName: title,
      fullName: '',
      phone: '',
      adult: 1,
      children: 0,
      baby: 0,
      bookAt: '',
      status: 'pending',
      price: price,
      hotelId: '',
      hotelPrice: 0,
      bedPrice: 0,
      extraBed: 0,
      roomQuantity: 1,
      restaurantId: ''
   });

   const [errors, setErrors] = useState({
      adult: '',
      children: '',
      baby: '',
      bookAt: '',
      roomQuantity: '',
      extraBed: ''
   });

   useEffect(() => {
      const fetchData = async () => {
         try {
            const itineraryResponse = await axios.get(`${BASE_URL}/itinerary/tour/${tourId}`, { withCredentials: true });
            const hotelResponse = await axios.get(`${BASE_URL}/hotels/tour/${tourId}`, { withCredentials: true });
            const restaurantResponse = await axios.get(`${BASE_URL}/restaurants/tour/${tourId}`, { withCredentials: true });

            setItinerary(itineraryResponse.data);
            setHotels(hotelResponse.data);
            setRestaurants(restaurantResponse.data);
         } catch (error) {
            console.error("Error fetching data:", error);
         }
      };

      fetchData();
   }, [tourId]);

   const handleChange = e => {
      const { id, value } = e.target;
      setBooking(prev => ({ ...prev, [id]: value }));

      // Validate input fields and set errors
      if (id === 'adult' || id === 'children' || id === 'baby') {
         if (value < 0) {
            setErrors(prev => ({ ...prev, [id]: `${id} must be at least 0.` }));
         } else {
            setErrors(prev => ({ ...prev, [id]: '' }));
         }

         // Reset room quantity if adult changes to ensure validity
         if (id === 'adult') {
            if (value < booking.roomQuantity) {
               setBooking(prev => ({ ...prev, roomQuantity: value }));
            }
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

      if (id === 'roomQuantity') {
         if (value < 1 || value > booking.adult) {
            setErrors(prev => ({ ...prev, roomQuantity: 'Number of rooms must be at least 1 and cannot exceed the number of adults.' }));
         } else {
            setErrors(prev => ({ ...prev, roomQuantity: '' }));
         }
      }

      if (id === 'extraBed') {
         if (value < 0 || value > booking.roomQuantity) {
            setErrors(prev => ({ ...prev, extraBed: 'Number of extra beds must be between 0 and the number of rooms.' }));
         } else {
            setErrors(prev => ({ ...prev, extraBed: '' }));
         }
      }
   }

   const handleSelectChange = e => {
      const { name, value } = e.target;

      if (name === 'hotelId') {
         const selectedHotel = hotels.find(hotel => hotel._id === value);
         setBooking(prev => ({ ...prev, hotelId: value, hotelPrice: selectedHotel ? selectedHotel.price : 0, bedPrice: selectedHotel ? selectedHotel.bedPrice : 0 }));
      } else if (name === 'restaurantId') {
         setBooking(prev => ({ ...prev, restaurantId: value }));
      }
   }

   // Calculate number of days in itinerary
   const itineraryDays = itinerary.length;

   const serviceFee = 10;
   const totalAmount =
      (Number(booking.hotelPrice) * Number(booking.roomQuantity) + Number(booking.extraBed) * Number(booking.bedPrice)) * itineraryDays +
      (Number(price) * Number(booking.adult) + 0.7 * Number(price) * Number(booking.children)) + serviceFee;

   const handleClick = async e => {
      e.preventDefault();

      // Validate guest size
      if (booking.adult < 1) {
         return alert('At least one adult must be included.');
      }

      // Validate booking date
      if (!booking.bookAt) {
         return alert('Please select a booking date.');
      }

      // Convert booking date to a Date object for comparison
      const bookingDate = new Date(booking.bookAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set current time to midnight for accurate comparison

      if (bookingDate < today) {
         return alert('Booking date cannot be in the past.');
      }

      // Validate room quantity and extra beds
      if (booking.roomQuantity < 1 || booking.roomQuantity > booking.adult) {
         return alert('Number of rooms must be at least 1 and cannot exceed the number of adults.');
      }

      if (booking.extraBed < 0 || booking.extraBed > booking.roomQuantity) {
         return alert('Number of extra beds must be between 0 and the number of rooms.');
      }

      try {
         if (!user || user === undefined || user === null) {
            return alert('Please sign in');
         }

         const res = await fetch(`${BASE_URL}/booking`, {
            method: 'post',
            headers: {
               'content-type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ ...booking, price: totalAmount })
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

   return (
      <div className='booking'>
         <div className="booking__top d-flex align-items-center justify-content-between">
            <h3>${price} <span>/per person</span></h3>
            <span className="tour__rating d-flex align-items-center">
               <i className='ri-star-fill' style={{ 'color': 'var(--secondary-color)' }}></i>
               {avgRating === 0 ? null : avgRating} ({reviews?.length})
            </span>
         </div>

         {/* =============== BOOKING FORM START ============== */}
         <div className="booking__form">
            <h5>Information</h5>
            <Form className='booking__info-form' onSubmit={handleClick}>
               <FormGroup>
                  <input type="text" placeholder='Full Name' id='fullName' required onChange={handleChange} />
               </FormGroup>
               <FormGroup>
                  <input type="tel" placeholder='Phone' id='phone' required onChange={handleChange} />
               </FormGroup>
               <FormGroup className='d-flex align-items-center gap-3'>
                  <input type="date" placeholder='' id='bookAt' required onChange={handleChange} />
               </FormGroup>
               <p className='text-danger'> {errors.bookAt && <small>{errors.bookAt}</small>}</p>
               <FormGroup className='d-flex align-items-center gap-3'>
                  <label>Adult
                     <input type="number" placeholder='Adult' id='adult' required onChange={handleChange} />
                  </label>
                  <label>Children
                     <input type="number" placeholder='Children' id='children' required onChange={handleChange} />
                  </label>
                  <label>Baby
                     <input type="number" placeholder='Baby' id='baby' required onChange={handleChange} />
                  </label>
               </FormGroup>

               <p className='text-danger'>{errors.adult && <small >{errors.adult}</small>}</p>
               <p className='text-danger'>{errors.children && <small >{errors.children}</small>}</p>
               <p className='text-danger'>{errors.baby && <small >{errors.baby}</small>}</p>

               <FormGroup>
                  <select name="hotelId" id="hotelId" onChange={handleSelectChange}>
                     <option value="">Select Hotel</option>
                     {hotels.map(hotel => (
                        <option key={hotel._id} value={hotel._id}>{hotel.name}</option>
                     ))}
                  </select>
               </FormGroup>
               <FormGroup className='d-flex align-items-center gap-3'>
                  <label>Room Quantity<input type="number" placeholder='Room Quantity' id='roomQuantity' value={booking.roomQuantity} required onChange={handleChange} /></label>
                  <label>Extra Beds<input type="number" placeholder='Extra Beds' id='extraBed' value={booking.extraBed} required onChange={handleChange} /></label>
               </FormGroup>

               <p className='text-danger'>{errors.roomQuantity && <small>{errors.roomQuantity}</small>}</p>
               <p className='text-danger'>{errors.extraBed && <small>{errors.extraBed}</small>}</p>

               <FormGroup>
                  <select name="restaurantId" id="restaurantId" onChange={handleSelectChange}>
                     <option value="">Select Restaurant</option>
                     {restaurants.map(restaurant => (
                        <option key={restaurant._id} value={restaurant._id}>{restaurant.name}</option>
                     ))}
                  </select>
               </FormGroup>
            </Form>
         </div>
         {/* =============== BOOKING FORM END ================ */}

         {/* =============== ITINERARY START ================ */}
         <div className="itinerary">
            <h5>Itinerary</h5>
            {itinerary.map((day, index) => (
               <div key={index} className="itinerary__day">
                  <h6>Day {day.day}</h6>
                  <ul>
                     {day.detail.split(', ').map((activity, idx) => (
                        <li key={idx}>{activity}</li>
                     ))}
                  </ul>
               </div>
            ))}
         </div>
         {/* =============== ITINERARY END ================= */}

         <div className="booking__bottom">
            <ListGroup>
               <ListGroupItem className='border-0 px-0'>
                  <h5 className='d-flex align-items-center gap-1'>
                     ${price} <i className="ri-close-line"></i> {booking.adult} adults, {booking.children} children(sale 30%)
                  </h5>
                  <span>${(Number(price) * Number(booking.adult) + 0.7 * Number(price) * Number(booking.children)).toFixed(2)}</span>
               </ListGroupItem>
               <ListGroupItem className='border-0 px-0'>
                  <h5>Hotel Cost: {booking.hotelPrice}(room price) x {booking.roomQuantity} x {itineraryDays} day</h5>
                  <span>${(Number(booking.hotelPrice) * Number(booking.roomQuantity) * itineraryDays).toFixed(2)}</span>
               </ListGroupItem>
               <ListGroupItem className='border-0 px-0'>
                  <h5>Extra Bed Cost: {booking.bedPrice}(bedPrice) x {booking.extraBed} x {itineraryDays} day</h5>
                  <span>${(Number(booking.extraBed) * Number(booking.bedPrice) * itineraryDays).toFixed(2)}</span>
               </ListGroupItem>
               <ListGroupItem className='border-0 px-0'>
                  <h5>Service charge</h5>
                  <span>${serviceFee}</span>
               </ListGroupItem>
               <ListGroupItem className='border-0 px-0 total'>
                  <h5>Total</h5>
                  <span>${totalAmount.toFixed(2)}</span>
               </ListGroupItem>
            </ListGroup>
            <Button className='btn primary__btn w-100 mt-4' onClick={handleClick}>Book Now</Button>
         </div>

      </div>
   );
};

export default Booking;
