const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../../../../web3central/backend/.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        console.log('Listing available models for your API key...');
        const models = await genAI.listModels();
        
        console.log('\n--- Available Models ---');
        models.models.forEach(m => {
            console.log(`- Name: ${m.name}`);
            console.log(`  Methods: ${m.supportedGenerationMethods.join(', ')}`);
            console.log('---');
        });
        
    } catch (error) {
        console.error('Error listing models:', error.message);
    }
}

listModels();
