import React, { useState, useRef, useEffect, useContext } from 'react';
import '../../styles/tour-details.css';
import { Container, Row, Col, Form, ListGroup } from 'reactstrap';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import calculateAvgRating from '../../utils/avgRating';
import avatar from '../../assets/images/avatar.jpg';
import Booking from '../../components/Booking/Booking';
import useFetch from '../../hooks/useFetch';
import { BASE_URL } from '../../utils/config';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';

const TourDetails = () => {
   const { id } = useParams();
   const reviewMsgRef = useRef('');
   const [tourRating, setTourRating] = useState(null);
   const { user } = useContext(AuthContext);

   // fetch data from database
   const { data: tour, loading, error } = useFetch(`${BASE_URL}/tours/${id}`);
   const [bookings, setBookings] = useState([]);

   const { photo, title, desc, price, reviews, city, address, distance, maxGroupSize } = tour || {};

   const { totalRating, avgRating } = calculateAvgRating(reviews);

   const options = { day: 'numeric', month: 'long', year: 'numeric' };
   const navigate = useNavigate();
   const submitHandler = async e => {
      e.preventDefault();
      const reviewText = reviewMsgRef.current.value;

      try {
         if (!user || !user._id) {
            Swal.fire({
               icon: 'error',
               title: 'Bạn phải đăng nhập để đánh giá',
               showConfirmButton: true,
               confirmButtonText : 'Đăng nhập',
               confirmButtonColor: '#3085d6',
               timer: 1500
            })
            return;
         }

         const reviewObj = {
            username: user?.username,
            reviewText,
            rating: tourRating
         };

         const res = await fetch(`${BASE_URL}/review/${id}`, {
            method: 'post',
            headers: {
               'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(reviewObj)
         });

         const result = await res.json();
         if (!res.ok) {
            return alert(result.message);
         }

         Swal.fire({
            icon: 'success',
            title: 'Đánh giá thành công',
            showConfirmButton: true,
            confirmButtonText : 'OK',
            confirmButtonColor: '#3085d6',
            timer: 1500
         })
         navigate(`/tours`);
      } catch (error) {
         alert(error.message);
      }
   };

   useEffect(() => {
      const fetchData = async () => {
         if (!user) {
            return; // Do not fetch if user is not logged in
         }

         try {
            const bookingsResponse = await axios.get(`${BASE_URL}/booking`, {
               withCredentials: true,
            });

            setBookings(bookingsResponse.data.data.filter(b => title === b.tourName));

         } catch (error) {
            console.error("Error fetching data:", error);
         }
      };

      fetchData();
      window.scrollTo(0, 0);
   }, [tour, user]);

   // Check if the current user has a completed booking for the tour
   const userCanReview = bookings.some(booking => booking.userId === user?._id && booking.status === 'confirmed');

   return (
      <section>
         <Container>
            {loading && <h4 className='text-center pt-5'>LOADING.........</h4>}
            {error && <h4 className='text-center pt-5'>{error}</h4>}
            {
               !loading && !error && tour &&
               <Row>
                  <Col lg='8'>
                     <div className="tour__content">
                        <img src={photo} alt="" />

                        <div className="tour__info">
                           <h2>{title}</h2>
                           <div className="d-flex align-items-center gap-5">
                              <span className="tour__rating d-flex align-items-center gap-1">
                                 <i className='ri-star-fill' style={{ color: 'var(--secondary-color)' }}></i> {avgRating === 0 ? null : avgRating}
                                 {avgRating === 0 ? ('Not rated') : (<span>({reviews?.length})</span>)}
                              </span>

                              <span><i className='ri-map-pin-fill'></i> {address}</span>
                           </div>

                           <div className="tour__extra-details">
                              <span><i className='ri-map-pin-2-line'></i> {city}</span>
                              <span><i className='ri-money-dollar-circle-line'></i> {price}/ per person</span>
                              <span><i className='ri-map-pin-time-line'></i> {distance} k/m</span>
                              <span><i className='ri-group-line'></i> {maxGroupSize} people</span>
                           </div>
                           <h5>Description</h5>
                           <p>{desc}</p>
                        </div>

                        {/* ============ TOUR REVIEWS SECTION START ============ */}
                        <div className="tour__reviews mt-4">
                           <h4>Reviews ({reviews?.length} reviews)</h4>

                           {userCanReview ? (
                              <Form onSubmit={submitHandler}>
                                 <div className="d-flex align-items-center gap-3 mb-4 rating__group">
                                    <span onClick={() => setTourRating(1)}>1 <i className='ri-star-s-fill'></i></span>
                                    <span onClick={() => setTourRating(2)}>2 <i className='ri-star-s-fill'></i></span>
                                    <span onClick={() => setTourRating(3)}>3 <i className='ri-star-s-fill'></i></span>
                                    <span onClick={() => setTourRating(4)}>4 <i className='ri-star-s-fill'></i></span>
                                    <span onClick={() => setTourRating(5)}>5 <i className='ri-star-s-fill'></i></span>
                                 </div>

                                 <div className="review__input">
                                    <input type="text" ref={reviewMsgRef} placeholder='Share your thoughts' required />
                                    <button className='btn primary__btn text-white' type='submit'>
                                       Submit
                                    </button>
                                 </div>
                              </Form>
                           ) : (
                              <p>Only users who have completed this tour can leave a review.</p>
                           )}

                           <ListGroup className='user__reviews'>
                              {
                                 reviews?.map((review, index) => (
                                    <div className="review__item" key={index}>
                                       <img src={avatar} alt="" />

                                       <div className="w-100">
                                          <div className="d-flex align-items-center justify-content-between">
                                             <div>
                                                <h5>{review.username}</h5>
                                                <p>{new Date(review.createdAt).toLocaleDateString('en-US', options)}</p>
                                             </div>

                                             <span className='d-flex align-items-center'>
                                                {review.rating}<i className='ri-star-s-fill'></i>
                                             </span>
                                          </div>

                                          <h6>{review.reviewText}</h6>
                                       </div>
                                    </div>
                                 ))
                              }
                           </ListGroup>
                        </div>
                        {/* ============ TOUR REVIEWS SECTION END ============== */}
                     </div>
                  </Col>

                  <Col lg='4'>
                     <Booking tour={tour} avgRating={avgRating} />
                  </Col>
               </Row>
            }
         </Container>
      </section>
   );
}

export default TourDetails;
