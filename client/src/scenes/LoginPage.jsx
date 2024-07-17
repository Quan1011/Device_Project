import React, { useState } from "react";
import { TextField, Button, Typography, Container } from "@mui/material";
import { useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  logInStart,
  logInSuccess,
  logInFailure,
} from '../redux/userSlice';

export default function LogIn()  {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const currentUser = useSelector(state => state.user.currentUser);
  if (currentUser) {
    return <Navigate to="/notification" replace />; // Chuyển hướng về trang chủ nếu đã đăng nhập
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    const input = e.target.value;
    if (/^\d*$/.test(input)) {
      setPassword(input);
    }
  };

  const handleLogIn = async (e) => {
    e.preventDefault();
    try {
      dispatch(logInStart());
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(logInFailure(data.message));
        return;
      }
      dispatch(logInSuccess(data));
      navigate('/notification');
    } catch (error) {
      dispatch(logInFailure(error.message));
    }
  };

  return (
    <form onSubmit={handleLogIn}>
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          // backgroundImage: 'url("./assets/1.jpeg")'
        }}
      >
        <Typography
            fontSize="2rem"
            fontWeight="bold"
            variant="h4"
            align="center"
            gutterBottom
            >
            Đăng nhập
        </Typography>

        {/* <TextField
          label="Email"
          type="email"
          id='email'
          placeholder='Email'
          onChange={handleChange}
          fullWidth
          variant="outlined"  
          sx={{
            width: '350px',
            mt: 5,
            mb: 2,
          }}
        /> */}
            
        <TextField
          label="Mật khẩu"
          type="password"
          id='password'
          placeholder='Mật khẩu'
          onChange={handleChange}
          value={password}
          fullWidth
          variant="outlined"
          InputProps={{
            inputProps: {
              maxLength: 6,
            },
          }}
          sx={{
            width: '350px',
            mt: 5,
            mb: 2,
          }}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
          // disabled={password.length !== 6}
          fullWidth
          sx={{
            width: '350px',
            height: '40px',
            backgroundColor: '#5063c9',
          }}
        >
          {loading ? 'Loading...' : 'Đăng nhập'}
        </Button>
        {error && <p>{error}</p>}
      </Container>
    </form>
  );
}


