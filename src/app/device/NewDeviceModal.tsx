"use client";

import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { API_BACKEND } from "../constant";
import { useSnackBarError } from "../stors/snakebar-store";

type propsType = {
  onSuccess: () => void;
  onClose: () => void;
};

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "92vw", sm: 440 },
  maxWidth: 440,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  outline: "none",
  borderRadius: 2,
};

export default function NewDeviceModal({ onSuccess, onClose }: propsType) {
  const addMessage = useSnackBarError((state) => state.addMessage);
  const [serial, setSerial] = useState("");
  const [saving, setSaving] = useState(false);

  const parsedSerial = Number(serial.trim());
  const isValidSerial =
    serial.trim() !== "" &&
    Number.isInteger(parsedSerial) &&
    parsedSerial >= 0;

  const handleSubmit = async () => {
    if (!isValidSerial) {
      addMessage("serial is required", "error");
      return;
    }

    setSaving(true);
    try {
      await API_BACKEND.post("user/devices", { serial: parsedSerial });
      addMessage("device added", "succes");
      onSuccess();
    } catch (err) {
      addMessage("failed to add device", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={style}>
      <Stack spacing={2.5}>
        <Typography variant="h6" fontWeight={700}>
          add new device
        </Typography>

        <TextField
          label="serial"
          type="number"
          fullWidth
          value={serial}
          onChange={(event) => setSerial(event.target.value)}
          disabled={saving}
          slotProps={{
            htmlInput: { min: 0, step: 1 },
          }}
        />

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button onClick={onClose} disabled={saving}>
            cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!isValidSerial || saving}
            sx={{ bgcolor: "#1B3C53", "&:hover": { bgcolor: "#152f42" } }}
          >
            {saving ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "add"
            )}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
