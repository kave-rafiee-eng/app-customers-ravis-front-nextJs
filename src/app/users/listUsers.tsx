"use client";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { API_BACKEND } from "../constant";
import { useSnackBarError } from "../stors/snakebar-store";
import { MiniDescriptionType } from "../menu/type/menu_type";
import { userType } from "./type";

type propsType = {
  onEdit: (id: string | null) => void;
  activeId: string | null;
  update: number;
};

export default function ShowListUsers({ onEdit, activeId, update }: propsType) {
  const addMessage = useSnackBarError((state) => state.addMessage);

  const [users, setUsers] = useState<userType[]>([]);

  const [loading, setLoading] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API_BACKEND.get<userType[]>("/user");
      setUsers(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
      addMessage("can not load users", "error");
    } finally {
      setLoading(false);
    }
  }, [addMessage, update]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers, update]);

  //   const handleDelete = async (
  //     id: string,
  //     event: React.MouseEvent<HTMLButtonElement>,
  //   ) => {
  //     event.stopPropagation();

  //     try {
  //       await API_BACKEND.delete(`${END_POINT_AI_DOCUMENTS}/${id}`);
  //       addMessage("document deleted", "succes");
  //       onEdit(null);
  //       await loadDocuments();
  //     } catch (err) {
  //       console.log(err);
  //       addMessage("failed to delete document", "error");
  //     }
  //   };

  return (
    <Stack direction="column" spacing={1} sx={{ height: "100%", p: 1 }}>
      <Stack
        direction="column"
        spacing={0.5}
        sx={{ overflowY: "auto", flex: 1 }}
      >
        {loading && users.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
            loading...
          </Typography>
        ) : users.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
            no user found
          </Typography>
        ) : (
          users.map((user) => {
            const isActive = activeId === user.id;

            return (
              <Box
                key={user.id}
                onClick={() => onEdit(user.id)}
                sx={{
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: isActive ? "#1B3C53" : "divider",
                  bgcolor: isActive ? "#1B3C53" : "background.paper",
                  color: isActive ? "common.white" : "text.primary",
                  borderRadius: 1,
                  transition: "all 0.15s ease",
                  "&:hover": {
                    borderColor: "#1B3C53",
                  },
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ px: 1.5, py: 1 }}
                  spacing={1}
                >
                  <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      noWrap
                      sx={{
                        direction: "rtl",
                        unicodeBidi: "plaintext",
                      }}
                    >
                      {user.phone}
                    </Typography>
                    {user.name && (
                      <Typography
                        variant="caption"
                        noWrap
                        sx={{
                          color: isActive ? "grey.300" : "text.secondary",
                        }}
                      >
                        {user.name}
                      </Typography>
                    )}
                  </Stack>

                  <IconButton
                    size="small"
                    aria-label="delete document"
                    // onClick={(event) => handleDelete(user.id, event)}
                    sx={{
                      color: isActive ? "common.white" : "error.main",
                      flexShrink: 0,
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
            );
          })
        )}
      </Stack>
    </Stack>
  );
}
