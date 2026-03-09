export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).end();
  
    const { resumeText, apiKey } = req.body;
  
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: "You are a brutally honest career coach. Roast this resume like a comedy roast — be funny but genuinely helpful. Point out 5 specific weaknesses with emojis, then give 5 concrete improvements. Be direct, a little savage, but end with encouragement.",
        messages: [{ role: 'user', content: resumeText }]
      })
    });
  
    const data = await response.json();
    return res.status(200).json(data);
  }
 