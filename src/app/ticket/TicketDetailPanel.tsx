import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { TicketStatusEnum, TicketType } from "../users/type";
import { ACCENT } from "./constant";
import { formatTicketDate } from "./utils";

type TicketDetailPanelProps = {
  ticket?: TicketType;
  answer: string;
  saving: boolean;
  deleting: boolean;
  onAnswerChange: (value: string) => void;
  onUpdate: () => void;
  onDeleteClick: () => void;
  onCancel: () => void;
};

function DetailField({
  label,
  value,
  bgcolor = "#f8fafb",
  rtl = false,
}: {
  label: string;
  value: string;
  bgcolor?: string;
  rtl?: boolean;
}) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Paper
        elevation={0}
        sx={{
          mt: 0.5,
          p: 2,
          bgcolor,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          ...(rtl && {
            direction: "rtl",
            unicodeBidi: "plaintext",
          }),
        }}
      >
        <Typography variant="body2" lineHeight={1.8}>
          {value}
        </Typography>
      </Paper>
    </Box>
  );
}

export default function TicketDetailPanel({
  ticket,
  answer,
  saving,
  deleting,
  onAnswerChange,
  onUpdate,
  onDeleteClick,
  onCancel,
}: TicketDetailPanelProps) {
  if (!ticket) {
    return (
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
      </Paper>
    );
  }

  return (
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
            label={ticket.status}
            size="small"
            color={
              ticket.status === TicketStatusEnum.closed ? "success" : "warning"
            }
          />
        </Stack>
      </Box>
      <Divider />

      <Box sx={{ flex: 1, overflow: "auto", p: 2.5 }}>
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Box sx={{ minWidth: 140 }}>
              <Typography variant="caption" color="text.secondary">
                created at
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {formatTicketDate(ticket.createdAt)}
              </Typography>
            </Box>

            {ticket.status === TicketStatusEnum.closed && (
              <Box sx={{ minWidth: 140 }}>
                <Typography variant="caption" color="text.secondary">
                  closed at
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatTicketDate(ticket.closedAt)}
                </Typography>
              </Box>
            )}
          </Stack>

          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Box sx={{ minWidth: 140 }}>
              <Typography variant="caption" color="text.secondary">
                user phone
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {ticket.user.phone || "-"}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 140 }}>
              <Typography variant="caption" color="text.secondary">
                user name
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {ticket.user.name || "-"}
              </Typography>
            </Box>
          </Stack>

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
                {ticket.question}
              </Typography>
            </Paper>
          </Box>

          {ticket.answer && (
            <DetailField
              label="current answer"
              value={ticket.answer}
              bgcolor="#f0f7f0"
              rtl
            />
          )}

          <TextField
            label="answer"
            multiline
            minRows={5}
            fullWidth
            value={answer}
            onChange={(event) => onAnswerChange(event.target.value)}
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
          onClick={onUpdate}
          disabled={saving || deleting}
          sx={{ bgcolor: ACCENT, "&:hover": { bgcolor: "#152f42" } }}
        >
          {saving ? "saving..." : "update & close"}
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteOutlineIcon />}
          onClick={onDeleteClick}
          disabled={saving || deleting}
        >
          delete
        </Button>
        <Button
          variant="text"
          onClick={onCancel}
          disabled={saving || deleting}
        >
          cancel
        </Button>
      </Stack>
    </Paper>
  );
}
