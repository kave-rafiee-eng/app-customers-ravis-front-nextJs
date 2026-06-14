"use client";

import React from "react";
import { MiniDescriptionType, optionType } from "../type/menu_type";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { TableBasic, TableBasicProps } from "../../tree/component/TableBasic";
import { useMenuStore } from "../store/menu_store";

type propsType = {
  editItem: boolean;
};

type optionsRow = {
  id: number;
  descibe: string;
  name: string;
};

const emptyOption: optionType = {
  value: "",
  description: {
    english: "",
    persian: "",
  },
};

export default function EditOptions({ editItem }: propsType) {
  const [optionLanguage, setOptionLanguage] = React.useState<
    "english" | "persian"
  >("english");

  const options = useMenuStore((state) =>
    editItem ? state.items : state.options,
  );
  const setOptionsList = useMenuStore((state) =>
    editItem ? state.setItems : state.setOptions,
  );

  const updateOption = (
    index: number,
    updater: (option: optionType) => optionType,
  ) => {
    setOptionsList(
      options.map((option, i) => (i === index ? updater(option) : option)),
    );
  };

  const handleAddOption = () => {
    setOptionsList([...options, { ...emptyOption }]);
  };

  const tableData: optionsRow[] = options.map((value, index) => ({
    id: index,
    descibe: value.description[optionLanguage] ?? "",
    name: value.value,
  }));

  const propsTable: TableBasicProps<optionsRow> = {
    columns: [
      {
        Width: "5%",
        id: "id",
        label: "delet ",
        render: (row) => {
          return (
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setOptionsList(options.filter((v, i) => i != row.id));
              }}
            >
              delet
            </Button>
          );
        },
      },
      {
        id: "name",
        label: "name",
        Width: "20%",
        render: (row) => {
          return (
            <TextField
              fullWidth
              size="small"
              value={row.name}
              dir="ltr"
              onChange={(event) => {
                const value = event.target.value;
                updateOption(row.id, (option) => ({
                  ...option,
                  value,
                }));
              }}
            />
          );
        },
      },
      {
        id: "descibe",
        label: () => {
          return (
            <Stack direction={"row"} spacing={1}>
              <FormControl sx={{ width: "100%", minWidth: 120 }}>
                <InputLabel id="option-language-label">language</InputLabel>
                <Select
                  size="small"
                  labelId="option-language-label"
                  id="option-language-select"
                  value={optionLanguage}
                  label="language"
                  onChange={(event) => {
                    setOptionLanguage(
                      event.target.value as "english" | "persian",
                    );
                  }}
                >
                  <MenuItem value="english">english</MenuItem>
                  <MenuItem value="persian">persian</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                size="small"
                onClick={handleAddOption}
              >
                add option
              </Button>
            </Stack>
          );
        },
        render: (row) => {
          return (
            <TextField
              fullWidth
              size="small"
              value={row.descibe}
              dir={optionLanguage === "persian" ? "rtl" : "ltr"}
              onChange={(event) => {
                const value = event.target.value;
                updateOption(row.id, (option) => ({
                  ...option,
                  description: {
                    ...option.description,
                    [optionLanguage as keyof MiniDescriptionType]: value,
                  },
                }));
              }}
            />
          );
        },
      },
    ],
    tableData,
  };

  return (
    <Stack spacing={1} sx={{ height: "100%" }}>
      <TableBasic
        height="100%"
        columns={propsTable.columns}
        tableData={propsTable.tableData}
      />
    </Stack>
  );
}
