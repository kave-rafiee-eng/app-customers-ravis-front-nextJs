import * as React from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { useSnackBarError } from "../stors/snakebar-store";

export default function SimpleSnackbar() {
  const messages = useSnackBarError((state) => state.messages);
  const deletMessage = useSnackBarError((state) => state.deletMessage);

  const handleClose = (index: number) => {
    deletMessage(index);
  };

  return (
    <>
      {messages.map((message, index) => (
        <Snackbar
          key={`${message.text}-${index}`}
          open
          autoHideDuration={40000}
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
      ))}
    </>
  );
}
