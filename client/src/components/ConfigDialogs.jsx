import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

const ConfigDialogs = ({
  dialogState,
  allBands,
  configData,
  handleSelectChange,
  handleInputChange,
  onClose,
  onSubmit,
  title,
  actionButtonLabel,
}) => (
  <Dialog open={!!dialogState} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{`${actionButtonLabel} the config parameters.`}</DialogContentText>
      <Select
        fullWidth
        variant="outlined"
        value={configData.bandId || ""}
        onChange={handleSelectChange}
        displayEmpty
      >
        <MenuItem value="" disabled>
          Select Band
        </MenuItem>
        {allBands.map((band) => (
          <MenuItem key={band._id} value={band._id}>
            {band.band}
          </MenuItem>
        ))}
      </Select>
      <Box display="flex" gap={2} mb={2} mt={2}>
        <TextField
          margin="dense"
          label="Min Frequency"
          type="number"
          fullWidth
          variant="outlined"
          name="minFrequency"
          value={configData.minFrequency}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          margin="dense"
          label="Max Frequency"
          type="number"
          fullWidth
          variant="outlined"
          name="maxFrequency"
          value={configData.maxFrequency}
          InputProps={{
            readOnly: true,
          }}
        />
      </Box>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          margin="dense"
          label="Current Frequency"
          type="number"
          fullWidth
          variant="outlined"
          name="currentFrequency"
          value={configData.currentFrequency}
          onChange={handleInputChange}
          inputProps={{
            min: configData.minFrequency,
            max: configData.maxFrequency,
          }}
        />
        <TextField
          margin="dense"
          label="Current Bandwidth"
          type="number"
          fullWidth
          variant="outlined"
          name="currentBandwidth"
          value={configData.currentBandwidth}
          onChange={handleInputChange}
          inputProps={{
            min: 0,
            max: 30,
          }}
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
          value={configData.currentPower}
          onChange={handleInputChange}
          inputProps={{
            min: 0,
            max: 5,
          }}
        />
      </Box>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button onClick={onSubmit} color="primary">
        {actionButtonLabel}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfigDialogs;
