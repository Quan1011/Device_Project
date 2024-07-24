import * as React from "react";
import Box from "@mui/material/Box";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { TextField, Container, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import CancelIcon from "@mui/icons-material/Cancel";
import FolderIcon from "@mui/icons-material/Folder";
import axios from "axios";

let globalId = null;

export default function CustomTreeView() {
  const [treeData, setTreeData] = React.useState([]);
  const [newNodeName, setNewNodeName] = React.useState("");
  const [addingNode, setAddingNode] = React.useState(false);
  const [isFolder, setIsFolder] = React.useState(false);
  const [selectedNodeId, setSelectedNodeId] = React.useState(null);
  const [selectedNodeIsFolder, setSelectedNodeIsFolder] = React.useState(false);
  const [expandedItems, setExpandedItems] = React.useState([]);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [nodeToDelete, setNodeToDelete] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/devices-tree"
        );
        setTreeData(response.data);
      } catch (error) {
        console.error("Error fetching data from server:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddClick = (isFolder, isTopLevel = false) => {
    setIsFolder(isFolder);
    setSelectedNodeId(null);
    setSelectedNodeIsFolder(false);
    setAddingNode(true);
  };

  const handleAddNode = async () => {
    if (newNodeName.trim() === "") {
      setAddingNode(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/device", {
        name: newNodeName,
        parent_id: selectedNodeId,
        isFolder: isFolder,
      });

      const newNode = response.data;

      setTreeData((prevData) =>
        addNode(prevData, selectedNodeId, newNode, selectedNodeIsFolder)
      );

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

  const handleSelect = (event, nodeId) => {
    globalId = nodeId;
    console.log("nodeId:", nodeId);
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

  const handleEditNode = (nodeId, nodeName, isFolder) => {
    setSelectedNodeId(nodeId);
    setNewNodeName(nodeName);
    setIsFolder(isFolder);
    setAddingNode(true);
  };

  const handleUpdateNode = async () => {
    if (newNodeName.trim() === "") {
      setAddingNode(false);
      return;
    }

    try {
      await axios.put(`http://localhost:3000/api/devices/${selectedNodeId}`, {
        name: newNodeName,
        isFolder: isFolder,
      });
      setTreeData(prevData =>
        updateNode(prevData, selectedNodeId, newNodeName, isFolder)
      );
      console.log("Node updated successfully");
    } catch (error) {
      console.error("Error updating node:", error);
    }

    setNewNodeName("");
    setAddingNode(false);
  };

  const updateNode = (nodes, nodeId, newName, newIsFolder) => {
    return nodes.map(node => {
      if (node.id === nodeId) {
        return { ...node, label: newName, isFolder: newIsFolder };
      }
      if (node.children) {
        return {
          ...node,
          children: updateNode(node.children, nodeId, newName, newIsFolder),
        };
      }
      return node;
    });
  };

  const handleDeleteNode = (nodeId) => {
    setNodeToDelete(nodeId);
    setConfirmOpen(true);
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

  const handleAddNodeOrUpdate = async () => {
    if (selectedNodeId === null) {
      await handleAddNode();
    } else {
      await handleUpdateNode();
    }
  };

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      itemId={nodes.id}
      nodeId={nodes.id} // Đảm bảo rằng nodeId được cung cấp
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
          onDoubleClick={() => handleEditNode(nodes.id, nodes.label, nodes.isFolder)}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {nodes.isFolder ? <FolderIcon /> : <InsertDriveFileIcon />}
            {nodes.label}
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
    <Box component="nav" sx={{ marginTop: 8 }}>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Custom TreeView
          <IconButton onClick={() => handleAddClick(true)}>
            <CreateNewFolderIcon />
          </IconButton>
          <IconButton onClick={() => handleAddClick(false)}>
            <NoteAddIcon />
          </IconButton>
          <IconButton onClick={() => handleAddClick(true, true)}>
            Thêm
          </IconButton>
          <IconButton onClick={handleExpandAll}>
            <AddCircleOutlineIcon />
          </IconButton>
          <IconButton onClick={handleCollapseAll}>
            <RemoveCircleOutlineIcon />
          </IconButton>
        </Typography>
        {addingNode && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            {isFolder ? <CreateNewFolderIcon /> : <NoteAddIcon />}
            <TextField
              variant="standard"
              autoFocus
              value={newNodeName}
              onChange={(e) => setNewNodeName(e.target.value)}
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
          <DialogTitle id="alert-dialog-title">{"Xác nhận xóa"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Bạn có chắc chắn muốn xóa node này không?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)} color="primary">
              Hủy bỏ
            </Button>
            <Button onClick={confirmDeleteNode} color="primary" autoFocus>
              Đồng ý
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
