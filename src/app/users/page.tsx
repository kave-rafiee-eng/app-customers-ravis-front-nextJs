"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SimpleSnackbar from "../general-components/SnackbarError";
import Link from "next/link";

import { useSnackBarError } from "../stors/snakebar-store";
import ShowListUsers from "./listUsers";
import ShowUser from "./ShowUser";
import { API_BACKEND } from "../constant";
import { userType } from "./type";
import { AxiosError, isAxiosError } from "axios";

import "react-phone-number-input/style.css";
import PhoneInput, {
  isPossiblePhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input";
import type { FlagProps } from "react-phone-number-input";

import styles from "./style.module.css";

const phoneLabels = {
  IR: "IRAN",
  country: "کشور",
  phone: "شماره موبایل",
};

function CountryNameFlag({ countryName }: FlagProps) {
  return <span className={styles.countryLabel}>{countryName}</span>;
}

export default function USers() {
  const [idEdit, setIdEdit] = useState<string | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [newUserPhone, setNewUserPhone] = useState<string | undefined>("");
  const [newUserName, setNewUserName] = useState("");

  const [phoneError, setPhoneError] = useState<string | null>(null);
  const addMessage = useSnackBarError((state) => state.addMessage);

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
    setNewUserPhone("");
    setNewUserName("");
  };

  function validatePhone(value: string | undefined) {
    if (!value) {
      return "شماره موبایل الزامی است";
    }
    if (!isPossiblePhoneNumber(value)) {
      return "شماره موبایل نامعتبر است";
    }
    return null;
  }

  const handleCreateUser = async () => {
    try {
      const res = await API_BACKEND.post("user", {
        name: newUserName,
        phone: newUserPhone,
      });

      if (res.status === 201) {
        addMessage("user created. id :" + res.data.id, "succes");
        handleCloseCreateModal();
        setUpdateCount((prev) => prev + 1);
      }
    } catch (err) {
      if (isAxiosError(err)) {
        const e: AxiosError = err;
        if (e.status === 409) {
          addMessage("Conflict user phone exist", "error");
        } else {
          addMessage("error", "error");
        }
      }
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
            size="small"
            startIcon={<AddOutlinedIcon />}
            onClick={() => setOpenCreateModal(true)}
            sx={{
              bgcolor: "white",
              color: "#1B3C53",
              fontWeight: 700,
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            new user
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

      <Dialog open={openCreateModal} onClose={handleCloseCreateModal}>
        <DialogTitle>create new user</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1, minWidth: 320 }}>
            <Typography
              component="label"
              variant="body2"
              className={styles.phoneLabel}
            >
              شماره موبایل
            </Typography>
            <PhoneInput
              placeholder="09123456789"
              value={newUserPhone}
              onChange={(value) => {
                console.log(value);
                setNewUserPhone(value);
                if (phoneError) {
                  setPhoneError(validatePhone(value));
                }
              }}
              onBlur={() => setPhoneError(validatePhone(newUserPhone))}
              countries={["IR"]}
              defaultCountry="IR"
              labels={phoneLabels}
              flagComponent={CountryNameFlag}
              className={`${styles.phoneInput}${phoneError ? ` ${styles.phoneInputError}` : ""}`}
              numberInputProps={{
                dir: "ltr",
                autoComplete: "tel",
                required: true,
              }}
            />
            {phoneError && (
              <FormHelperText error sx={{ mx: 1.75 }}>
                {phoneError}
              </FormHelperText>
            )}
            <TextField
              label="name"
              fullWidth
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateModal}>cancel</Button>
          <Button variant="contained" onClick={handleCreateUser}>
            create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
