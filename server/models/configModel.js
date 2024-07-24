import mongoose from 'mongoose';
const { Schema } = mongoose;

// Định nghĩa schema cho Config
const configSchema = new Schema({
    band: { type: String, required: true },
    frequency: { type: Number, required: true },
    bandwidth: { type: Number, required: true },
    power: { type: Number, required: true },
    device: { type: Schema.Types.ObjectId, ref: 'Device', required: true } // Tham chiếu đến Device
});

const Config = mongoose.model('Config', configSchema);

export default Config;
