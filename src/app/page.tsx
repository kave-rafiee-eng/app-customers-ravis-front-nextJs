import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import type { SvgIconComponent } from "@mui/icons-material";

type Section = {
  title: string;
  description: string;
  href: string;
  icon: SvgIconComponent;
  accent: string;
};

const appSections: Section[] = [
  {
    title: "Advance Menus",
    description: "Create and edit nested menu structures",
    href: "menus",
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
];

function SectionCard({ section }: { section: Section }) {
  const Icon = section.icon;

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: section.accent,
          boxShadow: `0 8px 24px ${section.accent}22`,
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{}}>
        <Stack spacing={2} height="100%">
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: `${section.accent}18`,
              color: section.accent,
            }}
          >
            <Icon />
          </Box>
          <Box flex={1}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              <nav>
                <Link href={`/${section.href}`}>{section.title}</Link>
              </nav>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {section.description}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
      <CardActions>
        <Box
          flexDirection={"row"}
          justifyContent={"center"}
          width={"100%"}
          display={"flex"}
        ></Box>
      </CardActions>
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
    <Stack spacing={2.5}>
      <Typography variant="h5" fontWeight={700} color="text.primary">
        {title}
      </Typography>
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
  return (
    <Box
      // dir="rtl"
      sx={{
        minHeight: "100vh",
        bgcolor: "#f4f7f9",
        backgroundImage:
          "radial-gradient(circle at top right, #1B3C5314 0%, transparent 45%), radial-gradient(circle at bottom left, #88B7C218 0%, transparent 40%)",
      }}
    >
      <Box
        sx={{
          bgcolor: "#1B3C53",
          color: "white",
          py: { xs: 4, md: 6 },
          mb: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={1.5} alignItems="flex-start">
            <Typography variant="h3" fontWeight={800} letterSpacing={-0.5}>
              Admin panel
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.85, fontWeight: 400 }}>
              first page
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 6 }}>
        <Stack spacing={5}>
          <SectionGroup title="main" sections={appSections} />
          <Card
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#1B3C5318",
                    color: "#1B3C53",
                  }}
                >
                  <InfoOutlinedIcon />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    about Project
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    React app with next.js for managing data
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
