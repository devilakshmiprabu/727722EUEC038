const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;

let windowNumbers = [];

app.use(cors());
app.use(express.json());

// Helper function to fetch data from the 3rd party API
const fetchNumbers = async (type) => {
  const apiUrl = `http://20.244.56.144/test/${type}`;
  try {
    const response = await axios.get(apiUrl);
    return response.data.numbers || [];
  } catch (error) {
    console.error(`Error fetching numbers: ${error.message}`);
    return [];
  }
};

// Route to get numbers based on type (p, f, e, r)
app.get('/numbers/:type', async (req, res) => {
  const { type } = req.params;

  // Validate the type
  const validTypes = ['p', 'f', 'e', 'r'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: 'Invalid type. Use p, f, e, or r.' });
  }

  // Map type to API endpoint
  const typeMap = {
    p: 'primes',
    f: 'fibo',
    e: 'even',
    r: 'rand',
  };

  // Fetch new numbers
  const newNumbers = await fetchNumbers(typeMap[type]);

  // Add unique numbers to the window
  const uniqueNumbers = newNumbers.filter((num) => !windowNumbers.includes(num));
  windowNumbers = [...windowNumbers, ...uniqueNumbers].slice(-WINDOW_SIZE);

  // Calculate the average
  const average =
    windowNumbers.length > 0
      ? windowNumbers.reduce((acc, num) => acc + num, 0) / windowNumbers.length
      : 0;

  // Send response
  res.json({
    windowPrevState: windowNumbers.slice(0, -uniqueNumbers.length),
    windowCurrState: windowNumbers,
    numbers: newNumbers,
    avg: parseFloat(average.toFixed(2)),
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
