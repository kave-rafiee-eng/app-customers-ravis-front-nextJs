import {
  Box,
  Button,
  Divider,
  Icon,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { userType } from "./type";
import { API_BACKEND } from "../constant";
import { useSnackBarError } from "../stors/snakebar-store";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

type propsType = {
  id: string;
};

export default function ShowUser({ id }: propsType) {
  const [user, setUser] = useState<userType>();

  const addMessage = useSnackBarError((state) => state.addMessage);

  const loadUser = async () => {
    try {
      const res = await API_BACKEND.get(`user/${id}`);
      setUser(res.data);
    } catch (err) {
      addMessage("can not get error", "error");
    }
  };

  useEffect(() => {
    loadUser();
  }, [id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      addMessage("copy", "succes");
    } catch (err) {}
  };

  return (
    <Box>
      <Typography>user detalis</Typography>
      {user && (
        <Stack>
          <Typography>{user.id}</Typography>
          <Button
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopy}
          >
            copy
          </Button>
          <Typography>{user.phone}</Typography>
          <Divider></Divider>
          <Typography>agentMemory</Typography>
          <Typography>{user.agentMemory}</Typography>
        </Stack>
      )}
    </Box>
  );
}
