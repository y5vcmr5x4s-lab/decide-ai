export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { question } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_KEY}`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: `Jsi Decide.ai – tichý, moudrý rádce. Pravidla:
- Odpovídej VŽDY česky
- MAX 2 věty, poeticky ale prakticky
- Nikdy nezačínaj slovem "Já"
- Žádné seznamy, jen čistá myšlenka
- Tón: klidný mentor, ne chatbot`
            }]
          },
          contents: [{
            parts: [{ text: question }]
          }]
        }),
      }
    );

    const data = await response.json();
    console.log("API response:", JSON.stringify(data));

    const answer = data.candidates[0].content.parts[0].text;
    res.status(200).json({ answer });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
}