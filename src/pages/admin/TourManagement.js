import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table, Form, Modal } from 'react-bootstrap';
import '../../styles/TourManagement.css';
import axios from 'axios';
import Pagination from '../../components/Page';  // Import the Pagination component

function TourManagement() {
    const [tours, setTours] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedTour, setSelectedTour] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [toursPerPage] = useState(8);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        fetch('http://localhost:8000/api/v1/tours', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => setTours(data.data))
            .catch(error => console.error(error));
    }, []);

    const handleDeleteTour = id => {
        const token = localStorage.getItem("accessToken");
        fetch(`http://localhost:8000/api/v1/tours/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(() => {
                setTours(tours.filter(tour => tour._id !== id));
            })
            .catch(error => console.error(error));
    };

    const handleToggleFeatured = id => {
        const token = localStorage.getItem("accessToken");
        const tour = tours.find(t => t._id === id);
        fetch(`http://localhost:8000/api/v1/tours/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ featured: !tour.featured }),
        })
            .then(response => response.json())
            .then(updatedTour => {
                setTours(tours.map(t => (t._id === id ? updatedTour.data : t)));
            })
            .catch(error => console.error(error));
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleShowModal = async (tour) => {
        setSelectedTour(tour);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTour(null);
        setReviews([]);
    };

    const filteredTours = tours.filter(tour =>
        tour.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get current tours
    const indexOfLastTour = currentPage * toursPerPage;
    const indexOfFirstTour = indexOfLastTour - toursPerPage;
    const currentTours = filteredTours.slice(indexOfFirstTour, indexOfLastTour);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    if (tours.length === 0) {
        return <h2>No tours</h2>;
    }

    return (
        <div className="tours-container p-6 bg-gray-100">
            <h2 className="text-2xl font-bold mb-4">Tours Management</h2>
            
            <Form.Control
                type="text"
                placeholder="Search by tour title"
                value={searchQuery}
                onChange={handleSearchChange}
                className="mb-3"
            />
            <Table striped bordered hover>
                <thead className="bg-gray-200">
                    <tr>
                        <th>Photo</th>
                        <th>Title</th>
                        <th>Address</th>
                        <th>Distance</th>
                        <th>Max Group Size</th>
                        <th>Price</th>
                        <th>Featured</th>
                        <th>Actions</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {currentTours.map(tour => (
                        <tr key={tour._id} className="bg-white hover:bg-gray-50">
                            <td onClick={() => handleShowModal(tour)}><img src={tour.photo} alt={tour.title} style={{ width: '125px' }} /></td>
                            <td onClick={() => handleShowModal(tour)}>{tour.title}</td>
                            <td onClick={() => handleShowModal(tour)}>{tour.address}</td>
                            <td onClick={() => handleShowModal(tour)}>{tour.distance}</td>
                            <td onClick={() => handleShowModal(tour)}>{tour.maxGroupSize}</td>
                            <td onClick={() => handleShowModal(tour)}>{tour.price}</td>
                            <td>
                                <Form.Check 
                                    type="switch"
                                    id={`featured-switch-${tour._id}`}
                                    checked={tour.featured}
                                    onChange={() => handleToggleFeatured(tour._id)}
                                />
                            </td>
                            <td>
                                <Link to={`/admin/update-tour/${tour._id}`}>
                                    <Button variant="warning">Update</Button>
                                </Link>
                            </td>
                            <td>
                                <Button variant="danger" onClick={() => handleDeleteTour(tour._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Link to="/admin/create-tour">
                <Button variant="primary" className="mb-3">Create Tour</Button>
            </Link>

            <Pagination
                toursPerPage={toursPerPage}
                totalTours={filteredTours.length}
                paginate={paginate}
                currentPage={currentPage}
            />

            {selectedTour && (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedTour.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <img src={selectedTour.photo} alt={selectedTour.title} style={{ width: '100%' }} />
                        <p>{selectedTour.desc}</p>
                        <p><strong>City:</strong> {selectedTour.city}</p>
                        <p><strong>Address:</strong> {selectedTour.address}</p>
                        <p><strong>Distance:</strong> {selectedTour.distance} km</p>
                        <p><strong>Max Group Size:</strong> {selectedTour.maxGroupSize}</p>
                        <p><strong>Price:</strong> ${selectedTour.price}</p>
                        {selectedTour.reviews.length > 0 && (
                            <div className="reviews mt-3">
                                <h5>Reviews</h5>
                                {selectedTour.reviews.map(review => (
                                    <div key={review._id}>
                                        <p><strong>{review.username}</strong>: {review.rating} stars</p>
                                        <p>{review.reviewText}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}

export default TourManagement;
