import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';

const BandForm = ({ bandToEdit, onSave }) => {
  const [band, setBand] = useState('');
  const [minFrequency, setMinFrequency] = useState('');
  const [maxFrequency, setMaxFrequency] = useState('');
  const [ID, setID] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (bandToEdit) {
      setBand(bandToEdit.band);
      setMinFrequency(bandToEdit.minFrequency);
      setMaxFrequency(bandToEdit.maxFrequency);
      setID(bandToEdit.ID);
      setEditMode(true);
    }
  }, [bandToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newBand = {
      band,
      minFrequency,
      maxFrequency,
      ID,
    };
  
    try {
      let response;
  
      if (editMode) {
        response = await fetch(`/api/band/${bandToEdit._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newBand),
        });
      } else {
        response = await fetch('/api/band', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newBand),
        });
      }
  
      if (!response.ok) {
        throw new Error('Failed to save band');
      }
  
      const result = await response.json();
      console.log('Band saved:', result);
  
      setBand('');
      setMinFrequency('');
      setMaxFrequency('');
      setID('');
      setEditMode(false);
  
      onSave();
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom mt={5}>
        {editMode ? 'Edit Band' : 'Add New Band'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Band"
          variant="outlined"
          fullWidth
          margin="normal"
          value={band}
          onChange={(e) => setBand(e.target.value)}
          required
        />
        <TextField
          label="Min Frequency"
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          value={minFrequency}
          onChange={(e) => setMinFrequency(e.target.value)}
          required
        />
        <TextField
          label="Max Frequency"
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          value={maxFrequency}
          onChange={(e) => setMaxFrequency(e.target.value)}
          required
        />
        <TextField
          label="ID"
          variant="outlined"
          fullWidth
          margin="normal"
          value={ID}
          onChange={(e) => setID(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {editMode ? 'Update Band' : 'Add Band'}
        </Button>
      </form>
    </Container>
  );
};

export default BandForm;
