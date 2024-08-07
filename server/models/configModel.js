import mongoose from "mongoose";
const { Schema } = mongoose;

const configSchema = new Schema({
  band: { type: Schema.Types.ObjectId, ref: "Band", required: true },
  minFrequency: { type: Number, required: true },
  maxFrequency: { type: Number, required: true },
  // startFrequency: { type: Number, required: true },
  // endFrequency: { type: Number, required: true },
  currentFrequency: { type: Number, required: true },
  currentBandwidth: { type: Number, required: true },
  currentPower: { type: Number, required: true },
  device: { type: Schema.Types.ObjectId, ref: "Device", required: true },
});

const Config = mongoose.model("Config", configSchema);

export default Config;
