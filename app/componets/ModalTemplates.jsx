import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import GetRecipe from "./GetRecipe";
import { nanoid } from "nanoid";
import theme from "../theme";
import { addDoc, collection, doc, setDoc } from "firebase/firestore"; // Import Firestore methods
import {
  ref,
  uploadString,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage"; // Import Firebase storage methods
import { auth, db, storage } from "../../firebase"; // Import Firebase configuration
import firestore from "../../firebase";
import ErrorSharpIcon from "@mui/icons-material/ErrorSharp";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import { IconButton } from "@mui/joy";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

export let handleCloseAddItemModal = () => {};
export let handleCloseEditItemModal = () => {};

export default function AddItemModal({ children, CustomIconButton }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  handleCloseAddItemModal = () => setOpen(false);

  return (
    <>
      <Modal
        open={open}
        onClose={handleCloseAddItemModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>{children}</Box>
      </Modal>
      <CustomIconButton onClick={handleOpen} color="text.primary">
        <AddIcon />
      </CustomIconButton>
    </>
  );
}

export function EditItemModal({ children, CustomIconButton }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  handleCloseEditItemModal = () => setOpen(false);

  return (
    <>
      <Modal
        open={open}
        onClose={handleCloseEditItemModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        nanoid
      >
        <Box sx={style}>{children}</Box>
      </Modal>
      <CustomIconButton
        onClick={(e) => {
          handleOpen();
          e.stopPropagation();
        }}
        color="secondary"
      >
        <EditIcon />
      </CustomIconButton>
    </>
  );
}

export function DisplayRecipeModal({
  CustomButton,
  customAction,
  IconToDisplay,
  textTittle,
  tooltipTitle = "",
}) {
  const [textBody, setTextBody] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  let handleCloseGenericModal = () => setOpen(false);
  return (
    <>
      <Tooltip title={tooltipTitle}>
        <CustomButton
          onClick={(e) => {
            e.stopPropagation();
            customAction().then((item) => {
              handleOpen();
              setTextBody(item);
            });
          }}
        >
          <IconToDisplay />
        </CustomButton>
      </Tooltip>
      <Modal
        open={open}
        onClose={handleCloseGenericModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4" component="h2">
            {textTittle}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 4 }}>
            {textBody}
          </Typography>
        </Box>
      </Modal>
    </>
  );
}

export function DisplayImageDetectionModal({
  IconToDisplay,
  textTittle,
  tooltipTitle = "",
  CustomButton,
  setSnackBarVisibility,
  setSnackBarData,
}) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = React.useState(false);
  const videoRef = React.useRef(null);
  const [imageSrc, setImageSrc] = React.useState(null);

  const handleOpen = async () => {
    setOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error(error);
      // Handle error appropriately
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (videoRef.current && videoRef.current.srcObject) {
      let tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setImageSrc(dataUrl);
      uploadImageToFirebase(dataUrl); // Call upload function with captured image
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target.result;
      setImageSrc(imageDataUrl);
      uploadImageToFirebase(imageDataUrl); // Call upload function with selected image
    };
    reader.readAsDataURL(file);
  };
  const uploadImageToFirebase = async (imageDataUrl) => {
    try {
      // Convert base64 string to a Blob
      const base64Response = await fetch(imageDataUrl);
      const blob = await base64Response.blob();

      // Check the file size (size is in bytes)
      const fileSizeInMB = blob.size / (1024 * 1024); // Convert to MB
      if (fileSizeInMB < 0.001 || fileSizeInMB > 15) {
        // Size between 1KB and 15MB
        setSnackBarVisibility(true);
        setSnackBarData([
          ErrorSharpIcon,
          "error",
          "Image size should be between 1KB and 15MB",
        ]);
        return;
      }

      // Proceed with the upload
      const fileRef = ref(storage, `images/${nanoid()}.png`);
      await uploadBytes(fileRef, blob);
      const downloadURL = await getDownloadURL(fileRef);
      await saveImageUrlToFirestore(downloadURL);
      setSnackBarVisibility(true);
      setSnackBarData([
        DoneAllIcon,
        "success",
        "Image uploaded successfully to Firebase ",
      ]);
    } catch (error) {
      console.error(error);
      alert("Error uploading image");
    }
  };

  const saveImageUrlToFirestore = async (downloadURL) => {
    try {
      const docRef = await addDoc(collection(firestore, "images"), {
        url: downloadURL,
        timestamp: new Date(),
      });
      setSnackBarVisibility(true);
      setSnackBarData([
        DoneAllIcon,
        "success",
        "Image URL saved to Firestore with ID: " + docRef.id,
      ]);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <>
      <Tooltip title={tooltipTitle}>
        <CustomButton
          sx={{
            color: "#1976d2",
            ":hover": { backgroundColor: "#1976d2", color: "#fff" },
            fontSize: "1.1rem",
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
        >
          <IconToDisplay />
        </CustomButton>
      </Tooltip>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4" component="h2">
            {textTittle}
          </Typography>

          <Button variant="contained" onClick={handleCapture}>
            Capture Image
          </Button>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ marginTop: "20px" }}
          />
          {imageSrc && (
            <img
              src={imageSrc}
              alt="Captured or Uploaded"
              style={{ marginTop: "20px", width: "100%" }}
            />
          )}
          <video
            ref={videoRef}
            autoPlay
            style={{ width: "100%", marginTop: "20px" }}
          />
        </Box>
      </Modal>
    </>
  );
}
