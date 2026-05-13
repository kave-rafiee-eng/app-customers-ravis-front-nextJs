import * as React from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { useSnackBarError } from "../snakebar-store";

export default function SimpleSnackbar() {
    const errors = useSnackBarError((state) => state.errors);
    const addError = useSnackBarError((state) => state.addError);
    const deletError = useSnackBarError((state) => state.deletError);

    const handleClose = (index: number) => {
        deletError(index);
    };

    return (
        <>
            {errors.map((error, index) => (
                <Snackbar
                    key={`${error}-${index}`}
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
                        severity="error"
                        variant="filled"
                        onClose={() => handleClose(index)}
                        sx={{
                            width: "100%",
                            minWidth: 300,
                            boxShadow: 3,
                            alignItems: "center",
                        }}
                    >
                        {error}
                    </Alert>
                </Snackbar>
            ))}
        </>
    );
}
