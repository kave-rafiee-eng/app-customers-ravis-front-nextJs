import {
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { TicketStatusEnum, TicketType } from "../users/type";
import { ACCENT } from "./constant";
import { formatTicketDate, questionPreview } from "./utils";

type TicketListItemProps = {
  ticket: TicketType;
  selected: boolean;
  onSelect: () => void;
};

export default function TicketListItem({
  ticket,
  selected,
  onSelect,
}: TicketListItemProps) {
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
            {ticket.user.phone || ticket.user.id}
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

        <Typography variant="caption" color="text.secondary">
          created: {formatTicketDate(ticket.createdAt)}
        </Typography>

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
