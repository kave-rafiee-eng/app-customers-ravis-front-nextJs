"use client";

import { useEffect, useState } from "react";
import { API_BACKEND } from "../constant";
import { Box, Button, Grid, Modal, Stack, Typography } from "@mui/material";
import SimpleSnackbar from "../general-components/SnackbarError";
import Link from "next/link";

import { useSnackBarError } from "../stors/snakebar-store";
import ShowListUsers from "./listUsers";
import ShowUser from "./ShowUser";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function USers() {
  const [idEdit, setIdEdit] = useState<string | null>(null);

  const [updateCount, setUpdateCount] = useState(0);

  const addMessage = useSnackBarError((state) => state.addMessage);

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
          <ShowListUsers
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
          {idEdit && <ShowUser id={idEdit} />}
        </Grid>
      </Grid>
    </Box>
  );
}
