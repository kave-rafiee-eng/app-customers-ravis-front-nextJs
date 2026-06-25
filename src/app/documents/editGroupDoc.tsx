import React from "react";
import { useSnackBarError } from "../stors/snakebar-store";
import { GroupDocType, pdfFileType } from "./documentsType";
import {
  DescriptionType,
  MiniDescriptionType,
} from "@/app/menu/type/menu_type";

import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  TableBasic,
  TableBasicProps,
} from "@/app/general-components/TableBasic";
import { API_BACKEND } from "../constant";
import { translateFull } from "../general-components/translate";

type propsType = {
  onUpdate: () => void;
  activeId: string;
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

export default function EditGroupDoc({ onUpdate, activeId }: propsType) {
  const addMessage = useSnackBarError((state) => state.addMessage);
  const [GroupDoc, setGroupDoc] = React.useState<GroupDocType | null>();
  const [saving, setSaving] = React.useState(false);

  const [translate, SetTranslate] = React.useState(true);
  const [translateProgress, setTranslateProgress] = React.useState(0);
  const translateTotalStep = React.useRef(0);
  const [language, setLanguage] = React.useState<langs>(langs.persian);

  const [openModalAddItem, SetOpenModalAddItem] = React.useState(false);
  const [newFileName, setNewFileName] = React.useState("");
  const [newName, setNewName] = React.useState("");

  const handleOpenModal = () => SetOpenModalAddItem(true);
  const handleCloseModal = () => {
    SetOpenModalAddItem(false);
    setNewFileName("");
    setNewName("");
  };

  const handleAddFileItem = () => {
    const trimmedName = newName.trim();
    const trimmedFileName = newFileName.trim();

    if (trimmedName.length < 2) {
      addMessage("Name must be at least 2 characters", "error");
      return;
    }

    if (trimmedFileName.length < 2) {
      addMessage("File name must be at least 2 characters", "error");
      return;
    }

    setGroupDoc((prev) => {
      if (prev == null) return null;
      return {
        ...prev,
        files: [
          ...prev.files,
          {
            name: {
              ...emptyDescription,
              [language]: trimmedName,
            },
            fileName: trimmedFileName,
          },
        ],
      };
    });

    addMessage("File item added", "succes");
    handleCloseModal();
  };

  const loadData = async () => {
    try {
      const response = await API_BACKEND.get(`/documents/${activeId}`);
      setGroupDoc((prev) => {
        return response.data;
      });
      console.log(`get Error id : ${activeId}`);
      console.log(response.data);
    } catch (err) {
      console.log(err);
      addMessage("Server Error", "error");
    }
  };

  React.useEffect(() => {
    loadData();
  }, [activeId]);

  const handleSave = async () => {
    if (GroupDoc == null) return;
    setSaving(true);
    try {
      await API_BACKEND.patch(`/documents/${activeId}`, {
        ...GroupDoc,
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

  async function translateAll() {
    if (GroupDoc == null) return;

    translateTotalStep.current = 1 + GroupDoc.files.length;
    const addStep = () => {
      setTranslateProgress((prev) => prev + 1);
    };

    setTranslateProgress(0);
    SetTranslate(false);

    //addMessage("connection Error", "error");
    try {
      const updatedCategory = await translateFull(GroupDoc.category.persian);
      addStep();

      const updatedFiles: pdfFileType[] = [];
      for (const file of GroupDoc.files) {
        const persianName = file.name.persian;
        if (persianName) {
          const translatedName = await translateFull(persianName);
          updatedFiles.push({
            ...file,
            name: translatedName,
          });
        } else {
          updatedFiles.push(file);
        }
        addStep();
      }

      setGroupDoc((prev) => {
        if (prev == null) return null;
        return {
          ...prev,
          category: updatedCategory,
          files: updatedFiles,
        };
      });

      addMessage("Translation completed", "succes");
    } catch (err) {
      addMessage("connection Error", "error");
    } finally {
      SetTranslate(true);
      setTranslateProgress(0);
    }
  }

  //------------------------------------------------------
  if (GroupDoc == null) return <div></div>;

  type optionsRow = {
    id: number;
    name: string;
    fineName: string;
  };

  const tableData: optionsRow[] = GroupDoc.files.map((file, index) => ({
    id: index,
    name: file.name[language] ?? "",
    fineName: file.fileName ?? "",
  }));

  const propsTable: TableBasicProps<optionsRow> = {
    columns: [
      {
        id: "id",
        label: "id",
        Width: "10%",
        render: (row) => {
          return (
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setGroupDoc((prev) => {
                  if (prev == null) return;
                  return {
                    ...prev,
                    files: prev.files.filter((_, index) => index != row.id),
                  };
                });
              }}
            >
              delet
            </Button>
          );
        },
      },
      {
        Width: "40%",
        id: "name",
        label: "name",
        render: (row) => {
          return (
            <TextField
              fullWidth
              size="small"
              value={row.name}
              dir={
                language === langs.persian || language === langs.arabic
                  ? "rtl"
                  : "ltr"
              }
              onChange={(event) => {
                const value = event.target.value;
                setGroupDoc((prev) => {
                  if (prev == null) return null;
                  return {
                    ...prev,
                    files: prev.files.map((file, index) => {
                      if (index !== row.id) return file;
                      return {
                        ...file,
                        name: {
                          ...file.name,
                          [language]: value,
                        },
                      };
                    }),
                  };
                });
              }}
            />
          );
        },
      },
      {
        id: "fineName",
        label: "fineName",
        render: (row) => {
          return (
            <TextField
              fullWidth
              size="small"
              value={row.fineName}
              dir="ltr"
              onChange={(event) => {
                const value = event.target.value;
                setGroupDoc((prev) => {
                  if (prev == null) return null;
                  return {
                    ...prev,
                    files: prev.files.map((file, index) => {
                      if (index !== row.id) return file;
                      return {
                        ...file,
                        fileName: value,
                      };
                    }),
                  };
                });
              }}
            />
          );
        },
        Width: "20%",
      },
    ],
    tableData: tableData,
  };

  return (
    <Box sx={{ width: "100%", height: "80%" }}>
      {!translate && (
        <Box sx={{ p: 2, width: "90%", mx: "auto" }}>
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

      {translate && (
        <>
          <Modal
            open={openModalAddItem}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style} display="flex" flexDirection="column" gap={2}>
              <Typography id="modal-modal-title" variant="h6" fontWeight={700}>
                Add File Item
              </Typography>

              <Stack spacing={2}>
                <TextField
                  label="name"
                  size="small"
                  fullWidth
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                  dir={
                    language === langs.persian || language === langs.arabic
                      ? "rtl"
                      : "ltr"
                  }
                  helperText={`Name in ${language}`}
                />

                <TextField
                  label="fileName"
                  size="small"
                  fullWidth
                  value={newFileName}
                  onChange={(event) => setNewFileName(event.target.value)}
                  dir="ltr"
                  helperText="PDF file name"
                />
              </Stack>

              <Stack direction="row" justifyContent="flex-end" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleAddFileItem}
                >
                  Add
                </Button>
              </Stack>
            </Box>
          </Modal>

          <Stack
            sx={{
              width: "90%",
              minWidth: "15%",
              p: 1.5,
              borderRadius: 1,
              bgcolor: "background.paper",
              boxShadow: 2,
            }}
            direction={"row"}
            justifyContent={"space-evenly"}
            marginBottom={"1%"}
            spacing={1}
          >
            <FormControl size="small">
              <InputLabel id="origin-filter-label">origin</InputLabel>
              <Select
                labelId="origin-filter-label"
                label="lang"
                value={language}
                onChange={(event) => {
                  setLanguage((prev) => event.target.value);
                }}
                size={"small"}
              >
                {Object.entries(langs).map((item) => (
                  <MenuItem value={item[0]}>{item[1]}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant={"contained"}
              size="small"
              onClick={handleOpenModal}
            >
              add item
            </Button>

            <Button
              variant={"contained"}
              size="small"
              onClick={translateAll}
              disabled={!translate}
            >
              translate
            </Button>

            <Button variant={"contained"} size="small" onClick={handleSave}>
              save
            </Button>
          </Stack>

          <Stack
            sx={{
              width: "90%",
              minWidth: "15%",
              p: 1.5,
              borderRadius: 1,
              bgcolor: "background.paper",
              boxShadow: 2,
            }}
            direction={"row"}
            justifyContent={"space-evenly"}
            marginBottom={"5%"}
            spacing={1}
          >
            <TextField
              label="category"
              dir={
                language === langs.persian || language === langs.arabic
                  ? "rtl"
                  : "ltr"
              }
              size="small"
              fullWidth
              value={GroupDoc?.category[language] ?? ""}
              onChange={(event) => {
                const value = event.target.value;
                setGroupDoc((prev) => {
                  if (prev == null) return null;
                  return {
                    ...prev,
                    category: {
                      ...prev.category,
                      [language]: value,
                    },
                  };
                });
              }}
              disabled={GroupDoc == null}
            />
          </Stack>

          <TableBasic
            height={"100%"}
            columns={propsTable.columns}
            tableData={propsTable.tableData}
          ></TableBasic>
        </>
      )}
    </Box>
  );
}
