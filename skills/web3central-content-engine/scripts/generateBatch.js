const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const fetchInsights = require('./fetchInsights');

// Load env
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
    dotenv.config(); // Fallback to process.env (useful for Codespaces/Production)
}


async function sendToTelegram(filePath, fileName) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return;

    const form = new FormData();
    form.append('chat_id', chatId);
    form.append('document', fs.createReadStream(filePath), { filename: fileName });
    form.append('caption', `📝 Your Web3Central Weekly Content Schedule is ready!\n\nI followed the 10 Rules and used real metrics (Ratings/Clicks/TVL). Copy & Paste from the attached file.`);

    try {
        await axios.post(`https://api.telegram.org/bot${token}/sendDocument`, form, {
            headers: form.getHeaders(),
        });
        console.log('📬 Content Schedule sent to your Telegram DM!');
    } catch (error) {
        console.error('❌ Telegram Send Error:', error.response?.data || error.message);
    }
}

async function generateBatch() {
    console.log('🚀 Web3Central "Alpha" Content Agent starting...');
    
    const insights = await fetchInsights();
    if (!insights) return;

    const apiKey = process.env.GROQ_API_KEY;
    
    const trainingContext = `
    MASTER RULES FOR THE AGENT (2026 ALPHA PILLARS):
    1. Hook with the "Why": Don't just state data. Explain why it matters. (e.g., "Uniswap TVL up 5% = Liquidity is returning to ETH").
    2. Utility-First Narrative: Every post must solve a problem or provide a direct insight. No hype/speculation.
    3. Platform Integration: Naturally mention Web3Central features:
        - "Review Ratings": Use these to validate community sentiment.
        - "Developer Console": Encourage builders to claim their profile and track metrics.
        - "Categories": Reference our 500+ tools organized by sector (DePIN, RWA, etc).
    4. One idea per post. Punchy, authoritative, and data-backed.
    5. No AI-isms: Eliminate words like "Leverage," "Unlock," "Deep-dive," "Game-changer," "Revolutionize." Use plain, professional English.
    6. Vary CTAs: Link to specific platform sections (e.g., /categories, /submit-tool, /reviews).
    7. Human Energy: End with a call to action that feels urgent and logical.
    8. Proof-Based: If a tool is trending, mention its clickCount or recent rating change.

    ADVANCED RESEARCH CONSTRAINTS (DEFILLAMA STYLE):
    9. The Neutrality Filter: Absolutely zero emotive adjectives. Use "Significant" instead of "Massive," "Consistent" instead of "Incredible."
    10. Atomic Metrics: Every post must feature a specific ratio or comparison (e.g., "This tool has 4x the clickCount of its category average").
    11. Alpha Divergence: Look for "odd" data points in the provided JSON (e.g., a tool with high ratings but low clickCount, or a trending tool with low TVL) and hypothesize why.

    CONTENT CALENDAR LOGIC:
    - Monday: The Narrative Shift (Metrics)
    - Tuesday: Developer Alpha (Dev Console/Onboarding)
    - Wednesday: Category Kings (Sector deep dives)
    - Thursday: Community Consensus (Review Ratings)
    - Friday: On-Chain Trending (Clicks/Signals)
    - Saturday: Platform Mastery (Tutorials/Features)
    - Sunday: Weekly Recap

    DATA TO WORK WITH:
    Tools: ${JSON.stringify(insights.tools)}
    News: ${JSON.stringify(insights.news)}
    `;

    const prompt = `
    Create a 7-day content schedule following the CONTENT CALENDAR LOGIC.
    Each day must have 3 posts: Morning (Insight), Afternoon (Platform Utility), Evening (Community/Engagement).
    
    Use the provided tool metrics (rating, clickCount, tvl) to ground every post in reality.
    Mention specific Categories and the Developer Console where appropriate.
    
    Output the result as a plain text file format, separated by days and time slots.
    `;

    try {
        console.log('🧠 Generating Alpha content with Llama 3.3...');
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: trainingContext },
                { role: "user", content: prompt }
            ],
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            timeout: 60000 // 60s timeout
        });

        const rawContent = response.data.choices[0].message.content;
        
        const batchDir = path.join(__dirname, '../batches');
        if (!fs.existsSync(batchDir)) fs.mkdirSync(batchDir);
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `web3central_schedule_${timestamp}.txt`;
        const filePath = path.join(batchDir, fileName);
        
        fs.writeFileSync(filePath, rawContent);
        console.log(`✅ SUCCESS! Alpha Schedule generated: ${filePath}`);
        
        // Send to Telegram
        await sendToTelegram(filePath, fileName);
        
        console.log('\n--- Day 1 Preview ---');
        console.log(rawContent.split('---').slice(0, 3).join('\n---'));
        
        return rawContent;
    } catch (error) {
        console.error('❌ Generation Error:', error.response?.data || error.message);
    }
}

generateBatch();
