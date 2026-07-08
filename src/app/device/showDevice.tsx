import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PinOutlinedIcon from "@mui/icons-material/PinOutlined";
import ReplayIcon from "@mui/icons-material/Replay";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import TagOutlinedIcon from "@mui/icons-material/TagOutlined";
import { useCallback, useEffect, useMemo, useState } from "react";
import { API_BACKEND } from "../constant";
import { useSnackBarError } from "../stors/snakebar-store";
import { DeviceType } from "../users/type";

type ShowDeviceProps = {
  serial: number;
};

export default function ShowDevice({ serial }: ShowDeviceProps) {
  const addMessage = useSnackBarError((state) => state.addMessage);
  const [device, setDevice] = useState<DeviceType>();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadDevice = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API_BACKEND.get<DeviceType>(`user/devices/${serial}`);
      setDevice(res.data);
      setAddress(res.data.address ?? "");
      setPhone(res.data.info?.phone ?? "");
    } catch (err) {
      try {
        const res = await API_BACKEND.get<DeviceType[]>("user/devices/all");
        const found = res.data.find((item) => item.serial === serial);
        if (found) {
          setDevice(found);
          setAddress(found.address ?? "");
          setPhone(found.info?.phone ?? "");
        } else {
          setDevice(undefined);
          addMessage("device not found", "error");
        }
      } catch {
        setDevice(undefined);
        addMessage("can not load device", "error");
      }
    } finally {
      setLoading(false);
    }
  }, [addMessage, serial]);

  useEffect(() => {
    loadDevice();
  }, [loadDevice]);

  const hasChanges = useMemo(() => {
    if (!device) return false;

    return (
      address.trim() !== (device.address ?? "").trim() ||
      phone.trim() !== (device.info?.phone ?? "").trim()
    );
  }, [address, device, phone]);

  const handleSave = async () => {
    if (!device) return;

    setSaving(true);
    try {
      const res = await API_BACKEND.patch<DeviceType>(
        `user/devices/${serial}`,
        {
          address: address.trim(),
          phone: phone.trim(),
        },
      );

      setDevice(res.data);
      setAddress(res.data.address ?? "");
      setPhone(res.data.info?.phone ?? "");
      addMessage("device updated", "succes");
    } catch (err) {
      addMessage("failed to update device", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={2} sx={{ p: 1, overflowY: "auto" }}>
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #1B3C53 0%, #456882 100%)",
            color: "common.white",
            p: 2,
          }}
        >
          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Stack spacing={0.5} sx={{ minWidth: 0 }}>
              <Typography variant="h6" fontWeight={800} noWrap>
                Device {device?.serial ?? serial}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Tooltip title="Refresh">
                <IconButton
                  aria-label="refresh device"
                  onClick={loadDevice}
                  disabled={loading || saving}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.14)",
                    color: "common.white",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.22)" },
                  }}
                >
                  <ReplayIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {loading ? (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
            <CircularProgress size={28} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              loading device...
            </Typography>
          </Stack>
        ) : !device ? (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
            <Typography variant="body2" color="text.secondary">
              device not found
            </Typography>
          </Stack>
        ) : (
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              <InfoRow
                icon={<PinOutlinedIcon fontSize="small" />}
                label="Device Serial"
                value={String(serial)}
              />

              <Paper
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 1.5,
                }}
              >
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                      sx={{
                        alignItems: "center",
                        bgcolor: "#F0F4F8",
                        borderRadius: 1.5,
                        color: "#1B3C53",
                        display: "flex",
                        height: 36,
                        justifyContent: "center",
                        width: 36,
                      }}
                    >
                      <HomeOutlinedIcon fontSize="small" />
                    </Box>
                    <Typography variant="subtitle2" fontWeight={700}>
                      Edit device
                    </Typography>
                  </Stack>

                  <TextField
                    label="Address"
                    dir="rtl"
                    fullWidth
                    multiline
                    minRows={2}
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    disabled={saving}
                  />

                  <TextField
                    label="Phone"
                    fullWidth
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    disabled={saving}
                    slotProps={{
                      htmlInput: {
                        inputMode: "tel",
                      },
                    }}
                  />

                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      startIcon={
                        saving ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : (
                          <SaveOutlinedIcon />
                        )
                      }
                      onClick={handleSave}
                      disabled={!hasChanges || saving}
                      sx={{
                        bgcolor: "#1B3C53",
                        "&:hover": { bgcolor: "#152f42" },
                      }}
                    >
                      {saving ? "saving..." : "save changes"}
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={() => {
                        setAddress(device.address ?? "");
                        setPhone(device.info?.phone ?? "");
                      }}
                      disabled={saving || !hasChanges}
                    >
                      reset
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </Stack>
          </Box>
        )}
      </Paper>
    </Stack>
  );
}

type InfoRowProps = {
  icon: React.ReactNode;
  label: string;
  value?: string;
  action?: React.ReactNode;
};

function InfoRow({ icon, label, value, action }: InfoRowProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 1.5,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box
          sx={{
            alignItems: "center",
            bgcolor: "#F0F4F8",
            borderRadius: 1.5,
            color: "#1B3C53",
            display: "flex",
            height: 36,
            justifyContent: "center",
            width: 36,
          }}
        >
          {icon}
        </Box>

        <Stack sx={{ minWidth: 0, flex: 1 }} spacing={0.25}>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="body2" fontWeight={700} noWrap>
            {value || "-"}
          </Typography>
        </Stack>

        {action}
      </Stack>
    </Paper>
  );
}
