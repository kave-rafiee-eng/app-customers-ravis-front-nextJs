import { create } from "zustand";

type messageType = {
  type: "error" | "succes";
  text: string;
  autoHideDuration?: number | null;
};

type snackbarStore = {
  messages: messageType[];
  addMessage: (
    text: string,
    type: "error" | "succes",
    autoHideDuration?: number | null,
  ) => void;
  deletMessage: (id: number) => void;
};

export const useSnackBarError = create<snackbarStore>((set) => ({
  messages: [],
  addMessage: (text, type, autoHideDuration) => {
    const newMess: messageType = {
      type,
      text,
      autoHideDuration,
    };
    set((pre) => ({
      messages: [...pre.messages, newMess],
    }));
  },

  deletMessage: (id) => {
    set((pre) => ({
      messages: pre.messages.filter((_, index) => index !== id),
    }));
  },
}));
