import React, { useState, useEffect, useCallback } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../components/Header";
import DataGridCustomToolbar from "../components/DataGrid";
import mqtt from "mqtt";
import WebSocket from "ws";

export default function GridView() {
  const theme = useTheme();

  // values to be sent to the backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);

  const columns = [
    {
      field: "label",
      headerName: "Label",
      flex: 1,
    },
    {
      field: "latitude",
      headerName: "Latitude",
      flex: 1,
    },
    {
      field: "longitude",
      headerName: "Longitude",
      flex: 1,
    },
    {
      field: "timestamp",
      headerName: "Timestamp",
      flex: 1,
    },
  ];

  const client = mqtt.connect("ws://localhost:9001", { WebSocket: WebSocket });

  const handleMQTTMessage = useCallback((topic, message) => {
    if (topic === "drone/location") {
      try {
        const data = JSON.parse(message.toString());
        if (Array.isArray(data)) {
          const newRows = data.map((drone) => ({
            id: Date.now() + Math.random(), // Unique ID for each row
            label: drone.label,
            latitude: drone.lat,
            longitude: drone.lng,
            timestamp: new Date().toLocaleTimeString(),
          }));

          setRows((prevRows) => [...newRows, ...prevRows]);
        } else {
          console.error("Dữ liệu nhận được không phải là mảng:", data);
        }
      } catch (error) {
        console.error("Lỗi khi phân tích JSON:", error);
      }
    }
  }, []);

  useEffect(() => {
    client.on("connect", () => {
      try {
        console.log("Đã kết nối đến MQTT broker");
        client.subscribe("drone/location");
      } catch (error) {
        console.error("Lỗi khi kết nối hoặc đăng ký MQTT:", error);
      }
    });

    client.on("message", handleMQTTMessage);

    client.on("error", (error) => {
      console.error("Lỗi kết nối MQTT:", error);
    });

    return () => {
      client.end();
    };
  }, [handleMQTTMessage]);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="DRONE LOCATION" />
      <Box
        height="80vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          getRowId={(row) => row.id}
          rows={rows}
          columns={columns}
          rowsPerPageOptions={[20, 50, 100]}
          pagination
          page={page}
          pageSize={pageSize}
          sortingMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onSortModelChange={(newSortModel) => setSort(...newSortModel)}
          slots={{ toolbar: DataGridCustomToolbar }}
        />
      </Box>
    </Box>
  );
}
