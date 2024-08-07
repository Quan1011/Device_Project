// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import { Box, Typography, Grid, Button } from "@mui/material";
// // import { useTheme } from "@mui/material/styles";
// // import FolderIcon from "@mui/icons-material/Folder";
// // import DevicesIcon from "@mui/icons-material/Devices";

// // const ChildLabels = () => {
// //   const [deviceLabels, setDeviceLabels] = useState([]);
// //   const theme = useTheme();

// //   useEffect(() => {
// //     // Gọi API để lấy dữ liệu thiết bị
// //     const fetchDeviceLabels = async () => {
// //       try {
// //         const response = await axios.get("http://localhost:3000/api/device-labels");
// //         setDeviceLabels(response.data);
// //       } catch (error) {
// //         console.error("Error fetching device labels:", error);
// //       }
// //     };

// //     fetchDeviceLabels(); // Thực thi hàm gọi API khi component được mount
// //   }, []);

// //   const renderDevice = (device) => {
// //     return (
// //       <Box
// //         display="flex"
// //         flexDirection="column"
// //         alignItems="center"
// //         justifyContent="center"
// //         border={1}
// //         borderRadius={2}
// //         borderColor={theme.palette.primary.main}
// //         p={2}
// //         m={1}
// //         bgcolor={theme.palette.background.paper}
// //         width={200}
// //         height={200}
// //         key={device._id}
// //       >
// //         {device.isFolder ? (
// //           <FolderIcon
// //             style={{
// //               marginBottom: theme.spacing(1),
// //               color: theme.palette.primary.main,
// //             }}
// //           />
// //         ) : (
// //           <DevicesIcon
// //             style={{
// //               marginBottom: theme.spacing(1),
// //               color: theme.palette.secondary.main,
// //             }}
// //           />
// //         )}
// //         <Typography>{device.name}</Typography>
// //         {device.isFolder ? (
// //           <>
// //             <Typography variant="caption">
// //               Tổng: {device.totalChildren}
// //             </Typography>
// //             <Typography variant="caption">
// //               Folders: {device.folderChildrenCount}
// //             </Typography>
// //             <Typography variant="caption">
// //               Items: {device.itemChildrenCount}
// //             </Typography>
// //           </>
// //         ) : (
// //           <>
// //             <Typography variant="caption">
// //               Tổng config: {device.configCount}
// //             </Typography>
// //             <Typography variant="caption">
// //               Online: {device.onlineConfigCount}
// //             </Typography>
// //             <Typography variant="caption">
// //               Offline: {device.offlineConfigCount}
// //             </Typography>
// //           </>
// //         )}
// //       </Box>
// //     );
// //   };

// //   return (
// //     <Box mb={2}>
// //       <Grid container spacing={2}>
// //         {deviceLabels.map((device) => (
// //           <Grid item xs={12} md={6} key={device._id}>
// //             {renderDevice(device)}
// //             {device.children && Array.isArray(device.children) && device.children.map((child) => (
// //               <Grid item xs={12} md={6} key={child._id}>
// //                 {renderDevice(child)}
// //               </Grid>
// //             ))}
// //           </Grid>
// //         ))}
// //       </Grid>
// //     </Box>
// //   );
  
// // };

// // export default ChildLabels;



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Box, Typography, Grid } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import FolderIcon from "@mui/icons-material/Folder";
// import DevicesIcon from "@mui/icons-material/Devices";

// const ChildLabels = () => {
//   const [deviceLabels, setDeviceLabels] = useState([]);
//   const [selectedFolderId, setSelectedFolderId] = useState(null);
//   const [children, setChildren] = useState([]);
//   const theme = useTheme();

//   useEffect(() => {
//     // Gọi API để lấy dữ liệu thiết bị
//     const fetchDeviceLabels = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:3000/api/device-labels"
//         );
//         setDeviceLabels(response.data);
//       } catch (error) {
//         console.error("Error fetching device labels:", error);
//       }
//     };

//     fetchDeviceLabels(); // Thực thi hàm gọi API khi component được mount
//   }, []);

//   const fetchChildren = async (id) => {
//     try {
//       const response = await axios.get(`http://localhost:3000/api/folder/${id}`);
//       setChildren(response.data);
//     } catch (error) {
//       console.error("Error fetching children:", error);
//     }
//   };

//   const handleFolderClick = (id) => {
//     setSelectedFolderId(id);
//     fetchChildren(id); // Gọi API để lấy thông tin chi tiết cho folder được chọn
//   };

//   const renderDevice = (device) => {
//     return (
//       <Box
//         display="flex"
//         flexDirection="column"
//         alignItems="center"
//         justifyContent="center"
//         border={1}
//         borderRadius={2}
//         borderColor={theme.palette.primary.main}
//         p={2}
//         m={1}
//         bgcolor={theme.palette.background.paper}
//         width={200}
//         height={200}
//         key={device._id}
//         onClick={() => device.isFolder && handleFolderClick(device._id)} // Sự kiện nhấp vào folder
//         style={{ cursor: device.isFolder ? "pointer" : "default" }}
//       >
//         {device.isFolder ? (
//           <FolderIcon
//             style={{
//               marginBottom: theme.spacing(1),
//               color: theme.palette.primary.main,
//             }}
//           />
//         ) : (
//           <DevicesIcon
//             style={{
//               marginBottom: theme.spacing(1),
//               color: theme.palette.secondary.main,
//             }}
//           />
//         )}
//         <Typography>{device.name}</Typography>
//         {device.isFolder ? (
//           <>
//             <Typography variant="caption">Tổng: {device.totalChildren}</Typography>
//             <Typography variant="caption">Folders: {device.folderChildrenCount}</Typography>
//             <Typography variant="caption">Items: {device.itemChildrenCount}</Typography>
//           </>
//         ) : (
//           <>
//             <Typography variant="caption">Tổng config: {device.configCount}</Typography>
//             <Typography variant="caption">Online: {device.onlineConfigCount}</Typography>
//             <Typography variant="caption">Offline: {device.offlineConfigCount}</Typography>
//           </>
//         )}
//       </Box>
//     );
//   };

//   return (
//     <Box mb={2}>
//       <Grid container spacing={2}>
//         {deviceLabels.map((device) => (
//           <Grid item xs={12} md={6} key={device._id}>
//             {renderDevice(device)}
//             {selectedFolderId === device._id &&
//               children.map((child) => (
//                 <Grid item xs={12} md={6} key={child._id}>
//                   {renderDevice(child)}
//                 </Grid>
//               ))}
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// export default ChildLabels;

import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FolderIcon from "@mui/icons-material/Folder";
import DevicesIcon from "@mui/icons-material/Devices";

const ChildLabels = ({ children }) => {
  const theme = useTheme();

  const renderDevice = (device) => {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        border={1}
        borderRadius={2}
        borderColor={theme.palette.primary.main}
        p={2}
        m={1}
        bgcolor={theme.palette.background.paper}
        width={200}
        height={200}
        key={device._id}
      >
        {device.isFolder ? (
          <FolderIcon
            style={{
              marginBottom: theme.spacing(1),
              color: theme.palette.primary.main,
            }}
          />
        ) : (
          <DevicesIcon
            style={{
              marginBottom: theme.spacing(1),
              color: theme.palette.secondary.main,
            }}
          />
        )}
        <Typography>{device.name}</Typography>
        {device.isFolder ? (
          <>
            <Typography variant="caption">Tổng: {device.totalChildren}</Typography>
            <Typography variant="caption">Areas: {device.folderChildrenCount}</Typography>
            <Typography variant="caption">Devices: {device.itemChildrenCount}</Typography>
          </>
        ) : (
          <>
            <Typography variant="caption">Tổng config: {device.configCount}</Typography>
            <Typography variant="caption">Online: {device.onlineConfigCount}</Typography>
            <Typography variant="caption">Offline: {device.offlineConfigCount}</Typography>
          </>
        )}
      </Box>
    );
  };

  return (
    <Box mb={2}>
      <Grid container spacing={2}>
        {children.map((child) => (
          <Grid item xs={12} md={6} key={child._id}>
            {renderDevice(child)}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ChildLabels;
