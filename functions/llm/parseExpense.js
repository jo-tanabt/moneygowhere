// functions/llm/parseExpense.js
const functions = require("firebase-functions");
const { Configuration, OpenAIApi } = require("openai");

// You can store this key in .env or use Firebase config instead
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.parseExpense = functions.https.onRequest(async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Missing 'text' in request body" });
  }

  const prompt = `
You are a smart expense parser. Given a short sentence, extract the following fields as JSON:
- amount (in number)
- category (must be one of these: Food & Dining, Transport, Groceries, Shopping, Entertainment, Health, Utilities, Subscriptions, Travel, Gifts, Education, Uncategorized)
- date (ISO format: YYYY-MM-DD)
- note (short description)

Today's date is ${new Date().toISOString().split("T")[0]}

Input: "${text}"
Output (in JSON format):
`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText = completion.data.choices[0].message.content;
    const parsed = JSON.parse(responseText);

    res.json(parsed);
  } catch (error) {
    console.error("LLM parsing failed", error.message);
    res.status(500).json({ error: "Failed to parse with LLM", details: error.message });
  }
});