cat > ~/resume-roaster/api/roast.js << 'EOF'
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { resumeText, style } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    const systemPrompts = {
      brutal: 'You are a savage comedy roast host. Roast this resume mercilessly — be funny, harsh, but genuinely helpful. Start with a score like "Score: 65/100". Then 5 brutal weaknesses with emojis. Then 5 concrete fixes. End with one line of encouragement.',
      balanced: 'You are a friendly mentor reviewing this resume. Be honest but kind. Start with a score like "Score: 65/100". Point out 5 specific weaknesses with emojis. Give 5 actionable improvements. End with encouragement.',
      professional: 'You are a senior HR consultant. Give formal, professional feedback. Start with a score like "Score: 65/100". List 5 specific weaknesses. Provide 5 concrete recommendations. End professionally.'
    };

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [
          { role: 'system', content: systemPrompts[style] || systemPrompts.brutal },
          { role: 'user', content: String(resumeText) }
        ]
      })
    });

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || JSON.stringify(data);
    return res.status(200).json({ content: [{ text }] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
cat > ~/resume-roaster/api/roast.js << 'EOF'
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY not set', env: Object.keys(process.env).filter(k => k.includes('GROQ')) });
  }

  try {
    const { resumeText, style } = req.body;

    const systemPrompts = {
      brutal: 'You are a savage comedy roast host. Roast this resume mercilessly — be funny, harsh, but genuinely helpful. Start with a score like "Score: 65/100". Then 5 brutal weaknesses with emojis. Then 5 concrete fixes. End with one line of encouragement.',
      balanced: 'You are a friendly mentor reviewing this resume. Be honest but kind. Start with a score like "Score: 65/100". Point out 5 specific weaknesses with emojis. Give 5 actionable improvements. End with encouragement.',
      professional: 'You are a senior HR consultant. Give formal, professional feedback. Start with a score like "Score: 65/100". List 5 specific weaknesses. Provide 5 concrete recommendations. End professionally.'
    };

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [
          { role: 'system', content: systemPrompts[style] || systemPrompts.brutal },
          { role: 'user', content: String(resumeText) }
        ]
      })
    });

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || JSON.stringify(data);
    return res.status(200).json({ content: [{ text }] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
EOF