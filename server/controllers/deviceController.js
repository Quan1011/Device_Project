import mongoose from 'mongoose';
import Device from '../models/deviceModel.js';

export const getAllDevice = async (req, res) => {
    try {
      const devices = await Device.find({});
      console.log("devices:", devices)
      res.status(200).json(devices);
    } catch (error) {
      console.error('Error fetching devices:', error);
      res.status(500).send(error);
    }
  };

  export const getAllDevices = async (req, res) => {
    try {
      const devices = await Device.find({}).lean();
  
      const buildTree = (data) => {
        const map = new Map();
  
        data.forEach(item => {
          const id = item._id.toString();
          map.set(id, { 
            id: id,
            label: item.name, 
            isFolder: item.isFolder, 
            children: []
          });
        });
  
        const roots = [];
  
        data.forEach(item => {
          const node = map.get(item._id.toString());
          if (item.parent_id) {
            const parentNode = map.get(item.parent_id.toString());
            if (parentNode) {
              parentNode.children.push(node);
            }
          } else {
            roots.push(node);
          }
        });
  
        return roots;
      };
  
      const treeData = buildTree(devices);
      res.status(200).json(treeData);
    } catch (error) {
      console.error('Error fetching devices:', error);
      res.status(500).send(error);
    }
  };

export const createDevice = async (req, res) => {
    const { name, parent_id, isFolder } = req.body;
    console.log('Received data:', req.body);
    const newDevice = new Device({
        name,
        parent_id: parent_id,
        isFolder,
        // children: isFolder ? [] : undefined
    });

    try {
        await newDevice.save();
        res.status(201).json(newDevice);
    } catch (error) {
        console.error('Error saving new device:', error);
        res.status(400).json({ message: error.message });
    }
};
