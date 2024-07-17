import React, { useState } from 'react';
import { TreeView, TreeItem } from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { v4 as uuidv4 } from 'uuid';
import { TextField, Button, Container, Typography } from '@mui/material';

const initialData = [
  {
    id: uuidv4(),
    name: 'Root',
    children: [
      { id: uuidv4(), name: 'Subitem 1.1' },
      { id: uuidv4(), name: 'Subitem 1.2' },
    ],
  },
];

const renderTree = (nodes) => (
  <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
    {Array.isArray(nodes.children)
      ? nodes.children.map((node) => renderTree(node))
      : null}
  </TreeItem>
);

const CustomTreeView = () => {
  const [treeData, setTreeData] = useState(initialData);
  const [newItemName, setNewItemName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);

  const handleAddItem = () => {
    if (!selectedNode) return;

    const addItemToNode = (node, itemName) => {
      if (node.id === selectedNode) {
        const newNode = { id: uuidv4(), name: itemName };
        if (!node.children) node.children = [];
        node.children.push(newNode);
      } else if (node.children) {
        node.children = node.children.map((child) =>
          addItemToNode(child, itemName)
        );
      }
      return node;
    };

    setTreeData(treeData.map((node) => addItemToNode(node, newItemName)));
    setNewItemName('');
  };

  const handleAddFolder = () => {
    const newFolder = {
      id: uuidv4(),
      name: newFolderName,
      children: [],
    };
    setTreeData([...treeData, newFolder]);
    setNewFolderName('');
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Custom TreeView
      </Typography>
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        onNodeSelect={(event, nodeId) => setSelectedNode(nodeId)}
      >
        {treeData.map((node) => renderTree(node))}
      </TreeView>
      <div>
        <TextField
          label="New Item Name"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleAddItem}>
          Add Item
        </Button>
      </div>
      <div>
        <TextField
          label="New Folder Name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleAddFolder}>
          Add Folder
        </Button>
      </div>
    </Container>
  );
};

export default CustomTreeView;
