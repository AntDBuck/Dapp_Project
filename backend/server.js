import express from 'express';
import axios from 'axios';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import FormData from 'form-data';

// Load keys and port number from .env file and store in .process.env.
// Purpose: hide API keys.
dotenv.config()

// Get API keys from .env file.
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

// Get port number from .env file or set to 5000 if not found.
const PORT = process.env.PORT || 5000;

// Create express server app.
const app = express();

// Initialise multer object and store articles in buffer memory.
const articleUploader = multer();

// Enable requests from React application.
app.use(cors());
// Enable parsing of JSON requests (added for potential future use).
app.use(express.json());

// Define root get endpoint.
app.get('/', (req, res) => 
    {
        // Send confirmation message.
        res.send('Backend is running!');
    }
);

// Define API endpoint for uploading article files to Pinata IPFS.
app.post('/upload', articleUploader.single('article'), async (req, res) => 
    {
        try 
        {
            // Get uploaded article from request. 
            const article = req.file;

            // If article does not exist send status code and JSON error message.
            if (!article) return res.status(400).json({ error: 'No article was uploaded!' });

            // If API keys do not exist send status code and JSON error message.
            if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY)
            {
                return res.status(500).json({ error: 'No Pinata API keys found!' });
            }

            // Create form data object and append uploaded file from memory buffer.
            const wrappedArticle = new FormData();
            wrappedArticle.append('article', article.buffer, article.originalname);

            // Send form data to Pinata's API using axios post method.
            const pinataRes = await axios.post(
                'https://api.pinata.cloud/pinning/pinFileToIPFS',
                wrappedArticle,
                {
                    // No article length limit.
                    maxBodyLength: 'Infinity',
                    // Set metadata information, including API keys for authentication.
                    headers:
                    {
                        ...wrappedArticle.getHeaders(),
                        pinata_api_key: PINATA_API_KEY,
                        pinata_secret_api_key: PINATA_SECRET_API_KEY
                    },
                }
            );

            // Pass upload data response to console.
            console.log('Pinata response data:', pinataRes.data);

            // Get uploaded article's CID in JSON format.
            res.json({ cid: pinataRes.data.IpfsHash });
        } 
        // Catch potential errors during upload.
        catch (err)
        {
            // Pass error to console.
            console.error('Pinata upload error:', err);
            // Send HTTP status code and JSON error message.
            res.status(500).json({ error: 'Failed to upload article to Pinata!' });
        }
    }
);

// Start server and print console confirmation.
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}.`));