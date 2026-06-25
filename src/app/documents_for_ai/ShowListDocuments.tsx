"use client";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { API_BACKEND } from "../constant";
import { useSnackBarError } from "../stors/snakebar-store";
import { MiniDescriptionType } from "../menu/type/menu_type";
import {
  END_POINT_AI_DOCUMENTS,
  END_POINT_AI_DOCUMENTS_CATEGORY,
  END_POINT_AI_DOCUMENTS_TITLE,
} from "./constant";

type propsType = {
  onEdit: (id: string | null) => void;
  activeId: string | null;
  update: number;
};

type DocumentTitleType = {
  id: string;
  title: MiniDescriptionType;
};

function getTitleLabel(title?: MiniDescriptionType) {
  if (!title) return "no title";
  return title.persian?.trim() || title.english?.trim() || "no title";
}

export default function ShowListDocuments({
  onEdit,
  activeId,
  update,
}: propsType) {
  const addMessage = useSnackBarError((state) => state.addMessage);

  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [documents, setDocuments] = useState<DocumentTitleType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await API_BACKEND.get<string[]>(
          END_POINT_AI_DOCUMENTS_CATEGORY,
        );
        setCategories(res.data);
        setCategoryFilter(res.data[0]);
      } catch (err) {
        console.log(err);
        addMessage("can not load categories", "error");
      }
    };

    loadCategories();
  }, [addMessage]);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter) params.set("category", categoryFilter);

      if (search.trim()) {
        params.set("search", search.trim());
      }

      const query = params.toString();
      const url = query
        ? `${END_POINT_AI_DOCUMENTS_TITLE}?${query}`
        : END_POINT_AI_DOCUMENTS_TITLE;

      const res = await API_BACKEND.get<DocumentTitleType[]>(url);
      setDocuments(res.data);

      console.log(res.data);
    } catch (err) {
      console.log(err);
      addMessage("can not load documents", "error");
    } finally {
      setLoading(false);
    }
  }, [addMessage, categoryFilter, search, update]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments, update]);

  const handleDelete = async (
    id: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();

    try {
      await API_BACKEND.delete(`${END_POINT_AI_DOCUMENTS}/${id}`);
      addMessage("document deleted", "succes");
      onEdit(null);
      await loadDocuments();
    } catch (err) {
      console.log(err);
      addMessage("failed to delete document", "error");
    }
  };

  return (
    <Stack direction="column" spacing={1} sx={{ height: "100%", p: 1 }}>
      {categories && (
        <FormControl size="small" fullWidth>
          <InputLabel id="category-filter-label">category</InputLabel>
          <Select
            labelId="category-filter-label"
            label="category"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <TextField
        size="small"
        fullWidth
        label="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="search by title..."
      />

      <Stack
        direction="column"
        spacing={0.5}
        sx={{ overflowY: "auto", flex: 1 }}
      >
        {loading && documents.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
            loading...
          </Typography>
        ) : documents.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
            no documents found
          </Typography>
        ) : (
          documents.map((document) => {
            const isActive = activeId === document.id;
            const titleLabel = getTitleLabel(document.title);

            return (
              <Box
                key={document.id}
                onClick={() => onEdit(document.id)}
                sx={{
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: isActive ? "#1B3C53" : "divider",
                  bgcolor: isActive ? "#1B3C53" : "background.paper",
                  color: isActive ? "common.white" : "text.primary",
                  borderRadius: 1,
                  transition: "all 0.15s ease",
                  "&:hover": {
                    borderColor: "#1B3C53",
                  },
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ px: 1.5, py: 1 }}
                  spacing={1}
                >
                  <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      noWrap
                      sx={{
                        direction: "rtl",
                        unicodeBidi: "plaintext",
                      }}
                    >
                      {titleLabel}
                    </Typography>
                    {document.title?.english &&
                      document.title.english !== titleLabel && (
                        <Typography
                          variant="caption"
                          noWrap
                          sx={{
                            color: isActive ? "grey.300" : "text.secondary",
                          }}
                        >
                          {document.title.english}
                        </Typography>
                      )}
                  </Stack>

                  <IconButton
                    size="small"
                    aria-label="delete document"
                    onClick={(event) => handleDelete(document.id, event)}
                    sx={{
                      color: isActive ? "common.white" : "error.main",
                      flexShrink: 0,
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
            );
          })
        )}
      </Stack>
    </Stack>
  );
}
