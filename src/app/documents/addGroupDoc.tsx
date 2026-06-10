"use client";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { useSnackBarError } from "../stors/snakebar-store";
import { DescriptionType, MiniDescriptionType } from "../tree/type/menu-type";
import { backendUrl } from "../constant";
import { CreateGroupDocType, GroupDocType } from "./documentsType";

const api = axios.create({
  baseURL: backendUrl,
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type PropsType = {
  onClose: () => void;
  onSuccess: (groupDoc: GroupDocType) => void;
  listGroups: GroupDocType[];
};

export default function AddGroupDoc({
  onClose,
  onSuccess,
  listGroups,
}: PropsType) {
  const addMessage = useSnackBarError((state) => state.addMessage);
  const [category, setCategory] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(event.target.value);
  };

  const handleSubmit = async () => {
    if (category === "") {
      addMessage("Name is required", "error");
      return;
    }

    if (category.length < 2) {
      addMessage("Name must be at least 2 characters", "error");
      return;
    }

    let fIndex = listGroups.findIndex((v) => v.category.persian === category);
    if (fIndex != -1) {
      addMessage("Failed name already exist", "error");
      return;
    }

    const emptyDescription: DescriptionType = {
      english: "",
      persian: category,
      arabic: "",
      turkish: "",
      russian: "",
      german: "",
    };

    const payload: CreateGroupDocType = {
      category: emptyDescription,
      files: null,
    };

    setSaving(true);

    try {
      const response = await api.post<GroupDocType>("/documents", payload);
      console.log(response.data);
      addMessage("Group Doc created successfully", "succes");
      onSuccess(response.data);
      onClose();
    } catch (err) {
      console.log(err);
      addMessage("Failed to create Group Doc", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={style} display="flex" flexDirection="column" gap={2}>
      <Typography variant="h6" fontWeight={700}>
        Add New Group documents
      </Typography>

      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography sx={{ minWidth: 48 }}>
            category name in persian :
          </Typography>
          <TextField
            dir="rtl"
            // type="number"
            size="small"
            fullWidth
            value={category}
            onChange={handleCategoryChange}
            // slotProps={{
            //   htmlInput: { min: 0, max: 100, step: 1 },
            // }}
            // helperText="Enter a number between 0 and 100"
          />
        </Stack>
      </Stack>

      <Stack direction="row" justifyContent="flex-end" spacing={1}>
        <Button variant="outlined" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Create"}
        </Button>
      </Stack>
    </Box>
  );
}
