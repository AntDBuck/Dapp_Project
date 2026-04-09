import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

// Load keys and port number from .env file and store in .process.env.
// Purpose: hide API keys.
dotenv.config()

// Get API keys from .env file.
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

// Get port number from .env file or set to 5000 if not found.
const PORT = process.env.PORT || 5000;

const app = express();

// Enable requests from React application.
app.use(cors());
// Enable parsing of JSON requests and increase limit.
app.use(express.json({ limit: '5mb' }));

// Define root get endpoint (for testing purposes).
app.get('/', (req, res) => 
{
    res.send('Backend is running!');
});

// Define API endpoint for uploading JSON articles to Pinata IPFS.
app.post('/upload-json-data', async (req, res) => 
{
    try 
    {
        // Get uploaded article from request. 
        const articleData = req.body;

        if (!articleData) return res.status(400).json({ error: 'No article was uploaded!' });

        if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY){
            return res.status(500).json({ error: 'No Pinata API keys found!' });
        }

        const pinataRes = await axios.post(
            'https://api.pinata.cloud/pinning/pinJSONToIPFS',
            articleData, 
            {
                // No article length limit.
                maxBodyLength: Infinity,
                // Set metadata information, including API keys for authentication.
                headers: {
                    'Content-Type': 'application/json',
                    pinata_api_key: PINATA_API_KEY,
                    pinata_secret_api_key: PINATA_SECRET_API_KEY
                }
            }
        );

        console.log('Pinata response data:', pinataRes.data);

        res.json({ cid: pinataRes.data.IpfsHash });
    }
    catch (err) 
    {
        console.error('Pinata upload error:', err);
        res.status(500).json({ error: 'Failed to upload article to Pinata!' });
    }
});

app.listen(PORT, () => console.log(`Backend server running on port ${PORT}.`));