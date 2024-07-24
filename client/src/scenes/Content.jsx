import React, { useContext, useState, useEffect } from 'react';
import { Box, Button, Typography, Grid, Slider, TextField, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { TreeContext } from '../context/TreeContext';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const BandControl = ({ band, onEdit, onDelete, onSliderChange }) => (
  <Box border={1} borderRadius={2} borderColor="green" p={2} m={1} bgcolor="gray">
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h6">{band.band}</Typography>
      <Box>
        <IconButton color="primary" onClick={() => onEdit(band)}>
          <EditIcon />
        </IconButton>
        <IconButton color="secondary" onClick={() => onDelete(band)}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
    <Box>
      <Typography>Frequency</Typography>
      <Slider
        value={band.frequency}
        onChange={(e, value) => onSliderChange(band._id, 'frequency', value)}
        max={band.frequency}
        aria-labelledby="frequency-slider"
      />
      <Typography>{band.frequency} MHz</Typography>
    </Box>
    <Box>
      <Typography>Bandwidth</Typography>
      <Slider
        value={band.bandwidth}
        onChange={(e, value) => onSliderChange(band._id, 'bandwidth', value)}
        max={band.bandwidth}
        aria-labelledby="bandwidth-slider"
      />
      <Typography>{band.bandwidth} MHz</Typography>
    </Box>
    <Box>
      <Typography>Power</Typography>
      <Slider
        value={band.power}
        onChange={(e, value) => onSliderChange(band._id, 'power', value)}
        max={band.power}
        aria-labelledby="power-slider"
      />
      <Typography>{band.power} dBm</Typography>
    </Box>
  </Box>
);

const Content = () => {
  const { selectedNode } = useContext(TreeContext);
  const [bands, setBands] = useState([]);
  const [addingBand, setAddingBand] = useState(false);
  const [editingBand, setEditingBand] = useState(null);
  const [deletingBand, setDeletingBand] = useState(null);
  const [editedBand, setEditedBand] = useState({
    band: '',
    frequency: 0,
    bandwidth: 0,
    power: 0
  });
  const [newBand, setNewBand] = useState({
    band: '',
    frequency: 0,
    bandwidth: 0,
    power: 0
  });

  useEffect(() => {
    if (selectedNode) {
      const fetchConfigs = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/configs/${selectedNode.id}`);
          setBands(response.data);
        } catch (error) {
          console.error("Error fetching configs from server:", error);
        }
      };

      fetchConfigs();
    }
  }, [selectedNode]);

  const handleAddBand = () => {
    setAddingBand(true);
  };

  const handleEditBand = (band) => {
    setEditingBand(band);
    setEditedBand(band);
  };

  const handleDeleteBand = (band) => {
    setDeletingBand(band);
  };

  const confirmAddBand = async () => {
    if (!selectedNode) return;
    const newBandWithDevice = {
      ...newBand,
      deviceId: selectedNode.id // Thêm deviceId vào đối tượng mới
    };
  
    console.log(newBandWithDevice); // Kiểm tra xem deviceId có đúng không
  
    try {
      const response = await axios.post('http://localhost:3000/api/configs', newBandWithDevice); // Gửi yêu cầu POST với deviceId
      setBands([...bands, response.data]);
      setAddingBand(false);
      setNewBand({ band: '', frequency: 0, bandwidth: 0, power: 0 });
    } catch (error) {
      console.error("Error adding band:", error);
    }
  };
  

  const confirmDeleteBand = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/configs/${deletingBand._id}`);
      setBands(bands.filter(band => band._id !== deletingBand._id));
      setDeletingBand(null);
    } catch (error) {
      console.error("Error deleting band:", error);
    }
  };

  const handleSaveBand = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/api/configs/${editingBand._id}`, editedBand);
      setBands(bands.map(band => band._id === editingBand._id ? response.data : band));
      setEditingBand(null);
    } catch (error) {
      console.error("Error saving band:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedBand(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleNewBandChange = (event) => {
    const { name, value } = event.target;
    setNewBand(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSliderChange = (bandId, name, value) => {
    setBands(prevBands =>
      prevBands.map(band =>
        band._id === bandId ? { ...band, [name]: value } : band
      )
    );
  };

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>SMART CONFIGURATION MAC-SW</Typography>
      {selectedNode && <Typography variant="h6" align="center" gutterBottom>Selected: {selectedNode.label}</Typography>}
      <Typography variant="h6" align="center" gutterBottom>Total Configs: {bands.length}</Typography>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <IconButton color="primary" onClick={handleAddBand}>
          <AddIcon />
        </IconButton>
      </Box>
      <Grid container spacing={2}>
        {bands.map((band) => (
          <Grid item xs={12} md={6} key={band._id}>
            <BandControl
              band={band}
              onEdit={handleEditBand}
              onDelete={handleDeleteBand}
              onSliderChange={handleSliderChange}
            />
          </Grid>
        ))}
      </Grid>
      <Dialog open={addingBand} onClose={() => setAddingBand(false)}>
        <DialogTitle>Add Band</DialogTitle>
        <DialogContent>
          <DialogContentText>Add the new band parameters.</DialogContentText>
          <TextField
            margin="dense"
            label="Band Label"
            type="text"
            fullWidth
            variant="outlined"
            name="band"
            value={newBand.band}
            onChange={handleNewBandChange}
          />
          <TextField
            margin="dense"
            label="Frequency"
            type="number"
            fullWidth
            variant="outlined"
            name="frequency"
            value={newBand.frequency}
            onChange={handleNewBandChange}
          />
          <TextField
            margin="dense"
            label="Bandwidth"
            type="number"
            fullWidth
            variant="outlined"
            name="bandwidth"
            value={newBand.bandwidth}
            onChange={handleNewBandChange}
          />
          <TextField
            margin="dense"
            label="Power"
            type="number"
            fullWidth
            variant="outlined"
            name="power"
            value={newBand.power}
            onChange={handleNewBandChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddingBand(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmAddBand} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!editingBand} onClose={() => setEditingBand(null)}>
        <DialogTitle>Edit Band</DialogTitle>
        <DialogContent>
          <DialogContentText>Edit the band parameters.</DialogContentText>
          <TextField
            margin="dense"
            label="Band Label"
            type="text"
            fullWidth
            variant="outlined"
            name="band"
            value={editedBand.band}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Frequency"
            type="number"
            fullWidth
            variant="outlined"
            name="frequency"
            value={editedBand.frequency}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Bandwidth"
            type="number"
            fullWidth
            variant="outlined"
            name="bandwidth"
            value={editedBand.bandwidth}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Power"
            type="number"
            fullWidth
            variant="outlined"
            name="power"
            value={editedBand.power}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingBand(null)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveBand} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!deletingBand} onClose={() => setDeletingBand(null)}>
        <DialogTitle>Delete Band</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this band?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingBand(null)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteBand} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Content;
