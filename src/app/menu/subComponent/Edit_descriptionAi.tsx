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
import { useMenuStore } from "../store/menu_store";
import {
  translateEnglish,
  translateFull,
} from "@/app/general-components/translate";

type propsType = {};
export default function EditDescriptionAi({}: propsType) {
  const [languageSelect, setLanguageSelect] = React.useState("persian");
  const [translating, setTranslating] = React.useState(false);

  const description = useMenuStore((state) => state.descriptionAi);
  const setDescription = useMenuStore((state) => state.setDescriptionAi);

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
    setDescription(newDescrip);
  };

  const translate = async () => {
    if (translating == false) {
      setTranslating(true);

      try {
        const translate = await translateEnglish(description.persian);
        if (translate.english) {
          setDescription(translate);
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
        <Typography variant="h6">Additional Description For Ai </Typography>
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
