"use client";

import * as React from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import SimpleSnackbar from "../general-components/SnackbarError";
import { useSnackBarError } from "../stors/snakebar-store";
import { API_BACKEND } from "../constant";
import { TicketStatusEnum, TicketType } from "./ticketType";

const ACCENT = "#1B3C53";

type StatusFilter = "all" | TicketStatusEnum;

function questionPreview(text: string, maxLength = 90) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

function TicketListItem({
  ticket,
  selected,
  onSelect,
}: {
  ticket: TicketType;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Paper
      elevation={0}
      onClick={onSelect}
      sx={{
        p: 1.5,
        cursor: "pointer",
        border: "2px solid",
        borderColor: selected ? ACCENT : "divider",
        bgcolor: selected ? `${ACCENT}08` : "background.paper",
        borderRadius: 2,
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: ACCENT,
          bgcolor: `${ACCENT}06`,
        },
      }}
    >
      <Stack spacing={1}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <Typography variant="caption" color="text.secondary" noWrap>
            {ticket.userid}
          </Typography>
          <Chip
            label={ticket.status}
            size="small"
            color={
              ticket.status === TicketStatusEnum.closed ? "success" : "warning"
            }
            sx={{ height: 22, fontSize: 11 }}
          />
        </Stack>

        <Typography
          variant="body2"
          fontWeight={selected ? 700 : 500}
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.5,
            direction: "rtl",
            unicodeBidi: "plaintext",
          }}
        >
          {ticket.question}
        </Typography>

        {ticket.answer && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            answer: {questionPreview(ticket.answer, 60)}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

export default function TicketPage() {
  const addMessage = useSnackBarError((state) => state.addMessage);

  const [tickets, setTickets] = React.useState<TicketType[]>([]);
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = React.useState<string>("");
  const [answer, setAnswer] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const selectedTicket = tickets.find((ticket) => ticket.id === selectedId);

  const loadTickets = React.useCallback(async () => {
    try {
      const response = await API_BACKEND.get<TicketType[]>("/ticket");
      setTickets(response.data);
    } catch (err) {
      console.log(err);
      addMessage("can not load tickets", "error");
    }
  }, [addMessage]);

  React.useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const filteredTickets = React.useMemo(() => {
    if (statusFilter === "all") return tickets;
    return tickets.filter((ticket) => ticket.status === statusFilter);
  }, [tickets, statusFilter]);

  const handleSelect = (ticket: TicketType) => {
    setSelectedId(ticket.id);
    setAnswer(ticket.answer);
  };

  const handleUpdate = async () => {
    if (!selectedTicket) {
      addMessage("please select a ticket", "error");
      return;
    }

    if (!answer.trim()) {
      addMessage("answer is required", "error");
      return;
    }

    setSaving(true);
    try {
      await API_BACKEND.patch(`/ticket/${selectedTicket.id}`, {
        userid: selectedTicket.userid,
        question: selectedTicket.question,
        answer: answer.trim(),
        status: TicketStatusEnum.closed,
      });
      addMessage("ticket updated", "succes");
      await loadTickets();
      setSelectedId("");
      setAnswer("");
    } catch (err) {
      console.log(err);
      addMessage("failed to update ticket", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTicket) return;

    setDeleting(true);
    try {
      await API_BACKEND.delete(`/ticket/${selectedTicket.id}`);
      addMessage("ticket deleted", "succes");
      setOpenDeleteDialog(false);
      setSelectedId("");
      setAnswer("");
      await loadTickets();
    } catch (err) {
      console.log(err);
      addMessage("failed to delete ticket", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f4f7f9",
        overflow: "hidden",
      }}
    >
      <SimpleSnackbar />

      <Box
        sx={{
          px: 2,
          py: 1.5,
          bgcolor: ACCENT,
          color: "white",
          flexShrink: 0,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <ConfirmationNumberOutlinedIcon />
            <Link href="/" style={{ textDecoration: "none", color: "white" }}>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Home
              </Typography>
            </Link>
            <Typography variant="h6" fontWeight={700}>
              Tickets
            </Typography>
          </Stack>
        </Stack>
      </Box>

      <Grid container sx={{ flex: 1, minHeight: 0, p: 2 }} spacing={2}>
        {/* Ticket list sidebar */}
        <Grid size={{ xs: 12, md: 4 }} sx={{ height: "100%", minHeight: 0 }}>
          <Paper
            elevation={0}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box sx={{ px: 2, py: 1.5, bgcolor: `${ACCENT}08` }}>
              <Stack direction={"row"} spacing={1}>
                <Typography variant="subtitle2" fontWeight={700} color={ACCENT}>
                  Tickets ({filteredTickets.length})
                </Typography>

                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel id="ticket-status-filter" sx={{ color: "white" }}>
                    status
                  </InputLabel>
                  <Select
                    labelId="ticket-status-filter"
                    label="status"
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value as StatusFilter)
                    }
                    sx={{
                      bgcolor: "white",
                      borderRadius: 1,
                    }}
                  >
                    <MenuItem value="all">all</MenuItem>
                    <MenuItem value={TicketStatusEnum.pending}>
                      pending
                    </MenuItem>
                    <MenuItem value={TicketStatusEnum.closed}>closed</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Box>
            <Divider />

            <Box sx={{ flex: 1, overflow: "auto", p: 1.5 }}>
              {filteredTickets.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  sx={{ py: 4 }}
                >
                  no tickets found
                </Typography>
              ) : (
                <Stack spacing={1.25}>
                  {filteredTickets.map((ticket) => (
                    <TicketListItem
                      key={ticket.id}
                      ticket={ticket}
                      selected={ticket.id === selectedId}
                      onSelect={() => handleSelect(ticket)}
                    />
                  ))}
                </Stack>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Detail panel */}
        <Grid size={{ xs: 12, md: 8 }} sx={{ height: "100%", minHeight: 0 }}>
          <Paper
            elevation={0}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {selectedTicket ? (
              <>
                <Box sx={{ px: 2.5, py: 2, bgcolor: `${ACCENT}08` }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={1}
                  >
                    <Typography variant="subtitle1" fontWeight={700}>
                      Ticket detail
                    </Typography>
                    <Chip
                      label={selectedTicket.status}
                      size="small"
                      color={
                        selectedTicket.status === TicketStatusEnum.closed
                          ? "success"
                          : "warning"
                      }
                    />
                  </Stack>
                </Box>
                <Divider />

                <Box sx={{ flex: 1, overflow: "auto", p: 2.5 }}>
                  <Stack spacing={2.5}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        userid
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {selectedTicket.userid}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        question
                      </Typography>
                      <Paper
                        elevation={0}
                        sx={{
                          mt: 0.5,
                          p: 2,
                          bgcolor: "#f8fafb",
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 2,
                          direction: "rtl",
                          unicodeBidi: "plaintext",
                        }}
                      >
                        <Typography variant="body1" lineHeight={1.8}>
                          {selectedTicket.question}
                        </Typography>
                      </Paper>
                    </Box>

                    {selectedTicket.answer && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          current answer
                        </Typography>
                        <Paper
                          elevation={0}
                          sx={{
                            mt: 0.5,
                            p: 2,
                            bgcolor: "#f0f7f0",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                            direction: "rtl",
                            unicodeBidi: "plaintext",
                          }}
                        >
                          <Typography variant="body2" lineHeight={1.8}>
                            {selectedTicket.answer}
                          </Typography>
                        </Paper>
                      </Box>
                    )}

                    <TextField
                      label="answer"
                      multiline
                      minRows={5}
                      fullWidth
                      value={answer}
                      onChange={(event) => setAnswer(event.target.value)}
                      disabled={saving || deleting}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          direction: "rtl",
                        },
                      }}
                    />
                  </Stack>
                </Box>

                <Divider />

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ p: 2, bgcolor: "background.paper" }}
                >
                  <Button
                    variant="contained"
                    onClick={handleUpdate}
                    disabled={saving || deleting}
                    sx={{ bgcolor: ACCENT, "&:hover": { bgcolor: "#152f42" } }}
                  >
                    {saving ? "saving..." : "update & close"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteOutlineIcon />}
                    onClick={() => setOpenDeleteDialog(true)}
                    disabled={saving || deleting}
                  >
                    delete
                  </Button>
                  <Button
                    variant="text"
                    onClick={() => {
                      setSelectedId("");
                      setAnswer("");
                    }}
                    disabled={saving || deleting}
                  >
                    cancel
                  </Button>
                </Stack>
              </>
            ) : (
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{ flex: 1, p: 4, opacity: 0.7 }}
                spacing={1.5}
              >
                <ConfirmationNumberOutlinedIcon
                  sx={{ fontSize: 48, color: ACCENT }}
                />
                <Typography variant="h6" fontWeight={600} color={ACCENT}>
                  select a ticket
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  choose a ticket from the list to view and answer
                </Typography>
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={openDeleteDialog}
        onClose={() => !deleting && setOpenDeleteDialog(false)}
      >
        <DialogTitle>delete ticket</DialogTitle>
        <DialogContent>
          <DialogContentText>
            are you sure you want to delete this ticket from user{" "}
            <strong>{selectedTicket?.userid}</strong>? this action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            disabled={deleting}
          >
            cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? "deleting..." : "delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
