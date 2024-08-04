"use client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import darkTheme from "./theme.js";
import Box from "@mui/material/Box";
import InitMain from "./componets/Inventory/InventoryGrid.jsx";
import SnackbarWithDecorators from "./componets/SnackBar.jsx";
import { useState } from "react";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import { Button, LinearProgress } from "@mui/material";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import { useAuth } from "./AuthContext";
import { firestore, app, auth } from "../firebase.js";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  signInWithRedirect,
} from "firebase/auth";
import {
  DisplayImageDetectionModal,
  SwipeableEdgeDrawer,
} from "./componets/ModalTemplates.jsx";

export default function Home() {
  const [snackBarVisibility, setSnackBarVisibility] = useState(false);

  const [SnackBarData, setSnackBarData] = useState([
    DoneAllIcon,
    "success",
    "Item Added Successfully",
  ]);
  const [defStartDecorator, defColor, defMessage] = SnackBarData;

  return (
    <>
      <SnackbarWithDecorators
        StartDecorator={defStartDecorator}
        color={defColor}
        snackBarMessage={defMessage}
        setSnackBarVisibility={setSnackBarVisibility}
        open={snackBarVisibility}
      />

      <ThemeProvider theme={darkTheme}>
        <CssBaseline />

        <InitMain
          setSnackBarDataGlobal={setSnackBarData}
          setSnackBarVisibilityGlobal={setSnackBarVisibility}
        />
      </ThemeProvider>
    </>
  );
}
