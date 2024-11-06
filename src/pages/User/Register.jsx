import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap';
import '../../styles/login.css';
import { Link, useNavigate } from 'react-router-dom';
import registerImg from '../../assets/images/login.png';
import userIcon from '../../assets/images/user.png';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config';
import Swal from 'sweetalert2';

const Register = () => {
   const [credentials, setCredentials] = useState({
      username: '',
      fullname: '',
      address: '',
      phone: '',
      email: '',
      password: '',
      avatar: null,
   });

   const [errors, setErrors] = useState({});
   const { dispatch } = useContext(AuthContext);
   const navigate = useNavigate();

   const handleChange = (e) => {
      const { id, value, files } = e.target;
      if (id === 'avatar') {
         setCredentials((prev) => ({ ...prev, avatar: files[0] }));
      } else {
         setCredentials((prev) => ({ ...prev, [id]: value }));
      }
   };

   const validateInput = () => {
      const newErrors = {};
      const { username, fullname, address, phone, email, password } = credentials;

      if (!username) newErrors.username = 'Username is required';

      if (!fullname) {
         newErrors.fullname = 'Full name is required';
      } else if (!/^[\p{L}\s]+$/u.test(fullname)) {
         newErrors.fullname = 'Full name must contain only letters and spaces';
      }

      if (!address) newErrors.address = 'Address is required';

      const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
      if (!phone) {
         newErrors.phone = 'Phone number is required';
      } else if (!phoneRegex.test(phone)) {
         newErrors.phone = 'Invalid phone number format';
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
         newErrors.email = 'Email is required';
      } else if (!emailRegex.test(email)) {
         newErrors.email = 'Invalid email format';
      }

      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
      if (!password) {
         newErrors.password = 'Password is required';
      } else if (!passwordRegex.test(password)) {
         newErrors.password = 'Password must be at least 8 characters, include uppercase, number, and special character';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };


   const handleClick = async (e) => {
      e.preventDefault();

      if (!validateInput()) return;

      Swal.fire({
         icon: 'success',
         title: 'Registration successful!',
         showConfirmButton: true,
         confirmButtonText: 'OK',
         confirmButtonColor: '#3085d6',
         timer: 1500,
      });

      const formData = new FormData();
      for (const key in credentials) {
         formData.append(key, credentials[key]);
      }

      try {
         const res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            body: formData,
         });

         const result = await res.json();

         if (!res.ok) {
            Swal.fire({
               icon: 'error',
               title: result.message || 'Registration failed',
            });
         } else {
            dispatch({ type: 'REGISTER_SUCCESS' });
            navigate('/login');
         }
      } catch (err) {
         Swal.fire({
            icon: 'error',
            title: err.message || 'An error occurred',
         });
      }
   };

   return (
      <section>
         <Container>
            <Row>
               <Col lg="8" className="m-auto">
                  <div className="login__container d-flex justify-content-between">
                     <div className="login__img">
                        <img src={registerImg} alt="" />
                     </div>

                     <div className="login__form">
                        <div className="user">
                           <img src={userIcon} alt="" />
                        </div>
                        <h2>Register</h2>

                        <Form onSubmit={handleClick}>
                           <FormGroup>
                              <input
                                 type="text"
                                 placeholder="Username"
                                 id="username"
                                 onChange={handleChange}
                                 required
                              />
                              {errors.username && <p className="text-danger">{errors.username}</p>}
                           </FormGroup>
                           <FormGroup>
                              <input
                                 type="text"
                                 placeholder="Full Name"
                                 id="fullname"
                                 onChange={handleChange}
                              />
                              {errors.fullname && <p className="text-danger">{errors.fullname}</p>}
                           </FormGroup>
                           <FormGroup>
                              <input
                                 type="text"
                                 placeholder="Address"
                                 id="address"
                                 onChange={handleChange}
                              />
                              {errors.address && <p className="text-danger">{errors.address}</p>}
                           </FormGroup>
                           <FormGroup>
                              <input
                                 type="text"
                                 placeholder="Phone"
                                 id="phone"
                                 onChange={handleChange}
                              />
                              {errors.phone && <p className="text-danger">{errors.phone}</p>}
                           </FormGroup>
                           <FormGroup>
                              <input
                                 type="email"
                                 placeholder="Email"
                                 id="email"
                                 onChange={handleChange}
                                 required
                              />
                              {errors.email && <p className="text-danger">{errors.email}</p>}
                           </FormGroup>
                           <FormGroup>
                              <input
                                 type="password"
                                 placeholder="Password"
                                 id="password"
                                 onChange={handleChange}
                                 required
                              />
                              {errors.password && <p className="text-danger">{errors.password}</p>}
                           </FormGroup>

                           <Button className="btn secondary__btn auth__btn" type="submit">
                              Create Account
                           </Button>
                        </Form>
                        <p>
                           Already have an account? <Link to="/login">Login</Link>
                        </p>
                     </div>
                  </div>
               </Col>
            </Row>
         </Container>
      </section>
   );
};

export default Register;
