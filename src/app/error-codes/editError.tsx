"use client";
import axios from "axios";
import React from "react";
import { errorCodeType, ErrorOriginEnum } from "./errorType";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";
import {
    DescriptionType,
    MiniDescriptionType,
} from "@/app/menu/type/menu_type";

import EditDescription from "../menu/subComponent/EditDescriptionLocal";
import EditDescriptionAi from "../menu/subComponent/EditDescriptionAiLocal";
import { useSnackBarError } from "../stors/snakebar-store";
import { API_BACKEND } from "../constant";

type propsType = {
    onUpdate: () => void;
    code: string;
};

export default function EditErrorCode({ code, onUpdate }: propsType) {
    const addMessage = useSnackBarError((state) => state.addMessage);
    const [ErrorCode, setErrorCode] = React.useState<errorCodeType | null>();
    const [tab, setTab] = React.useState("Description");
    const [saving, setSaving] = React.useState(false);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTab(newValue);
    };

    const loadData = async () => {
        try {
            const response = await API_BACKEND.get(`/error-code/${code}`);
            setErrorCode((prev) => {
                return response.data;
            });
            console.log(`get Error id : ${code}`);
            console.log(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    React.useEffect(() => {
        loadData();
    }, [code]);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setErrorCode((prev) => {
            if (prev == null) return null;
            return { ...prev, name: value };
        });
    };

    const handleSave = async () => {
        if (ErrorCode == null) return;
        if (ErrorCode.name.length < 2) {
            addMessage("Name must be at least 2 characters", "error");
            return;
        }

        setSaving(true);
        try {
            await API_BACKEND.patch(`/error-code/${code}`, {
                ...ErrorCode,
            });
            addMessage("Saved", "succes");
            onUpdate();
        } catch (err) {
            console.log(err);
            addMessage("connection error", "error");
        } finally {
            setSaving(false);
        }
    };

    let descrption: DescriptionType | null = null;
    let setDescription:
        | ((set: (prev: DescriptionType) => DescriptionType) => void)
        | undefined = undefined;

    let solution: DescriptionType | null = null;
    let setSolution:
        | ((set: (prev: DescriptionType) => DescriptionType) => void)
        | undefined = undefined;

    let descrptionForAi: MiniDescriptionType | null = null;
    let setDescrptionForAi:
        | ((set: (prev: MiniDescriptionType) => MiniDescriptionType) => void)
        | undefined = undefined;

    if (ErrorCode != null) {
        descrptionForAi = ErrorCode.additional_description_for_ai_assistant;
        setDescrptionForAi = (set) => {
            setErrorCode((prev) => {
                if (prev == null) return null;
                let newDes = set(prev.additional_description_for_ai_assistant!);

                return {
                    ...prev,
                    additional_description_for_ai_assistant: newDes,
                };
            });
        };

        descrption = ErrorCode.description;
        setDescription = (set) => {
            setErrorCode((prev) => {
                if (prev == null) return null;
                let newDes = set(prev.description!);

                return {
                    ...prev,
                    description: newDes,
                };
            });
        };

        solution = ErrorCode.solution;
        setSolution = (set) => {
            setErrorCode((prev) => {
                if (prev == null) return null;
                let newValue = set(prev.solution!);

                return {
                    ...prev,
                    solution: newValue,
                };
            });
        };
    }

    return (
        <>
            {" "}
            <Box sx={{ width: "100%", height: "80%" }}>
                <Stack
                    sx={{ width: "100%", minWidth: "15%" }}
                    direction={"row"}
                    justifyContent={"space-evenly"}
                    marginBottom={"5%"}
                    spacing={1}
                >
                    <TextField
                        label="name"
                        size="small"
                        value={ErrorCode?.name ?? ""}
                        onChange={handleNameChange}
                        disabled={ErrorCode == null}
                        sx={{ flex: 1, marginRight: "10%" }}
                    />

                    {ErrorCode != null && (
                        <FormControl size="small">
                            <InputLabel id="origin-filter-label">
                                origin
                            </InputLabel>
                            <Select
                                labelId="origin-filter-label"
                                label="origin"
                                value={ErrorCode.origin}
                                onChange={(event) => {
                                    setErrorCode((prev) => {
                                        if (prev == null) return prev;
                                        else
                                            return {
                                                ...prev,
                                                origin: event.target
                                                    .value as ErrorOriginEnum,
                                            };
                                    });
                                }}
                                size={"small"}
                            >
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
                    )}

                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleSave}
                        disabled={ErrorCode == null || saving}
                    >
                        {saving ? "saving..." : "save"}
                    </Button>
                </Stack>

                <Tabs
                    value={tab}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                >
                    <Tab value="Description" label="Description" />
                    <Tab value="Solution" label="Solution" />
                    <Tab value="AI" label="AI" />
                </Tabs>

                <div
                    hidden={tab != "Description"}
                    style={{
                        width: "100%",
                        height: "80%",
                        maxHeight: "80%",
                        overflowY: "auto",
                    }}
                >
                    Reason
                    {descrption != null && setDescription != null ? (
                        <EditDescription
                            description={descrption}
                            setDescription={setDescription}
                        />
                    ) : (
                        "error"
                    )}
                </div>
                <div
                    hidden={tab != "Solution"}
                    style={{
                        width: "100%",
                        height: "80%",
                        maxHeight: "80%",
                    }}
                >
                    Solution
                    {solution != null && setSolution != null ? (
                        <EditDescription
                            description={solution}
                            setDescription={setSolution}
                        />
                    ) : (
                        "error"
                    )}
                </div>

                <div
                    hidden={tab != "AI"}
                    style={{
                        width: "100%",
                        height: "80%",
                        maxHeight: "80%",
                    }}
                >
                    {descrptionForAi != null && setDescrptionForAi != null ? (
                        <EditDescriptionAi
                            description={descrptionForAi}
                            setDescription={setDescrptionForAi}
                        />
                    ) : (
                        "error"
                    )}
                </div>
            </Box>
        </>
    );
}
