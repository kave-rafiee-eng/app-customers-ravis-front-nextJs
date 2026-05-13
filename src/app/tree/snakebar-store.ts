import { error } from "console";
import { create } from "zustand";

type snackbarStore = {
    errors: string[];
    addError: (text: string) => void;
    deletError: (id: number) => void;
};
export const useSnackBarError = create<snackbarStore>((set, get) => ({
    errors: [],
    addError: (text) => {
        set((pre) => {
            return {
                errors: [...pre.errors, text],
            };
        });
    },
    deletError: (id) => {
        set((pre) => ({
            errors: pre.errors.filter((_, index) => index !== id),
        }));
    },
}));
