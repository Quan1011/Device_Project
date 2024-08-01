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
        const { band, frequency, bandwidth, power, currentFrequency, currentBandwidth, currentPower } = req.body;
        const { deviceId } = req.body;

        try {
            const device = await Device.findById(deviceId);
            if (!device || device.isFolder) {
                return res.status(404).json({ message: 'Device not found or is a folder' });
            }

            const newConfig = new Config({
                band,
                frequency,
                bandwidth,
                power,
                currentFrequency: currentFrequency || null,
                currentBandwidth: currentBandwidth || null,
                currentPower: currentPower || null,
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
        const { band, frequency, bandwidth, power, currentFrequency, currentBandwidth, currentPower } = req.body;

        try {
            const config = await Config.findById(configId);
            if (!config) {
                return res.status(404).json({ message: 'Config not found' });
            }

            // Cập nhật các giá trị, chỉ cập nhật nếu có giá trị mới
            if (band !== undefined) config.band = band;
            if (frequency !== undefined) config.frequency = frequency;
            if (bandwidth !== undefined) config.bandwidth = bandwidth;
            if (power !== undefined) config.power = power;
            if (currentFrequency !== undefined) config.currentFrequency = currentFrequency;
            if (currentBandwidth !== undefined) config.currentBandwidth = currentBandwidth;
            if (currentPower !== undefined) config.currentPower = currentPower;

            console.log('Updating config:', config); // Thêm dòng này để kiểm tra

            const updatedConfig = await config.save();
            res.status(200).json(updatedConfig);
        } catch (error) {
            console.error('Error updating config:', error); // Thêm dòng này để kiểm tra
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
