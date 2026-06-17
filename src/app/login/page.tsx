"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SimpleSnackbar from "../general-components/SnackbarError";
import { useSnackBarError } from "../stors/snakebar-store";

const ACCENT = "#1B3C53";

export default function LoginPage() {
    const router = useRouter();
    const addMessage = useSnackBarError((state) => state.addMessage);

    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!password.trim()) {
            addMessage("please enter password", "error");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (!response.ok) {
                addMessage("wrong password", "error");
                return;
            }

            addMessage("login successful", "succes");
            router.push("/");
        } catch {
            addMessage("connection error", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f4f7f9",
                backgroundImage:
                    "radial-gradient(circle at top right, #1B3C5314 0%, transparent 45%), radial-gradient(circle at bottom left, #88B7C218 0%, transparent 40%)",
                px: 2,
            }}
        >
            <SimpleSnackbar />

            <Card
                elevation={0}
                sx={{
                    width: "100%",
                    maxWidth: 420,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    boxShadow: `0 12px 40px ${ACCENT}18`,
                }}
            >
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                    <Stack
                        component="form"
                        spacing={3}
                        onSubmit={handleSubmit}
                        alignItems="center"
                    >
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: `${ACCENT}18`,
                                color: ACCENT,
                            }}
                        >
                            <LockOutlinedIcon fontSize="large" />
                        </Box>

                        <Stack spacing={0.5} alignItems="center" width="100%">
                            <Typography
                                variant="h5"
                                fontWeight={700}
                                color={ACCENT}
                            >
                                Admin Login
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                enter password to continue
                            </Typography>
                        </Stack>

                        <TextField
                            fullWidth
                            label="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            autoFocus
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() =>
                                                setShowPassword((prev) => !prev)
                                            }
                                            edge="end"
                                        >
                                            {showPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{
                                bgcolor: ACCENT,
                                py: 1.25,
                                "&:hover": { bgcolor: "#152f42" },
                            }}
                        >
                            {loading ? "checking..." : "login"}
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
