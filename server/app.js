import express from "express";
import cors from "cors";

const app = express();
const port = 3003;

app.use(express.json());
app.use(cors());

function convertGPS(input) {
    if (input.length !== 16) {
        throw new Error('Invalid input length');
    }
    
    var latDegrees = parseInt(input.substring(0, 2));
    var latMinutes = parseFloat(input.substring(2, 8)) / 10000;
    var lonDegrees = parseInt(input.substring(8, 11));
    var lonMinutes = parseFloat(input.substring(11, 17)) / 10000;
    
    var latitude = latDegrees + (latMinutes / 60);
    var longitude = lonDegrees + (lonMinutes / 60);
    
    return {
        latitude: latitude.toFixed(6),
        longitude: longitude.toFixed(6) // Fixed to 6 decimal places for consistency
    };
}

app.post('/convertGPS', (req, res) => {
    const { input } = req.body;

    if (!input) {
        return res.status(400).json({ error: 'Input is required' });
    }

    try {
        const coordinates = convertGPS(input);
        res.json({
            latitude: coordinates.latitude,
            longitude: coordinates.longitude
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while converting GPS coordinates' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

