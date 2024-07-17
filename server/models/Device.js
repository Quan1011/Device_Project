import mongoose from 'mongoose';
const { Schema } = mongoose;

const deviceSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    parent_id: { type: Number, ref: 'Device' },
    type: { type: String, required: true },
    description: { type: String }
});

deviceSchema.index({ id: 1, parent_id: 1 }, { unique: true });

const Device = mongoose.model('Device', deviceSchema);

export default Device;
