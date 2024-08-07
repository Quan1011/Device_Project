import mongoose from "mongoose";
const { Schema } = mongoose;

const bandSchema = new Schema({
  band: { type: String, required: true },
  minFrequency: { type: Number, required: true },
  maxFrequency: { type: Number, required: true },
  ID: { type: Number, required: true }
});

const Band = mongoose.model("Band", bandSchema);

export default Band;
