import Device from "../models/deviceModel.js";
import Config from "../models/configModel.js";

// export const getAllDevice = async (req, res) => {
//   try {
//     const devices = await Device.find({});
//     console.log("devices:", devices);
//     res.status(200).json(devices);
//   } catch (error) {
//     console.error("Error fetching devices:", error);
//     res.status(500).send(error);
//   }
// };

export const getAllDevice = async (req, res) => {
  try {
    const devices = await Device.find({}).lean();

    const configs = await Config.find({}).lean();

    const buildTree = (devices, configs) => {
      const map = new Map();

      devices.forEach((device) => {
        const id = device._id.toString();
        map.set(id, {
          id: id,
          label: device.name,
          isFolder: device.isFolder,
          children: [],
          totalChildren: 0,
          folderChildren: 0,
          itemChildren: 0,
          configCount: 0,
          onlineConfigCount: 0,
          offlineConfigCount: 0
        });
      });

      const roots = [];

      devices.forEach((device) => {
        const node = map.get(device._id.toString());

        if (device.isFolder) {
          node.totalChildren = devices.filter(d => d.parent_id && d.parent_id.toString() === device._id.toString()).length;
          node.folderChildren = devices.filter(d => d.parent_id && d.parent_id.toString() === device._id.toString() && d.isFolder).length;
          node.itemChildren = node.totalChildren - node.folderChildren;
        } else {
          const deviceConfigs = configs.filter(c => c.device.toString() === device._id.toString());
          node.configCount = deviceConfigs.length;
          node.onlineConfigCount = deviceConfigs.filter(c => c.currentPower !== 0).length;
          node.offlineConfigCount = deviceConfigs.filter(c => c.currentPower === 0).length;
        }

        if (device.parent_id) {
          const parentNode = map.get(device.parent_id.toString());
          if (parentNode) {
            parentNode.children.push(node);
          }
        } else {
          roots.push(node);
        }
      });

      return roots;
    };

    const treeData = buildTree(devices, configs);
    res.status(200).json(treeData);
  } catch (error) {
    console.error("Error fetching devices:", error);
    res.status(500).send(error);
  }
};

export const getAllDeviceLabels = async (req, res) => {
  try {
    const devices = await Device.find({}).lean();

    const configs = await Config.find({}).lean();

    const calculateDeviceDetails = (device, allDevices, allConfigs) => {
      const deviceId = device._id.toString();
      const isFolder = device.isFolder;
      const children = allDevices.filter(d => d.parent_id && d.parent_id.toString() === deviceId);

      if (isFolder) {
        const folderChildren = children.filter(child => child.isFolder);
        const itemChildren = children.filter(child => !child.isFolder);

        return {
          ...device,
          children: children.map(child => calculateDeviceDetails(child, allDevices, allConfigs)),
          totalChildren: children.length,
          folderChildrenCount: folderChildren.length,
          itemChildrenCount: itemChildren.length,
        };
      } else {
        const deviceConfigs = allConfigs.filter(c => c.device.toString() === deviceId);
        const onlineConfigCount = deviceConfigs.filter(c => c.currentPower !== 0).length;
        const offlineConfigCount = deviceConfigs.filter(c => c.currentPower === 0).length;

        return {
          ...device,
          configCount: deviceConfigs.length,
          onlineConfigCount,
          offlineConfigCount,
        };
      }
    };

    const deviceLabels = devices
      .filter(device => !device.parent_id)
      .map(device => calculateDeviceDetails(device, devices, configs));

    res.status(200).json(deviceLabels);
  } catch (error) {
    console.error("Error fetching device labels:", error);
    res.status(500).send(error);
  }
};


export const getAllDevices = async (req, res) => {
  try {
    const devices = await Device.find({}).lean();

    const buildTree = (data) => {
      const map = new Map();

      data.forEach((item) => {
        const id = item._id.toString();
        map.set(id, {
          id: id,
          label: item.name,
          isFolder: item.isFolder,
          deviceIP: item.deviceIP,
          children: [],
        });
      });

      const roots = [];

      data.forEach((item) => {
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
    console.error("Error fetching devices:", error);
    res.status(500).send(error);
  }
};

export const getDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }
    res.status(200).json(device);
  } catch (error) {
    console.error("Error fetching device:", error);
    res.status(500).json({ message: error.message });
  }
}

export const createDevice = async (req, res) => {
  const { name, parent_id, isFolder } = req.body;
  console.log("Received data:", req.body);
  const newDevice = new Device({
    name,
    parent_id: parent_id,
    isFolder,
    deviceIP: ""
    // children: isFolder ? [] : undefined
  });

  try {
    await newDevice.save();
    res.status(201).json(newDevice);
  } catch (error) {
    console.error("Error saving new device:", error);
    res.status(400).json({ message: error.message });
  }
};

export const updateDevice = async (req, res) => {
  const { id } = req.params;
  const { name, deviceIP } = req.body;

  try {
    const updatedDevice = await Device.findByIdAndUpdate(
      id,
      { name, deviceIP },
      { new: true }
    );

    if (!updatedDevice) {
      return res.status(404).json({ message: "Device not found" });
    }

    res.status(200).json(updatedDevice);
  } catch (error) {
    console.error("Error updating device:", error);
    res.status(400).json({ message: error.message });
  }
};

const getAllChildIds = async (parentId) => {
  const children = await Device.find({ parent_id: parentId });
  let allIds = children.map((child) => child._id.toString());
  for (const child of children) {
    const childIds = await getAllChildIds(child._id);
    allIds = allIds.concat(childIds);
  }
  return allIds;
};

export const deleteDevice = async (req, res) => {
  const { id } = req.params;

  try {
    const device = await Device.findById(id);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    const idsToDelete = await getAllChildIds(id);
    idsToDelete.push(id);

    await Device.deleteMany({ _id: { $in: idsToDelete } });

    res
      .status(200)
      .json({ message: "Device and its children deleted successfully" });
  } catch (error) {
    console.error("Error deleting device:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
