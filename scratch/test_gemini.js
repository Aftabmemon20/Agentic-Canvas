const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
  try {
    const key = process.env.GEMINI_API_KEY;
    console.log("Using key:", key ? key.substring(0, 10) + "..." : "undefined");
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello");
    console.log("Success:", result.response.text());
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
