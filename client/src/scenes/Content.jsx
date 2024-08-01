import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Slider,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  useTheme,
} from "@mui/material";
import { TreeContext } from "../context/TreeContext";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import debounce from "lodash/debounce";

const BandControl = ({ band, onEdit, onDelete, onSliderChange }) => {
  const theme = useTheme();

  return (
    <Box
      border={1}
      borderRadius={2}
      borderColor={theme.palette.primary.main}
      p={2}
      m={1}
      bgcolor={theme.palette.background.paper}
    >
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
        <Box display="flex" justifyContent="space-between">
          <Slider
            value={band.currentFrequency || band.frequency}
            onChange={(e, value) =>
              onSliderChange(band._id, "currentFrequency", value)
            }
            max={band.frequency}
            aria-labelledby="frequency-slider"
            sx={{ color: theme.palette.primary.main }}
          />
          <Typography>{band.currentFrequency || band.frequency} MHz</Typography>
        </Box>
      </Box>
      <Box>
        <Typography>Bandwidth</Typography>
        <Box display="flex" justifyContent="space-between">
          <Slider
            value={band.currentBandwidth || band.bandwidth}
            onChange={(e, value) =>
              onSliderChange(band._id, "currentBandwidth", value)
            }
            max={band.bandwidth}
            aria-labelledby="bandwidth-slider"
            sx={{ color: theme.palette.primary.main }}
          />
          <Typography>{band.currentBandwidth || band.bandwidth} MHz</Typography>
        </Box>
      </Box>
      <Box>
        <Typography>Power</Typography>
        <Box display="flex" justifyContent="space-between">
          <Slider
            value={band.currentPower || band.power}
            onChange={(e, value) =>
              onSliderChange(band._id, "currentPower", value)
            }
            max={band.power}
            aria-labelledby="power-slider"
            sx={{ color: theme.palette.primary.main }}
          />
          <Typography>{band.currentPower || band.power}</Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center">
        <Button
          sx={{ backgroundColor: theme.palette.primary.main, color: "white" }}
        >
          Apply
        </Button>
      </Box>
    </Box>
  );
};

const Content = () => {
  const theme = useTheme();
  const { selectedNode } = useContext(TreeContext);
  const [bands, setBands] = useState([]);
  const [dialogState, setDialogState] = useState({
    addingBand: false,
    editingBand: null,
    deletingBand: null,
  });
  const [editedBand, setEditedBand] = useState({
    band: "",
    frequency: 0,
    bandwidth: 0,
    power: 0,
    currentFrequency: 0,
    currentBandwidth: 0,
    currentPower: 0,
  });
  const [newBand, setNewBand] = useState({
    band: "",
    frequency: 0,
    currentFrequency: 0,
    bandwidth: 0,
    currentBandwidth: 0,
    power: 0,
    currentPower: 0,
  });

  useEffect(() => {
    if (selectedNode) {
      const fetchConfigs = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/configs/${selectedNode.id}`
          );
          setBands(response.data);
        } catch (error) {
          console.error("Error fetching configs from server:", error);
        }
      };

      fetchConfigs();
    }
  }, [selectedNode]);

  const handleAddBand = () => {
    if (selectedNode && !selectedNode.isFolder) {
      setDialogState({ ...dialogState, addingBand: true });
    }
  };

  const handleEditBand = (band) => {
    setDialogState({ ...dialogState, editingBand: band });
    setEditedBand({
      ...band,
      currentFrequency: band.currentFrequency || 0,
      currentBandwidth: band.currentBandwidth || 0,
      currentPower: band.currentPower || 0,
    });
  };

  const handleDeleteBand = (band) => {
    setDialogState({ ...dialogState, deletingBand: band });
  };

  const confirmAddBand = async () => {
    if (!selectedNode) return;
    const newBandWithDevice = {
      ...newBand,
      deviceId: selectedNode.id,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/configs",
        newBandWithDevice
      );
      setBands([...bands, response.data]);
      setDialogState({ ...dialogState, addingBand: false });
      setNewBand({ band: "", frequency: 0, bandwidth: 0, power: 0 });
    } catch (error) {
      console.error("Error adding band:", error);
    }
  };

  const confirmDeleteBand = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/api/configs/${dialogState.deletingBand._id}`
      );
      setBands(
        bands.filter((band) => band._id !== dialogState.deletingBand._id)
      );
      setDialogState({ ...dialogState, deletingBand: null });
    } catch (error) {
      console.error("Error deleting band:", error);
    }
  };

  const handleSaveBand = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/configs/${dialogState.editingBand._id}`,
        editedBand
      );
      setBands(
        bands.map((band) =>
          band._id === dialogState.editingBand._id ? response.data : band
        )
      );
      setDialogState({ ...dialogState, editingBand: null });
    } catch (error) {
      console.error("Error saving band:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedBand((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleNewBandChange = (event) => {
    const { name, value } = event.target;
    setNewBand((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const debouncedUpdateBand = useCallback(
    debounce(async (bandId, name, value) => {
      try {
        await axios.put(`http://localhost:3000/api/configs/${bandId}`, {
          [name]: value,
        });
      } catch (error) {
        console.error("Error updating band:", error);
      }
    }, 500),
    []
  );

  const handleSliderChange = (bandId, name, value) => {
    setBands((prevBands) =>
      prevBands.map((band) =>
        band._id === bandId ? { ...band, [name]: value } : band
      )
    );
    debouncedUpdateBand(bandId, name, value);
  };

  return (
    <Box width="100%">
      <Box
        height="calc(100vh - 64px)"
        sx={{
          backgroundColor: theme.palette.background.content,
          padding: 2,
          color: theme.palette.text.primary,
          overflowY: "auto",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          SMART CONFIGURATION MAC-SW
        </Typography>
        {selectedNode && (
          <Typography variant="h6" align="center" gutterBottom>
            Selected: {selectedNode.label}
          </Typography>
        )}
        <Typography variant="h6" align="center" gutterBottom>
          Total Configs: {bands.length}
        </Typography>
        {selectedNode && selectedNode.isFolder && (
          <Alert severity="warning" sx={{ marginBottom: 2 }}>
            Cannot add configuration to a folder
          </Alert>
        )}
        <Box display="flex" justifyContent="space-between" mb={2}>
          {!selectedNode?.isFolder && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Box>
                <Button
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                  }}
                >
                  <Typography>Apply all</Typography>
                </Button>
              </Box>
              <Box>
                <Button
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                  }}
                  onClick={handleAddBand}
                >
                  <AddIcon />
                  <Typography>Add Config</Typography>
                </Button>
              </Box>
            </Box>
          )}
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
        <Dialog
          open={dialogState.addingBand}
          onClose={() => setDialogState({ ...dialogState, addingBand: false })}
        >
          <DialogTitle>Add Config</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Add the new config parameters.
            </DialogContentText>
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
            <Box display="flex" gap={2} mb={2}>
              <TextField
                margin="dense"
                label="Current Frequency"
                type="number"
                fullWidth
                variant="outlined"
                name="currentFrequency"
                value={newBand.currentFrequency}
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
            </Box>
            <Box display="flex" gap={2} mb={2}>
              <TextField
                margin="dense"
                label="Current Bandwidth"
                type="number"
                fullWidth
                variant="outlined"
                name="currentBandwidth"
                value={newBand.currentBandwidth}
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
            </Box>
            <Box display="flex" gap={2} mb={2}>
              <TextField
                margin="dense"
                label="Current Power"
                type="number"
                fullWidth
                variant="outlined"
                name="currentPower"
                value={newBand.currentPower}
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
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() =>
                setDialogState({ ...dialogState, addingBand: false })
              }
              color="primary"
            >
              Cancel
            </Button>
            <Button onClick={confirmAddBand} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={!!dialogState.editingBand}
          onClose={() => setDialogState({ ...dialogState, editingBand: null })}
        >
          <DialogTitle>Edit Config</DialogTitle>
          <DialogContent>
            <DialogContentText>Edit the config parameters.</DialogContentText>
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
            <Box display="flex" gap={2} mb={2}>
              <TextField
                margin="dense"
                label="Current Frequency"
                type="number"
                fullWidth
                variant="outlined"
                name="currentFrequency"
                value={editedBand.currentFrequency}
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
            </Box>
            <Box display="flex" gap={2} mb={2}>
              <TextField
                margin="dense"
                label="Current Bandwidth"
                type="number"
                fullWidth
                variant="outlined"
                name="currentBandwidth"
                value={editedBand.currentBandwidth}
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
            </Box>
            <Box display="flex" gap={2} mb={2}>
              <TextField
                margin="dense"
                label="Current Power"
                type="number"
                fullWidth
                variant="outlined"
                name="currentPower"
                value={editedBand.currentPower}
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
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() =>
                setDialogState({ ...dialogState, editingBand: null })
              }
              color="primary"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveBand} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={!!dialogState.deletingBand}
          onClose={() => setDialogState({ ...dialogState, deletingBand: null })}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this config?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() =>
                setDialogState({ ...dialogState, deletingBand: null })
              }
              color="primary"
            >
              Cancel
            </Button>
            <Button onClick={confirmDeleteBand} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Content;
