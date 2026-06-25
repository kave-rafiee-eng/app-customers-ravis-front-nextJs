import React from "react";
import {
  menuType,
  DescriptionType,
  MiniDescriptionType,
} from "../type/menu_type";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackBarError } from "../../stors/snakebar-store";
import { translateFull } from "@/app/general-components/translate";

type propsType = {
  description: DescriptionType;
  setDescription: (set: (prev: DescriptionType) => DescriptionType) => void;
};
export default function EditDescription({
  description,
  setDescription,
}: propsType) {
  const [languageSelect, setLanguageSelect] = React.useState("persian");

  const [translating, setTranslating] = React.useState(false);

  const addMessage = useSnackBarError((state) => state.addMessage);

  let languages = Object.keys(description);

  const handleChangeSelectLanguage = (event: any) => {
    setLanguageSelect(event.target.value);
  };

  const handleChageDescription = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let newDescrip = { ...description };
    newDescrip[languageSelect as keyof typeof description] = event.target.value;
    setDescription(() => {
      return newDescrip;
    });
  };

  const translate = async () => {
    if (translating == false) {
      setTranslating(true);

      try {
        const translate = await translateFull(description.persian);
        if (
          translate.arabic &&
          translate.english &&
          translate.german &&
          translate.german &&
          translate.persian &&
          translate.russian &&
          translate.turkish
        ) {
          setDescription(() => {
            return translate;
          });
        } else addMessage("Error structure", "error");
      } catch (err) {
        console.log(err);
        addMessage("connection Error", "error");
      }
      setTranslating(false);
    }
  };

  let rtl = false;
  if (languageSelect == "persian" || languageSelect == "arabic") rtl = true;

  return (
    <Stack direction={"column"} spacing={2} pt={2}>
      <Stack direction={"row"} spacing={2}>
        <Typography color="secondary" variant="h6">
          For User
        </Typography>
        <FormControl
          sx={{
            width: "20%",
          }}
        >
          <InputLabel id="demo-simple-select-label">language</InputLabel>
          <Select
            size="small"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={languageSelect}
            label="language"
            onChange={handleChangeSelectLanguage}
          >
            {languages.map((lan, index) => {
              return (
                <MenuItem key={index} value={lan}>
                  {lan}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          size="small"
          onClick={translate}
          disabled={translating ? true : false}
        >
          translate
        </Button>
      </Stack>

      <TextField
        multiline
        minRows={3}
        maxRows={10}
        onChange={handleChageDescription}
        value={description[languageSelect as keyof typeof description]}
        variant="filled"
        sx={{
          direction: rtl ? "rtl" : "ltr",
        }}
        disabled={translating ? true : false}
      ></TextField>
    </Stack>
  );
}
