"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import axios from "axios";
import { Grid, Modal, Typography } from "@mui/material";
import SimpleSnackbar from "../general-components/SnackbarError";
import { errorCodeType } from "./errorType";
import AddErrorCode from "./addErrorCode";
import ShowListErros from "./listErrors";
import { useSnackBarError } from "../stors/snakebar-store";
import EditErrorCode from "./editError";
import Link from "next/link";
import { API_BACKEND } from "../constant";

export default function ErrorCodeHome() {
    const addMessage = useSnackBarError((state) => state.addMessage);
    const [activeCode, setActiveCode] = React.useState("");

    const [allErrors, setAllErrors] = React.useState<errorCodeType[]>([]);

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const loadData = async () => {
        try {
            const response = await API_BACKEND.get("/error-code");
            setAllErrors((prev) => {
                return response.data;
            });
            console.log("get Errors List");
            console.log(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    React.useEffect(() => {
        loadData();
    }, []);

    const handleSelect = (code: string) => {
        setActiveCode(code);
    };

    const handleDownloadJson = () => {
        if (allErrors.length === 0) {
            addMessage("No error codes to download", "error");
            return;
        }

        const json = JSON.stringify(allErrors, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        // link.download = `error-codes-${new Date().toISOString().slice(0, 10)}.json`;
        link.download = `errorCodes_json.json`;

        link.click();
        URL.revokeObjectURL(url);
        addMessage("JSON file downloaded", "succes");
    };

    const handleDelete = async (code: string) => {
        try {
            await API_BACKEND.delete(`/error-code/${code}`);
            setAllErrors((prev) => prev.filter((error) => error.code !== code));
            if (activeCode === code) {
                setActiveCode("");
            }
            addMessage("Error code deleted", "succes");
        } catch (err) {
            console.log(err);
            addMessage("Failed to delete error code", "error");
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                maxHeight: "100vh",
            }}
        >
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <AddErrorCode
                    allErrors={allErrors}
                    onClose={handleClose}
                    onSuccess={loadData}
                />
            </Modal>

            <SimpleSnackbar></SimpleSnackbar>

            <Box sx={{ background: "#1B3C53", height: "10%" }}>
                <Stack
                    direction={"row"}
                    justifyContent={"start"}
                    alignItems={"center"}
                    alignContent={"center"}
                    height={"100%"}
                    spacing={2}
                >
                    <Link color="red" href={"/"}>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            gutterBottom
                            color="white"
                        >
                            Home
                        </Typography>
                    </Link>

                    <Button variant="contained" onClick={handleOpen}>
                        add new Error
                    </Button>

                    <Button variant="contained" onClick={handleDownloadJson}>
                        download
                    </Button>
                </Stack>
            </Box>

            <Grid
                container
                spacing={2}
                sx={{ height: "80%" }}
                maxHeight={"80%"}
            >
                <Grid
                    size={4}
                    sx={{ background: "#E3E3E3" }}
                    maxHeight={"100%"}
                    overflow={"auto"}
                >
                    <ShowListErros
                        allErrors={allErrors}
                        activeCode={activeCode}
                        onSelect={handleSelect}
                        onDelet={handleDelete}
                    />
                </Grid>

                <Grid
                    size={8}
                    boxShadow={1}
                    sx={{ padding: 1 }}
                    maxHeight={"100%"}
                    overflow={"auto"}
                >
                    {activeCode != "" && (
                        <EditErrorCode onUpdate={loadData} code={activeCode} />
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}
