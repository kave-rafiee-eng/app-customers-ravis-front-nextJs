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
import { errorCodeType, ErrorOriginEnum } from "./errorType";

type OriginFilter = "ALL" | ErrorOriginEnum;

type propsType = {
  onSelect: (code: string) => void;
  onDelet: (code: string) => void;
  allErrors: errorCodeType[];
  activeCode: string;
};

export default function ShowListErros({
  allErrors,
  onDelet,
  onSelect,
  activeCode,
}: propsType) {
  const [originFilter, setOriginFilter] = React.useState<OriginFilter>("ALL");

  const sortedErrors = [...allErrors]
    .filter((error) => originFilter === "ALL" || error.origin === originFilter)
    .sort((a, b) => Number(a.code) - Number(b.code));

  return (
    <Stack direction="column" spacing={1} sx={{ height: "100%", p: 1 }}>
      <FormControl size="small" fullWidth>
        <InputLabel id="origin-filter-label">origin</InputLabel>
        <Select
          labelId="origin-filter-label"
          label="origin"
          value={originFilter}
          onChange={(event) =>
            setOriginFilter(event.target.value as OriginFilter)
          }
        >
          <MenuItem value="ALL">All</MenuItem>
          <MenuItem value={ErrorOriginEnum.ONLY_ADVANCE}>
            {ErrorOriginEnum.ONLY_ADVANCE}
          </MenuItem>
          <MenuItem value={ErrorOriginEnum.ONLY_TERSE}>
            {ErrorOriginEnum.ONLY_TERSE}
          </MenuItem>
          <MenuItem value={ErrorOriginEnum.ADVANCE_TERSE}>
            {ErrorOriginEnum.ADVANCE_TERSE}
          </MenuItem>
        </Select>
      </FormControl>

      <Stack
        direction="column"
        spacing={0.5}
        sx={{ overflowY: "auto", flex: 1 }}
      >
        {sortedErrors.map((erCode) => {
          const isActive = activeCode === erCode.code;
          return (
            <Box
              key={erCode.code}
              onClick={() => onSelect(erCode.code)}
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
                    {erCode.code}
                  </Typography>

                  <Typography variant="h6" sx={{ fontSize: 10, color: "red" }}>
                    {erCode.origin}
                  </Typography>
                </Stack>

                <Typography
                  variant="body2"
                  sx={{
                    color: isActive ? "grey.200" : "text.secondary",
                  }}
                >
                  {erCode.name}
                </Typography>

                <IconButton
                  size="small"
                  aria-label="delete error code"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelet(erCode.code);
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

/*

 */
