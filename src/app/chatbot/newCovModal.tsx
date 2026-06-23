import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from "@mui/material";
import { MessageType } from "./message-type";
import Checkbox from "@mui/material/Checkbox";
import { useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type NewCovProps = {
  onClose: () => void;
  onSuccess: (msg: string) => void;
};

const categories: string[] = ["کدهای خطا برد راویس", "yaskawa l1000a"];

export default function NewConv({ onClose, onSuccess }: NewCovProps) {
  const [checked, setChecked] = useState<boolean[]>(
    Array(categories.length).fill(false),
  );

  const handleChange = (index: number, value: boolean) => {
    setChecked((prev) => {
      return [
        ...prev.map((v, i) => {
          if (i == index) return value;
          return v;
        }),
      ];
    });
  };

  return (
    <Box sx={style} display="flex" flexDirection="column" gap={2}>
      <Typography variant="h6" fontWeight={700}>
        new Coverstion category
      </Typography>

      <Stack spacing={2}>
        <Typography sx={{ minWidth: 48 }}>category</Typography>

        <FormGroup>
          {categories.map((category, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  defaultChecked
                  checked={checked[index]}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    handleChange(index, event.target.checked);
                  }}
                />
              }
              label={category}
            />
          ))}
        </FormGroup>
      </Stack>

      <Stack direction="row" justifyContent="flex-end" spacing={1}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onSuccess(
              "سلام گفتگوی جدید ایجاد کنیم با موضوعات :" +
                categories.filter((_, index) => checked[index]).join(" و "),
            );
          }}
        >
          create
        </Button>
      </Stack>
    </Box>
  );
}
