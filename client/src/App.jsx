import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "./theme"
import Dashboard from "./scenes/Dashboard";
import Layout from "./scenes/Layout";
import LogIn from "./scenes/LoginPage";
import Control from "./scenes/Control";
import PrivateRoute from './components/PrivateRoute';
import GridView from "./scenes/GridView";
import Notification from "./scenes/Notification";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/control" element={<Control />} />
                <Route path="/gridview" element={<GridView />} />
                <Route path="/notification" element={<Notification />} />
              </Route>
            </Route>
            <Route path="/login" element={<LogIn />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
