import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import debounce from "lodash/debounce";
import { TreeContext } from "../context/TreeContext";
import ConfigDialogs from "../components/ConfigDialogs";
import ConfigList from "../components/ConfigList";
import ChildLabels from "../components/ChildLabels";

const Content = () => {
  const theme = useTheme();
  const { selectedNode } = useContext(TreeContext);
  const [configs, setConfigs] = useState([]);
  const [allBands, setAllBands] = useState([]);
  const [childLabels, setChildLabels] = useState([]);
  const [dialogState, setDialogState] = useState({
    addingConfig: false,
    editingConfig: null,
    deletingConfig: null,
  });
  const [editedConfig, setEditedConfig] = useState({
    band: "",
    bandId: "",
    minFrequency: 0,
    maxFrequency: 0,
    currentFrequency: 0,
    currentBandwidth: 0,
    currentPower: 0,
  });
  const [newConfig, setNewConfig] = useState({
    band: "",
    bandId: "",
    minFrequency: 0,
    maxFrequency: 0,
    currentFrequency: 0,
    currentBandwidth: 0,
    currentPower: 0,
  });

  const [deviceIP, setDeviceIP] = useState(""); // Trạng thái cho địa chỉ IP của thiết bị

  useEffect(() => {
    const fetchAllBands = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/bands");
        setAllBands(response.data);
      } catch (error) {
        console.error("Error fetching all bands:", error);
      }
    };

    fetchAllBands();

    if (selectedNode) {
      const fetchConfigs = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/configs/${selectedNode.id}`
          );
          setConfigs(response.data);
        } catch (error) {
          console.error("Error fetching configs from server:", error);
        }
      };

      const fetchDeviceIP = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/devices/${selectedNode.id}`
          );
          setDeviceIP(response.data.deviceIP || ""); // Đặt giá trị deviceIP nếu tồn tại
        } catch (error) {
          console.error("Error fetching device IP:", error);
          setDeviceIP("");
        }
      };

      fetchConfigs();
      fetchDeviceIP(); // Fetch the IP address when a new node is selected

      if (selectedNode.isFolder) {
        setChildLabels(selectedNode.children);
      }
    } else {
      setDeviceIP(""); // Đặt lại giá trị rỗng nếu không có node nào được chọn
      setConfigs([]); // Đặt lại danh sách cấu hình nếu không có node nào được chọn
    }
  }, [selectedNode]);

  const handleAddConfig = () => {
    if (selectedNode && !selectedNode.isFolder) {
      setDialogState({ ...dialogState, addingConfig: true });
    }
  };

  const handleEditConfig = (config) => {
    setDialogState({ ...dialogState, editingConfig: config });
    setEditedConfig({
      ...config,
      bandId: config.bandId || "",
      currentFrequency: config.currentFrequency || 0,
      currentBandwidth: config.currentBandwidth || 0,
      currentPower: config.currentPower || 0,
    });
  };

  const handleDeleteConfig = (config) => {
    setDialogState({ ...dialogState, deletingConfig: config });
  };

  const confirmAddConfig = async () => {
    if (!selectedNode) return;
    const newConfigWithDevice = {
      ...newConfig,
      deviceId: selectedNode.id,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/configs",
        newConfigWithDevice
      );
      setConfigs([...configs, response.data]);
      setDialogState({ ...dialogState, addingConfig: false });
      setNewConfig({
        band: "",
        bandId: "",
        minFrequency: 0,
        maxFrequency: 0,
        currentFrequency: 0,
        currentBandwidth: 0,
        currentPower: 0,
      });
    } catch (error) {
      console.error("Error adding config:", error);
    }
  };

  const confirmDeleteConfig = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/api/configs/${dialogState.deletingConfig._id}`
      );
      setConfigs(
        configs.filter(
          (config) => config._id !== dialogState.deletingConfig._id
        )
      );
      setDialogState({ ...dialogState, deletingConfig: null });
    } catch (error) {
      console.error("Error deleting config:", error);
    }
  };

  const handleSaveConfig = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/configs/${dialogState.editingConfig._id}`,
        editedConfig
      );
      setConfigs(
        configs.map((config) =>
          config._id === dialogState.editingConfig._id ? response.data : config
        )
      );
      setDialogState({ ...dialogState, editingConfig: null });
    } catch (error) {
      console.error("Error saving config:", error);
    }
  };

  const handleDeviceIPChange = (event) => {
    setDeviceIP(event.target.value);
  };

  const updateDeviceIP = async () => {
    if (!selectedNode) return;

    try {
      await axios.put(`http://localhost:3000/api/devices/${selectedNode.id}`, {
        deviceIP: deviceIP,
      });
      console.log("Device IP updated successfully");
    } catch (error) {
      console.error("Error updating device IP:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedConfig((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleNewConfigChange = (event) => {
    const { name, value } = event.target;
    setNewConfig((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleNewConfigSelectChange = (event) => {
    const bandId = event.target.value;
    const selectedBand = allBands.find((band) => band._id === bandId);

    if (selectedBand) {
      setNewConfig((prevState) => ({
        ...prevState,
        band: selectedBand.band,
        bandId: bandId,
        minFrequency: selectedBand.minFrequency,
        maxFrequency: selectedBand.maxFrequency,
      }));
    }
  };

  const handleEditedConfigSelectChange = (event) => {
    const bandId = event.target.value;
    const selectedBand = allBands.find((band) => band._id === bandId);

    if (selectedBand) {
      setEditedConfig((prevState) => ({
        ...prevState,
        band: selectedBand.band,
        bandId: bandId,
        minFrequency: selectedBand.minFrequency,
        maxFrequency: selectedBand.maxFrequency,
      }));
    }
  };

  const debouncedUpdateConfig = useCallback(
    debounce(async (configId, name, value) => {
      try {
        await axios.put(`http://localhost:3000/api/configs/${configId}`, {
          [name]: value,
        });
      } catch (error) {
        console.error("Error updating config:", error);
      }
    }, 500),
    []
  );

  const handleSliderChange = (configId, name, value) => {
    setConfigs((prevConfigs) =>
      prevConfigs.map((config) =>
        config._id === configId ? { ...config, [name]: value } : config
      )
    );
    debouncedUpdateConfig(configId, name, value);
  };

  const handleApplyAll = async () => {
    if (!selectedNode) return;

    try {
      // Call the API to apply all configs
      const response = await axios.post(
        `http://localhost:3000/api/device/${selectedNode.id}/apply`
      );

      // Show a success message
      console.log("All configurations applied successfully:", response.data);
    } catch (error) {
      console.error("Error applying all configurations:", error);
    }
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
        <Typography variant="h2" align="center" gutterBottom>
          SMART CONFIGURATION MAC-SW
        </Typography>
        {selectedNode && (
          <Typography variant="h3" align="center" gutterBottom>
            Selected: {selectedNode.label}
          </Typography>
        )}
        {selectedNode && selectedNode.isFolder && (
          <ChildLabels children={childLabels} />
        )}

        <Box display="flex" justifyContent="space-between" mb={2}>
          {!selectedNode?.isFolder && (
            <Box width="100%">
              <Typography variant="h3" align="center" gutterBottom>
                Total Configs: {configs.length}
              </Typography>
              <Box
                width="30%"
                display="flex"
                alignItems="center"
                marginBottom={3}
              >
                <TextField
                  margin="dense"
                  label="Device IP"
                  fullWidth
                  variant="outlined"
                  value={deviceIP || ""}
                  onChange={handleDeviceIPChange}
                />
                <Box marginLeft={3}>
                  <Button
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                    }}
                    onClick={updateDeviceIP}
                  >
                    <Typography>Update</Typography>
                  </Button>
                </Box>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
              >
                <Box>
                  <Button
                    onClick={handleApplyAll} // Gọi hàm handleApplyAll khi nhấn nút
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
                    onClick={handleAddConfig}
                  >
                    <AddIcon />
                    <Typography>Add Config</Typography>
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        <ConfigList
          configs={configs}
          onEdit={handleEditConfig}
          onDelete={handleDeleteConfig}
          onSliderChange={handleSliderChange}
          // onApply={handleApply} // Thêm hàm xử lý cho nút Apply
        />

        <ConfigDialogs
          dialogState={dialogState.addingConfig}
          allBands={allBands}
          configData={newConfig}
          handleSelectChange={handleNewConfigSelectChange}
          handleInputChange={handleNewConfigChange}
          onClose={() =>
            setDialogState({ ...dialogState, addingConfig: false })
          }
          onSubmit={confirmAddConfig}
          title="Add Config"
          actionButtonLabel="Add"
        />

        <ConfigDialogs
          dialogState={dialogState.editingConfig}
          allBands={allBands}
          configData={editedConfig}
          handleSelectChange={handleEditedConfigSelectChange}
          handleInputChange={handleChange}
          onClose={() =>
            setDialogState({ ...dialogState, editingConfig: null })
          }
          onSubmit={handleSaveConfig}
          title="Edit Config"
          actionButtonLabel="Save"
        />

        <Dialog
          open={!!dialogState.deletingConfig}
          onClose={() =>
            setDialogState({ ...dialogState, deletingConfig: null })
          }
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
                setDialogState({ ...dialogState, deletingConfig: null })
              }
              color="primary"
            >
              Cancel
            </Button>
            <Button onClick={confirmDeleteConfig} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Content;
