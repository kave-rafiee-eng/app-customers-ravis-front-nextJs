"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
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
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "row",
      }}
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

      <Box
        sx={{
          height: "100%",
          width: "80%",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          border: 1,
        }}
      >
        <Box
          sx={{
            height: "10%",
            width: "100%",
            background: "#ffffff",
            display: "flex",
            flexDirection: "row",
            border: 1,
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              setOpenModalNewCov(true);
            }}
          >
            new converstion
          </Button>
        </Box>

        <Box
          sx={{
            width: "100%",
            height: "80%",
            maxHeight: "80%",
            display: "flex",
            flexDirection: "column",
            border: 1,
            alignItems: "end",
            overflowY: "auto",
          }}
        >
          {messages.msg.map((value, index) => {
            return (
              <Box
                sx={{
                  mt: 1,
                  p: 1.5,
                  borderRadius: "8px",
                  background: value.type === "ai" ? "#E3F2FD" : "#F1F8E9",
                  direction: "rtl",
                  unicodeBidi: "plaintext",
                }}
                key={index}
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
        </Box>

        <Box
          sx={{
            height: "10%",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            border: 1,
            justifyContent: "center",
          }}
        >
          <TextField
            value={temp}
            onChange={(e) => setTemp((state) => e.target.value)}
            dir="rtl"
            disabled={sending}
            multiline={true}
            fullWidth
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
        </Box>
      </Box>

      <Box
        sx={{
          height: "100%",
          width: "20%",
          background: "#eeeeee",
          display: "flex",
          flexDirection: "column",
          border: 1,
        }}
      >
        <Box
          sx={{
            mt: 1,
            background: "#cccccc",
          }}
        >
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
          {executionReport && <Typography>Agent Execution Report :</Typography>}

          <ReactMarkdown>{messages.excution}</ReactMarkdown>
        </Box>
      </Box>
    </Box>
  );
}
