import mongoose from "mongoose";
const { Schema } = mongoose;

const deviceSchema = new Schema({
  name: { type: String, required: true },
  parent_id: { type: String, ref: "Device", default: null },
  isFolder: { type: Boolean, required: true },
  config: { type: Schema.Types.ObjectId, ref: "Config" },
  deviceIP: { type: String, default: "" }
  // children: { type: [mongoose.Schema.Types.ObjectId], ref: 'Device' }
});

const Device = mongoose.model("Device", deviceSchema);

export default Device;