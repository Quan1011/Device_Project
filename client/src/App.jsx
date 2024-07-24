import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "./theme"
import Layout from "./scenes/Layout";
import LogIn from "./scenes/LoginPage";
import PrivateRoute from './components/PrivateRoute';
import Content from "./scenes/Content";
import { TreeProvider } from './context/TreeContext';

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
                  <Route path="/" element={<Navigate to="/content" replace />} />
                  <Route path="/content" element={<Content />} />
                </Route>
              </Route>
              <Route path="/login" element={<LogIn />} />
            </Routes>
          </TreeProvider>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
