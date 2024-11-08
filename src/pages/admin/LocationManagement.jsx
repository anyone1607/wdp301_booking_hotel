import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Table, Form, Modal } from "react-bootstrap";
import "../../styles/TourManagement.css";
import axios from "axios";
import Pagination from "../../components/Page";

function LocationManagement() {
    const [locations, setLocations] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [locationsPerPage] = useState(8);

    useEffect(() => {
        const fetchLocations = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/v1/locations",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setLocations(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchLocations();
    }, []);

    const handleDeleteLocation = (id) => {
        const token = localStorage.getItem("accessToken");
        axios
            .delete(`http://localhost:8000/api/v1/locations/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                setLocations(locations.filter((location) => location._id !== id));
            })
            .catch((error) => console.error(error));
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleShowModal = (location) => {
        setSelectedLocation(location);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedLocation(null);
    };

    const filteredLocations = locations.filter((location) =>
        location.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get current locations
    const indexOfLastLocation = currentPage * locationsPerPage;
    const indexOfFirstLocation = indexOfLastLocation - locationsPerPage;
    const currentLocations = filteredLocations.slice(
        indexOfFirstLocation,
        indexOfLastLocation
    );

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="locations-container p-4 bg-light">
            <h2 className="text-2xl font-bold mb-4">Location Management</h2>

            <Form.Control
                type="text"
                placeholder="Search by location title"
                value={searchQuery}
                onChange={handleSearchChange}
                className="mb-3"
            />

            <Table striped bordered hover responsive>
                <thead className="bg-gray-200">
                    <tr>
                        <th>Logo</th>
                        <th>Title</th>
                        <th>City</th>
                        <th>Address</th>
                        <th>Images</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(currentLocations) && currentLocations.length > 0 ? (
                        currentLocations.map((location) => (
                            <tr key={location._id} className="bg-white hover:bg-gray-50">
                                <td onClick={() => handleShowModal(location)}>
                                    {location.logo ? (
                                        <img
                                            src={location.logo}
                                            alt={location.title}
                                            style={{ width: "70px", height: "auto" }}
                                        />
                                    ) : (
                                        "No Logo"
                                    )}
                                </td>
                                <td onClick={() => handleShowModal(location)}>{location.title}</td>
                                <td>{location.city}</td>
                                <td>{location.address}</td>
                                <td>
                                    {location.images && location.images.length > 0 ? (
                                        location.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`Image ${index + 1}`}
                                                style={{
                                                    width: "70px",
                                                    height: "auto",
                                                    marginRight: "5px",
                                                }}
                                            />
                                        ))
                                    ) : (
                                        "No Images"
                                    )}
                                </td>
                                <td>
                                    <Link to={`/update-location/${location._id}`}>
                                        <Button variant="warning" size="sm">Update</Button>
                                    </Link>
                                    {/* <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDeleteLocation(location._id)}
                                        className="ml-2"
                                    >
                                        Delete
                                    </Button> */}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">
                                No locations found
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Link to="/create-location">
                <Button variant="primary" className="mb-3">
                    Create Location
                </Button>
            </Link>

            <Pagination
                toursPerPage={locationsPerPage}
                totalTours={filteredLocations.length}
                paginate={paginate}
                currentPage={currentPage}
            />

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedLocation ? selectedLocation.title : ""}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedLocation && (
                        <div>
                            <p><strong>Title:</strong> {selectedLocation.title}</p>
                            <p><strong>City:</strong> {selectedLocation.city}</p>
                            <p><strong>Address:</strong> {selectedLocation.address}</p>
                            <p><strong>Description:</strong> {selectedLocation.description}</p>
                            <p><strong>Status:</strong> {selectedLocation.status}</p>
                            <div><strong>Images:</strong></div>
                            <div className="d-flex flex-wrap">
                                {selectedLocation.images && selectedLocation.images.length > 0 ? (
                                    selectedLocation.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Location image ${index + 1}`}
                                            style={{
                                                width: "70px",
                                                height: "auto",
                                                marginRight: "5px",
                                                marginTop: "5px",
                                            }}
                                        />
                                    ))
                                ) : (
                                    <p>No images available</p>
                                )}
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default LocationManagement;
