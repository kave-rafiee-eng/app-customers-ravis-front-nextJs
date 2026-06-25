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
import { useEffect, useState } from "react";
import { API_BACKEND } from "../constant";
import { useSnackBarError } from "../stors/snakebar-store";
import { MiniDescriptionType } from "../menu/type/menu_type";
import {
  END_POINT_AI_DOCUMENTS,
  END_POINT_AI_DOCUMENTS_CATEGORY,
} from "./constant";

type propsType = {
  onSuccess: (newID: string) => void;
  onClose: () => void;
};

type CreateAiDocumentPayload = {
  category: string;
  title: MiniDescriptionType;
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
};

export default function NewDocumentModal({ onSuccess, onClose }: propsType) {
  const addMessage = useSnackBarError((state) => state.addMessage);

  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [titlePersian, setTitlePersian] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await API_BACKEND.get<string[]>(
          END_POINT_AI_DOCUMENTS_CATEGORY,
        );
        setCategories(res.data);
        if (res.data.length > 0) {
          setCategory(res.data[0]);
        }
      } catch (err) {
        console.log(err);
        addMessage("can not load categories", "error");
      }
    };

    loadCategories();
  }, [addMessage]);

  const handleSubmit = async () => {
    if (!category) {
      addMessage("category is required", "error");
      return;
    }

    const persian = titlePersian.trim();

    if (!persian) {
      addMessage("title is required ( persian)", "error");
      return;
    }

    const payload: CreateAiDocumentPayload = {
      category,
      title: {
        english: "",
        persian,
      },
    };

    setSaving(true);
    try {
      const response = await API_BACKEND.post<{ id: string }>(
        END_POINT_AI_DOCUMENTS,
        payload,
      );
      addMessage("document created", "succes");
      onSuccess(response.data.id);
      onClose();
    } catch (err) {
      console.log(err);
      addMessage("failed to create document", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={style}>
      <Stack spacing={2.5}>
        <Typography variant="h6" fontWeight={700}>
          new document
        </Typography>

        <FormControl size="small" fullWidth>
          <InputLabel id="new-document-category-label">category</InputLabel>
          <Select
            labelId="new-document-category-label"
            label="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            disabled={saving}
          >
            {categories.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          fullWidth
          label="title (persian)"
          value={titlePersian}
          onChange={(event) => setTitlePersian(event.target.value)}
          disabled={saving}
          dir="rtl"
        />

        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button variant="outlined" onClick={onClose} disabled={saving}>
            cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving}>
            {saving ? "creating..." : "create"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
