import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DeviceType, TicketStatusEnum, userType } from "./type";
import { API_BACKEND } from "../constant";
import { useSnackBarError } from "../stors/snakebar-store";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import LockIcon from "@mui/icons-material/Lock";
import ReplayIcon from "@mui/icons-material/Replay";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";

enum TabsEnum {
  info = "info",
  memory = "memory",
  tickets = "tickets",
  devices = "devices",
}

const tabLabels: Record<TabsEnum, string> = {
  [TabsEnum.info]: "Info",
  [TabsEnum.memory]: "Memory",
  [TabsEnum.tickets]: "Tickets",
  [TabsEnum.devices]: "Devices",
};

type propsType = {
  id: string;
};

export default function ShowUser({ id }: propsType) {
  const [listDevices, setListDevices] = useState<DeviceType[]>([]);
  const [deviceSerialInput, setDeviceSerialInput] = useState("");
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [addingDevice, setAddingDevice] = useState(false);

  const [user, setUser] = useState<userType>();
  const [loading, setLoading] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const [tab, setTab] = useState<TabsEnum>(TabsEnum.info);

  const handleChange = (_event: SyntheticEvent, newValue: TabsEnum) => {
    setTab(newValue);
  };

  const addMessage = useSnackBarError((state) => state.addMessage);

  const loadListDevices = useCallback(async () => {
    setLoadingDevices(true);
    try {
      const res = await API_BACKEND.get<DeviceType[]>("user/devices/all");
      setListDevices(res.data);
      console.log(res.data);
    } catch (err) {
      addMessage("can not get list devices", "error");
    } finally {
      setLoadingDevices(false);
    }
  }, [addMessage]);

  const loadUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API_BACKEND.get(`user/${id}/with-relations`);
      setUser(res.data);
    } catch (err) {
      addMessage("can not get error", "error");
    } finally {
      setLoading(false);
    }
  }, [addMessage, id]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (tab === TabsEnum.devices) {
      loadListDevices();
    }
  }, [tab, loadListDevices]);

  const userDeviceSerials = new Set(
    user?.devices.map((device) => device.serial) ?? [],
  );

  const listDeviceSerials = useMemo(
    () => new Set(listDevices.map((device) => device.serial)),
    [listDevices],
  );

  const parsedDeviceSerial = useMemo(() => {
    const trimmed = deviceSerialInput.trim();
    if (!trimmed) return null;

    const value = Number(trimmed);
    if (!Number.isInteger(value) || value < 0) return null;

    return value;
  }, [deviceSerialInput]);

  const canAddDevice =
    parsedDeviceSerial !== null &&
    !userDeviceSerials.has(parsedDeviceSerial) &&
    listDeviceSerials.has(parsedDeviceSerial);

  const deviceSerialHelperText = useMemo(() => {
    if (!deviceSerialInput.trim()) {
      return "enter device serial number";
    }

    if (parsedDeviceSerial === null) {
      return "serial must be a valid number";
    }

    if (userDeviceSerials.has(parsedDeviceSerial)) {
      return "this device is already assigned to the user";
    }

    if (!listDeviceSerials.has(parsedDeviceSerial)) {
      return "serial not found in device list";
    }

    return "device found and ready to add";
  }, [
    deviceSerialInput,
    listDeviceSerials,
    parsedDeviceSerial,
    userDeviceSerials,
  ]);

  const ticketSummary = useMemo(() => {
    const tickets = user?.tickets ?? [];

    return {
      total: tickets.length,
      closed: tickets.filter(
        (ticket) => ticket.status === TicketStatusEnum.closed,
      ).length,
      pending: tickets.filter(
        (ticket) => ticket.status === TicketStatusEnum.pending,
      ).length,
    };
  }, [user?.tickets]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      addMessage("copy", "succes");
    } catch (err) {
      addMessage("can not copy", "error");
    }
  };

  const handleClearAgentMemory = async () => {
    try {
      const res = await API_BACKEND.patch("/user/" + id, {
        agentMemory: "",
      });

      if (res.status == 200) {
        addMessage("memory cleared .", "succes");
        setUser(res.data);
      } else {
        addMessage("http code error : " + res.status, "error");
      }
    } catch (err) {
      addMessage("http Error", "error");
    }
  };

  const handleDeletDevice = async (serial: number) => {
    try {
      const res = await API_BACKEND.delete(`user/${id}/devices/${serial}`);
      if (res.status == 200) {
        addMessage("device deleted .", "succes");
        await loadUser();
      } else {
        addMessage("http code error : " + res.status, "error");
      }
    } catch (err) {
      addMessage("http Error", "error");
    }
  };

  const handleAddDeviceToUser = async (serial: number) => {
    setAddingDevice(true);
    try {
      const res = await API_BACKEND.post(`user/${id}/devices/${serial}`);
      if (res.status == 201) {
        addMessage("device added .", "succes");
        setUser(res.data);
        setDeviceSerialInput("");
      } else {
        addMessage("http code error : " + res.status, "error");
      }
    } catch (err) {
      addMessage("http Error", "error");
    } finally {
      setAddingDevice(false);
    }
  };

  const handleChangePassword = async () => {
    const newPass = newPasswordInput.trim();
    if (!newPass || !user?.phone) return;

    setChangingPassword(true);
    try {
      const res = await API_BACKEND.patch(`user/change-pass/${user.phone}`, {
        newPass,
      });
      if (res.status === 200) {
        addMessage("password changed .", "succes");
        loadUser();
        setNewPasswordInput("");
      } else {
        addMessage("http code error : " + res.status, "error");
      }
    } catch (err) {
      addMessage("http Error", "error");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <Stack spacing={2} sx={{ p: 1 }}>
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
                {user?.name || "Unknown user"}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.78)" }}
              >
                {user?.phone || "No phone number"}
              </Typography>
            </Stack>

            <Tooltip title="Copy user id">
              <Stack direction={"row"} spacing={1}>
                <IconButton
                  aria-label="copy user id"
                  onClick={handleCopy}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.14)",
                    color: "common.white",
                    alignSelf: "flex-start",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.22)" },
                  }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>

                <IconButton
                  aria-label="copy user id"
                  onClick={() => loadUser()}
                  disabled={loading}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.14)",
                    color: "common.white",
                    alignSelf: "flex-start",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.22)" },
                  }}
                >
                  <ReplayIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Tooltip>
          </Stack>
        </Box>

        <Tabs
          value={tab}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          variant="fullWidth"
          aria-label="user details tabs"
          sx={{
            minHeight: 44,
            "& .MuiTab-root": {
              minHeight: 44,
              textTransform: "none",
              fontWeight: 700,
            },
          }}
        >
          {Object.values(TabsEnum).map((value) => (
            <Tab key={value} value={value} label={tabLabels[value]} />
          ))}
        </Tabs>
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
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ height: "100%" }}
          >
            <CircularProgress size={28} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              loading user...
            </Typography>
          </Stack>
        ) : !user ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ height: "100%" }}
          >
            <Typography variant="body2" color="text.secondary">
              user not found
            </Typography>
          </Stack>
        ) : (
          <Box sx={{ height: "100%", overflowY: "auto", p: 2 }}>
            {tab === TabsEnum.info && (
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip label={`${ticketSummary.total} tickets`} size="small" />
                  <Chip
                    label={`${ticketSummary.pending} pending`}
                    color="warning"
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`${ticketSummary.closed} closed`}
                    color="success"
                    size="small"
                    variant="outlined"
                  />
                </Stack>

                <InfoRow
                  icon={<PersonOutlineOutlinedIcon fontSize="small" />}
                  label="Name"
                  value={user.name}
                />
                <InfoRow
                  icon={<LocalPhoneOutlinedIcon fontSize="small" />}
                  label="Phone"
                  value={user.phone}
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
                  <Stack spacing={1.5}>
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
                        <LockIcon fontSize="small" />
                      </Box>

                      <Stack sx={{ minWidth: 0, flex: 1 }} spacing={0.25}>
                        <Typography variant="caption" color="text.secondary">
                          password
                        </Typography>
                        <Typography variant="body2" fontWeight={700} noWrap>
                          {user.password || "-"}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                      <TextField
                        label="new password"
                        size="small"
                        fullWidth
                        value={newPasswordInput}
                        onChange={(event) =>
                          setNewPasswordInput(event.target.value)
                        }
                        disabled={changingPassword}
                        helperText="enter a new password for this user"
                      />

                      <Button
                        variant="contained"
                        startIcon={
                          changingPassword && (
                            <CircularProgress size={16} color="inherit" />
                          )
                        }
                        onClick={handleChangePassword}
                        disabled={!newPasswordInput.trim() || changingPassword}
                        sx={{
                          whiteSpace: "nowrap",
                          bgcolor: "#1B3C53",
                          "&:hover": { bgcolor: "#152f42" },
                          padding: 3,
                        }}
                      >
                        {changingPassword ? "changing..." : "change password"}
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
                <InfoRow
                  icon={<EmailOutlinedIcon fontSize="small" />}
                  label="Email"
                  value={user.email}
                />
                <InfoRow
                  icon={<WorkOutlineOutlinedIcon fontSize="small" />}
                  label="Job"
                  value={user.info?.job}
                />
                <InfoRow
                  icon={<ContentCopyIcon fontSize="small" />}
                  label="User ID"
                  value={user.id}
                  action={
                    <Tooltip title="Copy user id">
                      <IconButton size="small" onClick={handleCopy}>
                        <ContentCopyIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  }
                />
              </Stack>
            )}

            {tab === TabsEnum.memory && (
              <Box
                sx={{
                  bgcolor: "#F8FAFC",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  color: "text.primary",
                  minHeight: 180,
                  p: 2,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                <IconButton
                  size="small"
                  disabled={user === null}
                  onClick={handleClearAgentMemory}
                >
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
                {user.agentMemory || (
                  <Typography variant="body2" color="text.secondary">
                    no memory saved for this user
                  </Typography>
                )}
              </Box>
            )}

            {tab === TabsEnum.tickets && (
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip label={`Total: ${ticketSummary.total}`} size="small" />
                  <Chip
                    label={`Pending: ${ticketSummary.pending}`}
                    color="warning"
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`Closed: ${ticketSummary.closed}`}
                    color="success"
                    size="small"
                    variant="outlined"
                  />
                </Stack>

                <Divider />

                {user.tickets.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    no tickets found
                  </Typography>
                ) : (
                  user.tickets.map((ticket) => (
                    <Paper
                      key={ticket.id}
                      elevation={0}
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        p: 1.5,
                      }}
                    >
                      <Stack spacing={1}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          spacing={1}
                        >
                          <Typography variant="subtitle2" fontWeight={800}>
                            Ticket
                          </Typography>
                          <Chip
                            label={ticket.status}
                            color={
                              ticket.status === TicketStatusEnum.closed
                                ? "success"
                                : "warning"
                            }
                            size="small"
                            variant="outlined"
                          />
                        </Stack>
                        <Typography variant="body2">
                          {ticket.question}
                        </Typography>
                        {ticket.answer && (
                          <Typography variant="body2" color="text.secondary">
                            {ticket.answer}
                          </Typography>
                        )}
                      </Stack>
                    </Paper>
                  ))
                )}
              </Stack>
            )}

            {tab === TabsEnum.devices && (
              <Stack spacing={1.5}>
                <Paper
                  elevation={0}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    p: 1.5,
                  }}
                >
                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      add device
                    </Typography>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                      <TextField
                        label="serial"
                        type="number"
                        size="small"
                        fullWidth
                        value={deviceSerialInput}
                        onChange={(event) =>
                          setDeviceSerialInput(event.target.value)
                        }
                        disabled={addingDevice || loadingDevices}
                        helperText={deviceSerialHelperText}
                        slotProps={{
                          htmlInput: { min: 0, step: 1 },
                        }}
                      />

                      <Button
                        variant="contained"
                        startIcon={
                          addingDevice ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : (
                            <AddIcon />
                          )
                        }
                        onClick={() => {
                          if (parsedDeviceSerial !== null) {
                            handleAddDeviceToUser(parsedDeviceSerial);
                          }
                        }}
                        disabled={
                          !canAddDevice || addingDevice || loadingDevices
                        }
                        sx={{
                          whiteSpace: "nowrap",
                          bgcolor: "#1B3C53",
                          "&:hover": { bgcolor: "#152f42" },
                        }}
                      >
                        {addingDevice ? "adding..." : "add device"}
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>

                <Divider />

                {user.devices.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    no devices assigned to this user
                  </Typography>
                ) : (
                  user.devices.map((device) => (
                    <Paper
                      key={device.serial}
                      elevation={0}
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        p: 1.5,
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Typography fontWeight={600}>
                          {device.serial}
                        </Typography>
                        {device.address && (
                          <Typography variant="body2" color="text.secondary">
                            {device.address}
                          </Typography>
                        )}
                        <Box sx={{ flex: 1 }} />
                        <IconButton
                          onClick={() => {
                            handleDeletDevice(device.serial);
                          }}
                          color="error"
                          aria-label="delete device"
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Paper>
                  ))
                )}
              </Stack>
            )}
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
