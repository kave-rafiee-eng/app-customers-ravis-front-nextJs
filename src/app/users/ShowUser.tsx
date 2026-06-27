import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
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
import { TicketStatusEnum, userType } from "./type";
import { API_BACKEND } from "../constant";
import { useSnackBarError } from "../stors/snakebar-store";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import ReplayIcon from "@mui/icons-material/Replay";
enum TabsEnum {
  info = "info",
  memory = "memory",
  tickets = "tickets",
}

const tabLabels: Record<TabsEnum, string> = {
  [TabsEnum.info]: "Info",
  [TabsEnum.memory]: "Memory",
  [TabsEnum.tickets]: "Tickets",
};

type propsType = {
  id: string;
};

export default function ShowUser({ id }: propsType) {
  const [user, setUser] = useState<userType>();
  const [loading, setLoading] = useState(false);

  const [tab, setTab] = useState<TabsEnum>(TabsEnum.info);

  const handleChange = (_event: SyntheticEvent, newValue: TabsEnum) => {
    setTab(newValue);
  };

  const addMessage = useSnackBarError((state) => state.addMessage);

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
