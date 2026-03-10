export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { resumeText } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 800,
        messages: [
          {
            role: 'system',
            content: 'Return ONLY a raw JSON array of 5 jobs. No markdown. Format: [{"title":"...","company":"...","location":"...","description":"...","applyUrl":"..."}]'
          },
          {
            role: 'user',
            content: String(resumeText).slice(0, 1000)
          }
        ]
      })
    });

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || '[]';
    let jobs;
    try {
      jobs = JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch {
      jobs = [
        { title: "Software Developer", company: "Tech Corp", location: "Remote", description: "Build modern web applications", applyUrl: "https://www.indeed.com/jobs?q=software+developer" },
        { title: "Frontend Engineer", company: "StartupXYZ", location: "Remote", description: "React development", applyUrl: "https://www.linkedin.com/jobs/search/?keywords=frontend+engineer" }
      ];
    }
    return res.status(200).json({ jobs });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
