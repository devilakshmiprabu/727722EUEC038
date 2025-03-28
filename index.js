// Import required modules
const express = require('express');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const baseURL = "http://20.244.56.144/test";


app.post('/api/register', async (req, res) => {
    try {
        const response = await axios.post(`${baseURL}/register`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.response?.data?.message || "Error registering company"
        });
    }
});


app.post('/api/auth', async (req, res) => {
    try {
        const response = await axios.post(`${baseURL}/auth`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.response?.data?.message || "Error fetching token"
        });
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
