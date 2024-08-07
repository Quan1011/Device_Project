import React from "react";
import {
  Box,
  Typography,
  Slider,
  IconButton,
  Button,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const BandControl = ({ config, onEdit, onDelete, onSliderChange, onApply }) => {
  const theme = useTheme();
  const bandName = config.band ? config.band : "Unnamed Band";

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
        {/* <Typography variant="h6">{bandName}</Typography> */}
        <Box>
          <IconButton color="primary" onClick={() => onEdit(config)}>
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => onDelete(config)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      <Box>
        <Typography>Frequency</Typography>
        <Box display="flex" justifyContent="space-between">
          <Typography>{`${config.minFrequency} MHz`}</Typography>
          <Slider
            value={config.currentFrequency}
            onChange={(e, value) =>
              onSliderChange(config._id, "currentFrequency", value)
            }
            min={config.minFrequency}
            max={config.maxFrequency}
            step={1}
            aria-labelledby="frequency-slider"
            sx={{ color: theme.palette.primary.main, marginRight: "20px" }}
          />
          <Typography>{`${config.maxFrequency} MHz`}</Typography>
        </Box>
      </Box>
      <Box>
        <Typography>Bandwidth</Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Slider
            value={config.currentBandwidth}
            onChange={(e, value) =>
              onSliderChange(config._id, "currentBandwidth", value)
            }
            min={0}
            max={30}
            aria-labelledby="bandwidth-slider"
            sx={{ color: theme.palette.primary.main, marginRight: "20px" }}
          />
          <Typography>{config.currentBandwidth}</Typography>
        </Box>
      </Box>
      <Box>
        <Typography>Power</Typography>
        <Box display="flex" justifyContent="space-between">
          <Slider
            value={config.currentPower}
            onChange={(e, value) =>
              onSliderChange(config._id, "currentPower", value)
            }
            min={0}
            max={5}
            step={1}
            marks
            aria-labelledby="power-slider"
            sx={{ color: theme.palette.primary.main, marginRight: "20px" }}
          />
          <Typography>{config.currentPower}</Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center">
        <Button
          onClick={() => onApply(config)} // Gọi hàm onApply với config hiện tại
          sx={{ backgroundColor: theme.palette.primary.main, color: "white" }}
        >
          Apply
        </Button>
      </Box>
    </Box>
  );
};

export default BandControl;
