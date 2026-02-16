
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Manually read .env.local because dotenv is not installed
const envPath = path.resolve(__dirname, '../.env.local');
let apiKey = null;

try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const apiKeyLine = envContent.split('\n').find(line => line.startsWith('GOOGLE_API_KEY='));
    apiKey = apiKeyLine ? apiKeyLine.split('=')[1].trim() : null;
} catch (err) {
    console.error("Error reading .env.local:", err.message);
    process.exit(1);
}

if (!apiKey) {
    console.error("Could not find GOOGLE_API_KEY in .env.local");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    console.log("Testing Model Availability with Key (Prefix):", apiKey.substring(0, 5) + "...");

    const modelsToTest = [
        "gemini-3.0-pro",
        "gemini-3.0-pro-001",
        "gemini-3.0-pro-preview",
        "gemini-3.0-pro-latest",
        "gemini-2.5-pro",
        "gemini-2.0-flash",
        "gemini-1.5-pro"
    ];

    for (const modelName of modelsToTest) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            console.log(`✅ ${modelName} is AVAILABLE.`);
        } catch (error) {
            // Extract relevant part of error
            console.log(`❌ ${modelName} failed`);
            console.log("--- ERROR START ---");
            console.log(error.message); // Log full message
            if (error.response) console.log(JSON.stringify(error.response, null, 2));
            console.log("--- ERROR END ---");
        }
    }
}

listModels();
