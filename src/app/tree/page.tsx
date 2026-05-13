"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { menuType } from "./type/menu-type";
import axios from "axios";
import TreeView from "./component/TreeView";
import { Grid } from "@mui/material";
import EditMenu from "./component/EditMenu";
import { typeMenuEnum } from "./type/menu-type";
import SimpleSnackbar from "./component/SnackbarError";

export default function Menu() {
    const [editId, setEditId] = React.useState<string>("14");
    const api = axios.create({
        // baseURL: "http://localhost:3000",
        baseURL: "http://10.240.195.179:3000",
    });

    const [allMenus, setAllMenus] = React.useState<menuType[]>([]);

    React.useEffect(() => {
        const loadData = async () => {
            try {
                const response = await api.get("/menu");
                setAllMenus((prev) => {
                    return response.data;
                });
            } catch (err) {
                console.log(err);
            }
        };

        loadData();
    }, []);

    const handleEdit = (id: string) => {
        console.log(`select id ${id}`);
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
            <SimpleSnackbar></SimpleSnackbar>
            <Box sx={{ background: "#1B3C53", height: "10%" }}></Box>

            <Grid
                container
                spacing={2}
                sx={{ height: "80%" }}
                maxHeight={"80%"}
            >
                <Grid
                    size={4}
                    sx={{ background: "#E3E3E3" }}
                    maxHeight={"100%"}
                    overflow={"auto"}
                >
                    <TreeView menus={allMenus} handleEdit={handleEdit} />
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
