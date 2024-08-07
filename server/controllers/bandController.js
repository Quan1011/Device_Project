import Band from "../models/bandModel.js";

export const getAllBands = async (req, res) => {
  try {
    const bands = await Band.find({});
    res.status(200).json(bands);
  } catch (error) {
    console.error("Error fetching bands:", error);
    res.status(500).send(error);
  }
};

export const createBand = async (req, res) => {
  const { band, minFrequency, maxFrequency, ID } = req.body;
  const newBand = new Band({
    band,
    minFrequency,
    maxFrequency,
    ID
  });
  try {
    await newBand.save();
    res.status(201).json(newBand);
  } catch (error) {
    console.error("Error saving new band: ", error);
    res.status(400).json({ message: error.message });
  }
};

export const updatedBand = async (req, res) => {
  const { id } = req.params;
  const { band, minFrequency, maxFrequency, ID } = req.body;

  try {
    const updatedBand = await Band.findByIdAndUpdate(
      id,
      { band, minFrequency, maxFrequency, ID },
      { new: true }
    );

    if (!updatedBand) {
      return res.status(404).json({ message: "Band not found" });
    }
    console.log(updatedBand)
    res.status(200).json(updatedBand);
  } catch (error) {
    console.error("Error updating device:", error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteBand = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBand = await Band.findByIdAndDelete(id);
        if (!deletedBand) {
            return res.status(404).json({ message: 'Band not found' });
        }
        res.status(200).json({ message: 'Band deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
