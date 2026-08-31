import fs from 'fs';
import path from 'path';

// Simple manual .env.local parser
function getApiKey() {
    try {
        const envPath = path.resolve('.env.local');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/GEMINI_API_KEY=(.*)/);
        return match ? match[1].trim() : null;
    } catch (e) {
        return null;
    }
}

const key = getApiKey();
if (!key) {
    console.error("No API key found in .env.local");
    process.exit(1);
}

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await response.json();
    
    console.log("--- AVAILABLE MODELS ---");
    if (data.models) {
        data.models.forEach(m => {
            console.log(`${m.name} (Methods: ${m.supportedGenerationMethods.join(', ')})`);
        });
    } else {
        console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
