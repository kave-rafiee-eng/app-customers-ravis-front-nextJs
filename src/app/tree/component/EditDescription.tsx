import React from "react";
import { menuType, DescriptionType } from "../type/menu-type";
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
} from "@mui/material";
import axios from "axios";
import { useSnackBarError } from "../snakebar-store";

type propsType = {
    description: DescriptionType;
    setDescription: (language: DescriptionType) => void;
};
export default function EditDescription({
    description,
    setDescription,
}: propsType) {
    const [languageSelect, setLanguageSelect] = React.useState("persian");

    const [translating, setTranslating] = React.useState(false);

    const addError = useSnackBarError((state) => state.addError);

    let languages = Object.keys(description);

    const handleChangeSelectLanguage = (event: any) => {
        setLanguageSelect(event.target.value);
    };

    const handleChageDescription = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        let newDescrip = { ...description };
        newDescrip[languageSelect as keyof typeof description] =
            event.target.value;
        setDescription(newDescrip);
    };

    const translate = async () => {
        if (translating == false) {
            setTranslating(true);
            const api = axios.create({
                baseURL: "http://localhost:8000",
            });
            try {
                const resault = await api.post("/translate", {
                    text: description.persian,
                });
                console.log(resault.data);
                const translate: DescriptionType = resault.data;
                setDescription(translate);
            } catch (err) {
                console.log(err);
                addError("connection Error");
            }
            setTranslating(false);
        }
    };

    let rtl = false;
    if (languageSelect == "persian" || languageSelect == "arabic") rtl = true;

    return (
        <Stack direction={"column"} spacing={2} pt={2}>
            <Stack direction={"row"} spacing={2}>
                <FormControl
                    sx={{
                        width: "20%",
                    }}
                >
                    <InputLabel id="demo-simple-select-label">
                        language
                    </InputLabel>
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
                    auto translate
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
