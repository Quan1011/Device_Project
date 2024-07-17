// import * as React from "react";
// import Box from "@mui/material/Box";
// import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
// import { TreeItem } from "@mui/x-tree-view/TreeItem";
// import { TextField, Container, Typography, IconButton } from "@mui/material";
// import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
// import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import NoteAddIcon from "@mui/icons-material/NoteAdd";
// import CancelIcon from "@mui/icons-material/Cancel";
// import FolderIcon from "@mui/icons-material/Folder";
// import { v4 as uuidv4 } from "uuid";
// import axios from "axios";

// export default function CustomTreeView() {
//   const [treeData, setTreeData] = React.useState([
//     {
//       id: uuidv4(),
//       label: "Root",
//       isFolder: true,
//       children: [
//         {
//           id: uuidv4(),
//           label: "Folder 1",
//           isFolder: true,
//           children: [
//             { id: uuidv4(), label: "Item 1.1", isFolder: false },
//             { id: uuidv4(), label: "Item 1.2", isFolder: false },
//           ],
//         },
//         {
//           id: uuidv4(),
//           label: "Folder 2",
//           isFolder: true,
//           children: [
//             { id: uuidv4(), label: "Item 2.1", isFolder: false },
//             { id: uuidv4(), label: "Item 2.2", isFolder: false },
//             {
//               id: uuidv4(),
//               label: "Folder 2.1",
//               isFolder: true,
//               children: [
//                 { id: uuidv4(), label: "Item 2.1.1", isFolder: false },
//                 { id: uuidv4(), label: "Item 2.1.2", isFolder: false },
//               ],
//             },
//           ],
//         },
//         { id: uuidv4(), label: "Item 3", isFolder: false },
//       ],
//     },
//     {
//       id: uuidv4(),
//       label: "Folder 1",
//       isFolder: true,
//       children: []
//     },
//     {
//       id: uuidv4(),
//       label: "Folder 2",
//       isFolder: true,
//       children: []
//     }
//   ]);

//   const [newNodeName, setNewNodeName] = React.useState("");
//   const [addingNode, setAddingNode] = React.useState(false);
//   const [isFolder, setIsFolder] = React.useState(false);
//   const [selectedNodeId, setSelectedNodeId] = React.useState(null);
//   const [selectedNodeIsFolder, setSelectedNodeIsFolder] = React.useState(false);
//   const [expandedItems, setExpandedItems] = React.useState([]);

//   const handleAddClick = (isFolder) => {
//     setIsFolder(isFolder);
//     setAddingNode(true);
//   };

//   const handleAddNode = async () => {
//     if (newNodeName.trim() === "") {
//       setAddingNode(false);
//       return;
//     }
//     const newNode = {
//       id: uuidv4(),
//       label: newNodeName,
//       isFolder: isFolder,
//       // children: isFolder ? [] : undefined,
//     };

//     setTreeData((prevData) =>
//       addNode(prevData, selectedNodeId, newNode, selectedNodeIsFolder)
//     );

//     try {
//       await axios.post("http://localhost:3000/api/devices", {
//         name: newNodeName,
//         parent_id: selectedNodeId,
//         isFolder: isFolder,
//       });
//       console.log("Node added to the server successfully");
//     } catch (error) {
//       console.error("Error adding node to the server:", error);
//     }
//     console.log("newNodeName:", newNodeName)
//     console.log("selectedNodeId:", selectedNodeId)
//     console.log("isFolder:", isFolder)

//     setNewNodeName("");
//     setAddingNode(false);
//   };

//   const handleCancelAddNode = () => {
//     setNewNodeName("");
//     setAddingNode(false);
//   };

//   const addNode = (nodes, parentId, newNode, isFolder) => {
//     if (!parentId) {
//       return [...nodes, newNode];
//     }

//     return nodes.map((node) => {
//       if (node.id === parentId) {
//         if (node.isFolder) {
//           return {
//             ...node,
//             children: node.children
//               ? [...node.children, newNode]
//               : [newNode],
//           };
//         }
//       }

//       if (node.children) {
//         return {
//           ...node,
//           children: addNode(node.children, parentId, newNode, isFolder),
//         };
//       }

//       return node;
//     });
//   };

//   const findParentNode = (nodes, id) => {
//     for (let node of nodes) {
//       if (node.children) {
//         for (let child of node.children) {
//           if (child.id === id) {
//             return node;
//           }
//         }
//         const parent = findParentNode(node.children, id);
//         if (parent) {
//           return parent;
//         }
//       }
//     }
//     return null;
//   };

//   const handleSelect = (event, nodeId) => {
//     console.log("nodeId:", nodeId)
//     const findNode = (nodes, id) => {
//       for (let node of nodes) {
//         if (node.id === id) {
//           return node;
//         }
//         if (node.children) {
//           const found = findNode(node.children, id);
//           if (found) {
//             return found;
//           }
//         }
//       }
//       return null;
//     };

//     const selectedNode = findNode(treeData, nodeId);
//     if (selectedNode) {
//       setSelectedNodeId(nodeId);
//       setSelectedNodeIsFolder(selectedNode.isFolder);
//     }
//   };

//   const handleExpandAll = () => {
//     const expandAllNodes = (nodes) => {
//       let ids = [];
//       nodes.forEach((node) => {
//         ids.push(node.id);
//         if (node.children) {
//           ids = ids.concat(expandAllNodes(node.children));
//         }
//       });
//       return ids;
//     };
//     setExpandedItems(expandAllNodes(treeData));
//   };

//   const handleCollapseAll = () => {
//     setExpandedItems([]);
//   };

//   const renderTree = (nodes) => (
//     <TreeItem
//       key={nodes.id}
//       itemId={nodes.id}
//       label={
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             gap: 1,
//             padding: 1,
//             fontSize: "1rem",
//           }}
//         >
//           {nodes.isFolder ? <FolderIcon /> : <InsertDriveFileIcon />}
//           {nodes.label}
//         </Box>
//       }
//       onClick={(event) => handleSelect(event, nodes.id)}
//     >
//       {Array.isArray(nodes.children)
//         ? nodes.children.map((node) => renderTree(node))
//         : null}
//     </TreeItem>
//   );

//   return (
//     <Box component="nav" sx={{ marginTop: 8 }}>
//       <Container>
//         <Typography variant="h4" component="h1" gutterBottom>
//           Custom TreeView
//           <IconButton onClick={() => handleAddClick(true)}>
//             <CreateNewFolderIcon />
//           </IconButton>
//           <IconButton onClick={() => handleAddClick(false)}>
//             <NoteAddIcon />
//           </IconButton>
//           <IconButton onClick={handleExpandAll}>
//             <AddCircleOutlineIcon />
//           </IconButton>
//           <IconButton onClick={handleCollapseAll}>
//             <RemoveCircleOutlineIcon />
//           </IconButton>
//         </Typography>
//         {addingNode && (
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
//             {isFolder ? <CreateNewFolderIcon /> : <NoteAddIcon />}
//             <TextField
//               variant="standard"
//               autoFocus
//               value={newNodeName}
//               onChange={(e) => setNewNodeName(e.target.value)}
//             />
//             <IconButton onClick={handleAddNode}>
//               <CheckCircleIcon />
//             </IconButton>
//             <IconButton onClick={handleCancelAddNode}>
//               <CancelIcon />
//             </IconButton>
//           </Box>
//         )}
//         <Box>
//           <SimpleTreeView
//             expandedItems={expandedItems}
//             onExpandedItemsChange={(e, ids) => setExpandedItems(ids)}
//           >
//             {treeData.map((node) => renderTree(node))}
//           </SimpleTreeView>
//         </Box>
//       </Container>
//     </Box>
//   );
// }


import * as React from "react";
import Box from "@mui/material/Box";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { TextField, Container, Typography, IconButton } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import CancelIcon from "@mui/icons-material/Cancel";
import FolderIcon from "@mui/icons-material/Folder";
import { v4 as uuidv4 } from "uuid";
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

  React.useEffect(() => {
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
    console.log("newNodeName:", newNodeName);
    console.log("selectedNodeId:", selectedNodeId);
    console.log("isFolder:", isFolder);

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

  const handleCollapseAll = (globalId) => {
    globalId = null;
    setExpandedItems([]);
  };

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      itemId={nodes.id}
      label={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            padding: 1,
            fontSize: "1rem",
          }}
        >
          {nodes.isFolder ? <FolderIcon /> : <InsertDriveFileIcon />}
          {nodes.label}
          <IconButton>
            <CancelIcon />
          </IconButton>

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
      </Container>
    </Box>
  );
}
