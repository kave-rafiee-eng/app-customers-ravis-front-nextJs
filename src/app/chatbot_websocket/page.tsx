"use client";

import { Box, Button } from "@mui/material";
import { useSocket } from "./socket";
import { useEffect, useState } from "react";

export default function ChatbotWebSocket() {
  const connect = useSocket((state) => state.connect);
  const send = useSocket((state) => state.send);
  const subscribe = useSocket((state) => state.subscribe);
  const connected = useSocket((state) => state.connected);

  const [text, setText] = useState("");

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    const unSub = subscribe((reciveData) => {
      console.log(JSON.parse(reciveData));

      const data = JSON.parse(reciveData);

      if (data.on_stream) {
        const text = data.on_stream as string;
        setText((prev) => prev + text);
      }

      if (data.too_call) {
      }

      // const recived = JSON.parse(reciveData);
    });
    return () => {
      unSub();
    };
  });
  return (
    <Box>
      connected : {connected === true ? "ok" : "error"}
      <Button
        variant="contained"
        onClick={() => {
          send("خطای 1 برد ادونس چیه؟");
          setText("");
        }}
      >
        send
      </Button>
      {text}
    </Box>
  );
}
