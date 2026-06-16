"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import axios from "axios";
import { Grid, Modal, Typography } from "@mui/material";
import SimpleSnackbar from "../general-components/SnackbarError";
import { useSnackBarError } from "../stors/snakebar-store";

import Link from "next/link";
import { GroupDocType } from "./documentsType";
import AddGroupDoc from "./addGroupDoc";
import ShowListGroupDoc from "./listGroups";
import EditGroupDoc from "./editGroupDoc";
import { API_BACKEND } from "../constant";

export default function ErrorCodeHome() {
    const addMessage = useSnackBarError((state) => state.addMessage);

    const [activeId, setActiveId] = React.useState("");

    const [listGroups, setListGroups] = React.useState<GroupDocType[]>([]);

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const loadData = async () => {
        try {
            const response = await API_BACKEND.get("/documents");
            setListGroups((prev) => {
                return response.data;
            });
            console.log("get List documents");
        } catch (err) {
            console.log(err);
        }
    };

    React.useEffect(() => {
        loadData();
    }, []);

    const handleSelect = (uuid: string) => {
        setActiveId(uuid);
    };

    const handleDownloadJson = () => {
        if (listGroups.length === 0) {
            addMessage("No documents to download", "error");
            return;
        }

        const json = JSON.stringify(listGroups, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        // link.download = `error-codes-${new Date().toISOString().slice(0, 10)}.json`;
        link.download = `documents.json`;

        link.click();
        URL.revokeObjectURL(url);
        addMessage("JSON file downloaded", "succes");
    };

    const handleDelete = async (uuid: string) => {
        try {
            await API_BACKEND.delete(`/documents/${uuid}`);

            setListGroups((prev) =>
                prev.filter((element) => element.id !== uuid),
            );

            if (activeId === uuid) {
                setActiveId("");
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
                <AddGroupDoc
                    listGroups={listGroups}
                    onClose={handleClose}
                    onSuccess={() => {
                        handleClose();
                        loadData();
                    }}
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
                        add new Group
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
                    <ShowListGroupDoc
                        listGroups={listGroups}
                        activeId={activeId}
                        onDelet={handleDelete}
                        onSelect={handleSelect}
                    />
                </Grid>

                <Grid
                    size={8}
                    boxShadow={1}
                    sx={{ padding: 1 }}
                    maxHeight={"100%"}
                    overflow={"auto"}
                >
                    {activeId != "" && (
                        <EditGroupDoc onUpdate={loadData} activeId={activeId} />
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}
