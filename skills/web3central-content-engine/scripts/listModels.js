const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');


// Load environment variables
const localEnv = path.join(__dirname, '../../../.env');
const web3Env = path.join(__dirname, '../../../../web3central/backend/.env');
const currentEnv = path.join(process.cwd(), '.env');

if (fs.existsSync(localEnv)) {
    dotenv.config({ path: localEnv });
} else if (fs.existsSync(web3Env)) {
    dotenv.config({ path: web3Env });
} else if (fs.existsSync(currentEnv)) {
    dotenv.config({ path: currentEnv });
} else {
    dotenv.config(); 
}



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
