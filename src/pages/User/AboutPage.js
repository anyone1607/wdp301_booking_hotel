import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import facebookIcon from '../../assets/photos/facebook.png';
import instagramIcon from '../../assets/photos/instagram.png';
import logo from '../../assets/photos/logo.png';
import '../../styles/about.css';
import CommonSection from '../../shared/CommonSection';

const AboutPage = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    // Lắng nghe sự kiện khi nhấp vào các liên kết
    const links = document.querySelectorAll('a[href^="#"]');
    for (let i = 0; i < links.length; i++) {
      links[i].addEventListener('click', scrollOnClick);
    }

    // Hiển thị hoặc ẩn nút cuộn lên khi cuộn trang
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Hàm xử lý cuộn tự động
  function scrollOnClick(event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của liên kết
    const targetId = this.getAttribute('href'); // Lấy định danh của mục tiêu từ thuộc tính href
    const targetElement = document.querySelector(targetId); // Lấy phần tử mục tiêu dựa trên định danh
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' }); // Cuộn tự động đến phần tử mục tiêu
    }
  }

  // Hàm xử lý sự kiện cuộn trang
  function handleScroll() {
    if (window.pageYOffset > 100) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  }

  // Hàm xử lý khi nhấp vào nút cuộn lên
  function handleScrollUp() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  
  }
  return (
   

    <div className="about-page">
  
    <div> <CommonSection title={"About Touristic"} />
      </div>
      <ul className="link-list">
    <a href="#intro">Introduction</a>
    <a href="#story">Inspiration</a>
    <a href="#mission">Mission & Vision</a>
    <a href="#exp">Expertise & Qualifications</a>
    <a href="#unique">Unique Selling Proposition</a>
    <a href="#overview">Content Overview</a>
    <a href="#community">Community</a>
  </ul>
  <button className="scroll-up-button" style={{ display: showScrollButton ? 'block' : 'none' }} onClick={handleScrollUp}>
        Scroll Up
      </button>
  <section className="intro">
    <h2 id="intro" style={{ textAlign: 'center',marginTop:'30px', marginBottom: '30px' }}>Introduction</h2>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
     <div style={{ width: '50%', textAlign: 'justify' }}>
  <p>
    Welcome to our Touristic - a place dedicated to uncovering the marvels of the world and facilitating unforgettable journeys. We cater to avid travelers seeking new horizons and unique experiences.
  </p>
  <p>
    In Touristic , we understand that tourism is not merely about sightseeing; it's about delving into diverse cultures, embracing novelty, and crafting enduring memories.
  </p>
  <p>
    Join us as we traverse through breathtaking landscapes, delve into rich histories, and indulge in distinctive experiences. Let's embark on thrilling adventures, cultivate new connections, and fashion timeless moments together.
  </p>
</div>

        </div>

      </section>
      <section className="story">
  <h2 id="story" style={{ textAlign: 'center', marginTop:'30px', marginBottom: '30px'}}>Inspiration</h2>
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div style={{ width: '50%', textAlign: 'justify' }}>
      <p>
        From a young age, I've been drawn to the excitement of travel and the thrill of exploration. Each journey, whether to bustling cities or serene landscapes, has left an indelible mark on my soul. The sights, sounds, and flavors of each destination have ignited my passion for sharing these experiences with others.
      </p>
      <p>
        As I matured, I realized that my true calling was to help others embark on their own adventures and create memories that would last a lifetime. Thus, the idea for our tour booking platform was born - a place where travelers could find inspiration, plan their dream vacations, and make unforgettable memories.
      </p>
      <p>
        I want everyone to understand that travel is not just about visiting new places; it's about immersing yourself in different cultures, trying new cuisines, and forging connections with people from all walks of life. It's about stepping out of your comfort zone and embracing the unknown.
      </p>
      <p>
        Through our platform, I hope to inspire others to explore the world, discover hidden gems, and create their own stories. I want travelers to feel empowered and excited as they plan their journeys, knowing that each adventure is an opportunity for growth and self-discovery.
      </p>
      <p>
        Let's embark on this journey together and make every trip an unforgettable experience. Let's explore the world and create memories that will last a lifetime!
      </p>
    </div>
  </div>
</section>
<section className="mission-vision">
  <h2 id="mission" style={{ textAlign: 'center', marginTop:'30px', marginBottom: '30px'}}>Mission Vision</h2>
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div style={{ width: '50%', textAlign: 'justify' }}>
      <p>
        Our mission is to make travel accessible, enjoyable, and memorable for everyone. We aim to provide travelers with a seamless booking experience, a wide range of options, and expert guidance every step of the way.
      </p>
      <p>
        Our vision is to become the go-to platform for travelers seeking unique and authentic experiences around the globe. We want to connect people with unforgettable adventures, whether it's a relaxing beach getaway, an exhilarating outdoor expedition, or a cultural immersion in a vibrant city.
      </p>
      <p>
        We are committed to offering personalized service, reliable information, and innovative solutions to meet the diverse needs of travelers. We want to inspire people to explore new destinations, embrace new cultures, and create memories that will last a lifetime.
      </p>
      <p>
        With our mission and vision as our guiding principles, we strive to empower travelers to discover the world and enrich their lives through meaningful travel experiences.
      </p>
    </div>
  </div>
</section>
<section className="expertise">
  <h2 id="exp" style={{ textAlign: 'center', marginTop:'30px', marginBottom: '30px'}}>Qualifications</h2>
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div style={{ width: '50%', textAlign: 'justify' }}>
      <p>
        1. Travel experts: Our team consists of seasoned travel experts with extensive knowledge and experience in the tourism industry. We have traveled to countless destinations, explored diverse cultures, and curated unique experiences for our customers.
      </p>
      <p>
        2. Education and training: We hold certifications and qualifications in tourism and hospitality from reputable institutions. We have undergone rigorous training and continue to stay updated on the latest trends and developments in the travel industry.
      </p>
      <p>
        3. Practical experience: We have years of hands-on experience in organizing tours, managing logistics, and providing exceptional customer service. We have built strong relationships with trusted partners and suppliers to ensure smooth and seamless travel experiences for our customers.
      </p>
      <p>
        4. Research and innovation: We are constantly researching and innovating to offer new and exciting travel opportunities. From off-the-beaten-path destinations to unique cultural experiences, we strive to provide our customers with unforgettable adventures that exceed their expectations.
      </p>
      <p>
        5. Customer feedback: We value feedback from our customers and use it to improve and enhance our services. Our commitment to customer satisfaction drives us to continuously innovate and deliver exceptional travel experiences.
      </p>
      <p>
        With our expertise, passion, and dedication, we are confident in our ability to provide travelers with unforgettable experiences and create memories that will last a lifetime.
      </p>
    </div>
  </div>
</section>
<section className="unique-selling-proposition">
  <h2 id="unique" style={{ textAlign: 'center', marginTop:'30px', marginBottom: '30px'}}>Unique Selling Proposition</h2>
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div style={{ width: '50%', textAlign: 'justify' }}>
      <p>
        We stand out by offering:
      </p>
      <p>
        1. Personalized experiences: We tailor our tours to suit the unique preferences and interests of each traveler. Whether you're a thrill-seeker, a culture enthusiast, or a nature lover, we have the perfect itinerary for you.
      </p>
      <p>
        2. Diverse destinations: From iconic landmarks to hidden gems, we offer a wide range of destinations to explore. Whether you're dreaming of a European adventure, an African safari, or an Asian odyssey, we've got you covered.
      </p>
      <p>
        3. Expert guidance: Our team of experienced travel advisors is here to assist you every step of the way. From planning your itinerary to booking accommodations and activities, we provide expert guidance and personalized recommendations to ensure a seamless and memorable travel experience.
      </p>
      <p>
        4. Exceptional service: We go above and beyond to exceed our customers' expectations. From the moment you book your tour to the moment you return home, we strive to provide exceptional service and support to make your journey unforgettable.
      </p>
      <p>
        5. With these unique offerings, we aim to make travel planning effortless and enjoyable, allowing you to focus on what matters most – creating unforgettable memories with your loved ones.
      </p>
    </div>
  </div>
</section>
<section className="content-overview">
  <h2 id="overview" style={{ textAlign: 'center', marginTop:'30px', marginBottom: '30px'}}>Content Overview</h2>
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div style={{ width: '50%', textAlign: 'justify' }}>
      <p>
        Our tour booking platform offers:
      </p>
      <p>
        1. Unique itineraries: From cultural immersions to outdoor adventures, we offer a diverse range of tour packages to suit every traveler's interests and preferences. Our expertly crafted itineraries ensure that you get the most out of your travel experience.
      </p>
      <p>
        2. Insider tips: We provide insider tips and recommendations to help you make the most of your trip. Whether it's the best restaurants to try, hidden gems to discover, or local customs to be aware of, we've got you covered.
      </p>
      <p>
        3. Expert advice: Our team of travel experts is here to answer all your questions and provide personalized recommendations. Whether you're looking for family-friendly activities, romantic getaways, or solo adventures, we're here to help you plan the perfect trip.
      </p>
      <p>
        4. Customer reviews: We feature customer reviews and testimonials to help you make informed decisions about your travel plans. Hear from fellow travelers about their experiences and get inspired to embark on your own adventure.
      </p>
      <p>
        5. With our comprehensive content, easy-to-use platform, and expert guidance, planning your next adventure has never been easier. Let us help you turn your travel dreams into reality!
      </p>
    </div>
  </div>
</section>

      <section className="engagement">
      <h2 id="community" style={{ textAlign: 'center', marginTop:'30px', marginBottom: '30px'}}>Community </h2>

        <div style={{ display: 'flex', justifyContent: 'center' }} className="social-icons">
  <a href="https://www.facebook.com/tourdulichvtt" target="_blank" rel="noopener noreferrer">
    <img src={facebookIcon} alt="Facebook" style={{ width: '40px', height: '40px', marginRight: '8px' }} />
  </a>
  <a href="https://www.instagram.com/touristic" target="_blank" rel="noopener noreferrer">
    <img src={instagramIcon} alt="Instagram" style={{ width: '40px', height: '40px' }} />
  </a>
</div>



      </section>
     
      <section className="call-to-action">

        <h3 style={{ textAlign: 'center'}}>
      Let the journey begin!
        </h3>
      </section>
    </div>
  
  
  );
};

export default AboutPage;
