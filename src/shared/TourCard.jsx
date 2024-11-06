import React from 'react'
import { Card, CardBody } from 'reactstrap'
import { Link } from 'react-router-dom'
import { FaMapMarkerAlt, FaHotel } from 'react-icons/fa'
import { RiPinDistanceFill, RiStarFill } from "react-icons/ri"

import calculateAvgRating from '../utils/avgRating'

const TourCard = ({ tour }) => {
   const { _id, title, city, photo, price, featured, reviews, distance } = tour
   const { totalRating, avgRating } = calculateAvgRating(reviews)

   return (
      <div style={{ margin: "15px", transition: "transform 0.3s", borderRadius: "8px", overflow: "hidden" }}>
         <Card style={{
            border: "none",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
         }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.03)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
         >
            <div style={{ position: "relative" }}>
               <img
                  src={photo}
                  alt="tour-img"
                  style={{
                     width: "100%",
                     height: "180px",
                     objectFit: "cover",
                     borderTopLeftRadius: "8px",
                     borderTopRightRadius: "8px"
                  }}
               />
               {featured && (
                  <span style={{
                     position: "absolute",
                     top: "8px",
                     left: "8px",
                     backgroundColor: "#ff7f50",
                     color: "#fff",
                     padding: "4px 8px",
                     borderRadius: "3px",
                     fontSize: "0.75rem",
                     fontWeight: "bold",
                  }}
                  >
                     Featured
                  </span>
               )}
            </div>

            <CardBody style={{ padding: "15px" }}>
               <div
                  style={{
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "space-between",
                     marginBottom: "10px",
                     color: "#666",
                     fontSize: "0.9rem"
                  }}
               >
                  <span
                     style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "#333",
                        fontWeight: "500"
                     }}
                  >
                     <FaMapMarkerAlt style={{ color: "#ff7f50" }} /> {city}
                  </span>
                  <span
                     style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        color: "#ffcc00",
                        fontWeight: "bold"
                     }}
                  >
                     <RiStarFill /> {avgRating > 0 ? avgRating : "N/A"}
                     {totalRating > 0 && (
                        <span style={{ color: "#666" }}>({reviews.length})</span>
                     )}
                  </span>
               </div>

               <h5 style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  color: "#333",
                  marginBottom: "10px",
                  cursor: "pointer"
               }}
               >
                  <FaHotel style={{ color: "#007bff" }} />
                  <Link to={`/tours/${_id}`} style={{
                     textDecoration: "none",
                     color: "inherit"
                  }}
                     onMouseOver={(e) => e.target.style.color = "#007bff"}
                     onMouseOut={(e) => e.target.style.color = "#333"}
                  >
                     {title}
                  </Link>
               </h5>

               <div
                  style={{
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "space-between",
                     marginTop: "12px",
                     fontSize: "0.9rem",
                     color: "#666"
                  }}
               >
                  <span style={{
                     display: "flex",
                     alignItems: "center",
                     gap: "5px",
                  }}
                  >
                     <RiPinDistanceFill style={{ color: "#555" }} /> {distance} km
                  </span>
                  <div style={{ textAlign: "right" }}>
                     <h5 style={{
                        color: "#ff7f50",
                        fontSize: "1rem",
                        fontWeight: "700",
                        marginBottom: "6px"
                     }}
                     >

                     </h5>
                     <Link to={`/tours/${_id}`}>
                        <button
                           style={{
                              padding: "6px 15px",
                              backgroundColor: "#007bff",
                              color: "#fff",
                              border: "none",
                              borderRadius: "20px",
                              fontSize: "0.85rem",
                              fontWeight: "bold",
                              cursor: "pointer",
                              transition: "0.3s"
                           }}
                           onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#0056b3"}
                           onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#007bff"}
                        >
                           Book Now
                        </button>
                     </Link>
                  </div>
               </div>
            </CardBody>
         </Card>
      </div>
   )
}

export default TourCard