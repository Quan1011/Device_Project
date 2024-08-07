import mqtt from 'mqtt';
import Config from "../models/configModel.js";
import Device from "../models/deviceModel.js";
import Band from "../models/bandModel.js";

// Lấy tất cả Config của một Device
export const getAllConfig = async (req, res) => {
  try {
    const configs = await Config.find({ device: req.params.deviceId }).populate('band', 'bandName');
    res.json(configs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Thêm Config mới
export const addConfig = async (req, res) => {
  console.log("Received request:", req.body);

  let {
    band,
    currentFrequency,
    currentBandwidth,
    currentPower,
    deviceId,
  } = req.body;

  try {
    // Convert strings to numbers
    currentFrequency = parseFloat(currentFrequency);
    currentBandwidth = parseFloat(currentBandwidth);
    currentPower = parseFloat(currentPower);

    const device = await Device.findById(deviceId);
    if (!device || device.isFolder) {
      return res.status(404).json({ message: "Device not found or is a folder" });
    }

    const bandData = await Band.findOne({ band: band });
    if (!bandData) {
      return res.status(404).json({ message: "Band not found" });
    }

    if (currentFrequency < bandData.minFrequency || currentFrequency > bandData.maxFrequency) {
      return res.status(400).json({ message: "Current frequency is out of range" });
    }

    const newConfig = new Config({
      band: bandData._id,
      minFrequency: bandData.minFrequency,
      maxFrequency: bandData.maxFrequency,
      currentFrequency,
      currentBandwidth,
      currentPower,
      device: deviceId,
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
  const {
    bandName,
    currentFrequency,
    currentBandwidth,
    currentPower,
  } = req.body;

  try {
    const config = await Config.findById(configId);
    if (!config) {
      return res.status(404).json({ message: "Config not found" });
    }

    if (bandName !== undefined) {
      const band = await Band.findOne({ band: bandName });
      if (!band) {
        return res.status(404).json({ message: "Band not found" });
      }
      config.band = band._id;
      config.minFrequency = band.minFrequency;
      config.maxFrequency = band.maxFrequency;
    }

    if (currentFrequency !== undefined) {
      if (currentFrequency < config.minFrequency || currentFrequency > config.maxFrequency) {
        return res.status(400).json({ message: "Current frequency is out of range" });
      }
      config.currentFrequency = currentFrequency;
    }
    if (currentBandwidth !== undefined) config.currentBandwidth = currentBandwidth;
    if (currentPower !== undefined) config.currentPower = currentPower;

    console.log("Updating config:", config);

    const updatedConfig = await config.save();
    res.status(200).json(updatedConfig);
  } catch (error) {
    console.error("Error updating config:", error);
    res.status(500).json({ message: error.message });
  }
};

// Xóa Config
export const deleteConfig = async (req, res) => {
  const { configId } = req.params;

  try {
    const config = await Config.findById(configId);
    if (!config) {
      return res.status(404).json({ message: "Config not found" });
    }

    await Config.deleteOne({ _id: configId });
    res.status(200).json({ message: "Config deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// const mqttBrokerUrl = 'mqtt://192.168.38.237:1010';

// Tạo một client MQTT
// const mqttClient = mqtt.connect(mqttBrokerUrl);

// // Xử lý sự kiện kết nối MQTT
// mqttClient.on('connect', () => {
//   console.log('MQTT client connected');
// });

// mqttClient.on('error', (err) => {
//     console.error('MQTT connection error:', err);
//   });
  
//   // Optional: Lắng nghe các sự kiện khác như khi mất kết nối
//   mqttClient.on('reconnect', () => {
//     console.log('MQTT client trying to reconnect');
//   });
  
//   mqttClient.on('close', () => {
//     console.log('MQTT client connection closed');
//   });

  // export const applyConfig = async (req, res) => {
  //   const { configId } = req.params;
  
  //   try {
  //     const config = await Config.findById(configId).populate('band');
  
  //     if (!config) {
  //       return res.status(404).json({ message: "Config not found" });
  //     }
  
  //     const bandData = await Band.findById(config.band);
  
  //     if (!bandData) {
  //       return res.status(404).json({ message: "Band not found" });
  //     }
  
  //     const SS = ((config.currentFrequency - config.currentBandwidth / 2) ).toFixed(0).padStart(4, '0');
  //     const TT = ((config.currentFrequency + config.currentBandwidth / 2) ).toFixed(0).padStart(4, '0');
      
  //     const PP = config.currentPower.toString().padStart(2, '0');
  //     const DD = bandData.ID.toString().padStart(2, '0');
  
  //     const message = `*PC${SS}${TT}${PP}${DD}#`;
  
  //     mqttClient.publish('toserver', message, (err) => {
  //       if (err) {
  //         console.error('Error publishing message:', err);
  //         return res.status(500).json({ message: 'Failed to send configuration via MQTT' });
  //       }
  
  //       console.log('Message published:', message);
  //       res.status(200).json({ message: 'Configuration applied successfully via MQTT' });
  //     });
  //   } catch (error) {
  //     console.error('Error applying config:', error);
  //     res.status(500).json({ message: error.message });
  //   }
  // };


// Hàm applyConfig để áp dụng cấu hình cho thiết bị
export const applyConfig = async (req, res) => {
  const { configId } = req.params;

  try {
    // Tìm cấu hình theo ID
    const config = await Config.findById(configId).populate('band');

    if (!config) {
      return res.status(404).json({ message: "Config not found" });
    }

    // Tìm thông tin thiết bị theo ID của cấu hình
    const device = await Device.findById(config.device);

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    const deviceIP = device.deviceIP;

    if (!deviceIP) {
      return res.status(400).json({ message: "Device IP not set" });
    }

    // Tìm thông tin băng tần theo ID của cấu hình
    const bandData = await Band.findById(config.band);

    if (!bandData) {
      return res.status(404).json({ message: "Band not found" });
    }

    // Chuẩn bị thông tin cấu hình để gửi qua MQTT
    const SS = ((config.currentFrequency - config.currentBandwidth / 2)).toFixed(0).padStart(4, '0');
    const TT = ((config.currentFrequency + config.currentBandwidth / 2)).toFixed(0).padStart(4, '0');
    const PP = config.currentPower.toString().padStart(2, '0');
    const DD = bandData.ID.toString().padStart(2, '0');

    const message = `*PC${SS}${TT}${PP}${DD}#`;

    const mqttBrokerUrl = `${deviceIP}`;

    const mqttClient = mqtt.connect(mqttBrokerUrl);

    mqttClient.on('connect', () => {
      console.log('MQTT client connected');

      mqttClient.publish('toserver', message, (err) => {
        if (err) {
          console.error('Error publishing message:', err);
          res.status(500).json({ message: 'Failed to send configuration via MQTT' });
        } else {
          console.log('Message published:', message);
          res.status(200).json({ message: 'Configuration applied successfully via MQTT' });
        }

        mqttClient.end();
      });
    });

    mqttClient.on('error', (err) => {
      console.error('MQTT connection error:', err);
      res.status(500).json({ message: 'MQTT connection error' });
    });

    mqttClient.on('close', () => {
      console.log('MQTT client connection closed');
    });

  } catch (error) {
    console.error('Error applying config:', error);
    res.status(500).json({ message: error.message });
  }
};

export const applyAllConfig = async (req, res) => {
  const { deviceId } = req.params;

  try {
    // Tìm thông tin thiết bị theo ID
    const device = await Device.findById(deviceId);

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    const deviceIP = device.deviceIP;

    if (!deviceIP) {
      return res.status(400).json({ message: "Device IP not set" });
    }

    // Lấy tất cả các cấu hình của thiết bị
    const configs = await Config.find({ device: deviceId }).populate('band');

    if (!configs || configs.length === 0) {
      return res.status(404).json({ message: "No configurations found for this device" });
    }

    // Tạo MQTT client
    const mqttBrokerUrl = `${deviceIP}`;
    const mqttClient = mqtt.connect(mqttBrokerUrl);

    mqttClient.on('connect', async () => {
      console.log('MQTT client connected');

      try {
        // Duyệt qua từng cấu hình và gửi qua MQTT
        for (const config of configs) {
          const bandData = await Band.findById(config.band);

          if (!bandData) {
            console.error(`Band not found for config ID ${config._id}`);
            continue; // Bỏ qua cấu hình nếu không tìm thấy thông tin băng tần
          }

          const SS = ((config.currentFrequency - config.currentBandwidth / 2)).toFixed(0).padStart(4, '0');
          const TT = ((config.currentFrequency + config.currentBandwidth / 2)).toFixed(0).padStart(4, '0');
          const PP = config.currentPower.toString().padStart(2, '0');
          const DD = bandData.ID.toString().padStart(2, '0');

          const message = `*PC${SS}${TT}${PP}${DD}#`;

          mqttClient.publish('toserver', message, (err) => {
            if (err) {
              console.error(`Error publishing message for config ID ${config._id}:`, err);
            } else {
              console.log(`Message published for config ID ${config._id}:`, message);
            }
          });
        }

        res.status(200).json({ message: 'All configurations applied successfully via MQTT' });
      } catch (error) {
        console.error('Error applying configurations:', error);
        res.status(500).json({ message: error.message });
      } finally {
        mqttClient.end();
      }
    });

    mqttClient.on('error', (err) => {
      console.error('MQTT connection error:', err);
      res.status(500).json({ message: 'MQTT connection error' });
    });

    mqttClient.on('close', () => {
      console.log('MQTT client connection closed');
    });

  } catch (error) {
    console.error('Error applying all configs:', error);
    res.status(500).json({ message: error.message });
  }
};