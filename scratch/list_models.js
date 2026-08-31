const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  try {
    const key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(key);
    // There is no direct listModels on genAI instance in the basic SDK sometimes, 
    // but we can try to fetch it or just try a different model name.
    console.log("Trying gemini-1.5-flash-latest...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent("Hello");
    console.log("Success with gemini-1.5-flash-latest:", result.response.text());
  } catch (err) {
    console.error("Error with gemini-1.5-flash-latest:", err.message);
    
    try {
      console.log("Trying gemini-pro...");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent("Hello");
      console.log("Success with gemini-pro:", result.response.text());
    } catch (err2) {
      console.error("Error with gemini-pro:", err2.message);
    }
  }
}

listModels();
