import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../../utils/config";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Image,
  Alert,
  Card,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS for Toastify
import "../../styles/profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    file: "",
    fullname: "",
    address: "",
    phone: "",
  });
  const [tempFormData, setTempFormData] = useState({ ...formData });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !user._id) return;
      try {
        const res = await axios.get(`${BASE_URL}/users/${user._id}`, {
          withCredentials: true,
        });
        const profileData = res.data.data;
        setProfile(profileData);
        setFormData({
          username: profileData.username,
          email: profileData.email,
          file: profileData.avatar,
          fullname: profileData.fullname,
          address: profileData.address,
          phone: profileData.phone,
        });
        setTempFormData({
          username: profileData.username,
          email: profileData.email,
          file: profileData.avatar,
          fullname: profileData.fullname,
          address: profileData.address,
          phone: profileData.phone,
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch profile data"); // Thông báo lỗi
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempFormData({ ...tempFormData, [name]: value });

    // Xử lý ảnh tải lên
    if (name === "file") {
      const file = e.target.files[0];
      if (file) {
        setTempFormData((prevData) => ({ ...prevData, file }));

        // Xem trước ảnh
        const reader = new FileReader();
        reader.onloadend = () => {
          setTempFormData((prevData) => ({
            ...prevData,
            avatarPreview: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", tempFormData.username);
      formDataToSend.append("email", tempFormData.email);
      formDataToSend.append("fullname", tempFormData.fullname);
      formDataToSend.append("address", tempFormData.address);
      formDataToSend.append("phone", tempFormData.phone);
      if (tempFormData.file) {
        formDataToSend.append("file", tempFormData.file);
      }

      const res = await axios.put(
        `${BASE_URL}/users/${user._id}`,
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Cập nhật profile sau khi lưu thành công
      setProfile(res.data.data);
      setFormData(tempFormData);
      setIsEditing(false);
      toast.success("Profile updated successfully"); // Thông báo thành công
    } catch (err) {
      console.error(
        "Error updating profile:",
        err.response ? err.response.data : err
      );
      toast.error(
        "Error updating profile: " +
          (err.response?.data?.message || "An error occurred")
      ); // Thông báo lỗi
    }
  };

  const handleCancel = () => {
    setTempFormData({ ...formData });
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New password and confirm password do not match");
      toast.error("New password and confirm password do not match"); // Thông báo lỗi
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/auth/${user._id}/change-password`,
        passwordData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setPasswordSuccess("Password changed successfully");
      toast.success("Password changed successfully"); // Thông báo thành công
      setIsChangingPassword(false);
      setPasswordError("");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordError(
        "Error changing password: " +
          (err.response?.data?.message || err.message)
      );
      toast.error(
        "Error changing password: " +
          (err.response?.data?.message || err.message)
      ); // Thông báo lỗi
    }
  };

  return (
    <Container className="profile-container">
      <Row>
        <Col md={4}>
          <Card className="profile-card">
            <Card.Body>
              <div className="text-center">
                {tempFormData.avatarPreview ? (
                  <Image
                    id="profile-avatar"
                    src={tempFormData.avatarPreview}
                    alt="Profile Avatar"
                    roundedCircle
                  />
                ) : (
                  profile.avatar && (
                    <Image
                      id="profile-avatar"
                      src={profile.avatar}
                      alt="Profile Avatar"
                      roundedCircle
                    />
                  )
                )}
                <h5 className="mt-3">{profile.username}</h5>
              </div>
              <div className="profile-actions">
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setIsEditing(true);
                  }}
                  className="w-100 mb-2"
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    setIsChangingPassword(true);
                    setIsEditing(false);
                  }}
                  className="w-100 mb-2"
                >
                  Change Password
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => navigate("/my-booking")}
                  className="w-100 mb-2"
                >
                  View My Bookings
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={logout}
                  className="w-100"
                >
                  Log Out
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="profile-info-card">
            <Card.Body>
              {isEditing ? (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={tempFormData.username}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullname"
                      value={tempFormData.fullname}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Avatar</Form.Label>
                    <Form.Control
                      accept="image/*"
                      type="file"
                      name="file"
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={tempFormData.email}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={tempFormData.address}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={tempFormData.phone}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-between">
                    <Button variant="primary" onClick={handleSave}>
                      Save
                    </Button>
                    <Button variant="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              ) : isChangingPassword ? (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </Form.Group>
                  {passwordError && (
                    <Alert variant="danger">{passwordError}</Alert>
                  )}
                  {passwordSuccess && (
                    <Alert variant="success">{passwordSuccess}</Alert>
                  )}
                  <Button variant="primary" onClick={handleChangePassword}>
                    Change Password
                  </Button>
                </Form>
              ) : (
                <div>
                  <h3>Profile Information</h3>
                  <p>
                    <strong>Full Name:</strong> {profile.fullname}
                  </p>
                  <p>
                    <strong>Email:</strong> {profile.email}
                  </p>
                  <p>
                    <strong>Address:</strong> {profile.address}
                  </p>
                  <p>
                    <strong>Phone:</strong> {profile.phone}
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ToastContainer /> {/* Thêm ToastContainer ở đây */}
    </Container>
  );
};

export default Profile;
