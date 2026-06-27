import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import { Box, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { ACCENT } from "./constant";

export default function TicketPageHeader() {
  return (
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
  );
}
