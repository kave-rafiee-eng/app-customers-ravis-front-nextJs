"use client";
import React from "react";
import { MiniDescriptionType, optionType } from "../type/menu-type";
import { TableBasic, TableBasicProps } from "./TableBasic";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";

type propsType = {
    options: optionType[];
    setOptions: (set: (prev: optionType[]) => optionType[]) => void;
};

export default function EditOptions({ options, setOptions }: propsType) {
    const [optionLanguage, setOptionLanguage] = React.useState<
        "english" | "persian"
    >("english");

    type optionsRow = {
        id: number;
        descibe: string;
        name: string;
    };

    const tableData: optionsRow[] = options.map((value, index) => ({
        id: index,
        descibe: value.description[optionLanguage],
        name: value.value,
    }));

    const propsTable: TableBasicProps<optionsRow> = {
        columns: [
            // {
            //     id: "id",
            //     label: "c",
            //     Width: "10%",
            // },
            {
                id: "name",
                label: "name",
                Width: "20%",
            },
            {
                id: "descibe",
                label: () => {
                    return (
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
                                value={optionLanguage}
                                label="language"
                                onChange={(event) => {
                                    setOptionLanguage(event.target.value);
                                }}
                            >
                                <MenuItem value={"english"}>english</MenuItem>
                                <MenuItem value={"persian"}>persian</MenuItem>
                            </Select>
                        </FormControl>
                    );
                },
                render: (row) => {
                    return (
                        <TextField
                            fullWidth
                            size="small"
                            value={row.descibe}
                            dir={optionLanguage == "persian" ? "rtl" : "ltr"}
                            onChange={(event) => {
                                setOptions((prev) => {
                                    return prev.map((option, index) => {
                                        if (index == row.id)
                                            return {
                                                value: option.value,
                                                description: {
                                                    ...option.description,
                                                    [optionLanguage as keyof MiniDescriptionType]:
                                                        event.target.value,
                                                },
                                            };
                                        else return option;
                                    });
                                });
                            }}
                        ></TextField>
                    );
                },
            },
        ],
        tableData: tableData,
    };

    return (
        <TableBasic
            height={"100%"}
            columns={propsTable.columns}
            tableData={propsTable.tableData}
        ></TableBasic>
    );
}

/*
                                /*
                                setSetting((prev) => {
                                    return {
                                        ...prev,
                                        options: prev.options.map(
                                            (option, index) => {
                                                if (index == row.id)
                                                    return {
                                                        value: option.value,
                                                        description: {
                                                            ...option.description,
                                                            [optionLanguage as keyof MiniDescriptionType]:
                                                                event.target
                                                                    .value,
                                                        },
                                                    };
                                                else return option;
                                            },
                                        ),
                                    };
                                });*/
