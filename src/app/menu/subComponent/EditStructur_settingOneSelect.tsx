"use client";

import React from "react";
import { Grid, Stack, TextField, Typography } from "@mui/material";
import { useMenuStore } from "../store/menu_store";

export default function EditStructur_settingOneSelect() {
  const structure = useMenuStore((state) => state.structureOneSelect);
  const setStructureOneSelect = useMenuStore(
    (state) => state.setStructureOneSelect,
  );

  const handleNumberChange =
    (field: "default" | "address") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      setStructureOneSelect({
        ...structure,
        [field]: Number.isNaN(value) ? 0 : value,
      });
    };

  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStructureOneSelect({
      ...structure,
      label: event.target.value,
    });
  };

  return (
    <Stack spacing={2} pt={2}>
      <Typography color="secondary" variant="h6">
        Structure
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label="address"
            value={structure.address}
            onChange={handleNumberChange("address")}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label="default"
            value={structure.default}
            onChange={handleNumberChange("default")}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            label="label"
            value={structure.label}
            onChange={handleLabelChange}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
