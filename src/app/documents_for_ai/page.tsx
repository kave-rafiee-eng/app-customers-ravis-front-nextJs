"use client";

import { useEffect, useState } from "react";
import { API_BACKEND } from "../constant";
import { Box, Button, Grid, Modal, Stack, Typography } from "@mui/material";
import SimpleSnackbar from "../general-components/SnackbarError";
import Link from "next/link";
import EditDocument, { DocumentAiType } from "./EditDocuments";
import NewDocumentModal from "./NewDocument";
import { useSnackBarError } from "../stors/snakebar-store";
import ShowListDocuments from "./ShowListDocuments";

const END_POINT_AI_DOCUMENTS = "ai-documents";
const END_POINT_AI_DOCUMENTS_CATEGORY = "ai-documents/category";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function AiDocuments() {
  const [idEdit, setIdEdit] = useState<string | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  const [openNewDocumentModal, setOpenNewDocumentModal] = useState(false);
  const addMessage = useSnackBarError((state) => state.addMessage);
  const [download, setDownload] = useState(false);

  const handleCloseModal = () => {
    setOpenNewDocumentModal(false);
  };

  const handleDownloadJson = async (forAi: boolean) => {
    setDownload(true);
    try {
      const [resCategory, resDocument] = await Promise.all([
        API_BACKEND.get<string[]>(END_POINT_AI_DOCUMENTS_CATEGORY),
        API_BACKEND.get<DocumentAiType[]>(END_POINT_AI_DOCUMENTS),
      ]);
      const categories = resCategory.data;
      const documents = resDocument.data;

      if (categories.length === 0 || documents.length === 0) {
        addMessage("No documents to download", "error");
        return;
      }

      let downloadCount = 0;

      for (const category of categories) {
        const filteredDocs = documents.filter(
          (item) => item.category === category,
        );

        if (filteredDocs.length === 0) continue;

        let fileContent = "";

        if (forAi) {
          const markdown = filteredDocs.map((doc, index) => {
            const title = doc.title.english?.trim() || "Untitled document";
            const header = doc.header.english?.trim();
            const content = doc.content.english?.trim();

            return [
              `# ${title}`,
              header ? `## Summary\n\n${header}` : "",
              content ? `## Content\n\n${content}` : "",
            ].join("\n");
          });

          fileContent = JSON.stringify(markdown, null, 2);
        } else {
          fileContent = JSON.stringify(filteredDocs, null, 2);
        }

        const blob = new Blob([fileContent], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${category.replace(/[\\/:*?"<>|]/g, "-")}${forAi ? "-AI" : ""}.json`;
        console.log("downloading:", link.download);
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        downloadCount += 1;

        await delay(1000);
      }

      if (downloadCount === 0) {
        addMessage("No documents to download", "error");
        return;
      }

      addMessage(`${downloadCount} JSON file downloaded`, "succes");
    } catch (err) {
      console.log(err);
      addMessage("http Error", "error");
    } finally {
      setDownload(false);
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
            sx={{
              color: "white",
              textTransform: "none",
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
            }}
          >
            Add new Document
          </Button>

          <Button
            disabled={download}
            variant="contained"
            onClick={() => handleDownloadJson(false)}
            sx={{
              color: "white",
              textTransform: "none",
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
            }}
          >
            download
          </Button>

          <Button
            disabled={download}
            variant="contained"
            onClick={() => handleDownloadJson(true)}
            sx={{
              color: "white",
              textTransform: "none",
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
            }}
          >
            download For Ai
          </Button>
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
