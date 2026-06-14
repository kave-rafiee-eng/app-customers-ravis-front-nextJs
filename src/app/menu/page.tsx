"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import axios from "axios";
// import TreeView from "./component/TreeView";
import { Grid } from "@mui/material";
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

export default function Menu() {
  React.useEffect(() => {
    console.log("---- RENDER : Menu");
  });

  const [editId, setEditId] = React.useState<string>("105");
  const [allMenus, setAllMenus] = React.useState<menuType[]>([]);

  const addMessage = useSnackBarError((state) => state.addMessage);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const response = await API_MENU.get(END_POINT_MENU_ADVANCE);
        setAllMenus((prev) => {
          return response.data;
        });
      } catch (err) {
        console.log(err);
        addMessage("can not get menus", "error");
      }
    };
    loadData();
  }, []);

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
      <SimpleSnackbar />
      <Box sx={{ background: "#1B3C53", height: "10%" }}></Box>

      <Grid container spacing={2} sx={{ height: "80%" }} maxHeight={"80%"}>
        <Grid
          size={4}
          sx={{ background: "#E3E3E3" }}
          maxHeight={"100%"}
          overflow={"auto"}
        >
          <MenuTreeView menus={allMenus} handleEdit={handleEdit} />
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
