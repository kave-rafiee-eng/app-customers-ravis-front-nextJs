"use client";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import { API_BACKEND } from "../constant";
import { useSnackBarError } from "../stors/snakebar-store";
import { DeviceType } from "../users/type";

type propsType = {
  onEdit: (seria: number | null) => void;
  activeSerial: number;
  update: number;
};

export default function ShowListDevices({
  onEdit,
  activeSerial,
  update,
}: propsType) {
  const addMessage = useSnackBarError((state) => state.addMessage);

  const [devices, setDevices] = useState<DeviceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [deviceToDelete, setDeviceToDelete] = useState<DeviceType | null>(null);

  const loadListDevices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API_BACKEND.get<DeviceType[]>("user/devices/all");
      setDevices(res.data);
      console.log(res.data);
    } catch (err) {
      addMessage("can not load users", "error");
    } finally {
      setLoading(false);
    }
  }, [addMessage, update]);

  useEffect(() => {
    loadListDevices();
  }, [loadListDevices, update]);

  const filteredDevices = useMemo(() => {
    const query = search.toString();
    if (!query) return devices;

    return devices.filter((device) => device.serial.toString().includes(query));
  }, [search, devices]);

  const handleOpenDeleteDialog = (
    user: DeviceType,
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    setDeviceToDelete(user);
  };

  const handleCloseDeleteDialog = () => {
    if (!deleting) {
      setDeviceToDelete(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deviceToDelete) return;

    setDeleting(true);
    try {
      await API_BACKEND.delete(`user/devices/${deviceToDelete.serial}`);
      addMessage("user deleted", "succes");
      if (activeSerial === deviceToDelete.serial) {
        onEdit(null);
      }
      setDeviceToDelete(null);
      await loadListDevices();
    } catch (err) {
      console.log(err);
      addMessage("failed to delete user", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Stack spacing={1.5} sx={{ height: "100%", p: 1.5 }}>
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          p: 1.5,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="subtitle1" fontWeight={800}>
            Devices
          </Typography>
          <Chip
            label={`${devices.length} total`}
            size="small"
            sx={{ bgcolor: "#F0F4F8", fontWeight: 700 }}
          />
        </Stack>

        <TextField
          size="small"
          fullWidth
          placeholder="Search by phone, name or email..."
          value={search}
          type="number"
          onChange={(event) => setSearch(event.target.value)}
          sx={{ mt: 1.5 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Paper>

      <Stack
        direction="column"
        spacing={0.75}
        sx={{ overflowY: "auto", flex: 1, minHeight: 0 }}
      >
        {loading && devices.length === 0 ? (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
            <CircularProgress size={24} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              loading users...
            </Typography>
          </Stack>
        ) : filteredDevices.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 2,
              p: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {search.toString()
                ? "no user matches your search"
                : "no user found"}
            </Typography>
          </Paper>
        ) : (
          filteredDevices.map((device) => {
            const isActive = activeSerial === device.serial;

            return (
              <Paper
                key={device.serial}
                elevation={0}
                onClick={() => onEdit(device.serial)}
                sx={{
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: isActive ? "#1B3C53" : "divider",
                  bgcolor: isActive ? "#1B3C53" : "background.paper",
                  color: isActive ? "common.white" : "text.primary",
                  borderRadius: 2,
                  transition: "all 0.15s ease",
                  overflow: "hidden",
                  "&:hover": {
                    borderColor: "#1B3C53",
                    boxShadow: isActive
                      ? "none"
                      : "0 2px 8px rgba(27, 60, 83, 0.08)",
                  },
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ px: 1.25, py: 1.25 }}
                  spacing={1}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.25}
                    sx={{ minWidth: 0, flex: 1 }}
                  >
                    <Box
                      sx={{
                        alignItems: "center",
                        bgcolor: isActive
                          ? "rgba(255,255,255,0.14)"
                          : "#F0F4F8",
                        borderRadius: 1.5,
                        color: isActive ? "common.white" : "#1B3C53",
                        display: "flex",
                        flexShrink: 0,
                        height: 40,
                        justifyContent: "center",
                        width: 40,
                      }}
                    >
                      <PersonOutlineOutlinedIcon fontSize="small" />
                    </Box>

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
                        {device.serial}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Tooltip title="Delete user">
                    <IconButton
                      size="small"
                      aria-label="delete user"
                      onClick={(event) => handleOpenDeleteDialog(device, event)}
                      sx={{
                        color: isActive ? "common.white" : "error.main",
                        flexShrink: 0,
                        bgcolor: isActive
                          ? "rgba(255,255,255,0.1)"
                          : "transparent",
                        "&:hover": {
                          bgcolor: isActive
                            ? "rgba(255,255,255,0.18)"
                            : "rgba(211, 47, 47, 0.08)",
                        },
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Paper>
            );
          })
        )}
      </Stack>

      <Dialog open={Boolean(deviceToDelete)} onClose={handleCloseDeleteDialog}>
        <DialogTitle>delete user</DialogTitle>
        <DialogContent>
          <DialogContentText>
            are you sure you want to delete device{" "}
            <strong>{deviceToDelete?.serial}</strong>
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={deleting}>
            cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? "deleting..." : "delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
