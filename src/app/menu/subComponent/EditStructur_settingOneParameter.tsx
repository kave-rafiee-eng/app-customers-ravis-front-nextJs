"use client";

import React from "react";
import { Grid, Stack, TextField, Typography } from "@mui/material";
import { useMenuStore } from "../store/menu_store";

type NumberFieldKey =
  | "address"
  | "default"
  | "offset"
  | "addition"
  | "factor"
  | "minValue"
  | "maxValue";

const numberFields: { key: NumberFieldKey; label: string }[] = [
  { key: "address", label: "address" },
  { key: "default", label: "default" },
  { key: "offset", label: "offset" },
  { key: "addition", label: "addition" },
  { key: "factor", label: "factor" },
  { key: "minValue", label: "minValue" },
  { key: "maxValue", label: "maxValue" },
];

export default function EditStructur_settingOneParameter() {
  const structure = useMenuStore((state) => state.structureOneParameter);
  const setStructureOneParameter = useMenuStore(
    (state) => state.setStructureOneParameter,
  );

  const handleNumberChange =
    (field: NumberFieldKey) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      setStructureOneParameter({
        ...structure,
        [field]: Number.isNaN(value) ? 0 : value,
      });
    };

  const handleTextChange =
    (field: "unit" | "label") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setStructureOneParameter({
        ...structure,
        [field]: event.target.value,
      });
    };

  return (
    <Stack spacing={2} pt={2}>
      <Typography color="secondary" variant="h6">
        Structure
      </Typography>

      <Grid container spacing={2}>
        {numberFields.map((field) => (
          <Grid key={field.key} size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label={field.label}
              value={structure[field.key]}
              onChange={handleNumberChange(field.key)}
            />
          </Grid>
        ))}

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            label="unit"
            value={structure.unit}
            onChange={handleTextChange("unit")}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            label="label"
            value={structure.label}
            onChange={handleTextChange("label")}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
