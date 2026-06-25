"use client";

import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import StorageIcon from "@mui/icons-material/Storage";
import type { SvgIconComponent } from "@mui/icons-material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { API_BACKEND } from "./constant";

const ACCENT = "#1B3C53";

type Section = {
  title: string;
  description: string;
  href: string;
  icon: SvgIconComponent;
  accent: string;
};

const appSections: Section[] = [
  {
    title: "Advance Menu",
    description: "Create and edit nested menu structures",
    href: "menu",
    icon: AccountTreeIcon,
    accent: "#1B3C53",
  },
  {
    title: "Error Codes",
    description: "Manage error codes for Advance and Terse",
    href: "error-codes",
    icon: ErrorOutlineIcon,
    accent: "#B45309",
  },
  {
    title: "Chat",
    description: "Test the AI assistant and response speed",
    href: "chatbot",
    icon: SmartToyIcon,
    accent: "#2E5A6F",
  },
  {
    title: "Documents",
    description: "Edit PDF files and categories",
    href: "documents",
    icon: PictureAsPdfIcon,
    accent: "#0F766E",
  },
  {
    title: "Phonebook",
    description: "Edit name, phone and description",
    href: "phonebook",
    icon: ContactPhoneIcon,
    accent: "#456882",
  },
  {
    title: "tickets",
    description: "tickets and supports",
    href: "ticket",
    icon: SupportAgentIcon,
    accent: "#0F766E",
  },
  {
    title: "document for ai",
    description: "dpcument for rag system",
    href: "documents_for_ai",
    icon: StorageIcon,
    accent: "#0F766E",
  },
];

function SectionCard({ section }: { section: Section }) {
  const Icon = section.icon;

  return (
    <Card
      component={Link}
      href={`/${section.href}`}
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        color: "inherit",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        transition: "all 0.25s ease",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          bgcolor: section.accent,
          opacity: 0.85,
          transition: "height 0.25s ease",
        },
        "&:hover": {
          borderColor: section.accent,
          boxShadow: `0 14px 32px ${section.accent}24`,
          transform: "translateY(-4px)",
          "&::before": {
            height: 6,
          },
          "& .section-arrow": {
            opacity: 1,
            transform: "translateX(4px)",
          },
        },
      }}
    >
      <CardContent sx={{ flex: 1, pt: 3, pb: 2.5 }}>
        <Stack spacing={2.5} height="100%">
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: `${section.accent}14`,
              color: section.accent,
            }}
          >
            <Icon />
          </Box>

          <Box flex={1}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              {section.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
              {section.description}
            </Typography>
          </Box>

          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{
              color: section.accent,
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            <Typography variant="body2" fontWeight={600} color="inherit">
              open
            </Typography>
            <ArrowForwardIcon
              className="section-arrow"
              sx={{
                fontSize: 18,
                opacity: 0.7,
                transition: "all 0.25s ease",
              }}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function SectionGroup({
  title,
  sections,
}: {
  title: string;
  sections: Section[];
}) {
  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box
          sx={{
            width: 4,
            height: 28,
            borderRadius: 1,
            bgcolor: ACCENT,
          }}
        />
        <Typography variant="h5" fontWeight={700} color="text.primary">
          {title}
        </Typography>
      </Stack>

      <Grid container spacing={2.5}>
        {sections.map((section) => (
          <Grid key={section.href} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <SectionCard section={section} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

export default function Home() {
  const router = useRouter();
  const [lastUpdate, setLastUpdate] = React.useState<string>("");
  const [updated, setUpdated] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);

  React.useEffect(() => {
    getLastUpdate();
  }, []);

  async function getLastUpdate() {
    try {
      const res = await API_BACKEND.get("/version");
      setLastUpdate(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  function generateRandomString(length: number) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }

  async function updateVersion() {
    setUpdating(true);
    try {
      const res = await API_BACKEND.post(
        `/version/${generateRandomString(10)}`,
      );
      setLastUpdate(res.data);
      setUpdated(true);
    } catch (err) {
      console.log(err);
    } finally {
      setUpdating(false);
    }
  }

  const logOut = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/logout", { method: "POST" });
      router.push("/login");
    } catch (err) {
      console.log(err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f4f7f9",
        backgroundImage:
          "radial-gradient(circle at top right, #1B3C5314 0%, transparent 45%), radial-gradient(circle at bottom left, #88B7C218 0%, transparent 40%)",
      }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          bgcolor: ACCENT,
          color: "white",
          py: { xs: 5, md: 7 },
          mb: { xs: 4, md: 6 },
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 85% 20%, rgba(255,255,255,0.12) 0%, transparent 35%), radial-gradient(circle at 10% 90%, rgba(136,183,194,0.25) 0%, transparent 40%)",
            pointerEvents: "none",
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={3}
          >
            <Stack spacing={1.5} maxWidth={640}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "rgba(255,255,255,0.12)",
                  }}
                >
                  <DashboardOutlinedIcon />
                </Box>
                <Chip
                  label="admin"
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.14)",
                    color: "white",
                    fontWeight: 600,
                  }}
                />
              </Stack>

              <Typography
                variant="h3"
                fontWeight={800}
                letterSpacing={-0.5}
                sx={{ fontSize: { xs: "2rem", md: "2.75rem" } }}
              >
                Admin Panel
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  opacity: 0.88,
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                Manage menus, documents, error codes and more from one place.
              </Typography>

              <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                <Chip
                  icon={
                    <RefreshOutlinedIcon sx={{ color: "inherit !important" }} />
                  }
                  label={
                    lastUpdate
                      ? `version: ${lastUpdate}`
                      : "version: loading..."
                  }
                  onClick={updateVersion}
                  disabled={updating}
                  sx={{
                    bgcolor: updated
                      ? "rgba(167,243,208,0.2)"
                      : "rgba(251,191,36,0.22)",
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.18)",
                    },
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{ opacity: 0.75, alignSelf: "center" }}
                >
                  click to publish a new version
                </Typography>
              </Stack>
            </Stack>

            <Tooltip title="log out">
              <Button
                variant="outlined"
                startIcon={<LogoutOutlinedIcon />}
                onClick={logOut}
                disabled={loggingOut}
                sx={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.45)",
                  whiteSpace: "nowrap",
                  px: 2.5,
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                {loggingOut ? "logging out..." : "log out"}
              </Button>
            </Tooltip>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 6 }}>
        <Stack spacing={5}>
          <SectionGroup title="Modules" sections={appSections} />

          <Card
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              background:
                "linear-gradient(135deg, rgba(27,60,83,0.04) 0%, rgba(136,183,194,0.08) 100%)",
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: `${ACCENT}18`,
                    color: ACCENT,
                    flexShrink: 0,
                  }}
                >
                  <InfoOutlinedIcon />
                </Box>
                <Box flex={1}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    About this project
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    lineHeight={1.8}
                  >
                    React admin dashboard built with Next.js for managing
                    application data, menus, documents and customer-facing
                    content.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
