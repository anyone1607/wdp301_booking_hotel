import React, { useContext, useState } from 'react';
import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap';
import '../../styles/login.css';
import { Link, useNavigate } from 'react-router-dom';
import loginImg from '../../assets/images/login.png';
import userIcon from '../../assets/images/user.png';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config';
import Swal from 'sweetalert2';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });

    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = e => {
        setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async e => {
        e.preventDefault();
        dispatch({ type: 'LOGIN_START' });

        try {
            const res = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(credentials),
            });

            const result = await res.json();
            if (!res.ok) {
                throw new Error(result.message);
            }

            // Đăng nhập thành công, lưu thông tin user vào context
            dispatch({ type: 'LOGIN_SUCCESS', payload: result.data });

            // Hiển thị thông báo đăng nhập thành công
            Swal.fire({
                icon: 'success',
                title: 'Đăng nhập thành công',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6',
                timer: 1500,
            });

            // Điều hướng dựa trên vai trò của người dùng
            if (result.data.role === 'admin') {
                navigate('/dashboard'); // Điều hướng admin và manager đến trang dashboard
            } else if (result.data.role === 'manager') {
                navigate('/booking-management');
            }
            else {
                navigate('/'); // Điều hướng user bình thường đến trang home
            }
        } catch (err) {
            // Đăng nhập thất bại, xử lý lỗi
            dispatch({ type: 'LOGIN_FAILURE', payload: err.message });
            Swal.fire({
                icon: 'error',
                title: 'Đăng nhập thất bại',
                text: err.message,
            });
        }
    };

    return (
        <section>
            <Container>
                <Row>
                    <Col lg='8' className='m-auto'>
                        <div className="login__container d-flex justify-content-between">
                            <div className="login__img">
                                <img src={loginImg} alt="" />
                            </div>

                            <div className="login__form">
                                <div className="user">
                                    <img src={userIcon} alt="" />
                                </div>
                                <h2>Login</h2>

                                <Form onSubmit={handleClick}>
                                    <FormGroup>
                                        <input type="email" placeholder='Email' id='email' onChange={handleChange} required />
                                    </FormGroup>
                                    <FormGroup>
                                        <input type="password" placeholder='Password' id='password' onChange={handleChange} required />
                                    </FormGroup>
                                    <Button className='btn secondary__btn auth__btn' type='submit'>Login</Button>
                                </Form>
                                <p>Forgot password? <Link to='/reset-password'> Reset password</Link></p>
                                <p>Don't have an account? <Link to='/register'>Create</Link></p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Login;
