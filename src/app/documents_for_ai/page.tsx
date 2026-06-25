"use client";

import { useEffect, useState } from "react";
import { API_BACKEND } from "../constant";
import { Box, Button, Grid, Modal, Stack, Typography } from "@mui/material";
import SimpleSnackbar from "../general-components/SnackbarError";
import Link from "next/link";
import EditDocument from "./EditDocuments";
import NewDocumentModal from "./NewDocument";
import { useSnackBarError } from "../stors/snakebar-store";
import ShowListDocuments from "./ShowListDocuments";

const END_POINT_AI_DOCUMENTS = "ai-documents";
const END_POINT_AI_DOCUMENTS_CATEGORY = "ai-documents/category";

export default function AiDocuments() {
  const [idEdit, setIdEdit] = useState<string | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  const [openNewDocumentModal, setOpenNewDocumentModal] = useState(false);
  const addMessage = useSnackBarError((state) => state.addMessage);

  const handleCloseModal = () => {
    setOpenNewDocumentModal(false);
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
      <SimpleSnackbar></SimpleSnackbar>

      <Modal
        open={openNewDocumentModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <NewDocumentModal
          onClose={handleCloseModal}
          onSuccess={(newId) => {
            setIdEdit(newId);
            handleCloseModal();
            addMessage("added .", "succes");
            setUpdateCount((prev) => prev + 1);
          }}
        />
      </Modal>

      {
        //Header
      }
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

          <Button
            variant="contained"
            onClick={() => setOpenNewDocumentModal(true)}
          >
            add new Document
          </Button>

          <Button variant="contained">download For Ai</Button>
        </Stack>
      </Box>

      <Grid container spacing={2} sx={{ height: "80%" }} maxHeight={"80%"}>
        <Grid
          size={4}
          sx={{ background: "#E3E3E3" }}
          maxHeight={"100%"}
          overflow={"auto"}
          height={"100%"}
        >
          <ShowListDocuments
            update={updateCount}
            onEdit={(id) => setIdEdit(id)}
            activeId={idEdit}
          />
        </Grid>

        <Grid
          size={8}
          boxShadow={1}
          sx={{ padding: 1 }}
          maxHeight={"100%"}
          overflow={"auto"}
        >
          {idEdit}
          {idEdit && (
            <EditDocument
              idEdit={idEdit}
              onUpdate={() => {
                setUpdateCount((prev) => prev + 1);
              }}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
