"use client";

import * as React from "react";
import { Box, Grid } from "@mui/material";
import SimpleSnackbar from "../general-components/SnackbarError";
import { useSnackBarError } from "../stors/snakebar-store";
import { API_BACKEND } from "../constant";
import { TicketType } from "../users/type";
import DeleteTicketDialog from "./DeleteTicketDialog";
import TicketDetailPanel from "./TicketDetailPanel";
import TicketListSidebar from "./TicketListSidebar";
import TicketPageHeader from "./TicketPageHeader";
import { StatusFilter } from "./types";

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
      const response = await API_BACKEND.get<TicketType[]>("/user/tickets/all");
      setTickets(response.data);
    } catch (err) {
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
      await API_BACKEND.patch(`user/tickets/${selectedTicket.id}/close`, {
        answer: answer.trim(),
      });
      addMessage("ticket updated", "succes");
      await loadTickets();
      setSelectedId("");
      setAnswer("");
    } catch (err) {
      addMessage("failed to update ticket", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTicket) return;

    setDeleting(true);
    try {
      await API_BACKEND.delete(`user/tickets/${selectedTicket.id}`);
      addMessage("ticket deleted", "succes");
      setOpenDeleteDialog(false);
      setSelectedId("");
      setAnswer("");
      await loadTickets();
    } catch (err) {
      addMessage("failed to delete ticket", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    setSelectedId("");
    setAnswer("");
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
      <TicketPageHeader />

      <Grid container sx={{ flex: 1, minHeight: 0, p: 2 }} spacing={2}>
        <Grid size={{ xs: 12, md: 4 }} sx={{ height: "100%", minHeight: 0 }}>
          <TicketListSidebar
            tickets={filteredTickets}
            statusFilter={statusFilter}
            selectedId={selectedId}
            onStatusFilterChange={setStatusFilter}
            onSelect={handleSelect}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }} sx={{ height: "100%", minHeight: 0 }}>
          <TicketDetailPanel
            ticket={selectedTicket}
            answer={answer}
            saving={saving}
            deleting={deleting}
            onAnswerChange={setAnswer}
            onUpdate={handleUpdate}
            onDeleteClick={() => setOpenDeleteDialog(true)}
            onCancel={handleCancel}
          />
        </Grid>
      </Grid>

      <DeleteTicketDialog
        open={openDeleteDialog}
        deleting={deleting}
        userPhone={selectedTicket?.user.phone}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
