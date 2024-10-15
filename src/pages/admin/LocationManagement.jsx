import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const LocationManagement = () => {
  const [locations, setLocations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  const [isEditing, setIsEditing] = useState(false); 
  const [currentLocationId, setCurrentLocationId] = useState(null);
  const [newLocation, setNewLocation] = useState({
    title: "",
    city: "",
    address: "",
    distance: "",
    description: "",
    featured: false,
    images: [],
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    const response = await axios.get("http://localhost:8000/api/v1/locations/getlocation");
    setLocations(response.data);
  };

  const handleShow = () => {
    setShowModal(true);
    setIsEditing(false);
    setNewLocation({
      title: "",
      city: "",
      address: "",
      distance: "",
      description: "",
      featured: false,
      images: [],
    });
  };

  const handleEditShow = (location) => {
    setShowModal(true);
    setIsEditing(true);
    setCurrentLocationId(location._id);
    setNewLocation(location);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentLocationId(null);
    setShowDeleteModal(false); 
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewLocation((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.post(`http://localhost:8000/api/v1/locations/update/${currentLocationId}`, newLocation);
      } else {
        await axios.post("http://localhost:8000/api/v1/locations/createlocation", newLocation);
      }
      handleClose();
      fetchLocations(); 
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  const handleDeleteRequest = (id) => {
    setCurrentLocationId(id); 
    setShowDeleteModal(true); 
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/locations/delete/${currentLocationId}`);
      fetchLocations(); 
      handleClose(); 
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Quản Lý Locations</h1>
      <Button variant="primary" onClick={handleShow}>
        Thêm Location
      </Button>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Thành phố</th>
            <th>Địa chỉ</th>
            <th>Khoảng cách</th>
            <th>Mô tả</th>
            <th>Hình ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location) => (
            <tr key={location._id}>
              <td>{location.title}</td>
              <td>{location.city}</td>
              <td>{location.address}</td>
              <td>{location.distance}</td>
              <td>{location.description}</td>
              <td>{location.images.length > 0 ? location.images.join(", ") : "Chưa có hình"}</td>
              <td>
                <Button variant="warning" size="sm" className="mr-2" onClick={() => handleEditShow(location)}>Sửa</Button>
                <Button variant="danger" size="sm" onClick={() => handleDeleteRequest(location._id)}>Xóa</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Sửa Location" : "Thêm Location"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control type="text" name="title" value={newLocation.title} onChange={handleChange} required />
            </Form.Group>

            <Form.Group controlId="formCity">
              <Form.Label>Thành phố</Form.Label>
              <Form.Control type="text" name="city" value={newLocation.city} onChange={handleChange} required />
            </Form.Group>

            <Form.Group controlId="formAddress">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control type="text" name="address" value={newLocation.address} onChange={handleChange} required />
            </Form.Group>

            <Form.Group controlId="formDistance">
              <Form.Label>Khoảng cách (km)</Form.Label>
              <Form.Control type="number" name="distance" value={newLocation.distance} onChange={handleChange} required />
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control as="textarea" name="description" value={newLocation.description} onChange={handleChange} required />
            </Form.Group>

            <Form.Group controlId="formFeatured">
              <Form.Check type="checkbox" name="featured" label="Nổi bật" checked={newLocation.featured} onChange={handleChange} />
            </Form.Group>

            <Form.Group controlId="formImages">
              <Form.Label>Hình ảnh (URL)</Form.Label>
              <Form.Control type="text" name="images" value={newLocation.images.join(", ")} onChange={handleChange} placeholder="Nhập các URL hình ảnh, ngăn cách bằng dấu phẩy" />
            </Form.Group>

            <Button variant="primary" type="submit">
              {isEditing ? "Cập nhật" : "Thêm"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Xóa Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn xóa địa điểm này?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LocationManagement;
