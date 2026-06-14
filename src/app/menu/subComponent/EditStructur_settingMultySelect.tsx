"use client";

import React from "react";
import { Stack, TextField, Typography } from "@mui/material";
import { useMenuStore } from "../store/menu_store";

function buildAddresses(startAddress: number, count: number) {
  return Array.from({ length: count }, (_, index) => startAddress + index);
}

export default function EditStructur_settingMultySelect() {
  const items = useMenuStore((state) => state.items);
  const structure = useMenuStore((state) => state.structureMultySelect);
  const setStructureMultySelect = useMenuStore(
    (state) => state.setStructureMultySelect,
  );

  const startAddress = structure.addresses[0] ?? 0;
  const itemCount = items.length;

  React.useEffect(() => {
    const nextAddresses = buildAddresses(startAddress, itemCount);
    const addressesChanged =
      nextAddresses.length !== structure.addresses.length ||
      nextAddresses.some((address, index) => address !== structure.addresses[index]);

    if (!addressesChanged) return;

    const defaults = [...structure.defaults];
    while (defaults.length < itemCount) defaults.push(0);

    setStructureMultySelect({
      defaults: defaults.slice(0, itemCount),
      addresses: nextAddresses,
    });
  }, [itemCount, startAddress]);

  const handleStartAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = Number(event.target.value);
    const start = Number.isNaN(value) ? 0 : value;

    setStructureMultySelect({
      defaults: structure.defaults,
      addresses: buildAddresses(start, itemCount),
    });
  };

  return (
    <Stack spacing={2} pt={2}>
      <Typography color="secondary" variant="h6">
        Structure
      </Typography>

      <TextField
        size="small"
        type="number"
        label="start address"
        value={startAddress}
        onChange={handleStartAddressChange}
        sx={{ maxWidth: 240 }}
        helperText={`${itemCount} item(s) → addresses generated automatically`}
      />

      {itemCount > 0 && (
        <Typography variant="body2" color="text.secondary">
          addresses: {structure.addresses.join(", ")}
        </Typography>
      )}
    </Stack>
  );
}
