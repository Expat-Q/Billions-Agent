const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
const localEnv = path.join(__dirname, '../../../.env');
const web3Env = path.join(__dirname, '../../../../web3central/backend/.env');
dotenv.config({ path: fs.existsSync(localEnv) ? localEnv : web3Env });

// Define Schemas with more metrics
const ToolSchema = new mongoose.Schema({
    name: String,
    description: String,
    category: String,
    trending: Boolean,
    builder: { handle: String, name: String },
    tags: [String],
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    clickCount: { type: Number, default: 0 },
    metrics: { 
        tvl: Number, 
        volume24h: Number, 
        tvlChange7d: Number 
    }
}, { collection: 'tools' });

const NewsSchema = new mongoose.Schema({
    title: String,
    summary: String,
    category: String
}, { collection: 'news' });

const Tool = mongoose.models.Tool || mongoose.model('Tool', ToolSchema);
const News = mongoose.models.News || mongoose.model('News', NewsSchema);

async function fetchInsights() {
    try {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI);
        }
        
        // Fetch tools and shuffle them to ensure rotation
        const allTools = await Tool.find({ status: 'active' }).lean();
        const shuffledTools = (allTools || []).sort(() => 0.5 - Math.random());
        const selectedTools = shuffledTools.slice(0, 15);

        // Fetch latest news
        const latestNews = await News.find().sort({ _id: -1 }).limit(5).lean();

        return {
            tools: selectedTools,
            news: latestNews,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error fetching insights:', error);
        return null;
    }
}

module.exports = fetchInsights;
