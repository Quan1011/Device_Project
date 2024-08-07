import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';

const BandList = ({ onEdit }) => {
  const [bands, setBands] = useState([]);
  const [open, setOpen] = useState(false); // State quản lý mở/đóng dialog
  const [selectedBandId, setSelectedBandId] = useState(null); // State lưu trữ band sẽ bị xóa

  useEffect(() => {
    fetchBands();
  }, []);

  const fetchBands = async () => {
    try {
      const response = await fetch('/api/bands/');
      const data = await response.json();
      setBands(data);
    } catch (error) {
      console.error('Error fetching bands:', error);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedBandId(id); // Lưu trữ band sẽ bị xóa
    setOpen(true); // Mở dialog xác nhận
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/band/${selectedBandId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete band');
      }

      setBands(bands.filter((band) => band._id !== selectedBandId));
    } catch (error) {
      console.error('Error deleting band:', error.message);
    } finally {
      setOpen(false); // Đóng dialog sau khi xóa
      setSelectedBandId(null); // Reset band đã chọn
    }
  };

  const handleDeleteCancel = () => {
    setOpen(false); // Đóng dialog khi người dùng hủy
    setSelectedBandId(null); // Reset band đã chọn
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h5" component="h2" gutterBottom>
        Band List
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Band</TableCell>
              <TableCell>Min Frequency</TableCell>
              <TableCell>Max Frequency</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bands.map((band) => (
              <TableRow key={band._id}>
                <TableCell>{band.band}</TableCell>
                <TableCell>{band.minFrequency}</TableCell>
                <TableCell>{band.maxFrequency}</TableCell>
                <TableCell>{band.ID}</TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    onClick={() => onEdit(band)}
                  >
                    Edit
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => handleDeleteClick(band._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={open}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa band này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BandList;
