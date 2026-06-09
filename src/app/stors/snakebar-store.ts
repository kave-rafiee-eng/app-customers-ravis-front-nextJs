import { error } from "console";
import { create } from "zustand";

type messageType = {
  type: "error" | "succes";
  text: string;
};
type snackbarStore = {
  messages: messageType[];
  addMessage: (text: string, type: "error" | "succes") => void;
  deletMessage: (id: number) => void;
};

export const useSnackBarError = create<snackbarStore>((set, get) => ({
  messages: [],
  addMessage: (text, type) => {
    const newMess: messageType = {
      type,
      text,
    };
    set((pre) => {
      return {
        messages: [...pre.messages, newMess],
      };
    });
  },

  deletMessage: (id) => {
    set((pre) => ({
      messages: pre.messages.filter((_, index) => index !== id),
    }));
  },
}));
