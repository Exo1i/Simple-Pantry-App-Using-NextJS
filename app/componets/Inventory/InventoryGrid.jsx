"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Tooltip,
  Typography,
  IconButton,
  Grid,
  Skeleton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import GetRecipe from "../GetRecipe";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import firestore from "../../../firebase.js";
import FetchProductInfo from "../FetchProductInfo";
import AddItemModal, {
  EditItemModal,
  DisplayRecipeModal,
  handleCloseAddItemModal,
  handleCloseEditItemModal,
  DisplayImageDetectionModal,
} from "../ModalTemplates";
import columns from "../columns";
import SearchIcon from "@mui/icons-material/Search";
import ErrorSharpIcon from "@mui/icons-material/ErrorSharp";
import Image from "next/image.js";
import nyanCat from "./nyancat.gif";
import RecipeIcon from "./RecipeIcon.jsx";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import DoneAllIcon from "@mui/icons-material/DoneAll";
let setSnackBarVisibility, setSnackBarData;
export default function InitMain({
  setSnackBarVisibilityGlobal,
  setSnackBarDataGlobal,
}) {
  setSnackBarData = setSnackBarDataGlobal;
  setSnackBarVisibility = setSnackBarVisibilityGlobal;
  return <InventoryGrid />;
}
export function InventoryGrid() {
  const [inventory, setInventory] = useState([]);
  const [itemData, setItemData] = useState({
    id: null,
    eanCode: "",
    productName: "",
    nutriments: "",
    brand: "",
    quantity: 1,
  });
  const [lastID, setLastID] = useState(-1);
  const [loading, setLoading] = useState(true); // Add a loading state

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    let maxID = -1;

    docs.forEach((doc) => {
      const data = doc.data();
      inventoryList.push(data);
      if (data.id > maxID) maxID = data.id;
    });

    setLastID(maxID);
    setInventory(inventoryList);
    setLoading(false); // Set loading to false once data is fetched
  };

  const updateItem = async (item, operation = "add") => {
    const itemsDoc = doc(firestore, "inventory", item.eanCode);
    const docSnapshot = await getDoc(itemsDoc);

    if (operation === "delete") {
      if (docSnapshot.exists()) {
        await deleteDoc(itemsDoc).then(() => {
          setSnackBarVisibility(true);
          setSnackBarData([DoneAllIcon, "success", "Item Deleted!"]);
        });
      } else {
        setSnackBarVisibility(true);
        setSnackBarData([ErrorSharpIcon, "error", "Item Not Found!"]);
      }
    } else if (operation === "remove") {
      if (docSnapshot.exists()) {
        const existingItemInDoc = docSnapshot.data();
        if (existingItemInDoc.quantity <= 1) {
          await deleteDoc(itemsDoc).then(() => {
            setSnackBarVisibility(true);
            setSnackBarData([DoneAllIcon, "success", "Item Deleted!"]);
          });
        } else {
          await setDoc(itemsDoc, {
            ...existingItemInDoc,
            quantity: existingItemInDoc.quantity - 1,
          }).then(() => {
            setSnackBarVisibility(true);
            setSnackBarData([
              DoneAllIcon,
              "success",
              `Item Updated, New Count is:${existingItemInDoc.quantity - 1}!`,
            ]);
          });
        }
      } else {
        setSnackBarVisibility(true);
        setSnackBarData([ErrorSharpIcon, "error", "Item Not Found!"]);
      }
    } else if (operation === "add") {
      if (docSnapshot.exists()) {
        const existingItemInDoc = docSnapshot.data();
        await setDoc(itemsDoc, {
          ...existingItemInDoc,
          quantity: Number(existingItemInDoc.quantity) + Number(item.quantity),
        }).then(() => {
          setSnackBarVisibility(true);
          setSnackBarData([
            DoneAllIcon,
            "success",
            `Item Updated, New Count is:${existingItemInDoc.quantity + 1}!`,
          ]);
        });
      } else {
        const newID = item.id ?? lastID + 1;
        await setDoc(itemsDoc, {
          id: newID,
          quantity: item.quantity ?? 1,
          eanCode: item.eanCode,
          productName: item.productName,
          nutriments: item.nutriments,
          brand: item.brand,
        }).then(() => {
          setSnackBarVisibility(true);
          setSnackBarData([DoneAllIcon, "success", `Item Added Sucessfully!`]);
        });
        setLastID(newID);
      }
    } else if (operation === "edit") {
      await updateDoc(itemsDoc, item).then(() => {
        setSnackBarVisibility(true);
        setSnackBarData([DoneAllIcon, "success", `Item Edited Sucessfully!`]);
      });
    }

    await updateInventory();
    setItemData({
      id: null,
      eanCode: "",
      productName: "",
      nutriments: "",
      brand: "",
      quantity: 1,
    });
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleEditItemClick = (row) => {
    setItemData(row);
  };

  return loading ? ( // Display Skeleton while loading
    <Box
      borderRadius={2}
      bgcolor={"background.primary"}
      padding={2}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        maxWidth: { xs: "100%", sm: "100%", md: 1200 },
        margin: "auto",
      }}
    >
      <Typography variant="h2" color={"text.primary"} mb={4}>
        Loading Inventory...
      </Typography>
      <Image
        src={nyanCat}
        width={300}
        height={300}
        alt="Loading..."
        style={{ width: "300px", height: "auto" }}
      />
    </Box>
  ) : (
    <Box
      // border={"1px solid #333"}
      borderRadius={2}
      bgcolor={"background.paper"}
      padding={2}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // maxWidth: { xs: "100%", sm: "100%", md: 1200 },
        width: "100%",
        height: "100%",
        margin: "auto",
      }}
    >
      <Box
        width="100%"
        height={100}
        bgcolor={"primary.main"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        borderRadius={2}
        mb={2}
      >
        <Typography variant="h2" color={"text.primary"}>
          Inventory Items
          <DisplayAddItemModal
            itemData={itemData}
            setItemData={setItemData}
            updateItem={updateItem}
            lastID={lastID}
          />
          <DisplayImageDetectionModal
            IconToDisplay={CameraAltOutlinedIcon}
            textTittle={"Camera:"}
            tooltipTitle="Use Camera To Add an Item!"
            CustomButton={IconButton}
            setSnackBarVisibility={setSnackBarVisibility}
            setSnackBarData={setSnackBarData}
          />
        </Typography>
      </Box>
      <Box width="100%" overflow="auto">
        <DataGrid
          columns={[
            ...columns,
            {
              field: "actions",
              headerName: "",
              width: 230,
              sortable: false,
              disableColumnMenu: true,
              renderCell: (params) => (
                <>
                  <Tooltip title="Delete">
                    <IconButton
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        const itemData = params.row;
                        updateItem(itemData, "delete");
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Increase Count">
                    <IconButton
                      color="success"
                      onClick={(e) => {
                        e.stopPropagation();
                        const itemData = params.row;
                        updateItem({ ...itemData, quantity: 1 }, "add");
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Decrement Count">
                    <IconButton
                      color="warning"
                      onClick={(e) => {
                        e.stopPropagation();
                        const itemData = params.row;
                        updateItem(itemData, "remove");
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Item">
                    <EditItemModal CustomIconButton={IconButton}>
                      <EditItemModalTextFields
                        initialItemData={params.row}
                        updateItem={updateItem}
                        handleClose={handleCloseEditItemModal}
                      />
                    </EditItemModal>
                  </Tooltip>
                  <DisplayRecipeModal
                    customAction={() => GetRecipe(params.row)}
                    CustomButton={IconButton}
                    IconToDisplay={RecipeIcon}
                    textTittle={"Recipe"}
                    tooltipTitle="Get Recipe"
                  ></DisplayRecipeModal>
                </>
              ),
            },
          ]}
          rows={inventory}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 20 },
            },
          }}
          pageSizeOptions={[20, 30]}
          checkboxSelection
          autoHeight
          height={500}
        />
      </Box>
    </Box>
  );
}

function DisplayAddItemModal({ itemData, setItemData, updateItem, lastID }) {
  return (
    <>
      <AddItemModal CustomIconButton={IconButton}>
        <Typography variant="h3" paddingBottom={4}>
          Enter Product Details:
        </Typography>
        <AddItemModalTextFields
          itemData={itemData}
          setItemData={setItemData}
          updateItem={updateItem}
          lastID={lastID}
        />
      </AddItemModal>
    </>
  );
}

function AddItemModalTextFields({ itemData, setItemData, updateItem, lastID }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItemData({
      ...itemData,
      [name]: value,
    });
  };
  function validateItemData(itemData) {
    if (itemData.eanCode === "") {
      setSnackBarVisibility(true);
      setSnackBarData([ErrorSharpIcon, "error", "Please enter an EAN code."]);
      return false;
    }
    if (itemData.productName === "") {
      setSnackBarVisibility(true);
      setSnackBarData([
        ErrorSharpIcon,
        "error",
        "Please enter a product name.",
      ]);
      return false;
    }
    if (itemData.quantity === 0) {
      return false;
    }
    return true;
  }
  return (
    <Stack direction={"column"} gap={2}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            name="id"
            label="ID"
            variant="outlined"
            value={lastID + 1}
            readOnly={true}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            name="quantity"
            label="Quantity"
            variant="outlined"
            fullWidth
            value={itemData.quantity}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setItemData({
                  ...itemData,
                  [e.target.name]: Number(value),
                });
              }
            }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            name="productName"
            label="Product Name"
            variant="outlined"
            fullWidth
            value={itemData.productName}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box display="flex" alignItems="center">
            <TextField
              name="eanCode"
              label="EAN Code"
              variant="outlined"
              fullWidth
              value={itemData.eanCode}
              onChange={handleInputChange}
            />
            <SearchIcon
              sx={{ ml: 1, ":hover": { cursor: "pointer" } }}
              onClick={() => {
                if (itemData.eanCode) {
                  FetchProductInfo(
                    itemData.eanCode,
                    setSnackBarData,
                    setSnackBarVisibility
                  ).then((fetchedData) =>
                    setItemData({ ...itemData, ...fetchedData })
                  );
                }
              }}
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            name="nutriments"
            label="Nutrition Facts"
            variant="outlined"
            fullWidth
            value={itemData.nutriments}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            name="brand"
            label="Brand"
            variant="outlined"
            fullWidth
            value={itemData.brand}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
      <Box
        borderRadius={2}
        bgcolor={"background.primary"}
        padding={2}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: { xs: "100%", sm: "100%", md: 1200 },
          margin: "auto",
        }}
      >
        <Button
          variant="outlined"
          sx={{
            color: "#1976d2",
            ":hover": { backgroundColor: "#1976d2", color: "#fff" },
            fontSize: "1.1rem",
          }}
          onClick={() => {
            if (validateItemData(itemData)) {
              updateItem(itemData);
              handleCloseAddItemModal();
            }
          }}
        >
          Add
        </Button>{" "}
      </Box>
    </Stack>
  );
}

function EditItemModalTextFields({ initialItemData, updateItem, handleClose }) {
  const [localItemData, setLocalItemData] = useState(initialItemData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalItemData({
      ...localItemData,
      [name]: value,
    });
  };

  const handleConfirm = () => {
    updateItem(localItemData, "edit");
    handleClose();
  };

  return (
    <Stack direction={"column"} gap={2}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            name="id"
            label="ID"
            variant="outlined"
            value={localItemData.id}
            disabled={true}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            name="quantity"
            label="Quantity"
            variant="outlined"
            fullWidth
            value={localItemData.quantity}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setLocalItemData({
                  ...localItemData,
                  [e.target.name]: Number(value),
                });
              }
            }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            name="eanCode"
            label="EAN Code"
            variant="outlined"
            value={localItemData.eanCode}
            onChange={handleInputChange}
            fullWidth
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            name="productName"
            label="Product Name"
            variant="outlined"
            fullWidth
            value={localItemData.productName}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>

        <Grid item xs={12} md={4}>
          <TextField
            name="nutriments"
            label="Nutrition Facts"
            variant="outlined"
            fullWidth
            value={localItemData.nutriments}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            name="brand"
            label="Brand"
            variant="outlined"
            fullWidth
            value={localItemData.brand}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
      <Stack direction={"row"} gap={2}>
        <Button variant="outlined" onClick={handleConfirm}>
          Confirm
        </Button>
        <Button variant="outlined" onClick={handleCloseEditItemModal}>
          Discard
        </Button>
      </Stack>
    </Stack>
  );
}
