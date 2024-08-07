import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "./theme"; // Đảm bảo import đúng tên
import Layout from "./scenes/Layout";
import LogIn from "./scenes/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import Content from "./scenes/Content";
import { TreeProvider } from "./context/TreeContext";
import BandManager from "./scenes/BandManage";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <TreeProvider>
            <Routes>
              <Route element={<PrivateRoute />}>
                <Route element={<Layout />}>
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route path="/dashboard" element={<Content />} />
                </Route>
              </Route>
              <Route path="/band-manager" element={<BandManager />} />
              <Route path="/login" element={<LogIn />} />
            </Routes>
          </TreeProvider>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
