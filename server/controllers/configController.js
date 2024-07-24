import Config from '../models/configModel.js';
import Device from '../models/deviceModel.js';

// Lấy tất cả Config của một Device
export const getAllConfig = async (req, res) => {
    try {
        const configs = await Config.find({ device: req.params.deviceId });
        res.json(configs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Thêm Config mới
export const addConfig = async (req, res) => {
    console.log('Received request:', req.body);
    const { band, frequency, bandwidth, power } = req.body;
    const { deviceId } = req.params;  // Lấy deviceId từ params

    try {
        const device = await Device.findById(deviceId);
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        const newConfig = new Config({
            band,
            frequency,
            bandwidth,
            power,
            device: deviceId
        });

        const savedConfig = await newConfig.save();
        res.status(201).json(savedConfig);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Sửa Config
export const updateConfig = async (req, res) => {
    const { configId } = req.params;
    const { band, frequency, bandwidth, power } = req.body;

    try {
        const config = await Config.findById(configId);
        if (!config) {
            return res.status(404).json({ message: 'Config not found' });
        }

        config.band = band;
        config.frequency = frequency;
        config.bandwidth = bandwidth;
        config.power = power;

        const updatedConfig = await config.save();
        res.status(200).json(updatedConfig);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa Config
export const deleteConfig = async (req, res) => {
    const { configId } = req.params;

    try {
        const config = await Config.findById(configId);
        if (!config) {
            return res.status(404).json({ message: 'Config not found' });
        }

        await Config.deleteOne({ _id: configId });
        res.status(200).json({ message: 'Config deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

