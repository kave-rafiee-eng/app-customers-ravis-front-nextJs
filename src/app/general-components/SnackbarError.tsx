import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { useSnackBarError } from "../stors/snakebar-store";

type SimpleSnackbarProps = {
  /** default auto-hide in ms; pass null to disable auto-hide globally */
  autoHideDuration?: number | null;
};

export default function SimpleSnackbar({
  autoHideDuration: defaultAutoHideDuration = 2000,
}: SimpleSnackbarProps) {
  const messages = useSnackBarError((state) => state.messages);
  const deletMessage = useSnackBarError((state) => state.deletMessage);

  const handleClose = (index: number) => {
    deletMessage(index);
  };

  return (
    <>
      {messages.map((message, index) => {
        const duration =
          message.autoHideDuration !== undefined
            ? message.autoHideDuration
            : defaultAutoHideDuration;

        return (
          <Snackbar
            key={`${message.text}-${index}`}
            open
            autoHideDuration={duration === null ? null : duration}
            onClose={(_, reason) => {
              if (reason === "clickaway") return;
              handleClose(index);
            }}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            sx={{
              mt: index * 7,
            }}
          >
            <Alert
              severity={message.type == "succes" ? "success" : "error"}
              variant="filled"
              onClose={() => handleClose(index)}
              sx={{
                width: "100%",
                minWidth: 300,
                boxShadow: 3,
                alignItems: "center",
              }}
            >
              {message.text}
            </Alert>
          </Snackbar>
        );
      })}
    </>
  );
}
