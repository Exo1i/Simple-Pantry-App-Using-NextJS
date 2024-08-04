"use client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import darkTheme from "./theme.js";
import Box from "@mui/material/Box";
import InventoryGrid from "./componets/Inventory/InventoryGrid.jsx";
import SnackbarWithDecorators from "./componets/SnackBar.jsx";
import { useState } from "react";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import { Button, LinearProgress } from "@mui/material";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import DoneAllIcon from "@mui/icons-material/DoneAll";

export let {
  SnackBarData,
  setSnackBarData,
  snackBarVisibility,
  setSnackBarVisibility,
} = {};
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
  const { user } = useAuth();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };
  [snackBarVisibility, setSnackBarVisibility] = useState(false);

  [SnackBarData, setSnackBarData] = useState([
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
        open={snackBarVisibility}
      />

      <ThemeProvider theme={darkTheme}>
        <CssBaseline />

        <InventoryGrid />
      </ThemeProvider>
    </>
  );
}
