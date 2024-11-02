import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Table, Form, Modal } from "react-bootstrap";
import "../../styles/TourManagement.css";
import axios from "axios";
import Pagination from "../../components/Page"; // Import the Pagination component

function RoomManagement() {
  const [roomCategories, setRoomCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomCategoriesPerPage] = useState(8);

  useEffect(() => {
    const fetchRoomCategories = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/roomCategory",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setRoomCategories(data); // Đảm bảo rằng dữ liệu trả về đúng cấu trúc
      } catch (error) {
        console.error(error);
      }
    };

    fetchRoomCategories();
  }, []);

  const handleDeleteRoomCategory = (id) => {
    const token = localStorage.getItem("accessToken");
    fetch(`http://localhost:8000/api/v1/roomCategory/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then(() => {
        setRoomCategories(roomCategories.filter((room) => room._id !== id));
      })
      .catch((error) => console.error(error));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleShowModal = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
  };

  const filteredRoomCategories = roomCategories.filter((room) =>
    room.roomName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current room categories
  const indexOfLastRoom = currentPage * roomCategoriesPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomCategoriesPerPage;
  const currentRoomCategories = filteredRoomCategories.slice(
    indexOfFirstRoom,
    indexOfLastRoom
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (roomCategories.length === 0) {
    return <h2>No room categories</h2>;
  }

  return (
    <div className="room-categories-container p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Room Management</h2>

      <Form.Control
        type="text"
        placeholder="Search by room name"
        value={searchQuery}
        onChange={handleSearchChange}
        className="mb-3"
      />
      <Table striped bordered hover>
        <thead className="bg-gray-200">
          <tr>
            <th>Photo room</th>
            <th>Hotel</th>
            <th>Room Name</th>
            <th>Price</th>
            <th>Max Occupancy</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Actions</th>

            {/* <th>Delete</th> */}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(currentRoomCategories) &&
          currentRoomCategories.length > 0 ? (
            currentRoomCategories.map((room) => (
              <tr key={room._id} className="bg-white hover:bg-gray-50">
                 <td onClick={() => handleShowModal(room)}>
                  <img
                    src={room.photo}
                    alt={room.title}
                    style={{ width: "70px" }}
                  />
                </td>
                <td>{room.hotelId ? room.hotelId.title : "No Hotel"}</td>
                <td onClick={() => handleShowModal(room)}>{room.roomName}</td>
                <td onClick={() => handleShowModal(room)}>${room.roomPrice}</td>
                <td onClick={() => handleShowModal(room)}>
                  {room.maxOccupancy}
                </td>
                <td onClick={() => handleShowModal(room)}>{room.quantity}</td>
                <td>{room.status}</td>
                <td>
                  <Link to={`/update-room/${room._id}`}>
                    <Button variant="warning">Update</Button>
                  </Link>
                </td>
                {/* <td>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDeleteRoomCategory(room._id)}
                                    >
                                        Delete
                                    </Button>
                                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No room categories found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Link to="/create-room">
        <Button variant="primary" className="mb-3">
          Create Room
        </Button>
      </Link>

      <Pagination
        toursPerPage={roomCategoriesPerPage}
        totalTours={filteredRoomCategories.length}
        paginate={paginate}
        currentPage={currentPage}
      />

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedRoom ? selectedRoom.roomName : ""}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRoom && (
            <div>
              <p>Room Name: {selectedRoom.roomName}</p>
              <p>Room Price: ${selectedRoom.roomPrice}</p>
              <p>Max Occupancy: {selectedRoom.maxOccupancy}</p>
              <p>Quantity: {selectedRoom.quantity}</p>
              <p>Description: {selectedRoom.description}</p>
              <p>Status: {selectedRoom.status}</p>
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

export default RoomManagement;
