import {
  Box,
  Button,
  Checkbox,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useState } from "react";

const ACCENT = "#1B3C53";
const ACCENT_LIGHT = "#456882";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "92vw", sm: 460 },
  maxWidth: 460,
  outline: "none",
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

  const selectedCount = checked.filter(Boolean).length;

  const handleChange = (index: number, value: boolean) => {
    setChecked((prev) => prev.map((v, i) => (i === index ? value : v)));
  };

  const handleCreate = () => {
    onSuccess(
      "سلام گفتگوی جدید ایجاد کنیم با موضوعات :" +
        categories.filter((_, index) => checked[index]).join(" و "),
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        ...style,
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 24px 48px rgba(27,60,83,0.18)",
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 2.5,
          bgcolor: ACCENT,
          color: "white",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
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
            <AddCommentOutlinedIcon />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
              New Conversation
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.85 }}>
              choose topics for this chat
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CategoryOutlinedIcon sx={{ color: ACCENT, fontSize: 20 }} />
            <Typography variant="subtitle2" fontWeight={700} color={ACCENT}>
              Categories
            </Typography>
            {selectedCount > 0 && (
              <Typography
                variant="caption"
                sx={{
                  ml: "auto",
                  px: 1.25,
                  py: 0.25,
                  borderRadius: 1,
                  bgcolor: `${ACCENT}12`,
                  color: ACCENT,
                  fontWeight: 600,
                }}
              >
                {selectedCount} selected
              </Typography>
            )}
          </Stack>

          <Stack spacing={1.25}>
            {categories.map((category, index) => {
              const isSelected = checked[index];

              return (
                <Paper
                  key={index}
                  elevation={0}
                  onClick={() => handleChange(index, !isSelected)}
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderRadius: 2.5,
                    cursor: "pointer",
                    border: "2px solid",
                    borderColor: isSelected ? ACCENT : "divider",
                    bgcolor: isSelected ? `${ACCENT}08` : "background.paper",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: isSelected ? ACCENT : ACCENT_LIGHT,
                      bgcolor: isSelected ? `${ACCENT}10` : `${ACCENT}04`,
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        event.stopPropagation();
                        handleChange(index, event.target.checked);
                      }}
                      sx={{
                        p: 0.5,
                        color: ACCENT_LIGHT,
                        "&.Mui-checked": { color: ACCENT },
                      }}
                    />
                    <Typography
                      variant="body1"
                      fontWeight={isSelected ? 600 : 500}
                      sx={{
                        flex: 1,
                        direction: "rtl",
                        unicodeBidi: "plaintext",
                      }}
                    >
                      {category}
                    </Typography>
                    {isSelected && (
                      <CheckCircleOutlineIcon
                        sx={{ color: ACCENT, fontSize: 20 }}
                      />
                    )}
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 2.5,
              borderColor: "divider",
              color: "text.secondary",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={selectedCount === 0}
            onClick={handleCreate}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 2.5,
              fontWeight: 600,
              bgcolor: ACCENT,
              boxShadow: "none",
              "&:hover": { bgcolor: ACCENT_LIGHT, boxShadow: "none" },
            }}
          >
            Create
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
