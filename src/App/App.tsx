import React, { useEffect, useState } from "react";
import "./App.css";
import {
  AppBar,
  Button,
  Container,
  createTheme,
  CssBaseline,
  IconButton,
  LinearProgress,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Brightness3Outlined, WbSunnyOutlined } from "@material-ui/icons";
import { TodolistsList } from "../features/Todolists/TodolistsList";
import { useAppDispatch, useAppSelector } from "../reducers/store";
import { initializeAppTC } from "./app-reducer";
import { ErrorSnackbar } from "../Components/ErrorSnackbar/ErrorSnackbar";
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "../features/Login/Login";
import { CircularProgress } from "@mui/material";
import { logoutTC } from "../reducers/login-reducer";

type PropsType = {
  demo?: boolean;
};

function App({ demo = false }: PropsType) {
  const status = useAppSelector((state) => state.app.status);
  const isInitialized = useAppSelector((state) => state.app.isInitialized);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const dispatch = useAppDispatch();
  //---------------Theme-------------------------------
  const [darkMode, setDarkMode] = useState(false);
  const lightTheme = createTheme({
    palette: {
      type: "light",
      primary: {
        main: "#5eb9b8",
        light: "#ddffff",
        dark: "#459392",
      },
      secondary: {
        main: "#4E91C6",
        light: "#fffffc",
      },
      error: {
        main: "#f44336",
        dark: "#8B1C00",
      },
      warning: {
        main: "#ff9800",
        dark: "#A93800",
      },
      success: {
        main: "#75DAA9",
      },
      info: {
        main: "#935892",
      },
    },
  });
  const darkTheme = createTheme({
    palette: {
      type: "dark",
      primary: {
        main: "#5eb9b8",
        light: "#ddffff",
        dark: "#459392",
      },
      secondary: {
        main: "#4E91C6",
        light: "#fffffc",
        dark: "#65a0e5",
      },
      error: {
        main: "#f44336",
        dark: "#8B1C00",
        light: "rgba(245,143,146,0.99)",
      },
      warning: {
        main: "#ff9800",
        light: "#e9ce79",
        dark: "#A93800",
        contrastText: "rgba(255,24,109,0.98)",
      },
      success: {
        main: "#75DAA9",
        light: "#73ff69",
        dark: "#449944",
        contrastText: "rgba(100,240,240,0.95)",
      },
      info: {
        main: "#b268b1",
        light: "#e898fc",
        dark: "#945bae",
      },
      text: {
        hint: "rgba(255,253,253,0.98)",
        disabled: "rgb(203,223,215)",
      },
    },
  });
  const selectedTheme = darkMode ? darkTheme : lightTheme;
  const themeToggle = () => setDarkMode(!darkMode);
  //------------------------------------------------------

  const logoutHandler = () => {
    dispatch(logoutTC());
  };
  useEffect(() => {
    dispatch(initializeAppTC());
  }, []);

  if (!isInitialized) {
    return (
      <div
        style={{
          position: "fixed",
          top: "30%",
          textAlign: "center",
          width: "100%",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <ThemeProvider theme={selectedTheme}>
      <CssBaseline />
      <div className="App">
        <ErrorSnackbar />
        <AppBar position="static">
          <Toolbar style={{ justifyContent: "space-between" }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={themeToggle}
            >
              {darkMode ? <WbSunnyOutlined /> : <Brightness3Outlined />}
            </IconButton>

            <Typography variant="h5">My to-do lists</Typography>
            <div>
              {isLoggedIn && (
                <Button
                  color="primary"
                  variant={"contained"}
                  onClick={logoutHandler}
                  style={{ margin: "5px" }}
                >
                  Log out
                </Button>
              )}
            </div>
          </Toolbar>
          {status === "loading" && <LinearProgress />}
        </AppBar>
        <Container fixed>
          <Routes>
            <Route path={"/"} element={<TodolistsList appStatus={status} />} />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/404"} element={<h1>404. Page not found</h1>} />
            <Route path={"*"} element={<Navigate to={"/404"} />} />
          </Routes>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
