"use client";

import {
    Box,
    Button,
    FormControl,
    InputLabel,
    LinearProgress,
    MenuItem,
    Modal,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import SimpleSnackbar from "../general-components/SnackbarError";
import Link from "next/link";
import React from "react";
import { CreatePhonebookType, PhonebookType } from "./phonebookType";

import { useSnackBarError } from "../stors/snakebar-store";
import {
    TableBasic,
    TableBasicProps,
} from "@/app/general-components/TableBasic";

import { DescriptionType } from "@/app/menu/type/menu_type";
import { API_BACKEND, API_TRANSLATE } from "../constant";

const styleModal = {
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

enum langs {
    persian = "persian",
    english = "english",
    arabic = "arabic",
    turkish = "turkish",
    russian = "russian",
    german = "german",
}

const emptyDescription: DescriptionType = {
    english: "",
    persian: "",
    arabic: "",
    turkish: "",
    russian: "",
    german: "",
};

export default function PhoneBook() {
    const [open, setOpen] = React.useState(false);
    const [listPhone, setListPhone] = React.useState<PhonebookType[]>([]);
    const addMessage = useSnackBarError((state) => state.addMessage);
    const [saving, setSaving] = React.useState(false);

    const [translate, SetTranslate] = React.useState(true);
    const [translateProgress, setTranslateProgress] = React.useState(0);
    const translateTotalStep = React.useRef(0);
    const [language, setLanguage] = React.useState<langs>(langs.persian);

    const [newName, setNewName] = React.useState("");
    const [newPhone, setNewPhone] = React.useState("");
    const [newDescriptionPersian, setNewDescriptionPersian] =
        React.useState("");
    const [modalDescription, setModalDescription] =
        React.useState<DescriptionType>(emptyDescription);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setNewName("");
        setNewPhone("");
        setNewDescriptionPersian("");
        setModalDescription(emptyDescription);
    };

    React.useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const res = await API_BACKEND.get("/phonebook");
            setListPhone(res.data);
        } catch (err) {
            console.log(err);
            addMessage("http error", "error");
        }
    }

    const translator = async (persian: string): Promise<DescriptionType> => {
        const result = await API_TRANSLATE.post("/translate", {
            text: persian,
        });
        return result.data as DescriptionType;
    };

    const handleModalTranslate = async () => {
        const persian = newDescriptionPersian.trim();
        if (persian.length < 2) {
            addMessage(
                "Persian description is required for translation",
                "error",
            );
            return;
        }

        try {
            const translated = await translator(persian);
            setModalDescription(translated);
            addMessage("Translation completed", "succes");
        } catch (err) {
            console.log(err);
            addMessage("connection Error", "error");
        }
    };

    const handleCreate = async () => {
        const trimmedName = newName.trim();
        const trimmedPhone = newPhone.trim();
        const trimmedPersian = newDescriptionPersian.trim();

        if (trimmedName.length < 2) {
            addMessage("Name must be at least 2 characters", "error");
            return;
        }

        if (trimmedPhone.length < 2) {
            addMessage("Phone must be at least 2 characters", "error");
            return;
        }

        const description =
            modalDescription.persian || modalDescription.english
                ? modalDescription
                : {
                      ...emptyDescription,
                      persian: trimmedPersian,
                  };

        const payload: CreatePhonebookType = {
            name: trimmedName,
            phone: trimmedPhone,
            description,
        };

        setSaving(true);
        try {
            await API_BACKEND.post("/phonebook", payload);
            addMessage("Phone contact created", "succes");
            handleClose();
            loadData();
        } catch (err) {
            console.log(err);
            addMessage("Failed to create contact", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await API_BACKEND.delete(`/phonebook/${id}`);
            setListPhone((prev) => prev.filter((item) => item.id !== id));
            addMessage("Contact deleted", "succes");
        } catch (err) {
            console.log(err);
            addMessage("Failed to delete contact", "error");
        }
    };

    const handleSaveAll = async () => {
        if (listPhone.length === 0) return;

        setSaving(true);
        try {
            for (const item of listPhone) {
                await API_BACKEND.patch(`/phonebook/${item.id}`, {
                    name: item.name,
                    phone: item.phone,
                    description: item.description ?? emptyDescription,
                });
            }
            addMessage("All contacts saved", "succes");
            loadData();
        } catch (err) {
            console.log(err);
            addMessage("connection error", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDownloadJson = () => {
        if (listPhone.length === 0) {
            addMessage("No contacts to download", "error");
            return;
        }

        const json = JSON.stringify(listPhone, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "phonebook.json";
        link.click();
        URL.revokeObjectURL(url);
        addMessage("JSON file downloaded", "succes");
    };

    async function translateAll() {
        if (listPhone.length === 0) {
            addMessage("No contacts to translate", "error");
            return;
        }

        translateTotalStep.current = listPhone.length;
        setTranslateProgress(0);
        SetTranslate(false);

        const addStep = () => setTranslateProgress((prev) => prev + 1);

        try {
            const updatedList: PhonebookType[] = [];

            for (const item of listPhone) {
                const persian = item.description?.persian?.trim();
                if (persian) {
                    const translated = await translator(persian);
                    updatedList.push({
                        ...item,
                        description: translated,
                    });
                } else {
                    updatedList.push(item);
                }
                addStep();
            }

            setListPhone(updatedList);
            addMessage("Translation completed", "succes");
        } catch (err) {
            console.log(err);
            addMessage("connection Error", "error");
        } finally {
            SetTranslate(true);
            setTranslateProgress(0);
        }
    }

    type optionsRow = {
        id: string;
        name: string;
        phone: string;
        description: string;
    };

    const tableData: optionsRow[] = listPhone.map((item) => ({
        id: item.id,
        name: item.name ?? "",
        phone: item.phone ?? "",
        description: item.description?.[language] ?? "",
    }));

    const propsTable: TableBasicProps<optionsRow> = {
        columns: [
            {
                id: "id",
                label: "action",
                Width: "10%",
                render: (row) => {
                    return (
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleDelete(row.id)}
                        >
                            delet
                        </Button>
                    );
                },
            },
            {
                Width: "20%",
                id: "name",
                label: "name",
                render: (row) => {
                    return (
                        <TextField
                            fullWidth
                            size="small"
                            value={row.name}
                            dir={"rtl"}
                            onChange={(event) => {
                                const value = event.target.value;
                                setListPhone((prev) =>
                                    prev.map((item) =>
                                        item.id === row.id
                                            ? { ...item, name: value }
                                            : item,
                                    ),
                                );
                            }}
                        />
                    );
                },
            },
            {
                Width: "20%",
                id: "phone",
                label: "phone",
                render: (row) => {
                    return (
                        <TextField
                            fullWidth
                            size="small"
                            value={row.phone}
                            dir="ltr"
                            onChange={(event) => {
                                const value = event.target.value;
                                setListPhone((prev) =>
                                    prev.map((item) =>
                                        item.id === row.id
                                            ? { ...item, phone: value }
                                            : item,
                                    ),
                                );
                            }}
                        />
                    );
                },
            },
            {
                Width: "30%",
                id: "description",
                label: () => {
                    return (
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel id="phonebook-lang-label">
                                lang
                            </InputLabel>
                            <Select
                                labelId="phonebook-lang-label"
                                label="lang"
                                value={language}
                                onChange={(event) => {
                                    setLanguage(event.target.value as langs);
                                }}
                                size="small"
                            >
                                {Object.entries(langs).map((item) => (
                                    <MenuItem key={item[0]} value={item[0]}>
                                        {item[1]}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    );
                },
                render: (row) => {
                    return (
                        <TextField
                            fullWidth
                            size="small"
                            value={row.description}
                            dir={
                                language === langs.persian ||
                                language === langs.arabic
                                    ? "rtl"
                                    : "ltr"
                            }
                            onChange={(event) => {
                                const value = event.target.value;
                                setListPhone((prev) =>
                                    prev.map((item) =>
                                        item.id === row.id
                                            ? {
                                                  ...item,
                                                  description: {
                                                      ...(item.description ??
                                                          emptyDescription),
                                                      [language]: value,
                                                  },
                                              }
                                            : item,
                                    ),
                                );
                            }}
                        />
                    );
                },
            },
        ],
        tableData: tableData,
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                maxHeight: "100vh",
            }}
        >
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={styleModal}
                    display="flex"
                    flexDirection="column"
                    gap={2}
                >
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        fontWeight={700}
                    >
                        Add New phone
                    </Typography>

                    <Stack spacing={2}>
                        <TextField
                            label="name"
                            size="small"
                            fullWidth
                            value={newName}
                            onChange={(event) => setNewName(event.target.value)}
                        />
                        <TextField
                            label="phone"
                            size="small"
                            fullWidth
                            value={newPhone}
                            onChange={(event) =>
                                setNewPhone(event.target.value)
                            }
                            dir="ltr"
                        />
                        <TextField
                            label="description (persian)"
                            size="small"
                            fullWidth
                            value={newDescriptionPersian}
                            onChange={(event) =>
                                setNewDescriptionPersian(event.target.value)
                            }
                            dir="rtl"
                        />
                    </Stack>

                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={1}
                    >
                        <Button
                            variant="outlined"
                            onClick={handleClose}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleModalTranslate}
                            disabled={saving}
                        >
                            translate
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleCreate}
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Create"}
                        </Button>
                    </Stack>
                </Box>
            </Modal>

            <SimpleSnackbar></SimpleSnackbar>

            <Box sx={{ background: "#1B3C53", height: "10%" }}>
                <Stack
                    direction="row"
                    justifyContent="start"
                    alignItems="center"
                    height="100%"
                    spacing={2}
                    sx={{ px: 2 }}
                >
                    <Link href="/">
                        <Typography variant="h6" fontWeight={700} color="white">
                            Home
                        </Typography>
                    </Link>

                    <Button variant="contained" onClick={handleOpen}>
                        add new phone
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleSaveAll}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "save"}
                    </Button>

                    <Button
                        variant="contained"
                        onClick={translateAll}
                        disabled={!translate || saving}
                    >
                        translate all
                    </Button>

                    <Button variant="contained" onClick={handleDownloadJson}>
                        download
                    </Button>
                </Stack>
            </Box>

            {!translate && (
                <Box sx={{ p: 2, width: "90%", mx: "auto" }}>
                    <Typography variant="body2" textAlign="center" gutterBottom>
                        Translating... {translateProgress} /{" "}
                        {translateTotalStep.current}
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={
                            translateTotalStep.current > 0
                                ? (translateProgress /
                                      translateTotalStep.current) *
                                  100
                                : 0
                        }
                        sx={{ height: 8, borderRadius: 1 }}
                    />
                </Box>
            )}

            {translate && (
                <Box sx={{ flex: 1, overflow: "auto", p: 1 }}>
                    <TableBasic
                        height="100%"
                        columns={propsTable.columns}
                        tableData={propsTable.tableData}
                    />
                </Box>
            )}
        </Box>
    );
}
