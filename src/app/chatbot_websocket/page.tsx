"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Modal,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSnackBarError } from "../stors/snakebar-store";
import { MessageType } from "../chatbot/message-type";
import { createHistory } from "../chatbot/history";
import NewConv from "../chatbot/newCovModal";
import SimpleSnackbar from "../general-components/SnackbarError";
import styles from "../chatbot/Markdown.module.scss";
import { useSocket } from "./socket";

const ACCENT = "#1B3C53";
const ACCENT_LIGHT = "#456882";

type aiResponseType = {
  on_stream?: string;
  too_call?: boolean;
  finish_reason?: string;
};

interface MessagesState {
  msg: MessageType[];
}

const markdownSx = {
  "& p": { m: 0, mb: 1, lineHeight: 1.7 },
  "& p:last-child": { mb: 0 },
  "& ul, & ol": { my: 1, pl: 2.5 },
  "& code": {
    bgcolor: "rgba(0,0,0,0.06)",
    px: 0.75,
    py: 0.25,
    borderRadius: 1,
    fontSize: "0.9em",
  },
  "& pre": {
    bgcolor: "rgba(0,0,0,0.06)",
    p: 1.5,
    borderRadius: 1.5,
    overflow: "auto",
    my: 1,
  },
};

function MessageBubble({ message }: { message: MessageType }) {
  const isAi = message.type === "ai";

  return (
    <Stack
      direction={isAi ? "row" : "row-reverse"}
      spacing={1.5}
      alignItems="flex-start"
      sx={{
        alignSelf: isAi ? "flex-start" : "flex-end",
        maxWidth: { xs: "100%", sm: "85%" },
        width: "fit-content",
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          bgcolor: isAi ? `${ACCENT}18` : "#e3f2fd",
          color: isAi ? ACCENT : "#1565c0",
        }}
      >
        {isAi ? (
          <SmartToyOutlinedIcon fontSize="small" />
        ) : (
          <PersonOutlineIcon fontSize="small" />
        )}
      </Box>

      <Paper
        elevation={0}
        sx={{
          px: 2,
          py: 1.5,
          borderRadius: isAi ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
          bgcolor: isAi ? "white" : "#e8f1f8",
          border: "1px solid",
          borderColor: isAi ? "divider" : "transparent",
          boxShadow: isAi ? "0 2px 12px rgba(27,60,83,0.08)" : "none",
          direction: "rtl",
          unicodeBidi: "plaintext",
          ...markdownSx,
        }}
      >
        {message.time !== undefined && (
          <Chip
            label={`${message.time.toFixed(1)}s`}
            size="small"
            sx={{
              mb: 1,
              height: 22,
              fontSize: 11,
              fontWeight: 600,
              bgcolor: "rgba(27,60,83,0.08)",
              color: ACCENT,
            }}
          />
        )}

        <Box className={styles.markdown}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.data}
          </ReactMarkdown>
        </Box>
      </Paper>
    </Stack>
  );
}

export default function ChatbotWebSocket() {
  const connect = useSocket((state) => state.connect);
  const disconnect = useSocket((state) => state.disconnect);
  const send = useSocket((state) => state.send);
  const subscribe = useSocket((state) => state.subscribe);
  const connected = useSocket((state) => state.connected);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const streamingRef = useRef("");
  const startTimeRef = useRef(0);
  const addError = useSnackBarError((state) => state.addMessage);

  const [sending, setSending] = useState(false);
  const [openModalNewCov, setOpenModalNewCov] = useState(false);
  const [messages, setMessages] = useState<MessagesState>({ msg: [] });
  const [streaming, setStreaming] = useState("");
  const [toolStatus, setToolStatus] = useState("");
  const [temp, setTemp] = useState("hello");
  const [userId, setUserId] = useState<string>("");

  const handleColseModal = () => {
    setOpenModalNewCov(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const userid = localStorage.getItem("userId");
    if (userid) setUserId(userid);
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streaming, toolStatus]);

  useEffect(() => {
    const unSub = subscribe((reciveData) => {
      console.log(reciveData);

      let data: aiResponseType;
      try {
        data = JSON.parse(reciveData) as aiResponseType;
      } catch (err) {
        console.log(err);
        return;
      }

      if (data.on_stream) {
        streamingRef.current += data.on_stream;
        setStreaming(streamingRef.current);
        setToolStatus("");
      }

      if (data.too_call) {
        setToolStatus("tool calling...");
      }

      if (data.finish_reason) {
        const finalText = streamingRef.current.trim();
        const duration = (Date.now() - startTimeRef.current) / 1000;

        if (finalText) {
          setMessages((prev) => ({
            msg: [...prev.msg, { type: "ai", data: finalText, time: duration }],
          }));
        }

        streamingRef.current = "";
        setStreaming("");
        setToolStatus("");
        setSending(false);
      }
    });

    return () => {
      unSub();
    };
  }, [subscribe]);

  const sendQuery = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || sending) return;

    if (!connected) {
      addError("socket is not connected", "error");
      return;
    }

    const history = createHistory(messages.msg);

    console.log(history);
    // const history: MessageType[] = [];

    setMessages((prev) => ({
      msg: [...prev.msg, { type: "human", data: trimmed }],
    }));

    streamingRef.current = "";
    setStreaming("");
    setToolStatus("");
    setSending(true);
    startTimeRef.current = Date.now();

    console.log("send");
    send({
      query: trimmed,
      history,
      userid: userId,
    });

    setTemp("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        bgcolor: "#f4f7f9",
        backgroundImage:
          "radial-gradient(circle at top right, #1B3C5314 0%, transparent 45%), radial-gradient(circle at bottom left, #88B7C218 0%, transparent 40%)",
        overflow: "hidden",
      }}
    >
      <Modal open={openModalNewCov} onClose={() => {}}>
        <NewConv
          onClose={handleColseModal}
          onSuccess={(msg) => {
            setTemp(msg);
            setMessages({ msg: [] });
            streamingRef.current = "";
            setStreaming("");
            setToolStatus("");
            handleColseModal();
          }}
        />
      </Modal>

      <SimpleSnackbar></SimpleSnackbar>

      {/* Header */}
      <Box
        sx={{
          bgcolor: ACCENT,
          color: "white",
          px: { xs: 2, md: 3 },
          py: 1.5,
          boxShadow: "0 2px 16px rgba(27,60,83,0.2)",
          flexShrink: 0,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(255,255,255,0.12)",
              }}
            >
              <SmartToyOutlinedIcon />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
                AI Assistant (WebSocket)
              </Typography>
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: connected ? "#4caf50" : "#e53935",
                  }}
                />
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {connected ? "connected" : "disconnected"}
                </Typography>
              </Stack>
            </Box>

            <TextField
              id="outlined-basic"
              label="user id"
              variant="outlined"
              value={userId}
              size="small"
              fullWidth
              sx={{
                background: "white",
              }}
              onChange={(event) => {
                setUserId(event.target.value);
              }}
            />
            <Button
              sx={{
                color: "white",
                textTransform: "none",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
              onClick={() => {
                localStorage.setItem("userId", userId);
              }}
            >
              Save
            </Button>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              component={Link}
              href="/"
              startIcon={<HomeOutlinedIcon />}
              sx={{
                color: "white",
                textTransform: "none",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              Home
            </Button>
            <Button
              variant="contained"
              startIcon={<AddCommentOutlinedIcon />}
              onClick={() => setOpenModalNewCov(true)}
              sx={{
                bgcolor: "white",
                color: ACCENT,
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: "none",
                "&:hover": { bgcolor: "#f0f4f7", boxShadow: "none" },
              }}
            >
              new conversation
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Chat area */}
      <Stack
        direction="row"
        sx={{ flex: 1, minHeight: 0, p: { xs: 1.5, md: 2 } }}
      >
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minHeight: 0,
          }}
        >
          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              p: { xs: 2, md: 3 },
              bgcolor: "rgba(255,255,255,0.6)",
            }}
          >
            {messages.msg.length === 0 && !streaming && !sending ? (
              <Stack
                alignItems="center"
                justifyContent="center"
                spacing={2}
                sx={{ height: "100%", minHeight: 280, opacity: 0.7 }}
              >
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: `${ACCENT}12`,
                    color: ACCENT,
                  }}
                >
                  <SmartToyOutlinedIcon sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h6" fontWeight={600} color={ACCENT}>
                  start a conversation
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  maxWidth={360}
                >
                  ask a question and the answer will stream in real time
                </Typography>
              </Stack>
            ) : (
              <Stack spacing={2.5}>
                {messages.msg.map((value, index) => (
                  <MessageBubble key={index} message={value} />
                ))}

                {/* Live streaming bubble */}
                {sending && (streaming || toolStatus) && (
                  <MessageBubble
                    message={{ type: "ai", data: streaming || toolStatus }}
                  />
                )}

                {/* Waiting indicator before first token */}
                {sending && !streaming && !toolStatus && (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: `${ACCENT}18`,
                        color: ACCENT,
                      }}
                    >
                      <SmartToyOutlinedIcon fontSize="small" />
                    </Box>
                    <Paper
                      elevation={0}
                      sx={{
                        px: 2,
                        py: 1.5,
                        borderRadius: "4px 16px 16px 16px",
                        bgcolor: "white",
                        border: "1px solid",
                        borderColor: "divider",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <CircularProgress size={16} sx={{ color: ACCENT }} />
                      <Typography variant="body2" color="text.secondary">
                        thinking...
                      </Typography>
                    </Paper>
                  </Stack>
                )}

                {toolStatus && (
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ pl: 6 }}
                  >
                    <BoltOutlinedIcon
                      sx={{ color: ACCENT_LIGHT, fontSize: 18 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {toolStatus}
                    </Typography>
                  </Stack>
                )}

                <div ref={messagesEndRef} />
              </Stack>
            )}
          </Box>

          <Divider />

          {/* Input */}
          <Box
            sx={{
              p: 2,
              bgcolor: "white",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="flex-end">
              <TextField
                fullWidth
                multiline
                maxRows={4}
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendQuery(temp);
                  }
                }}
                dir="rtl"
                disabled={sending}
                placeholder="پیام خود را بنویسید..."
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: "#f8fafb",
                    "&.Mui-focused fieldset": {
                      borderColor: ACCENT_LIGHT,
                    },
                  },
                }}
              />
              <Tooltip title="send">
                <span>
                  <IconButton
                    disabled={sending || !temp.trim()}
                    onClick={() => sendQuery(temp)}
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: ACCENT,
                      color: "white",
                      borderRadius: 2.5,
                      flexShrink: 0,
                      "&:hover": { bgcolor: ACCENT_LIGHT },
                      "&.Mui-disabled": {
                        bgcolor: "action.disabledBackground",
                        color: "action.disabled",
                      },
                    }}
                  >
                    <SendRoundedIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          </Box>
        </Paper>
      </Stack>
    </Box>
  );
}
