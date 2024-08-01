import mongoose from 'mongoose';
const { Schema } = mongoose;


const configSchema = new Schema({
    band: { type: String, required: true },
    frequency: { type: Number, required: true },
    bandwidth: { type: Number, required: true },
    power: { type: Number, required: true },
    currentFrequency: { type: Number, required: true },
    currentBandwidth: { type: Number, required: true },
    currentPower: { type: Number, required: true },
    device: { type: Schema.Types.ObjectId, ref: 'Device', required: true }
});

const Config = mongoose.model('Config', configSchema);

export default Config;
