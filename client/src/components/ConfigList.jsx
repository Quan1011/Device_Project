import React from "react";
import axios from "axios";
import { Grid } from "@mui/material";
import BandControl from "./BandControl";

const ConfigList = ({ configs, onEdit, onDelete, onSliderChange }) => {
  // Định nghĩa hàm onApply để gọi API
  const onApply = async (config) => {
    try {
      // Gửi yêu cầu POST tới API endpoint
      const response = await axios.post(`/api/configs/${config._id}/apply`);
      console.log("Response from API:", response.data);

      // Xử lý logic sau khi áp dụng cấu hình thành công (nếu cần)
      alert("Configuration applied successfully!");
    } catch (error) {
      console.error("Error applying configuration:", error);
      alert("Failed to apply configuration.");
    }
  };

  return (
    <Grid container spacing={2}>
      {configs.map((config) => (
        <Grid item xs={12} md={6} key={config._id}>
          <BandControl
            config={config}
            onEdit={onEdit}
            onDelete={onDelete}
            onSliderChange={onSliderChange}
            onApply={onApply} // Truyền hàm onApply xuống BandControl
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ConfigList;
