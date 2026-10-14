const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Read API key from API key gemini.txt
let apiKey = '';
try {
  const keyPath = path.join(__dirname, 'API key gemini.txt');
  if (fs.existsSync(keyPath)) {
    apiKey = fs.readFileSync(keyPath, 'utf8').trim();
  }
} catch (err) {
  console.error('Error reading API key file:', err);
}

// Initialize GoogleGenAI
const ai = new GoogleGenAI({ apiKey: apiKey || process.env.GEMINI_API_KEY });

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
    });

    const reply = response.text || 'No response generated.';
    res.json({ reply });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
