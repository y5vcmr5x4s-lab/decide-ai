export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  
    const { question } = req.body;
  
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 120,
        system: `Jsi Decide.ai – tichý, moudrý rádce. Pravidla:
  - Odpovídej VŽDY česky
  - MAX 2 věty, poeticky ale prakticky  
  - Nikdy nezačínaj slovem "Já"
  - Žádné seznamy, jen čistá myšlenka
  - Tón: klidný mentor, ne chatbot`,
        messages: [{ role: "user", content: question }],
      }),
    });
  
    const data = await response.json();
    res.status(200).json({ answer: data.content[0].text });
  }