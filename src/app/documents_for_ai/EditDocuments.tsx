"use client";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { MiniDescriptionType } from "../menu/type/menu_type";
import { API_BACKEND } from "../constant";
import { useSnackBarError } from "../stors/snakebar-store";
import { END_POINT_AI_DOCUMENTS } from "./constant";
import { translateEnglish } from "../general-components/translate";

type LanguageType = keyof MiniDescriptionType;

type DocumentType = {
  id: string;
  category: string;
  title: MiniDescriptionType;
  header: MiniDescriptionType;
  content: MiniDescriptionType;
};

type propsType = {
  idEdit: string;
  onUpdate: () => void;
};
export default function EditDocument({ idEdit, onUpdate }: propsType) {
  const addMessage = useSnackBarError((state) => state.addMessage);

  const [document, setDocument] = useState<DocumentType>();
  const [language, setLanguage] = useState<LanguageType>("persian");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [translate, SetTranslate] = useState(false);
  const [translateProgress, setTranslateProgress] = useState(0);
  const translateTotalStep = useRef(0);

  const loadDocument = async () => {
    setLoading(true);
    try {
      const res = await API_BACKEND.get<DocumentType>(
        END_POINT_AI_DOCUMENTS + "/" + idEdit,
      );

      setDocument(res.data);

      console.log(res.data);
    } catch (err) {
      console.log(err);
      addMessage("can not load document", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocument();
  }, [idEdit]);

  const handleMiniDescriptionChange = (
    field: "title" | "header" | "content",
    value: string,
  ) => {
    setDocument((prev) => {
      if (prev == null) return prev;

      return {
        ...prev,
        [field]: {
          ...prev[field],
          [language]: value,
        },
      };
    });
  };

  const handleTranslte = async () => {
    if (document == null || translate) return;

    const fields: Array<"title" | "header" | "content"> = [
      "title",
      "header",
      "content",
    ];
    const fieldsToTranslate = fields.filter((field) =>
      document[field].persian?.trim(),
    );

    if (fieldsToTranslate.length === 0) {
      addMessage("Persian text is required for translation", "error");
      return;
    }

    translateTotalStep.current = fieldsToTranslate.length;
    setTranslateProgress(0);
    SetTranslate(true);

    try {
      const updatedDocument: DocumentType = { ...document };

      for (const field of fieldsToTranslate) {
        const persian = document[field].persian.trim();
        const translated = await translateEnglish(persian);

        updatedDocument[field] = {
          persian,
          english: translated.english ?? "",
        };
        setTranslateProgress((prev) => prev + 1);
      }

      setDocument(updatedDocument);
      setLanguage("english");
      addMessage("Translation completed", "succes");
    } catch (err) {
      console.log(err);
      addMessage("connection Error", "error");
    } finally {
      SetTranslate(false);
      setTranslateProgress(0);
    }
  };

  const handleSave = async () => {
    if (document == null) return;

    if (!document.title.persian?.trim() && !document.title.english?.trim()) {
      addMessage("title is required", "error");
      return;
    }

    setSaving(true);
    try {
      await API_BACKEND.patch(`${END_POINT_AI_DOCUMENTS}/${idEdit}`, {
        ...document,
      });
      addMessage("document saved", "succes");
      onUpdate();
    } catch (err) {
      console.log(err);
      addMessage("failed to save document", "error");
    } finally {
      setSaving(false);
    }
  };

  const isRtl = language === "persian";

  if (loading && document == null) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
        loading...
      </Typography>
    );
  }

  if (document == null) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
        select a document
      </Typography>
    );
  }

  return (
    <Box sx={{ height: "100%" }}>
      <Stack spacing={2} sx={{ height: "100%" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Typography variant="h6" fontWeight={700}>
            edit document
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel id="edit-document-language-label">
                language
              </InputLabel>
              <Select
                labelId="edit-document-language-label"
                label="language"
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value as LanguageType)
                }
                disabled={saving || translate}
              >
                <MenuItem value="persian">persian</MenuItem>
                <MenuItem value="english">english</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving || loading || translate}
            >
              {saving ? "saving..." : "save"}
            </Button>

            <Button
              variant="contained"
              onClick={handleTranslte}
              disabled={saving || loading || translate}
            >
              {translate ? "translating..." : "translate"}
            </Button>
          </Stack>
        </Stack>

        {translate && (
          <Box sx={{ width: "100%" }}>
            <Typography variant="body2" textAlign="center" gutterBottom>
              Translating... {translateProgress} / {translateTotalStep.current}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={
                translateTotalStep.current > 0
                  ? (translateProgress / translateTotalStep.current) * 100
                  : 0
              }
              sx={{ height: 8, borderRadius: 1 }}
            />
          </Box>
        )}

        <Typography>Category : {document.category}</Typography>

        <TextField
          size="small"
          fullWidth
          label={`title (${language})`}
          value={document.title[language] ?? ""}
          onChange={(event) =>
            handleMiniDescriptionChange("title", event.target.value)
          }
          disabled={saving || translate}
          dir={isRtl ? "rtl" : "ltr"}
        />

        <TextField
          size="small"
          fullWidth
          label={`header (${language})`}
          value={document.header[language] ?? ""}
          onChange={(event) =>
            handleMiniDescriptionChange("header", event.target.value)
          }
          disabled={saving || translate}
          dir={isRtl ? "rtl" : "ltr"}
        />

        <TextField
          fullWidth
          multiline
          minRows={8}
          label={`content (${language})`}
          value={document.content[language] ?? ""}
          onChange={(event) =>
            handleMiniDescriptionChange("content", event.target.value)
          }
          disabled={saving || translate}
          dir={isRtl ? "rtl" : "ltr"}
          sx={{ flex: 1 }}
        />
      </Stack>
    </Box>
  );
}
