import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import facebookIcon from "../../assets/photos/facebook.png";
import instagramIcon from "../../assets/photos/instagram.png";
import logo from "../../assets/photos/logo.png";
import '../../styles/about.css';

import CommonSection from "../../shared/CommonSection";

const AboutPage = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    // Scroll event listener
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function handleScroll() {
    if (window.pageYOffset > 100) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  }

  function handleScrollUp() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div className="booking-page">
      <CommonSection title={"Book Your Stay at Hotel"} />

      <ul className="link-list">
        <a href="#hotel-info">Hotel Information</a>
        <a href="#room-types">Room Types</a>
        <a href="#amenities">Amenities</a>
        <a href="#reviews">Reviews</a>
        <a href="#book-now">Book Now</a>
      </ul>

      <button
        className="scroll-up-button"
        style={{ display: showScrollButton ? "block" : "none" }}
        onClick={handleScrollUp}
      >
        Scroll Up
      </button>

      <section className="hotel-info" id="hotel-info">
        <h2
          style={{
            textAlign: "center",
            marginTop: "30px",
            marginBottom: "30px",
          }}
        >
          Hotel Information
        </h2>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "50%", textAlign: "justify" }}>
            <p>
              Welcome to [Hotel Name], a luxurious getaway located in the heart
              of [Destination]. Our hotel offers a perfect blend of comfort,
              style, and convenience, providing travelers with an unforgettable
              stay.
            </p>
            <p>
              Experience top-notch service, modern amenities, and stunning
              views. Whether you're here for relaxation or adventure, our hotel
              is the ideal base for your journey.
            </p>
          </div>
        </div>
      </section>

      <section className="room-types" id="room-types">
        <h2
          style={{
            textAlign: "center",
            marginTop: "30px",
            marginBottom: "30px",
          }}
        >
          Room Types
        </h2>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "50%", textAlign: "justify" }}>
            <p>
              Choose from a range of room types designed to meet the needs of
              every traveler:
            </p>
            <p>
              1. Standard Room: A cozy and comfortable option for solo travelers
              or couples.
            </p>
            <p>
              2. Deluxe Room: Featuring added space and upgraded amenities for a
              more luxurious experience.
            </p>
            <p>
              3. Suite: Our most spacious option, ideal for families or groups
              seeking the utmost comfort and luxury.
            </p>
          </div>
        </div>
      </section>

      <section className="amenities" id="amenities">
        <h2
          style={{
            textAlign: "center",
            marginTop: "30px",
            marginBottom: "30px",
          }}
        >
          Amenities
        </h2>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "50%", textAlign: "justify" }}>
            <p>Enjoy a wide array of amenities at [Hotel Name]:</p>
            <p>1. Free Wi-Fi</p>
            <p>2. Swimming Pool & Spa</p>
            <p>3. In-House Restaurant and Bar</p>
            <p>4. Fitness Center</p>
            <p>5. Room Service</p>
          </div>
        </div>
      </section>

      <section className="reviews" id="reviews">
        <h2
          style={{
            textAlign: "center",
            marginTop: "30px",
            marginBottom: "30px",
          }}
        >
          Reviews
        </h2>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "50%", textAlign: "justify" }}>
            <p>
              "The staff was incredibly welcoming and the rooms were spotless!"
              - [Customer]
            </p>
            <p>
              "Perfect location and beautiful views. Would definitely stay
              again." - [Customer]
            </p>
            <p>
              "A wonderful experience! The amenities were top-notch." -
              [Customer]
            </p>
          </div>
        </div>
      </section>

      <section className="book-now" id="book-now">
        <h2
          style={{
            textAlign: "center",
            marginTop: "30px",
            marginBottom: "30px",
          }}
        >
          Book Now
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Link to="/booking-form" style={{ marginBottom: "20px" }}>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#0056b3")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#007bff")
              }
            >
              Book a Room
            </button>
          </Link>
          <p>
            For any assistance, contact us at{" "}
            <a
              href="mailto:hotel@example.com"
              style={{ color: "#007bff", textDecoration: "underline" }}
            >
              hotel@example.com
            </a>{" "}
            or call (123) 456-7890.
          </p>
        </div>
      </section>

      <section className="social-links">
        <h3 style={{ textAlign: "center", marginTop: "30px" }}>Follow Us</h3>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <a
            href="https://www.facebook.com/hotel"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={facebookIcon}
              alt="Facebook"
              style={{ width: "40px", height: "40px", marginRight: "8px" }}
            />
          </a>
          <a
            href="https://www.instagram.com/hotel"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={instagramIcon}
              alt="Instagram"
              style={{ width: "40px", height: "40px" }}
            />
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
