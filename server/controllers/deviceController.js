import Device from '../models/Device.js';

// Lấy tất cả các thiết bị và chuyển đổi thành cấu trúc cây
export const getDeviceTree = async (req, res) => {
    try {
        const devices = await Device.find();
        const deviceMap = {};
        
        // Tạo một map từ id đến thiết bị
        devices.forEach(device => {
            deviceMap[device.id] = device.toObject();
            deviceMap[device.id].children = [];
        });

        // Xây dựng cấu trúc cây
        const tree = [];
        devices.forEach(device => {
            if (device.parent_id === null) {
                tree.push(deviceMap[device.id]);
            } else {
                if (deviceMap[device.parent_id]) {
                    deviceMap[device.parent_id].children.push(deviceMap[device.id]);
                }
            }
        });

        res.status(200).json(tree);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createDevice = async (req, res) => {
    const { id, name, parent_id, type, description } = req.body;

    const newDevice = new Device({
        id,
        name,
        parent_id,
        type,
        description
    });

    try {
        await newDevice.save();
        res.status(201).json(newDevice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};