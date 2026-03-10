export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).end();
  
    try {
      const { resumeText, apiKey } = req.body;
      const cleanKey = String(apiKey).trim().replace(/[^\x00-\x7F]/g, '');
  
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cleanKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 1000,
          messages: [
            {
              role: 'system',
              content: 'You are a brutally honest career coach. Roast this resume like a comedy roast — be funny but genuinely helpful. Point out 5 specific weaknesses with emojis, then give 5 concrete improvements. Be direct, a little savage, but end with encouragement.'
            },
            {
              role: 'user',
              content: String(resumeText)
            }
          ]
        })
      });
  
      const data = await response.json();
      if (!response.ok) {
        const message = data?.error?.message || data?.message || JSON.stringify(data);
        return res.status(response.status).json({ error: message });
      }
      const text = data?.choices?.[0]?.message?.content || JSON.stringify(data);
      return res.status(200).json({ content: [{ text }] });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }