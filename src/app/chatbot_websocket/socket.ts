import { create } from "zustand";
import { CHATBOT_WS_URL } from "../constant";

type Listener = (data: any) => void;

type socketStorType = {
  socket: WebSocket | null;
  connected: boolean;
  listeners: Listener[];

  _manualDisconnect: boolean;

  connect: () => void;
  disconnect: () => void;
  subscribe: (callback: Listener) => () => void;
  send: (data: Object) => void;
};

export const useSocket = create<socketStorType>((set, get) => ({
  socket: null,
  connected: false,
  listeners: [],
  _manualDisconnect: false,

  connect: () => {
    set({ _manualDisconnect: true });
    if (get().socket) return;

    const port = `${CHATBOT_WS_URL}/ws/${Math.floor(Math.random() * 10000)}`;
    console.log(port);

    const ws = new WebSocket(port);
    console.log(`websocet:${port}`);

    ws.onopen = () => {
      console.log("WS connected");
      set({ connected: true });
    };

    ws.onclose = () => {
      console.log("WS disconnected");
      set({ connected: false, socket: null });
      if (!get()._manualDisconnect) {
        setTimeout(() => {
          console.log("Reconnect");
          get().connect();
        }, 2000);
      }
    };

    ws.onmessage = (event) => {
      const data = event.data;
      get().listeners.forEach((cb) => cb(data));
    };
    set({ socket: ws, _manualDisconnect: false });
  },

  disconnect: () => {
    const socket = get().socket;
    set({ _manualDisconnect: true });
    if (socket) {
      socket.close();
      set({ socket: null, connected: false });
      console.log("WS manually disconnected");
    }
  },

  subscribe: (callback) => {
    set((state) => ({
      listeners: [...state.listeners, callback],
    }));

    return () => {
      set((state) => ({
        listeners: state.listeners.filter((cb) => cb !== callback),
      }));
    };
  },
  send: (data) => {
    const ws = get().socket;

    if (ws && ws.readyState === 1) {
      ws.send(JSON.stringify(data));
    } else {
      console.log("socket not connected");
    }
  },
}));

// let connect = useSocket((state) => state.connect);
// let connected = useSocket((state) => state.connected);
// const send = useSocket((state) => state.send);
// const subscribe = useSocket((state) => state.subscribe);

// useEffect(() => {
//     const unSub = subscribe((reciveData) => {
//         console.log(reciveData);
//         const recived = JSON.parse(reciveData);

//         if (recived.cmd) {
//             setMessages((prev) => {
//                 return {
//                     ...prev,
//                     steps: [],
//                 };
//             });
//         } else if (recived.ai_resault) {
//             const newMsg: messageType = {
//                 type: "ai",
//                 data: recived.ai_resault,
//             };
//             setMessages((prev) => {
//                 return {
//                     ...prev,
//                     msg: [...prev.msg, newMsg],
//                 };
//             });
//         } else {
//             setMessages((prev) => {
//                 return {
//                     ...prev,
//                     steps: [...prev.steps, JSON.stringify(recived)],
//                 };
//             });
//         }

//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     });
//     return () => {
//         unSub();
//     };
// });
