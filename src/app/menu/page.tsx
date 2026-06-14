"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import axios from "axios";
// import TreeView from "./component/TreeView";
import { Grid, Typography } from "@mui/material";
// import EditMenu from "./component/EditMenu";
import SimpleSnackbar from "../general-components/SnackbarError";
import { menuType } from "./type/menu_type";
import {
  API_MENU,
  END_POINT_MENU_ADVANCE,
  MENU_API_BASE_URL,
} from "./constant/apiUrl";
import { useSnackBarError } from "../stors/snakebar-store";
import MenuTreeView from "./menuTreeView";
import EditDescription from "./subComponent/Edit_description";
import { useMenuStore } from "./store/menu_store";
import EditMenu from "./component/Edit_Menu";
import Link from "next/link";

export default function Menu() {
  const refreshTick = useMenuStore((state) => state.refreshTick);

  const [editId, setEditId] = React.useState<string>("105");
  const [allMenus, setAllMenus] = React.useState<menuType[]>([]);

  const addMessage = useSnackBarError((state) => state.addMessage);

  const loadData = React.useCallback(async () => {
    console.log("loadData");
    try {
      const response = await API_MENU.get(END_POINT_MENU_ADVANCE);
      setAllMenus(response.data);
    } catch (err) {
      console.log(err);
      addMessage("can not get menus", "error");
    }
  }, [addMessage]);

  React.useEffect(() => {
    loadData();
  }, [refreshTick, loadData]);
  const handleEdit = (id: string) => {
    setEditId(id);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        maxHeight: "100vh",
      }}
    >
      {/* <Button
        variant="text"
        onClick={() => {
          loadData();
        }}
      >
        refresh
      </Button> */}

      <SimpleSnackbar />
      <Box sx={{ background: "#1B3C53", height: "10%" }}>
        <Link color="red" href={"/"}>
          <Typography variant="h6" fontWeight={700} gutterBottom color="white">
            Home
          </Typography>
        </Link>
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
          <EditMenu idEdit={editId} allMenus={allMenus} />
        </Grid>
      </Grid>
    </Box>
  );
}
