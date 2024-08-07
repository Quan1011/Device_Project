import React, { useState } from "react";
import BandForm from "../components/BandForm.jsx";
import BandList from "../components/BandList";
import {
  TextField,
  Button,
  Container,
  Typography,
  Alert,
  Box,
} from "@mui/material";

const BandManager = () => {
  const [bandToEdit, setBandToEdit] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState(null);

  const handleEdit = (band) => {
    setBandToEdit(band);
  };

  const handleSave = () => {
    setBandToEdit(null);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:3000/api/auth/verify-password2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password2 }),
        }
      );
      const data = await res.json();

      if (!data.success) {
        setError(data.message);
      } else {
        setIsAuthenticated(true);
        setError(null);
      }
    } catch (error) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  if (!isAuthenticated) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            maxWidth: "400px",
            backgroundColor: "#182a5a",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            fontSize="2rem"
            fontWeight="bold"
            variant="h4"
            align="center"
            gutterBottom
            color="white"
          >
            Nhập mật khẩu đặc biệt
          </Typography>
          <form onSubmit={handlePasswordSubmit} style={{ width: "100%" }}>
            <TextField
              label="Mật khẩu đặc biệt"
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{
                mb: 3,
                input: { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "white",
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{
                height: "40px",
                backgroundColor: "#5063c9",
                "&:hover": {
                  backgroundColor: "#3b4b9b",
                },
              }}
            >
              Xác nhận
            </Button>
          </form>
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
              {error}
            </Alert>
          )}
        </Box>
      </Container>
    );
  }

  return (
    <div>
      <BandForm bandToEdit={bandToEdit} onSave={handleSave} />
      <BandList onEdit={handleEdit} />
    </div>
  );
};

export default BandManager;
