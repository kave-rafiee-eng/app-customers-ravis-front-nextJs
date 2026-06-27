import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { TicketStatusEnum, TicketType } from "../users/type";
import { ACCENT } from "./constant";
import { StatusFilter } from "./types";
import TicketListItem from "./TicketListItem";

type TicketListSidebarProps = {
  tickets: TicketType[];
  statusFilter: StatusFilter;
  selectedId: string;
  onStatusFilterChange: (value: StatusFilter) => void;
  onSelect: (ticket: TicketType) => void;
};

export default function TicketListSidebar({
  tickets,
  statusFilter,
  selectedId,
  onStatusFilterChange,
  onSelect,
}: TicketListSidebarProps) {
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
      <Box sx={{ px: 2, py: 1.5, bgcolor: `${ACCENT}08` }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="subtitle2" fontWeight={700} color={ACCENT}>
            Tickets ({tickets.length})
          </Typography>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="ticket-status-filter">status</InputLabel>
            <Select
              labelId="ticket-status-filter"
              label="status"
              value={statusFilter}
              onChange={(event) =>
                onStatusFilterChange(event.target.value as StatusFilter)
              }
              sx={{
                bgcolor: "white",
                borderRadius: 1,
              }}
            >
              <MenuItem value="all">all</MenuItem>
              <MenuItem value={TicketStatusEnum.pending}>pending</MenuItem>
              <MenuItem value={TicketStatusEnum.closed}>closed</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>
      <Divider />

      <Box sx={{ flex: 1, overflow: "auto", p: 1.5 }}>
        {tickets.length === 0 ? (
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
            {tickets.map((ticket) => (
              <TicketListItem
                key={ticket.id}
                ticket={ticket}
                selected={ticket.id === selectedId}
                onSelect={() => onSelect(ticket)}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Paper>
  );
}
