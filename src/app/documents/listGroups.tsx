"use client";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { GroupDocType } from "./documentsType";

type propsType = {
  onSelect: (code: string) => void;
  onDelet: (code: string) => void;
  listGroups: GroupDocType[];
  activeId: string;
};

export default function ShowListGroupDoc({
  listGroups,
  onDelet,
  onSelect,
  activeId,
}: propsType) {
  return (
    <Stack direction="column" spacing={1} sx={{ height: "100%", p: 1 }}>
      <Stack
        direction="column"
        spacing={0.5}
        sx={{ overflowY: "auto", flex: 1 }}
      >
        {listGroups.map((GroupDoc) => {
          const isActive = activeId === GroupDoc.id;
          return (
            <Box
              key={GroupDoc.id}
              onClick={() => onSelect(GroupDoc.id)}
              sx={{
                cursor: "pointer",
                border: "1px solid",
                borderColor: isActive ? "#1B3C53" : "divider",
                bgcolor: isActive ? "#1B3C53" : "background.paper",
                color: isActive ? "common.white" : "text.primary",
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
              >
                <Stack spacing={0.25}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {GroupDoc.id.slice(
                      GroupDoc.id.length - 4,
                      GroupDoc.id.length,
                    )}
                  </Typography>
                </Stack>

                <Typography
                  variant="h6"
                  fontWeight={300}
                  fontSize={20}
                  fontFamily={"ui-rounded"}
                  sx={{
                    color: isActive ? "grey.200" : "text.primiry",
                  }}
                >
                  {GroupDoc.category.persian}
                </Typography>

                <IconButton
                  size="small"
                  aria-label="delete error code"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelet(GroupDoc.id);
                  }}
                  sx={{
                    color: isActive ? "common.white" : "error.main",
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
}
