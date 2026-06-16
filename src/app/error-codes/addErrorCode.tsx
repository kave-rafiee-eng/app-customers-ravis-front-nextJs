"use client";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { useSnackBarError } from "../stors/snakebar-store";
import {
    DescriptionType,
    MiniDescriptionType,
} from "@/app/menu/type/menu_type";
import { errorCodeType, ErrorOriginEnum } from "./errorType";
import { API_BACKEND } from "../constant";

const emptyDescription: DescriptionType = {
    english: "",
    persian: "",
    arabic: "",
    turkish: "",
    russian: "",
    german: "",
};

const emptyMiniDescription: MiniDescriptionType = {
    english: "",
    persian: "",
};

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

type AddErrorCodeProps = {
    onClose: () => void;
    onSuccess: (error: errorCodeType) => void;
    allErrors: errorCodeType[];
};

export default function AddErrorCode({
    onClose,
    onSuccess,
    allErrors,
}: AddErrorCodeProps) {
    const addMessage = useSnackBarError((state) => state.addMessage);
    const [newCode, setNewCode] = React.useState<number | "">("");
    const [name, setName] = React.useState("");
    const [saving, setSaving] = React.useState(false);
    const [newOrigin, setNewOrigin] = React.useState<ErrorOriginEnum>(
        ErrorOriginEnum.ADVANCE_TERSE,
    );

    const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value === "") {
            setNewCode("");
            return;
        }

        const num = Number(value);
        if (!Number.isNaN(num) && num >= 0 && num <= 100) {
            setNewCode(num);
        }
    };

    const handleSubmit = async () => {
        if (newCode === "") {
            addMessage("Code is required", "error");
            return;
        }

        // const trimmedName = name.trim();
        const trimmedName = name;

        if (trimmedName.length < 2) {
            addMessage("Name must be at least 2 characters", "error");
            return;
        }

        let fIndex = allErrors.findIndex((v) => v.code === newCode.toString());
        if (fIndex != -1) {
            addMessage("Failed code exist", "error");
            return;
        }

        const payload: errorCodeType = {
            code: String(newCode),
            origin: newOrigin,
            name: trimmedName,
            description: emptyDescription,
            solution: emptyDescription,
            additional_description_for_ai_assistant: emptyMiniDescription,
        };

        setSaving(true);

        try {
            const response = await API_BACKEND.post<errorCodeType>(
                "/error-code",
                payload,
            );
            console.log(response.data);
            addMessage("Error code created successfully", "succes");
            onSuccess(response.data);
            onClose();
        } catch (err) {
            console.log(err);
            addMessage("Failed to create error code", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box sx={style} display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6" fontWeight={700}>
                Add New Error Code
            </Typography>

            <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography sx={{ minWidth: 48 }}>code :</Typography>
                    <TextField
                        type="number"
                        size="small"
                        fullWidth
                        value={newCode}
                        onChange={handleCodeChange}
                        slotProps={{
                            htmlInput: { min: 0, max: 100, step: 1 },
                        }}
                        helperText="Enter a number between 0 and 100"
                    />
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography sx={{ minWidth: 48 }}>name :</Typography>
                    <TextField
                        size="small"
                        fullWidth
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        helperText="At least 2 characters"
                    />
                </Stack>

                <FormControl size="small" fullWidth>
                    <InputLabel id="origin-filter-label">origin</InputLabel>
                    <Select
                        labelId="origin-filter-label"
                        label="origin"
                        value={newOrigin}
                        onChange={(event) =>
                            setNewOrigin(event.target.value as ErrorOriginEnum)
                        }
                    >
                        <MenuItem value="ALL">All</MenuItem>
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
            </Stack>

            <Stack direction="row" justifyContent="flex-end" spacing={1}>
                <Button variant="outlined" onClick={onClose} disabled={saving}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Create"}
                </Button>
            </Stack>
        </Box>
    );
}
