import React, { useContext, useEffect, useState } from 'react';
import Box from "@mui/material/Box";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { TextField, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, useTheme } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DevicesIcon from '@mui/icons-material/Devices';
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import CancelIcon from "@mui/icons-material/Cancel";
import FolderIcon from "@mui/icons-material/Folder";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { TreeContext } from "../context/TreeContext";


export default function CustomTreeView() {
  const theme = useTheme();

  const { setSelectedNode } = useContext(TreeContext);

  const [treeData, setTreeData] = useState([]);
  const [newNodeName, setNewNodeName] = useState("");
  const [addingNode, setAddingNode] = useState(false);
  const [isFolder, setIsFolder] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedNodeIsFolder, setSelectedNodeIsFolder] = useState(false);
  const [expandedItems, setExpandedItems] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState(null);
  const [nodeToDeleteIsFolder, setNodeToDeleteIsFolder] = useState(false);
  const [editingNode, setEditingNode] = useState(null);
  const [editingNodeName, setEditingNodeName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/devices-tree"); 
        setTreeData(response.data); 
      } catch (error) {
        console.error("Error fetching data from server:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddClick = (isFolder) => {
    setIsFolder(isFolder);
    setAddingNode(true);
  };

  const handleAddNode = async () => {
    if (newNodeName.trim() === "") {
      setAddingNode(false);
      return;
    }
    const newNode = {
      id: uuidv4(),
      label: newNodeName,
      isFolder: isFolder,
    };

    setTreeData((prevData) =>
      addNode(prevData, selectedNodeId, newNode, selectedNodeIsFolder)
    );

    try {
      await axios.post("http://localhost:3000/api/device", {
        name: newNodeName,
        parent_id: selectedNodeId,
        isFolder: isFolder,
      });
      console.log("Node added to the server successfully");
    } catch (error) {
      console.error("Error adding node to the server:", error);
    }

    setNewNodeName("");
    setAddingNode(false);
  };

  const handleCancelAddNode = () => {
    setNewNodeName("");
    setAddingNode(false);
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
            children: node.children ? [...node.children, newNode] : [newNode],
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

  const handleSelect = async (event, nodeId) => {
    console.log("NodeID: ", nodeId)
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
      if (selectedNode.isFolder) {
        try {
          const response = await axios.get(`http://localhost:3000/api/folder/${nodeId}`);
          setSelectedNode({ ...selectedNode, children: response.data });
        } catch (error) {
          console.error("Error fetching child nodes:", error);
        }
      } else {
        setSelectedNode(selectedNode);
      }
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
    setTimeout(() => {
      setSelectedNodeId(null);
    }, 100);
  };

  const handleDeleteNode = (nodeId) => {
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

    const node = findNode(treeData, nodeId);
    if (node) {
      setNodeToDelete(nodeId);
      setNodeToDeleteIsFolder(node.isFolder);
      setConfirmOpen(true);
    }
  };

  const confirmDeleteNode = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/devices/${nodeToDelete}`);
      setTreeData(prevData => removeNode(prevData, nodeToDelete));
      console.log("Node deleted successfully");
    } catch (error) {
      console.error("Error deleting node:", error);
    }
    setConfirmOpen(false);
    setNodeToDelete(null);
  };

  const removeNode = (nodes, nodeId) => {
    return nodes.filter(node => {
      if (node.id === nodeId) {
        return false;
      }
      if (node.children) {
        node.children = removeNode(node.children, nodeId);
      }
      return true;
    });
  };

  const handleDoubleClick = (nodeId, nodeLabel) => {
    setEditingNode(nodeId);
    setEditingNodeName(nodeLabel);
  };

  const handleEditChange = (e) => {
    setEditingNodeName(e.target.value);
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`http://localhost:3000/api/devices/${editingNode}`, {
        name: editingNodeName,
      });
      setTreeData((prevData) => updateNode(prevData, editingNode, editingNodeName));
      console.log("Node updated successfully");
    } catch (error) {
      console.error("Error updating node:", error);
    }
    setEditingNode(null);
    setEditingNodeName("");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEditSubmit();
    }
  };

  const handleAddKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddNode();
    }
  };

  const updateNode = (nodes, nodeId, newName) => {
    return nodes.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          label: newName,
        };
      }
      if (node.children) {
        return {
          ...node,
          children: updateNode(node.children, nodeId, newName),
        };
      }
      return node;
    });
  };

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      itemId={nodes.id}
      label={
        <Box
          sx={{
            display: "flex",
            gap: 1,
            padding: 1,
            fontSize: "1rem",
            alignItems: "center",
            justifyContent: "space-between",
            '&:hover .action-icons': {
              visibility: 'visible',
            },
          }}
          onDoubleClick={() => handleDoubleClick(nodes.id, nodes.label)}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {nodes.isFolder ? <FolderIcon /> : <DevicesIcon />}
            {editingNode === nodes.id ? (
              <TextField
                variant="standard"
                value={editingNodeName}
                onChange={handleEditChange}
                onBlur={handleEditSubmit}
                onKeyDown={handleKeyDown}
                autoFocus
                sx={{ color: theme.palette.text.primary }}
              />
            ) : (
              <>
                {nodes.label} 
                {/* {nodes.isFolder ? (
                  <Typography variant="caption" sx={{ marginLeft: 1 }}>
                    ({nodes.totalChildren} tổng cộng, {nodes.folderChildren} folders, {nodes.itemChildren} items)
                  </Typography>
                ) : (
                  <Typography variant="caption" sx={{ marginLeft: 1 }}>
                    ({nodes.configCount} configs, {nodes.onlineConfigCount} online, {nodes.offlineConfigCount} offline)
                  </Typography>
                )} */}
              </>
            )}
          </Box>
          <Box className="action-icons" sx={{ visibility: 'hidden', display: "flex", gap: 1 }}>
            <IconButton onClick={() => handleDeleteNode(nodes.id)}>
              <CancelIcon />
            </IconButton>
          </Box>
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
    <Box component="nav" display="flex" width="28%" >
      <Box sx={{width: '100%', height: '100vh', overflowY: 'auto', backgroundColor: theme.palette.background.alt, padding: 2, color: theme.palette.text.primary}}>
        <Box sx={{ position: 'sticky', top: 0, backgroundColor: theme.palette.background.alt, zIndex: 1, paddingBottom: 1 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Device Manage
          </Typography>
          <Box>
            <IconButton onClick={() => handleAddClick(true)} title="Add Area">
              <CreateNewFolderIcon />
            </IconButton>
            <IconButton onClick={() => handleAddClick(false)} title="Add Device">
              <NoteAddIcon />
            </IconButton>
            <IconButton onClick={handleExpandAll} title="Expand All">
              <AddCircleOutlineIcon />
            </IconButton>
            <IconButton onClick={handleCollapseAll} title="Collapse All">
              <RemoveCircleOutlineIcon />
            </IconButton>
          </Box>
        </Box>
        {addingNode && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            {isFolder ? <CreateNewFolderIcon /> : <NoteAddIcon />}
            <TextField
              variant="standard"
              autoFocus
              value={newNodeName}
              onChange={(e) => setNewNodeName(e.target.value)}
              onKeyDown={handleAddKeyDown}
              sx={{ color: theme.palette.text.primary }}
            />
            <IconButton onClick={handleAddNode}>
              <CheckCircleIcon />
            </IconButton>
            <IconButton onClick={handleCancelAddNode}>
              <CancelIcon />
            </IconButton>
          </Box>
        )}
        <Box>
          <SimpleTreeView
            expandedItems={expandedItems}
            onExpandedItemsChange={(e, ids) => setExpandedItems(ids)}
          >
            {treeData.map((node) => renderTree(node))}
          </SimpleTreeView>
        </Box>
        <Dialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm delete"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {nodeToDeleteIsFolder ? "Are you sure you want to delete this folder?" : "Are you sure you want to delete this device?"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmDeleteNode} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
