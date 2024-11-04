/* eslint-disable jsx-a11y/img-redundant-alt */
// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { Button, Modal, Form } from "react-bootstrap";
// import { FaPlus } from "react-icons/fa";
// import "bootstrap/dist/css/bootstrap.min.css";

// const LocationManagement = () => {
//   const fileInput = useRef(null);
//   const [locations, setLocations] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentLocationId, setCurrentLocationId] = useState(null);
//   const [newLocation, setNewLocation] = useState({
//     logo: "",
//     title: "",
//     city: "",
//     address: "",
//     distance: "",
//     description: "",
//     featured: false,
//     images: [],
//   });

//   useEffect(() => {
//     fetchLocations();
//   }, []);

//   const fetchLocations = async () => {
//     const response = await axios.get(
//       "http://localhost:8000/api/v1/locations/getlocation"
//     );
//     setLocations(response.data);
//   };

//   const handleShow = () => {
//     setShowModal(true);
//     setIsEditing(false);
//     setNewLocation({
//       logo: "",
//       title: "",
//       city: "",
//       address: "",
//       distance: "",
//       description: "",
//       featured: false,
//       images: [],
//     });
//   };

//   const handleEditShow = (location) => {
//     setShowModal(true);
//     setIsEditing(true);
//     setCurrentLocationId(location._id);
//     setNewLocation(location);
//   };

//   const handleClose = () => {
//     setShowModal(false);
//     setCurrentLocationId(null);
//     setShowDeleteModal(false);
//   };

//   // const handleChange = (e) => {
//   //   const { name, value, type, checked } = e.target;
//   //   setNewLocation((prev) => ({
//   //     ...prev,
//   //     [name]: type === "checkbox" ? checked : value,
//   //   }));
//   // };

//   const toggleActiveStatus = async (id, isActive) => {
//     try {
//       const response = await axios.patch(
//         `http://localhost:8000/api/v1/locations/updateStatus/${id}`
//       );
//       fetchLocations();
//       console.log(response);
//     } catch (error) {
//       console.error("Error toggling status:", error);
//     }
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     const formData = new FormData();
//   //     formData.append("logo", fileInput.current.files[0]);
//   //     formData.append("title", newLocation.title);
//   //     if (isEditing) {
//   //       await axios.post(
//   //         `http://localhost:8000/api/v1/locations/update/${currentLocationId}`,
//   //         formData
//   //       );
//   //     } else {
//   //       await axios.post(
//   //         "http://localhost:8000/api/v1/locations/createlocation",
//   //         formData
//   //       );
//   //     }
//   //     handleClose();
//   //     fetchLocations();
//   //   } catch (error) {
//   //     console.error("Error saving location:", error);
//   //   }
//   // };

//   const handleDeleteRequest = (id) => {
//     setCurrentLocationId(id);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       await axios.delete(
//         `http://localhost:8000/api/v1/locations/delete/${currentLocationId}`
//       );
//       fetchLocations();
//       handleClose();
//     } catch (error) {
//       console.error("Error deleting location:", error);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h1>Quản Lý Locations</h1>
//       <Button variant="success" onClick={handleShow}>
//         <FaPlus />
//       </Button>

//       <table className="table table-bordered mt-3">
//         <thead className="thead-dark">
//           <tr>
//             <th>Logo</th>
//             <th>Location</th>
//             <th>Title</th>
//             <th>Address</th>
//             <th>Distance</th>
//             <th>Featured</th>
//             <th>Image</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {locations.map((location) => (
//             <tr key={location._id}>
//               <td>
//                 {location.images.length > 0 ? (
//                   <img
//                     src={location.logo}
//                     alt="Location"
//                     style={{
//                       width: "100px",
//                       height: "60px",
//                       objectFit: "cover",
//                     }}
//                   />
//                 ) : (
//                   "No Image"
//                 )}
//               </td>
//               <td>{location.city}</td>
//               <td>{location.title}</td>
//               <td>{location.address}</td>
//               <td>{location.distance}</td>
//               <td>{location.featured ? <p>True</p> : <p>False</p>}</td>

//               <td>
//                 {location.images.length > 0
//                   ? location.images.map((image, index) => (
//                       <img
//                         key={index}
//                         src={image}
//                         alt={`Location ${index + 1}`}
//                         style={{
//                           width: "100px",
//                           height: "60px",
//                           objectFit: "cover",
//                           margin: "5px",
//                         }}
//                       />
//                     ))
//                   : "No Image"}
//               </td>

//               <td>
//               <Button
//                   variant={location.status === "active" ? "primary" : "secondary"}
//                   size="sm"
//                   onClick={() => toggleActiveStatus(location._id, location.status)}
//                 >
//                   {location.status === "active" ? "Active" : "Inactive"}
//                 </Button>
//               </td>

//               <td>
//                 {/* <Button
//                   variant="warning"
//                   size="sm"
//                   className="m-2"
//                   onClick={() => handleEditShow(location)}
//                 >
//                   Update
//                 </Button> */}
//                 {/* <Button
//                   variant="danger"
//                   size="sm"
//                   onClick={() => handleDeleteRequest(location._id)}
//                 >
//                   Delete
//                 </Button> */}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* <Modal
//         show={showModal}
//         onHide={handleClose}
//         className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto"
//       >
//         <div className="border-b border-gray-200">
//           <Modal.Header
//             closeButton
//             className="flex justify-between items-center p-4 bg-blue-100 rounded-t-lg"
//           >
//             <Modal.Title className="text-lg font-semibold text-gray-800">
//               {isEditing ? "Sửa Location" : "Thêm Location"}
//             </Modal.Title>
//           </Modal.Header>
//         </div>
//         <Modal.Body className="p-6 bg-gray-50">
//           <Form onSubmit={handleSubmit}>
//             <Form.Group controlId="formLogo">
//               <Form.Label className="block text-sm font-medium text-gray-700">
//                 Logo (URL)
//               </Form.Label>
//               <Form.Control
//                 type="file"
//                 name="logo"
//                 ref={fileInput}
//                 placeholder="URL của logo"
//                 className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </Form.Group>

//             <Form.Group controlId="formTitle" className="mb-4">
//               <Form.Label className="block text-sm font-medium text-gray-700">
//                 Tiêu đề
//               </Form.Label>
//               <Form.Control
//                 type="text"
//                 name="title"
//                 value={newLocation.title}
//                 onChange={handleChange}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                 required
//               />
//             </Form.Group>

//             <Form.Group controlId="formCity" className="mb-4">
//               <Form.Label className="block text-sm font-medium text-gray-700">
//                 Thành phố
//               </Form.Label>
//               <Form.Control
//                 type="text"
//                 name="city"
//                 value={newLocation.city}
//                 onChange={handleChange}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                 required
//               />
//             </Form.Group>

//             <Form.Group controlId="formAddress" className="mb-4">
//               <Form.Label className="block text-sm font-medium text-gray-700">
//                 Địa chỉ
//               </Form.Label>
//               <Form.Control
//                 type="text"
//                 name="address"
//                 value={newLocation.address}
//                 onChange={handleChange}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                 required
//               />
//             </Form.Group>

//             <Form.Group controlId="formDistance" className="mb-4">
//               <Form.Label className="block text-sm font-medium text-gray-700">
//                 Khoảng cách (km)
//               </Form.Label>
//               <Form.Control
//                 type="number"
//                 name="distance"
//                 value={newLocation.distance}
//                 onChange={handleChange}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                 required
//               />
//             </Form.Group>

//             <Form.Group controlId="formDescription" className="mb-4">
//               <Form.Label className="block text-sm font-medium text-gray-700">
//                 Mô tả
//               </Form.Label>
//               <Form.Control
//                 as="textarea"
//                 name="description"
//                 value={newLocation.description}
//                 onChange={handleChange}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                 required
//               />
//             </Form.Group>

//             <Form.Group controlId="formImages" className="mb-4">
//               <Form.Label className="block text-sm font-medium text-gray-700">
//                 Hình ảnh (URL)
//               </Form.Label>
//               <Form.Control
//                 type="file"
//                 name="images"
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                 placeholder="Nhập các URL hình ảnh, ngăn cách bằng dấu phẩy"
//               />
//             </Form.Group>

//             <div className="flex justify-end">
//               <Button
//                 type="submit"
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//               >
//                 {isEditing ? "Cập nhật" : "Thêm"}
//               </Button>
//             </div>
//           </Form>
//         </Modal.Body>
//       </Modal> */}

//       <Modal show={showDeleteModal} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Xóa Location</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>Bạn có chắc chắn muốn xóa địa điểm này?</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Hủy
//           </Button>
//           <Button variant="danger" onClick={confirmDelete}>
//             Xóa
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default LocationManagement;

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const LocationManagement = () => {
  const fileInput = useRef(null);
  const [locations, setLocations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLocationId, setCurrentLocationId] = useState(null);
  const [newLocation, setNewLocation] = useState({
    logo: "",
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
    const response = await axios.get(
      "http://localhost:8000/api/v1/locations/getlocation"
    );
    setLocations(response.data);
  };

  const toggleActiveStatus = async (id, isActive) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/v1/locations/updateStatus/${id}`
      );
      fetchLocations();
      console.log(response);
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const handleShow = () => {
    setShowModal(true);
    setIsEditing(false);
    setNewLocation({
      logo: "",
      title: "",
      city: "",
      address: "",
      distance: "",
      description: "",
      featured: false,
      images: [],
    });
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentLocationId(null);
    setShowDeleteModal(false);
  };

  const handleRowClick = (location) => {
    setCurrentLocation(location);
    setShowModal(true);
  };

  const handleDeleteRequest = (id) => {
    setCurrentLocationId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/api/v1/locations/delete/${currentLocationId}`
      );
      fetchLocations();
      handleClose();
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Quản Lý Locations</h1>
      <Button variant="success" onClick={handleShow}>
        <FaPlus />
      </Button>

      <table className="table table-bordered mt-3">
        <thead className="thead-dark">
          <tr>
            <th>Logo</th>
            <th>Location</th>
            <th>Title</th>
            <th>Address</th>
            <th>Distance</th>
            <th>Featured</th>
            <th>Image</th>
            <th>Status</th>
            {/* <th>Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {locations.map((location) => (
            <tr key={location._id} onClick={() => handleRowClick(location)}>
              {" "}
              {/* Bắt sự kiện click */}
              <td>
                {location.logo ? (
                  <img
                    src={location.logo}
                    alt="Location"
                    style={{
                      width: "100px",
                      height: "60px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td>{location.city}</td>
              <td>{location.title}</td>
              <td>{location.address}</td>
              <td>{location.distance}</td>
              <td>{location.featured ? <p>True</p> : <p>False</p>}</td>
              <td>
                {location.images.length > 0
                  ? location.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Location ${index + 1}`}
                      style={{
                        width: "100px",
                        height: "60px",
                        objectFit: "cover",
                        margin: "5px",
                      }}
                    />
                  ))
                  : "No Image"}
              </td>
              <td>
                <Button
                  variant={
                    location.status === "active" ? "primary" : "secondary"
                  }
                  size="sm"
                  onClick={(event) => {
                    event.stopPropagation(); // Ngăn chặn sự kiện click lên tr
                    toggleActiveStatus(location._id, location.status); // Thay đổi trạng thái active/inactive
                  }}
                >
                  {location.status === "active" ? "Active" : "Inactive"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal hiển thị thông tin location */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Thông tin Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentLocation && (
            <div>
              <p>
                <strong>Title:</strong> {currentLocation.title}
              </p>
              <p>
                <strong>City:</strong> {currentLocation.city}
              </p>
              <p>
                <strong>Address:</strong> {currentLocation.address}
              </p>
              <p>
                <strong>Distance:</strong> {currentLocation.distance} km
              </p>
              <p>
                <strong>Description:</strong> {currentLocation.description}
              </p>
              <p>
                <strong>Featured:</strong>{" "}
                {currentLocation.featured ? "Yes" : "No"}
              </p>
              {currentLocation.logo && (
                <img
                  src={currentLocation.logo}
                  alt="Location logo"
                  style={{
                    width: "100%",
                    height: "auto",
                    marginBottom: "10px",
                  }}
                />
              )}
              <div>
                <strong>Images:</strong>
                {currentLocation.images.length > 0 ? (
                  currentLocation.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Location image ${index + 1}`}
                      style={{
                        width: "100px",
                        height: "60px",
                        objectFit: "cover",
                        margin: "5px",
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
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal xác nhận xóa */}
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
