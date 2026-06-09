import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import {
    menuType,
    DescriptionType,
    settingOneParameterType,
    MiniDescriptionType,
    ParanetIdLableType,
} from "../type/menu-type";
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { TableBasic, TableBasicProps } from "./TableBasic";
import axios from "axios";
import EditDescription from "./EditDescription";
import EditStrucure from "./EditStructure";
import EditDescriptionAi from "./EditDescriptionAi";
type propsType = {
    descrption: DescriptionType;
    setDescription: (set: (prev: DescriptionType) => DescriptionType) => void;
    descrption_AI: MiniDescriptionType;
    setDescription_AI: (
        set: (prev: MiniDescriptionType) => MiniDescriptionType,
    ) => void;
    allMenu: menuType[];
    id: string;
};
export default function EditMenu_subMenu({
    descrption,
    setDescription,
    descrption_AI,
    setDescription_AI,
    allMenu,
    id,
}: propsType) {
    const [tab, setTab] = React.useState("Description");

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTab(newValue);
    };

    let subMenus: ParanetIdLableType[] = [];

    allMenu.forEach((menu) => {
        menu.parentId.forEach((parent) => {
            parent.id == id &&
                subMenus.push({
                    id: menu.id,
                    label: parent.label,
                });
        });
    });

    type TableRow = {
        id: number;
        maneId: string;
        name: string;
    };

    const tableData: TableRow[] = subMenus.map((sub, index) => ({
        id: index + 1,
        name: sub.label,
        maneId: sub.id,
    }));

    const propsTable: TableBasicProps<TableRow> = {
        columns: [
            {
                id: "id",
                label: "index",
                Width: "10%",
            },
            {
                id: "name",
                label: "name",
            },
            {
                id: "maneId",
                label: "Id",
            },
        ],
        tableData: tableData,
    };

    console.log(subMenus);
    return (
        <>
            <Box sx={{ width: "100%", height: "80%" }}>
                <Tabs
                    value={tab}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                >
                    <Tab value="Description" label="Description" />
                    <Tab value="Submenus" label="Submenus" />
                </Tabs>

                <div
                    hidden={tab != "Description"}
                    style={{
                        width: "100%",
                        height: "80%",
                        maxHeight: "80%",
                        overflowY: "auto",
                    }}
                >
                    <EditDescription
                        description={descrption}
                        setDescription={setDescription}
                    />
                    <EditDescriptionAi
                        description={descrption_AI}
                        setDescription={setDescription_AI}
                    />
                </div>
                <div
                    hidden={tab != "Submenus"}
                    style={{
                        width: "100%",
                        height: "80%",
                        maxHeight: "80%",
                        background: "red",
                    }}
                >
                    <TableBasic
                        height={"100%"}
                        columns={propsTable.columns}
                        tableData={propsTable.tableData}
                    />
                </div>
            </Box>
        </>
    );
}
