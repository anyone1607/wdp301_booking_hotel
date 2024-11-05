import React from 'react';
import TourCard from '../../shared/TourCard';
import { Col } from 'reactstrap';

const FeaturedTourList = ({ tours }) => {
  return (
    <>
      {tours.length === 0 && <h4>No hotel found</h4>}
      {tours.map((tour) => (
        <Col lg='3' md='4' sm='6' className='mb-4' key={tour._id}>
          <TourCard tour={tour} />
        </Col>
      ))}
    </>
  );
};

export default FeaturedTourList;
