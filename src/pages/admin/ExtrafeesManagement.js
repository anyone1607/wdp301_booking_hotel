import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Table, Form, Modal } from "react-bootstrap";
import "../../styles/TourManagement.css";
import axios from "axios";
import Pagination from "../../components/Page"; // Import the Pagination component

function ExtrafeesManagement() {
  const [extrafees, setExtrafees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedExtrafee, setSelectedExtrafee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [extrafeesPerPage] = useState(8);

  // Fetch extra fees data
  useEffect(() => {
    const fetchExtrafees = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch("http://localhost:8000/api/v1/extrafee", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setExtrafees(data);
      } catch (error) {
        console.error("Error fetching extra fees:", error);
      }
    };

    fetchExtrafees();
  }, []);

  const handleDeleteExtrafee = async (id) => {
    const token = localStorage.getItem("accessToken");
    try {
      await fetch(`http://localhost:8000/api/v1/extrafee/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExtrafees(extrafees.filter((extrafee) => extrafee._id !== id));
    } catch (error) {
      console.error("Error deleting extra fee:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleShowModal = (extrafee) => {
    setSelectedExtrafee(extrafee);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedExtrafee(null);
  };

  const filteredExtrafees = extrafees.filter((extrafee) =>
    extrafee.extraName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current extra fees
  const indexOfLastExtrafee = currentPage * extrafeesPerPage;
  const indexOfFirstExtrafee = indexOfLastExtrafee - extrafeesPerPage;
  const currentExtrafees = filteredExtrafees.slice(
    indexOfFirstExtrafee,
    indexOfLastExtrafee
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (extrafees.length === 0) {
    return <h2>No extra fees found</h2>;
  }

  return (
    <div className="extrafees-container p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Manage Extra Fees</h2>

      <Form.Control
        type="text"
        placeholder="Search by extra fee name"
        value={searchQuery}
        onChange={handleSearchChange}
        className="mb-3"
      />
      <Table striped bordered hover>
        <thead className="bg-gray-200">
          <tr>
            <th>Hotel</th>
            <th>Extra Fee Name</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(currentExtrafees) && currentExtrafees.length > 0 ? (
            currentExtrafees.map((extrafee) => (
              <tr key={extrafee._id} className="bg-white hover:bg-gray-50">
                <td>
                  {extrafee.hotelId
                    ? extrafee.hotelId.title
                    : "No hotel available"}
                </td>
                <td onClick={() => handleShowModal(extrafee)}>
                  {extrafee.extraName}
                </td>
                <td onClick={() => handleShowModal(extrafee)}>
                  ${extrafee.extraPrice}
                </td>
                <td>{extrafee.status}</td>
                <td>
                  <Link to={`/update-extrafee/${extrafee._id}`}>
                    <Button variant="warning">Update</Button>
                  </Link>
                </td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteExtrafee(extrafee._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No extra fees found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Link to="/create-extrafee">
        <Button variant="primary" className="mb-3">
          Create Extra Fee
        </Button>
      </Link>

      <Pagination
        toursPerPage={extrafeesPerPage}
        totalTours={filteredExtrafees.length}
        paginate={paginate}
        currentPage={currentPage}
      />

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedExtrafee ? selectedExtrafee.extraName : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedExtrafee && (
            <div>
              <p>Extra Fee Name: {selectedExtrafee.extraName}</p>
              <p>Extra Fee Price: ${selectedExtrafee.extraPrice}</p>
              <p>Status: {selectedExtrafee.status}</p>
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

export default ExtrafeesManagement;
