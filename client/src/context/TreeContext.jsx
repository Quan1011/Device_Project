import React, { createContext, useState } from 'react';

export const TreeContext = createContext();

export const TreeProvider = ({ children }) => {
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <TreeContext.Provider value={{ selectedNode, setSelectedNode }}>
      {children}
    </TreeContext.Provider>
  );
};
