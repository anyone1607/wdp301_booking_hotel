import React, { useState, useRef, useEffect, useContext } from "react";
import "../../styles/tour-details.css";
import {
   Container,
   Row,
   Col,
   Form,
   ListGroup,
   Card,
   CardBody,
   CardTitle,
   CardText,
   Button,
} from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import calculateAvgRating from "../../utils/avgRating";
import avatar from "../../assets/images/avatar.jpg";
import Booking from "../../components/Booking/Booking";
import useFetch from "../../hooks/useFetch";
import { BASE_URL } from "../../utils/config";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import { RiStarFill, RiMapPinFill, RiMapPin2Line, RiPinDistanceFill } from "react-icons/ri"; // Importing icons
import { FaDollarSign, FaHotel, FaInfoCircle, FaUserFriends } from "react-icons/fa";
const TourDetails = () => {
   const { id } = useParams();
   const reviewMsgRef = useRef("");
   const [tourRating, setTourRating] = useState(null);
   const { user } = useContext(AuthContext);

   // Fetch tour data from database
   const { data: tour, loading, error } = useFetch(`${BASE_URL}/tours/${id}`);
   const [bookings, setBookings] = useState([]);
   const [roomCategories, setRoomCategories] = useState([]);
   const { photo, title, desc, reviews, city, address, distance, maxGroupSize } =
      tour || {};

   const { totalRating, avgRating } = calculateAvgRating(reviews);
   const [reviewObj, setReviewObj] = useState(null);
   const hotelId = id;

   // Fetch room categories based on the hotel ID
   useEffect(() => {
      if (!hotelId) return;

      const fetchData = async () => {
         try {
            const responseRC = await axios.get(
               `${BASE_URL}/roomCategory/hotel/${hotelId}`,
               { withCredentials: true }
            );
            setRoomCategories(responseRC.data);
         } catch (error) {
            console.error("Error fetching room categories:", error);
         }
      };

      fetchData();
   }, [hotelId]);

   const options = { day: "numeric", month: "long", year: "numeric" };
   const navigate = useNavigate();

   const submitHandler = async (e) => {
      // e.preventDefault(); // Prevent the default behavior of form submission

      const reviewText = reviewMsgRef.current.value;

      try {
         if (!user || !user._id) {
            Swal.fire({
               icon: "error",
               title: "You must be logged in to submit a review",
               showConfirmButton: true,
               confirmButtonText: "Log in",
               confirmButtonColor: "#3085d6",
               timer: 1500,
            });
            return;
         }

         const reviewData = {
            username: user?.username,
            reviewText,
            rating: tourRating,
         };
         console.log(reviewData);

         const res = await fetch(`${BASE_URL}/review/${hotelId}`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(reviewData),
         });

         const result = await res.json();
         if (!res.ok) {
            return Swal.fire({
               icon: "error",
               title: result.message,
               confirmButtonText: "OK",
               confirmButtonColor: "#d33",
               timer: 1500,
            });
         }

         Swal.fire({
            icon: "success",
            title: "Review submitted successfully",
            showConfirmButton: true,
            confirmButtonText: "OK",
            confirmButtonColor: "#3085d6",
            timer: 1500,
         });

         navigate(`/tours/${hotelId}`);
      } catch (error) {
         Swal.fire({
            icon: "error",
            title: "An error occurred",
            text: error.message,
            confirmButtonText: "OK",
            confirmButtonColor: "#d33",
            timer: 1500,
         });
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

            setBookings(
               bookingsResponse.data.data.filter((b) => id === b.hotelId._id)
            );
         } catch (error) {
            console.error("Error fetching bookings:", error);
         }
      };

      fetchData();
      window.scrollTo(0, 0); // Only run this once when the component is mounted
   }, [user, id]);

   // Check if the current user has a completed booking for the tour
   const userCanReview = bookings.some(
      (booking) => booking.userId === user?._id && booking.status === "confirmed"
   );

   return (
      <section>
         <Container>
            {loading && <h4 className="text-center pt-5">LOADING.........</h4>}
            {error && <h4 className="text-center pt-5">{error}</h4>}
            {!loading && !error && tour && (
               <Row>
                  <Col lg="6">
                     <div className="tour__content">
                        <img src={photo} alt="" />


                        <div className="tour__info" style={{ padding: "20px", color: "#333" }}>
                           <h2 style={{ display: "flex", alignItems: "center", fontSize: "1.5rem", fontWeight: "600", marginBottom: "10px", gap: "8px" }}>
                              <FaHotel style={{ fontSize: "1.4rem", color: "#007bff" }} />
                              {title}
                           </h2>
                           <div className="d-flex align-items-center gap-4" style={{ marginBottom: "12px", fontSize: "0.9rem", color: "#555" }}>
                              {/* Rating Section */}
                              <span className="tour__rating d-flex align-items-center gap-1" style={{ color: "#FFCC00" }}>
                                 <RiStarFill style={{ fontSize: "1.2rem", color: "#FFCC00" }} />
                                 {avgRating > 0 ? avgRating : "Not rated"}
                                 {avgRating > 0 && <span style={{ color: "#555" }}>({reviews?.length})</span>}
                              </span>

                              {/* Address Section */}
                              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                 <RiMapPinFill style={{ fontSize: "1.2rem", color: "#ff7f50" }} />
                                 <span>{address}</span>
                              </span>
                           </div>

                           {/* Extra Details Section */}
                           <div className="tour__extra-details" style={{ display: "flex", gap: "15px", fontSize: "0.9rem", color: "#555", marginBottom: "12px" }}>
                              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                 <RiMapPin2Line style={{ fontSize: "1.1rem", color: "#007bff" }} />
                                 {city}
                              </span>
                              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                 <RiPinDistanceFill style={{ fontSize: "1.1rem", color: "#777" }} />
                                 {distance} km
                              </span>
                           </div>

                           {/* Description Section */}
                           {/* <h4 style={{ fontSize: "1.2rem", fontWeight: "600", marginTop: "15px", marginBottom: "8px", color: "#333" }}>{desc}</h4> */}
                           <p >{desc}</p>
                        </div>


                        {/* ============ Room Category Section START ============ */}

                        <div className="room-category-section mt-5" style={{ padding: "20px" }}>
                           <h4 style={{ fontSize: "1.75rem", fontWeight: "600", marginBottom: "20px", color: "#333" }}>Room Categories</h4>

                           <Row className="room-category-list">
                              {roomCategories.length > 0 ? (
                                 roomCategories.map((category, index) => (
                                    <Col lg="4" md="6" sm="12" key={index} className="mb-4">
                                       <Card className="shadow-sm border-light" style={{ height: "100%", borderRadius: "10px", overflow: "hidden" }}>
                                          <CardBody style={{ padding: "15px" }}>
                                             <div className="text-center">
                                                {/* Room Name */}
                                                <CardTitle
                                                   tag="h5"
                                                   className="font-weight-bold"
                                                   style={{
                                                      fontSize: "1.25rem",
                                                      color: "#333",
                                                      marginBottom: "15px",
                                                   }}
                                                >
                                                   {category.roomName}
                                                </CardTitle>

                                                {/* Room Image */}
                                                <img
                                                   src={category.photo}
                                                   alt="Room"
                                                   style={{
                                                      width: "100%",
                                                      height: "140px",
                                                      objectFit: "cover",
                                                      borderRadius: "8px",
                                                      marginBottom: "15px",
                                                   }}
                                                />
                                             </div>

                                             {/* Room Details */}
                                             <CardText style={{ fontSize: "0.9rem", color: "#555", lineHeight: "1.5" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                                                   <FaDollarSign style={{ color: "#28a745" }} />
                                                   :{category.roomPrice}
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                                                   <FaUserFriends style={{ color: "#007bff" }} />
                                                   {category.maxOccupancy} persons / room
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                   <FaInfoCircle style={{ color: "#ff7f50" }} />
                                                   <h6>{category.description}</h6>
                                                </div>
                                             </CardText>
                                          </CardBody>
                                       </Card>
                                    </Col>
                                 ))
                              ) : (
                                 <p className="text-center" style={{ fontSize: "0.9rem", color: "#888", marginTop: "15px" }}>
                                    No room categories available for this hotel.
                                 </p>
                              )}
                           </Row>
                        </div>


                        {/* ============ Room Category Section END ============ */}

                        {/* ============ TOUR REVIEWS SECTION START ============ */}
                        <div className="tour__reviews mt-4">
                           <h4>Reviews ({reviews?.length} reviews)</h4>

                           {userCanReview ? (
                              <Form onSubmit={submitHandler}>
                                 <div className="d-flex align-items-center gap-3 mb-4 rating__group">
                                    <span onClick={() => setTourRating(1)}>
                                       1 <i className="ri-star-s-fill"></i>
                                    </span>
                                    <span onClick={() => setTourRating(2)}>
                                       2 <i className="ri-star-s-fill"></i>
                                    </span>
                                    <span onClick={() => setTourRating(3)}>
                                       3 <i className="ri-star-s-fill"></i>
                                    </span>
                                    <span onClick={() => setTourRating(4)}>
                                       4 <i className="ri-star-s-fill"></i>
                                    </span>
                                    <span onClick={() => setTourRating(5)}>
                                       5 <i className="ri-star-s-fill"></i>
                                    </span>
                                 </div>

                                 <div className="review__input">
                                    <input
                                       type="text"
                                       ref={reviewMsgRef}
                                       placeholder="Share your thoughts"
                                       required
                                    />
                                    <button
                                       className="btn primary__btn text-white"
                                       type="submit"
                                    >
                                       Submit Review
                                    </button>
                                 </div>
                              </Form>
                           ) : (
                              <p>
                                 You need to complete a booking for this hotel before
                                 leaving a review.
                              </p>
                           )}

                           <ListGroup className="user__reviews">
                              {reviews?.map((review) => (
                                 <div className="review__item" key={review._id}>
                                    <img src={avatar} alt="" />

                                    <div className="w-100">
                                       <div className="d-flex align-items-center justify-content-between">
                                          <div>
                                             <h5>{review.username}</h5>
                                             <p>
                                                {new Date(review.createdAt).toLocaleDateString(
                                                   "en-US",
                                                   options
                                                )}
                                             </p>
                                          </div>
                                          <span className="d-flex align-items-center">
                                             {review.rating} <i className="ri-star-s-fill"></i>
                                          </span>
                                       </div>

                                       <h6>{review.reviewText}</h6>
                                    </div>
                                 </div>
                              ))}
                           </ListGroup>
                        </div>
                        {/* ============ TOUR REVIEWS SECTION END ============ */}
                     </div>
                  </Col>

                  {/* ============ BOOKING SECTION ============ */}
                  <Col lg="6">
                     <Booking tour={tour} />
                  </Col>
               </Row>
            )}
         </Container>
      </section>
   );
};

export default TourDetails;