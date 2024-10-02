import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../../utils/config';
import { Container, Row, Col, Form, Button, Image, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../styles/profile.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const { user, dispatch } = useContext(AuthContext);
    const [profile, setProfile] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        avatar: null,
        fullname: '',
        address: '',
        phone: ''
    });
    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/');
     };
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user || !user._id) return;
            try {
                const res = await axios.get(`${BASE_URL}/users/${user._id}`, { withCredentials: true });
                const profileData = res.data.data;
                setProfile(profileData);
                setFormData({
                    username: profileData.username,
                    email: profileData.email,
                    avatar: profileData.avatar,
                    fullname: profileData.fullname,
                    address: profileData.address,
                    phone: profileData.phone,
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, [user]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'avatar' && files.length > 0) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleSave = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('username', formData.username);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('fullname', formData.fullname);
            formDataToSend.append('address', formData.address);
            formDataToSend.append('phone', formData.phone);
            if (formData.avatar && typeof formData.avatar !== 'string') {
                formDataToSend.append('avatar', formData.avatar);
            }

            const res = await axios.put(`${BASE_URL}/users/${user._id}`, formDataToSend, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setProfile(res.data.data);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New password and confirm password do not match');
            return;
        }

        try {
            await axios.put(`${BASE_URL}/auth/${user._id}/change-password`, passwordData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setPasswordSuccess('Password changed successfully');
            setIsChangingPassword(false);
            setPasswordError('');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            setPasswordError('Error changing password: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <Container>
            <br/>
            <br/>
            <Row>
            <Col md={4}>
                        {profile.avatar && (
                            <Image id='profile-avatar'
                                src={profile.avatar}s
                                alt="Profile Avatar"
                            /> 
                        )}
                        <div id='profile-name'>{profile.username}</div>
                        <br/>
                        <div id = 'profile-btn' onClick={() => { setIsChangingPassword(false); setIsEditing(true) }}>Edit profile</div>
                        <hr/>
                        <div id = 'profile-btn' onClick={() => { setIsChangingPassword(true); setIsEditing(false) }}>Change password</div>
                        <hr/>
                        <div id = 'profile-btn' onClick={() => navigate("/my-booking")}>View my bookings</div> 
                        <hr/>
                        <div id = 'profile-btn' onClick={() => logout()}>Log out</div>
                        <br/> 
                    </Col>
                    <Col md={8}>
                    {isEditing ? (
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Avatar</Form.Label>
                        <Form.Control
                            type="file"
                            name="avatar"
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    
                    
                    <Button id='save' onClick={handleSave}>
                        Save
                    </Button>
                    <Button id='cancel' onClick={() => setIsEditing(false)}>
                        Cancel
                    </Button>
                </Form>
            ) : (
                <Row className="profile-details">
                    <Col md={8}>
                        <p><strong>Email:</strong> {profile.email}</p>
                        <hr/>
                        <p><strong>Full Name:</strong> {profile.fullname}</p>
                        <hr/>
                        <p><strong>Address:</strong> {profile.address}</p>
                        <hr/>
                        <p><strong>Phone:</strong> {profile.phone}</p>
                    </Col>
                </Row>
            )}

            {isChangingPassword && (
                <Form className="password-form">
                    <h4 style={{textAlign: 'center'}}>Change Password</h4>
                    
                    {passwordError && <Alert variant="danger">{passwordError}</Alert>}
                    {passwordSuccess && <Alert variant="success">{passwordSuccess}</Alert>}
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
                    <Button className="me-2" variant="primary" onClick={handleChangePassword}>
                        Change Password
                    </Button>
                    <Button variant="secondary" onClick={() => setIsChangingPassword(false)}>
                        Cancel
                    </Button>
                        
                </Form>
            )}
                    </Col>
            </Row>
            
        </Container>
    );
}

export default Profile;
