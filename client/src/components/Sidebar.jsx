import * as React from "react";
import Box from "@mui/material/Box";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { TextField, Container, Typography, IconButton } from "@mui/material";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CancelIcon from '@mui/icons-material/Cancel';
import FolderIcon from "@mui/icons-material/Folder";
import { v4 as uuidv4 } from "uuid";

export default function CustomTreeView() {
  const [treeData, setTreeData] = React.useState([
    {
      id: uuidv4(),
      label: "Root",
      isFolder: true,
      children: [
        {
          id: uuidv4(),
          label: "Folder 1",
          isFolder: true,
          children: [
            { id: uuidv4(), label: "Item 1.1", isFolder: false },
            { id: uuidv4(), label: "Item 1.2", isFolder: false },
          ],
        },
        {
          id: uuidv4(),
          label: "Folder 2",
          isFolder: true,
          children: [
            { id: uuidv4(), label: "Item 2.1", isFolder: false },
            { id: uuidv4(), label: "Item 2.2", isFolder: false },
            {
              id: uuidv4(),
              label: "Folder 2.1",
              isFolder: true,
              children: [
                { id: uuidv4(), label: "Item 2.1.1", isFolder: false },
                { id: uuidv4(), label: "Item 2.1.2", isFolder: false },
              ],
            },
          ],
        },
        { id: uuidv4(), label: "Item 3", isFolder: false },
      ],
    },
    {
      id: uuidv4(),
      label: "Root 2",
      isFolder: true,
      children: [
        {
          id: uuidv4(),
          label: "Folder 3",
          isFolder: true,
          children: [
            { id: uuidv4(), label: "Item 3.1", isFolder: false },
            { id: uuidv4(), label: "Item 3.2", isFolder: false },
          ],
        },
        { id: uuidv4(), label: "Item 4", isFolder: false },
      ],
    },
  ]);

  const [newFolderName, setNewFolderName] = React.useState("");
  const [addingFolder, setAddingFolder] = React.useState(false);
  const [newItemName, setNewItemName] = React.useState("");
  const [addingItem, setAddingItem] = React.useState(false);
  const [selectedNodeId, setSelectedNodeId] = React.useState(null);
  const [selectedNodeIsFolder, setSelectedNodeIsFolder] = React.useState(false);
  const [expandedItems, setExpandedItems] = React.useState([]);

  const handleAddFolderClick = () => {
    setAddingFolder(true);
  };

  const handleAddItemClick = () => {
    setAddingItem(true);
    // id:
    // name:
    // parentID: ??? 
    // type: item
  };

  const handleAddFolder = () => {
    if (newFolderName.trim() === "") {
      setAddingFolder(false);
      // call API add 
      return;
    }
    const newFolder = {
      id: uuidv4(),
      label: newFolderName,
      isFolder: true,
      children: [],
    };

    setTreeData((prevData) =>
      addNode(prevData, selectedNodeId, newFolder, selectedNodeIsFolder)
    );
    console.log('folder')
    setNewFolderName("");
    setAddingFolder(false);
  };

  const handleAddItem = () => {
    if (newItemName.trim() === "") {
      setAddingItem(false);
      return;
    }
    const newItem = {
      id: uuidv4(),
      label: newItemName,
      isFolder: false,
    };

    setTreeData((prevData) =>
      addNode(prevData, selectedNodeId, newItem, selectedNodeIsFolder)
    );
    console.log('item')
    setNewItemName("");
    setAddingItem(false);
  };

  const handleCancelAddFolder = () => {
    setNewFolderName("");
    setAddingFolder(false);
  };

  const clickFolderorItem = (isFolder) => {
    if (isFolder) {
      console.log("parentIdGolbal:", parentIdGolbal)
      console.log("Folder")
    }
    else {
      console.log("parentIdGolbal:", parentIdGolbal)
      console.log("Item")
    }
  }; 

  const handleCancelAddItem = () => {
    setNewItemName("");
    setAddingItem(false);
  };

  const addNode = (nodes, parentId, newNode, isFolder) => {
    if (!parentId) {
      return [...nodes, newNode];
    }

    return nodes.map((node) => {
      if (node.id === parentId) {
        if (node.isFolder) {
          return {
            ...node,
            children: node.children ? [...node.children, { ...newNode, id: uuidv4() }] : [{ ...newNode, id: uuidv4() }],
          };
        }
      }

      if (node.children) {
        return {
          ...node,
          children: addNode(node.children, parentId, newNode, isFolder),
        };
      }

      return node;
    });
  };

  const findParentNode = (nodes, id) => {
    for (let node of nodes) {
      if (node.children) {
        for (let child of node.children) {
          if (child.id === id) {
            return node;
          }
        }
        const parent = findParentNode(node.children, id);
        if (parent) {
          console.log("parent")
          return parent;
        }
      }
    }
    return null;
  };


  const parentIdGolbal = (nodeId) => {
    return nodeId;
  }

  const handleSelect = (event, nodeId) => {
    console.log("nodeId:", nodeId)
    const findNode = (nodes, id) => {
      for (let node of nodes) {
        if (node.id === id) {
          return node;
        }
        if (node.children) {
          const found = findNode(node.children, id);
          if (found) {
            return found;
          }
        }
      }
      return null;
    };

    const selectedNode = findNode(treeData, nodeId);
    if (selectedNode) {
      setSelectedNodeId(nodeId);
      setSelectedNodeIsFolder(selectedNode.isFolder);
    }
  };

  const handleExpandAll = () => {
    const expandAllNodes = (nodes) => {
      let ids = [];
      nodes.forEach((node) => {
        ids.push(node.id);
        if (node.children) {
          ids = ids.concat(expandAllNodes(node.children));
        }
      });
      return ids;
    };
    setExpandedItems(expandAllNodes(treeData));
  };

  const handleCollapseAll = () => {
    setExpandedItems([]);
  };

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      itemId={nodes.id}
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, padding: 1, fontSize: '1rem' }}>
          {nodes.isFolder ? <FolderIcon /> : <InsertDriveFileIcon />}
          {nodes.label}
        </Box>
      }
      onClick={(event) => handleSelect(event, nodes.id)}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <Box component="nav" sx={{ marginTop: 8 }}>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Custom TreeView
          <IconButton onClick={handleAddFolderClick}>
            <CreateNewFolderIcon />
          </IconButton>
          <IconButton onClick={handleAddItemClick}>
            <NoteAddIcon />
          </IconButton>
          <IconButton onClick={handleExpandAll}>
            <AddCircleOutlineIcon />
          </IconButton>
          <IconButton onClick={handleCollapseAll}>
            <RemoveCircleOutlineIcon />
          </IconButton>
        </Typography>
        {addingFolder && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <CreateNewFolderIcon 
              onClick={clickFolderorItem(true)}
            />
            <TextField
              variant="standard"
              autoFocus
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <IconButton onClick={handleAddFolder}>
              <CheckCircleIcon />
            </IconButton>
            <IconButton onClick={handleCancelAddFolder}>
              <CancelIcon />
            </IconButton>
          </Box>
        )}
        {addingItem && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <NoteAddIcon
              onClick={clickFolderorItem(false)}
            />
            <TextField
              variant="standard"
              autoFocus
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
            <IconButton onClick={handleAddItem}>
              <CheckCircleIcon />
            </IconButton>
            <IconButton onClick={handleCancelAddItem}>
              <CancelIcon />
            </IconButton>
          </Box>
        )}
        <Box>
          <SimpleTreeView expandedItems={expandedItems} onExpandedItemsChange={(e, ids) => setExpandedItems(ids)}>
            {treeData.map((node) => renderTree(node))}
          </SimpleTreeView>
        </Box>
      </Container>
    </Box>
  );
}
