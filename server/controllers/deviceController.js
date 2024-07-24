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

export const updateDevice = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
      const updatedDevice = await Device.findByIdAndUpdate(
          id,
          { name },
          { new: true }
      );

      if (!updatedDevice) {
          return res.status(404).json({ message: 'Device not found' });
      }

      res.status(200).json(updatedDevice);
  } catch (error) {
      console.error('Error updating device:', error);
      res.status(400).json({ message: error.message });
  }
};


const getAllChildIds = async (parentId) => {
  const children = await Device.find({ parent_id: parentId });
  let allIds = children.map(child => child._id.toString());
  for (const child of children) {
      const childIds = await getAllChildIds(child._id);
      allIds = allIds.concat(childIds);
  }
  return allIds;
};

// Hàm xóa thiết bị và tất cả các thiết bị con
export const deleteDevice = async (req, res) => {
  const { id } = req.params;

  try {
      // Kiểm tra xem thiết bị có tồn tại không
      const device = await Device.findById(id);
      if (!device) {
          return res.status(404).json({ message: 'Device not found' });
      }

      // Tìm tất cả các id con
      const idsToDelete = await getAllChildIds(id);
      idsToDelete.push(id); // Thêm id của thiết bị cha vào danh sách xóa

      // Xóa tất cả các thiết bị có id trong danh sách idsToDelete
      await Device.deleteMany({ _id: { $in: idsToDelete } });

      res.status(200).json({ message: 'Device and its children deleted successfully' });
  } catch (error) {
      console.error('Error deleting device:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};