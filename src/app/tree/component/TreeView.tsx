"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { useSimpleTreeViewApiRef } from "@mui/x-tree-view/hooks";
import { menuType, typeMenuEnum } from "../type/menu-type";
import { Typography } from "@mui/material";

type maptype = {
    [key: string]: nodesType;
};
function convert(menuData: menuType[]) {
    let map: maptype = {};
    let root: nodesType[] = [];

    menuData.forEach((menu) => {
        let label = "";
        if (menu.parentId.length) {
            label = menu.parentId[0].label;
        } else label = menu.lable != undefined ? menu.lable : "no name";

        map[menu.id] = {
            id: menu.id,
            //name: menu.lable != undefined ? menu.lable : "empty name",
            name: label,
            children: [],
            type: menu.type === typeMenuEnum.SUBMENU ? "subMenu" : "setting",
        };
    });

    menuData.forEach((menu) => {
        if (menu.parentId.length == 0) {
            if (menu.lable == "Main") root.push(map[menu.id]);
        } else {
            menu.parentId.forEach((parent) => {
                map[parent.id].children.push({ ...map[menu.id] });
            });
        }
    });

    return root;
}
// const testData: nodesType = {
//     id: "root",
//     name: "Parent",
//     children: [
//         {
//             id: "1",
//             name: "Child - 1",
//             children: [],
//         },
//         {
//             id: "3",
//             name: "Child - 3",
//             children: [
//                 {
//                     id: "4",
//                     name: "Child - 4",
//                     children: [],
//                 },
//             ],
//         },
//     ],
// };

type nodesType = {
    id: string;
    name: string;
    children: nodesType[];
    type: "subMenu" | "setting";
};

type TreeViewProps = {
    menus: menuType[];
    handleEdit: (id: string) => void;
};
export default function TreeView({ menus, handleEdit }: TreeViewProps) {
    const apiRef = useSimpleTreeViewApiRef();

    React.useEffect(() => {});

    const treeData: nodesType = {
        id: "node is",
        name: "Parent",
        children: convert(menus),
        type: "subMenu",
    };

    const renderTree = (nodes: nodesType) => {
        return (
            <TreeItem
                key={nodes.id}
                itemId={nodes.id}
                label={
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            transition: "0.2s",
                            "&:hover": {
                                backgroundColor: "rgba(0,0,0,0.04)",
                            },
                        }}
                    >
                        {nodes.type === "setting" && (
                            <Button
                                variant="text"
                                size="small"
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 500,
                                }}
                                onClick={() => handleEdit(nodes.id)}
                            >
                                {nodes.name}
                            </Button>
                        )}

                        {nodes.type === "subMenu" && (
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: "text.primary",
                                }}
                            >
                                {nodes.name}
                            </Typography>
                        )}
                    </Stack>
                }
            >
                {Array.isArray(nodes.children)
                    ? nodes.children.map((node) => renderTree(node))
                    : null}
            </TreeItem>
        );
    };

    return (
        <Stack spacing={2} sx={{ height: "100%" }}>
            <Box
                sx={{
                    height: "100%",
                    overflow: "auto",
                    p: 1,
                    borderRadius: 2,
                    backgroundColor: "background.paper",
                }}
            >
                <SimpleTreeView apiRef={apiRef} defaultExpandedItems={["grid"]}>
                    {renderTree(treeData)}
                </SimpleTreeView>
            </Box>
        </Stack>
    );
    // const renderTree = (nodes: nodesType) => {
    //     return (
    //         <TreeItem
    //             key={nodes.id}
    //             itemId={nodes.id}
    //             label={
    //                 <div style={{ background: "red" }}>
    //                     {nodes.type == "setting" && (
    //                         <Button
    //                             variant="outlined"
    //                             sx={{
    //                                 background: "#ffffff",
    //                             }}
    //                             size="small"
    //                             onClick={() => {
    //                                 handleEdit(nodes.id);
    //                             }}
    //                         >
    //                             {nodes.name}
    //                         </Button>
    //                     )}

    //                     {nodes.type == "subMenu" && (
    //                         <Typography>{nodes.name}</Typography>
    //                     )}
    //                 </div>
    //             }
    //         >
    //             {Array.isArray(nodes.children)
    //                 ? nodes.children.map((node) => renderTree(node))
    //                 : null}
    //         </TreeItem>
    //     );
    // };

    // return (
    //     <Stack spacing={2} maxHeight={"100%"}>
    //         <Box sx={{ maxHeight: "100%" }}>
    //             <SimpleTreeView apiRef={apiRef} defaultExpandedItems={["grid"]}>
    //                 {renderTree(treeData)}
    //             </SimpleTreeView>
    //         </Box>
    //     </Stack>
    // );
}

/*
const renderTree = (nodes: nodesType) => {
    return (
        <TreeItem
            key={nodes.id}
            itemId={nodes.id}
            label={
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        transition: "0.2s",
                        "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.04)",
                        },
                    }}
                >
                    {nodes.type === "setting" && (
                        <Button
                            variant="text"
                            size="small"
                            sx={{
                                textTransform: "none",
                                fontWeight: 500,
                            }}
                            onClick={() => handleEdit(nodes.id)}
                        >
                            {nodes.name}
                        </Button>
                    )}

                    {nodes.type === "subMenu" && (
                        <Typography
                            sx={{
                                fontSize: 14,
                                fontWeight: 500,
                                color: "text.primary",
                            }}
                        >
                            {nodes.name}
                        </Typography>
                    )}
                </Stack>
            }
        >
            {Array.isArray(nodes.children)
                ? nodes.children.map((node) => renderTree(node))
                : null}
        </TreeItem>
    );
};

return (
    <Stack spacing={2} sx={{ height: "100%" }}>
        <Box
            sx={{
                height: "100%",
                overflow: "auto",
                p: 1,
                borderRadius: 2,
                backgroundColor: "background.paper",
            }}
        >
            <SimpleTreeView
                apiRef={apiRef}
                defaultExpandedItems={["grid"]}
            >
                {renderTree(treeData)}
            </SimpleTreeView>
        </Box>
    </Stack>
);

*/
