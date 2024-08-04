import * as React from "react";
import Button from "@mui/joy/Button";
import Snackbar from "@mui/joy/Snackbar";

export default function SnackbarWithDecorators({
  StartDecorator,
  color,
  snackBarMessage,
  open,
  setSnackBarVisibility,
}) {
  return (
    <>
      <Snackbar
        variant="soft"
        color={color}
        open={open}
        autoHideDuration={2500}
        onClose={(event, reason) => {
          if (reason === "clickaway") {
            return;
          }
          setSnackBarVisibility(false);
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        startDecorator={<StartDecorator />}
        endDecorator={
          <Button
            onClick={() => setSnackBarVisibility(false)}
            size="sm"
            variant="soft"
            color={color}
          >
            Dismiss
          </Button>
        }
      >
        {snackBarMessage}
      </Snackbar>
    </>
  );
}
