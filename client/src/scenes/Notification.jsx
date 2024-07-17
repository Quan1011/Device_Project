import * as React from "react";
import Box from "@mui/material/Box";
import CustomTreeView from "../components/Sidebar";
import { Typography } from "@mui/material";

export default function Dashboard() {
  const [content, setContent] = React.useState("");

  const handleSelectItem = (content) => {
    setContent(content);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* <Box component="nav" sx={{ width: '300px', borderRight: '1px solid #ccc', padding: 2 }}>
        <CustomTreeView onSelectItem={handleSelectItem} />
      </Box> */}
      <Box component="main" sx={{ flexGrow: 1, padding: 2 }}>
        <Typography variant="h6" component="h2">Content</Typography>
        <Typography variant="body1">{content}</Typography>
      </Box>
    </Box>
  );
}
