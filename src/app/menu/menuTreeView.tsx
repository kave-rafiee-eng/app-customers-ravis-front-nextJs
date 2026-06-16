"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { useSimpleTreeViewApiRef } from "@mui/x-tree-view/hooks";
import { menuType, typeMenuEnum } from "./type/menu_type";

const ACCENT = "#1B3C53";
type maptype = {
  [key: string]: nodesType;
};
function convert(menuData: menuType[]): nodesType[] {
  let map: nodesType[] = [];
  let root: nodesType[] = [];

  menuData.forEach((menu, index) => {
    if (menu.parentId.length > 0) {
      menu.parentId.forEach((parentId) => {
        map.push({
          idMenu: menu.id,
          idTree: menu.id + parentId.id,
          name: parentId.label,
          idParent: parentId.id,
          children: [],
          type: menu.type === typeMenuEnum.SUBMENU ? "subMenu" : "setting",
        });
      });
    } else {
      map.push({
        idMenu: menu.id,
        idTree: menu.id,
        name: menu.lable!,
        idParent: null,
        children: [],
        type: menu.type === typeMenuEnum.SUBMENU ? "subMenu" : "setting",
      });
    }
  });

  map.forEach((menu) => {
    if (menu.idParent == null) {
      root.push(menu);
    } else {
      const founded = map.find((m) => m.idMenu == menu.idParent);
      if (founded) founded.children.push(menu);
      else root.push(menu);
      // map[menu.idParent].children.push(menu);
    }
  });

  // menuData.forEach((menu) => {
  //   if (menu.parentId.length == 0) {
  //     if (menu.lable == "Main") root.push(map[menu.id]);
  //     else root.push(map[menu.id]);
  //   } else {
  //     menu.parentId.forEach((parent) => {
  //       map[parent.id].children.push({ ...map[menu.id] });
  //     });
  //   }
  // });

  return root;
}

type nodesType = {
  idMenu: string;
  idTree: string;
  name: string;
  idParent: string | null;
  children: nodesType[];
  type: "subMenu" | "setting";
};

type TreeViewProps = {
  menus: menuType[];
  handleEdit: (id: string) => void;
  activeId?: string;
};

function TreeNodeLabel({
  node,
  isActive,
  onEdit,
}: {
  node: nodesType;
  isActive: boolean;
  onEdit: (id: string) => void;
}) {
  const handleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onEdit(node.idMenu);
  };

  if (node.type === "subMenu") {
    return (
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          width: "85%",
          px: 1.25,
          py: 0.75,
          borderRadius: 1.5,
          bgcolor: isActive
            ? "rgba(66, 14, 62, 0.12)"
            : "rgba(27, 60, 83, 0.06)",
          borderLeft: "3px solid",
          borderColor: isActive ? ACCENT : "rgba(27, 60, 83, 0.35)",
          transition: "background-color 0.2s, border-color 0.2s",
          "&:hover": {
            bgcolor: "rgba(27, 60, 83, 0.1)",
          },
          "&:hover .tree-edit-btn": {
            opacity: 1,
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ minWidth: 0, flex: 1 }}
        >
          <FolderOutlinedIcon
            sx={{ fontSize: 18, color: ACCENT, flexShrink: 0 }}
          />
          <Typography
            noWrap
            title={node.name}
            sx={{ fontSize: 14, fontWeight: 600, color: ACCENT }}
          >
            {node.name}
          </Typography>
          <Chip
            label={`submenu(${node.idMenu})`}
            size="small"
            sx={{
              height: 20,
              fontSize: 10,
              fontWeight: 600,
              bgcolor: "rgba(27, 60, 83, 0.08)",
              color: ACCENT,
            }}
          />
        </Stack>

        <IconButton
          className="tree-edit-btn"
          size="small"
          aria-label="edit submenu"
          onClick={handleEditClick}
          sx={{
            opacity: isActive ? 1 : 0.5,
            ml: 0,
            color: ACCENT,
            // "&:hover": {
            //   bgcolor: "rgba(27, 60, 83, 0.12)",
            // },
          }}
        >
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      </Stack>
    );
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        width: "80%",
        px: 1,
        py: 0.5,
        borderRadius: 1.5,
        bgcolor: isActive ? "rgba(86, 14, 90, 0.08)" : "transparent",
        transition: "background-color 0.2s",
        // "&:hover": {
        //   bgcolor: isActive ? "rgba(83, 27, 68, 0.1)" : "rgba(0, 0, 0, 0.04)",
        // },
      }}
    >
      <TuneOutlinedIcon
        sx={{ fontSize: 16, color: "text.secondary", flexShrink: 0 }}
      />
      <Button
        variant="text"
        size="small"
        onClick={handleEditClick}
        sx={{
          flex: 1,
          justifyContent: "flex-start",
          textTransform: "none",
          fontWeight: isActive ? 600 : 500,
          fontSize: 13,
          color: isActive ? ACCENT : "text.primary",
          px: 0.5,
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {node.name}
      </Button>
      <Chip
        label={node.idMenu}
        size="small"
        variant="outlined"
        sx={{
          height: 20,
          fontSize: 10,
          flexShrink: 0,
          borderColor: "divider",
          color: "text.secondary",
        }}
      />
    </Stack>
  );
}

export default function MenuTreeView({
  menus,
  handleEdit,
  activeId,
}: TreeViewProps) {
  const apiRef = useSimpleTreeViewApiRef();

  const treeData: nodesType = {
    idMenu: "",
    name: "Parent",
    idParent: null,
    idTree: "abcd",
    children: convert(menus),
    type: "subMenu",
  };

  const renderTree = (nodes: nodesType) => {
    return (
      <TreeItem
        key={nodes.idTree}
        itemId={nodes.idTree}
        sx={{
          "& .MuiTreeItem-content": {
            py: 0.25,
            borderRadius: 1.5,
          },
          "& .MuiTreeItem-label": {
            width: "100%",
          },
        }}
        label={
          <TreeNodeLabel
            node={nodes}
            isActive={activeId === nodes.idMenu}
            onEdit={handleEdit}
          />
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
          defaultExpandedItems={["node is"]}
          sx={{
            "& .MuiTreeItem-iconContainer": {
              color: ACCENT,
            },
          }}
        >
          {" "}
          {renderTree(treeData)}
        </SimpleTreeView>
      </Box>
    </Stack>
  );
}
