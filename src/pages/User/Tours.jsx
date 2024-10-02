import React, { useState, useEffect } from 'react';
import CommonSection from '../../shared/CommonSection';
import '../../styles/tour.css';
import TourCard from '../../shared/TourCard';
import SearchBar from '../../shared/SearchBar';
import { Col, Container, Row } from 'reactstrap';
import useFetch from '../../hooks/useFetch';
import { BASE_URL } from '../../utils/config';
import Pagination from '../../components/Page';  // Import the Pagination component

const Tours = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [toursPerPage] = useState(8); // Adjust the number of tours per page if needed
  const [sortCriteria, setSortCriteria] = useState('');
  const [sortedTours, setSortedTours] = useState([]);

  const { data: tours, loading, error } = useFetch(`${BASE_URL}/tours`);

  useEffect(() => {
    if (tours) {
      let sortedArray = [...tours];
      if (sortCriteria === 'location') {
        sortedArray.sort((a, b) => a.city.localeCompare(b.city));
      } else if (sortCriteria === 'priceAsc') {
        sortedArray.sort((a, b) => a.price - b.price);
      } else if (sortCriteria === 'priceDesc') {
        sortedArray.sort((a, b) => b.price - a.price);
      } else if (sortCriteria === 'rating') {
        sortedArray.sort((a, b) => b.rating - a.rating);
      }
      setSortedTours(sortedArray);
    }
  }, [tours, sortCriteria]);

  // Get current tours
  const indexOfLastTour = currentPage * toursPerPage;
  const indexOfFirstTour = indexOfLastTour - toursPerPage;
  const currentTours = sortedTours.slice(indexOfFirstTour, indexOfLastTour);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <>
      <CommonSection title={"All Tours Available"} />
      <section>
        <Container>
          <Row>
            <SearchBar />
            <Col lg="3" md="6" sm="6">
              <select
                onChange={(e) => setSortCriteria(e.target.value)}
                className="form-control sort-select"
              >
                <option value="">All</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="location">Location</option>
                <option value="rating">Most ratings</option>
              </select>
            </Col>
          </Row>
        </Container>
      </section>

      <section className='pt-0'>
        <Container>
          {loading && <h4 className='text-center pt-5'>LOADING..........</h4>}
          {error && <h4 className='text-center pt-5'>{error}</h4>}
          {
            !loading && !error &&
            <Row>
              {
                currentTours.map(tour => (
                  <Col lg='3' md='6' sm='6' className='mb-4' key={tour._id}>
                    <TourCard tour={tour} />
                  </Col>
                ))
              }
            </Row>
          }
          <Pagination
            toursPerPage={toursPerPage}
            totalTours={sortedTours.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </Container>
      </section>
    </>
  );
};

export default Tours;
