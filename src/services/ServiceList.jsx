import React from 'react';
import ServiceCard from './ServiceCard';
import { Col } from 'reactstrap';
import weatherImg from '../assets/images/weather.png'; // Hình ảnh thời tiết
import guideImg from '../assets/images/guide.png'; // Hình ảnh hướng dẫn viên
import customizationImg from '../assets/images/customization.png'; // Hình ảnh tùy chỉnh

const servicesData = [
   {
      imgUrl: weatherImg,
      title: 'Room Comfort',
      desc: 'Experience the ultimate comfort in our hotel rooms. With premium amenities and cozy designs, your stay will be a relaxing escape from the everyday hustle and bustle.',
   },
   {
      imgUrl: guideImg,
      title: 'Hotel Recommendations',
      desc: 'Discover the best hotels for your needs. Whether you are looking for luxury, budget-friendly options, or unique stays, our curated list of hotels ensures you find the perfect accommodation for your trip.',
   },
   {
      imgUrl: customizationImg,
      title: 'Customized Booking',
      desc: 'Tailor your hotel booking experience to suit your preferences. From choosing room types to adding special requests, our platform allows you to create a stay that matches your unique needs and desires.',
   },
];

const ServiceList = () => {
   return (
      <>
         {servicesData.map((item, index) => (
            <Col lg='3' md='6' sm='12' className='mb-4' key={index}>
               <ServiceCard item={item} />
            </Col>
         ))}
      </>
   );
};

export default ServiceList;
