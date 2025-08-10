import express from 'express';
// Replace getChatResponse function:
async function getChatResponse(userInput) {
  const response = await fetch('http://localhost:3000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userInput }),
  });

  if (!response.ok) {
    throw new Error('Failed to get chat response');
  }

  const data = await response.json();
  return data.text;
}


import cors from 'cors';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Endpoint for chat completion
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const completion = await openai.createChatCompletion({
      model: 'gpt-4', // or 'gpt-3.5-turbo'
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const responseText = completion.data.choices[0].message.content.trim();
    res.json({ text: responseText });
  } catch (error) {
    console.error('Chat API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get chat response' });
  }
});

// Endpoint for image generation
app.post('/image', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const imageResponse = await openai.createImage({
      prompt,
      n: 1,
      size: '256x256',
    });

    const imageUrl = imageResponse.data.data[0].url;
    res.json({ url: imageUrl });
  } catch (error) {
    console.error('Image API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});