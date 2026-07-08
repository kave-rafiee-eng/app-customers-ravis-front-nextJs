"use client";

import { useState } from "react";
import { Box, Button, Grid, Modal, Stack, Typography } from "@mui/material";
import SimpleSnackbar from "../general-components/SnackbarError";
import Link from "next/link";
import ShowListDevices from "./listDevices";
import NewDeviceModal from "./NewDeviceModal";
import ShowDevice from "./showDevice";

export default function DevicePage() {
  const [serialEdit, setSerialEdit] = useState<number | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  const [openNewDeviceModal, setOpenNewDeviceModal] = useState(false);

  const handleCloseModal = () => {
    setOpenNewDeviceModal(false);
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
      <SimpleSnackbar />

      <Modal open={openNewDeviceModal} onClose={handleCloseModal}>
        <NewDeviceModal
          onClose={handleCloseModal}
          onSuccess={() => {
            handleCloseModal();
            setUpdateCount((prev) => prev + 1);
          }}
        />
      </Modal>

      <Box sx={{ background: "#1B3C53", height: "10%" }}>
        <Stack
          direction="row"
          justifyContent="start"
          alignItems="center"
          alignContent="center"
          height="100%"
          spacing={2}
          sx={{ px: 2 }}
        >
          <Link href="/" style={{ textDecoration: "none" }}>
            <Typography variant="h6" fontWeight={700} color="white">
              Home
            </Typography>
          </Link>

          <Button
            variant="contained"
            onClick={() => setOpenNewDeviceModal(true)}
            sx={{
              color: "white",
              textTransform: "none",
              bgcolor: "rgba(255,255,255,0.14)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.22)" },
            }}
          >
            Add new Device
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={2} sx={{ height: "80%" }} maxHeight="80%">
        <Grid
          size={4}
          sx={{ background: "#E3E3E3" }}
          maxHeight="100%"
          overflow="auto"
          height="100%"
        >
          <ShowListDevices
            update={updateCount}
            onEdit={(serial) => setSerialEdit(serial)}
            activeSerial={serialEdit ?? 0}
          />
        </Grid>

        <Grid
          size={8}
          boxShadow={1}
          sx={{ padding: 1 }}
          maxHeight="100%"
          overflow="auto"
        >
          {serialEdit && <ShowDevice serial={serialEdit} />}
        </Grid>
      </Grid>
    </Box>
  );
}
