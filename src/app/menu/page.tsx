"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import axios from "axios";
// import TreeView from "./component/TreeView";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
// import EditMenu from "./component/EditMenu";
import SimpleSnackbar from "../general-components/SnackbarError";
import { menuType, typeMenuEnum } from "./type/menu_type";
import {
  API_MENU,
  END_POINT_MENU_ADVANCE,
  END_POINT_MENU_TERSE,
  MENU_API_BASE_URL,
} from "./constant/apiUrl";
import { useSnackBarError } from "../stors/snakebar-store";
import MenuTreeView from "./menuTreeView";
import EditDescription from "./subComponent/Edit_description";
import {
  boardEnum,
  emptyDescription,
  emptyMiniDescription,
  useMenuStore,
} from "./store/menu_store";
import EditMenu from "./component/Edit_Menu";
import Link from "next/link";
import AddMenu from "./subComponent/addMenu";
import { checkTypeMenu } from "./type/checkTypeMenu";
import { postMenu } from "./saveAndCollectMenu/saveAndCollectMenu";

export default function Menu() {
  const refreshTick = useMenuStore((state) => state.refreshTick);

  const [editId, setEditId] = React.useState<string>("");
  const [allMenus, setAllMenus] = React.useState<menuType[]>([]);
  const [openModalAddMenu, setOpenModalAddMenu] = React.useState(false);
  const addMessage = useSnackBarError((state) => state.addMessage);

  const board = useMenuStore((state) => state.board);
  const setBoard = useMenuStore((state) => state.setBoard);
  const setEndPointMenu = useMenuStore((state) => state.setEndPointMenu);

  const handleCloseModalAddMenu = () => {
    setOpenModalAddMenu(false);
  };

  const loadData = async () => {
    console.log("loadData : " + useMenuStore.getState().endPointMenu);
    try {
      const response = await API_MENU.get(useMenuStore.getState().endPointMenu);
      setAllMenus(response.data);
      console.log(response.data);
    } catch (err) {
      console.log(err);
      addMessage("can not get menus", "error");
    }
  };

  React.useEffect(() => {
    loadData();
  }, [refreshTick, board]);

  const handleEdit = (id: string) => {
    setEditId(id);
  };

  const onDelet = () => {
    setEditId("");
  };

  const handleDownloadJson = () => {
    if (allMenus.length === 0) {
      addMessage("No contacts to download", "error");
      return;
    }

    const json = JSON.stringify(allMenus, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    link.download = `menu_${Object.values(boardEnum).find((v) => v == board)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addMessage("JSON file downloaded", "succes");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        // height: "100vh",
        maxHeight: "100vh",
      }}
    >
      <SimpleSnackbar />

      <Modal open={openModalAddMenu} onClose={handleCloseModalAddMenu}>
        <AddMenu
          allMenus={allMenus}
          onCancel={handleCloseModalAddMenu}
          onSuccess={(id) => {
            addMessage("add new Menu", "succes");
            loadData();
            setEditId(id);
          }}
        />
      </Modal>

      <Box
        sx={{
          background: "#1B3C53",
          height: "10vh",
          justifyContent: "center",
          justifyItems: "center",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <Stack
          direction={"row"}
          spacing={2}
          justifyContent={"space-evenly"}
          width={"100%"}
        >
          <Link color="red" href={"/"}>
            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
              color="white"
            >
              Home
            </Typography>
          </Link>

          <FormControl color="primary">
            <InputLabel id="demo-simple-select-label">Borad</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Navgation"
              value={board}
              size="small"
              color="primary"
              sx={{ background: "white" }}
              onChange={(event) => {
                if (event.target.value == boardEnum.terse)
                  setEndPointMenu(END_POINT_MENU_TERSE);
                if (event.target.value == boardEnum.advance)
                  setEndPointMenu(END_POINT_MENU_ADVANCE);
                setBoard(event.target.value);
                setEditId("");
              }}
            >
              {Object.entries(boardEnum).map((v, index) => {
                return (
                  <MenuItem key={index} value={v[0]}>
                    {v[1]}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="error"
            size="medium"
            onClick={() => {
              setOpenModalAddMenu(true);
            }}
          >
            add new Menu
          </Button>

          <Button variant="contained" onClick={handleDownloadJson}>
            download
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={2} sx={{ height: "80%" }} maxHeight={"80%"}>
        <Grid
          size={4}
          sx={{ background: "#E3E3E3" }}
          maxHeight={"100%"}
          overflow={"auto"}
        >
          <MenuTreeView
            menus={allMenus}
            handleEdit={handleEdit}
            activeId={editId}
          />
        </Grid>

        <Grid
          size={8}
          boxShadow={1}
          sx={{ padding: 1 }}
          maxHeight={"100%"}
          overflow={"auto"}
        >
          {editId.length > 0 ? (
            <EditMenu onDelet={onDelet} idEdit={editId} allMenus={allMenus} />
          ) : (
            <Typography>select a menu...</Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
