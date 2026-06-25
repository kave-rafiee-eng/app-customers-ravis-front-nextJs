"use client";

import React from "react";
import { MiniDescriptionType, optionType } from "../type/menu_type";
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
import {
  TableBasic,
  TableBasicProps,
} from "@/app/general-components/TableBasic";

import { useMenuStore } from "../store/menu_store";
import { translateEnglish } from "@/app/general-components/translate";
import { useSnackBarError } from "@/app/stors/snakebar-store";

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
  const addMessage = useSnackBarError((state) => state.addMessage);

  const [optionLanguage, setOptionLanguage] = React.useState<
    "english" | "persian"
  >("english");

  const options = useMenuStore((state) =>
    editItem ? state.items : state.options,
  );
  const setOptionsList = useMenuStore((state) =>
    editItem ? state.setItems : state.setOptions,
  );

  const [translate, setTranslate] = React.useState(false);
  const [translateProgress, setTranslateProgress] = React.useState(0);
  const translateTotalStep = React.useRef(0);

  const handleTranslte = async () => {
    setTranslate(true);

    let newOptions = [...options];

    try {
      translateTotalStep.current = newOptions.length;
      setTranslateProgress(0);

      for (let i = 0; i < newOptions.length; i++) {
        const description = await translateEnglish(
          newOptions[i].description.persian,
        );
        newOptions[i].description.english = description.english;
        setTranslateProgress((prev) => prev + 1);
      }
      setOptionsList(newOptions);
    } catch (err) {
      addMessage("translating Error", "error");
    }

    setTranslate(false);
  };

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

              <Button variant="contained" size="small" onClick={handleTranslte}>
                translate
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
      {!translate && (
        <TableBasic
          height="100%"
          columns={propsTable.columns}
          tableData={propsTable.tableData}
        />
      )}
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
    </Stack>
  );
}
