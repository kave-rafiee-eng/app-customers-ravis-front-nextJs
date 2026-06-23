"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Modal,
  rgbToHex,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { json } from "stream/consumers";
import { API_CHATBOT } from "../constant";
import { useSnackBarError } from "../stors/snakebar-store";
import ReactMarkdown from "react-markdown";
import { MessageType } from "./message-type";
import { createHistory } from "./history";
import NewConv from "./newCovModal";
import Link from "next/link";
import { Padding } from "@mui/icons-material";

interface MessagesState {
  msg: MessageType[];
  excution: string;
}

export default function ChatMain() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const addError = useSnackBarError((state) => state.addMessage);

  const [sending, setSending] = useState(false);

  const [openModalNewCov, setOpenModalNewCov] = useState(false);
  const handleColseModal = () => {
    setOpenModalNewCov(false);
  };
  const [messages, setMessages] = useState<MessagesState>({
    msg: [],
    excution: "",
  });

  const [executionReport, setExecutionReport] = useState<boolean>(true);

  const [temp, setTemp] = useState("hello");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const sendQuery = async (query: string) => {
    const newMsg: MessageType = {
      type: "human",
      data: query,
    };

    setSending(true);

    try {
      const startTime = Date.now();
      const res = await API_CHATBOT.post("/agent", {
        query: createHistory([...messages.msg, newMsg]),
        executionReport,
      });

      const endTime = Date.now();
      const durationInSeconds = (endTime - startTime) / 1000;

      setMessages((prev) => {
        return {
          ...prev,
          msg: [
            ...prev.msg,
            newMsg,
            { type: "ai", data: res.data.answer, time: durationInSeconds },
          ],
          excution: res.data.Execution,
        };
      });

      setTemp("");
    } catch (err) {
      addError("error http", "error");
    }

    setSending(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "95vh",
        height: "95vh",
        width: "100%",
        bgcolor: "#f4f7f9",
        backgroundImage:
          "radial-gradient(circle at top right, #1B3C5314 0%, transparent 45%), radial-gradient(circle at bottom left, #88B7C218 0%, transparent 40%)",
      }}
      p={0}
      m={0}
    >
      <Modal
        open={openModalNewCov}
        onClose={() => {}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <NewConv
          onClose={handleColseModal}
          onSuccess={(msg) => {
            setTemp(msg);
            setMessages({
              msg: [],
              excution: "",
            });
            handleColseModal();
          }}
        />
      </Modal>

      <Stack
        direction={"row"}
        justifyContent={"space-evenly"}
        alignItems={"center"}
        alignContent={"center"}
        minHeight={"10%"}
        spacing={2}
        sx={{
          background: "#1B3C53",
        }}
      >
        <Link color="red" href={"/"}>
          <Typography variant="h6" fontWeight={700} gutterBottom color="white">
            Home
          </Typography>
        </Link>

        <Button
          variant="contained"
          onClick={() => {
            setOpenModalNewCov(true);
          }}
          sx={{
            borderRadius: 3,
            textTransform: "none",
          }}
        >
          new converstion
        </Button>
      </Stack>

      <Stack
        direction={"row"}
        justifyContent={"space-evenly"}
        alignItems={"center"}
        alignContent={"center"}
        minHeight={"90%"}
        spacing={2}
        sx={{
          background: "#0A3C53",
        }}
        p={2}
      >
        <Card
          sx={{
            width: "20%",
            height: "100%",
          }}
          elevation={3}
        >
          <CardContent sx={{ Padding: 10 }}>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked
                  checked={executionReport}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setExecutionReport(event.target.checked);
                  }}
                />
              }
              label={"report"}
            />
            <Divider></Divider>
            {executionReport && (
              <Typography>Agent Execution Report :</Typography>
            )}

            <ReactMarkdown>{messages.excution}</ReactMarkdown>
          </CardContent>
        </Card>

        <Card
          sx={{
            width: "80%",
            height: "100%",
          }}
          elevation={3}
        >
          <Stack
            direction={"column"}
            sx={{ minHeight: "100%", height: "100%" }}
            spacing={1}
          >
            <Stack
              flexDirection={"column"}
              sx={{
                width: "100%",
                height: "80%",
                maxHeight: "80%",
                minHeight: "80%",
                alignItems: "end",
                overflowY: "auto",
              }}
              spacing={1}
              p={2}
            >
              {messages.msg.map((value, index) => {
                return (
                  <Box
                    sx={{
                      borderRadius: "8px",
                      background: value.type === "ai" ? "#E3F2FD" : "#F1F8E9",
                      direction: "rtl",
                      unicodeBidi: "plaintext",
                    }}
                    key={index}
                    p={1}
                    // ml={2}
                  >
                    <Stack>
                      {value.time && (
                        <Typography color="error">{value.time} sec</Typography>
                      )}
                      <ReactMarkdown>{value.data}</ReactMarkdown>
                    </Stack>
                  </Box>
                );
              })}
              <div ref={messagesEndRef}></div>
            </Stack>

            <Stack
              direction={"row"}
              justifyContent={"space-evenly"}
              sx={{
                height: "10%",
                width: "100%",
                background: "#eeeeee",
              }}
              spacing={1}
              p={1}
            >
              <TextField
                value={temp}
                onChange={(e) => setTemp((state) => e.target.value)}
                dir="rtl"
                disabled={sending}
                multiline={true}
                sx={{
                  width: "80%",
                }}
                margin="normal"
              />
              <Button
                disabled={sending}
                variant="contained"
                onClick={async () => {
                  await sendQuery(temp);
                }}
              >
                Send
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
