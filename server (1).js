const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['https://vjlinus.github.io', 'http://localhost', 'http://127.0.0.1'],
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type']
}));

const PORT = process.env.PORT || 3000;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

app.get('/', (req, res) => {
  res.json({ status: 'Reviews to Growth API is running' });
});

app.post('/generate', async (req, res) => {
  const { review, senderName, stars } = req.body;

  if (!review) {
    return res.status(400).json({ error: 'Review text is required.' });
  }

  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API key not configured on server.' });
  }

  const starLabel = [
    'one-star (very unhappy)',
    'two-star (unhappy)',
    'three-star (neutral/mixed)',
    'four-star (happy)',
    'five-star (delighted)'
  ][(stars || 5) - 1];

  const nameInstruction = senderName
    ? `Address the reviewer by their first name "${senderName}" naturally within the reply — not just at the start.`
    : 'Do not address the reviewer by name.';

  const prompt = `You are helping the team at "Ember & Grain" write a warm, genuine reply to a Google review. This is a ${starLabel} review. Write a professional but human-sounding response in under 90 words. ${nameInstruction} Be specific to what the customer mentioned. Do not open with "Thank you for your feedback." End the reply with "— Ember & Grain Team" on a new line. Sound like a real caring team, not a corporate script.

Customer review: "${review}"

Write only the reply text, nothing else.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err?.error?.message || 'Anthropic API error.' });
    }

    const data = await response.json();
    const text = data?.content?.[0]?.text;

    if (!text) return res.status(500).json({ error: 'Empty response from AI.' });

    res.json({ response: text });

  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`RTG backend running on port ${PORT}`);
});
