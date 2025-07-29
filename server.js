const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');
const OpenAI = require('openai');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Initialize all three AI clients
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// This function contains the logic to try Google -> Groq -> OpenAI
async function generateWithFallback(prompt) {
    // --- 1. First, try to use the Google Gemini API ---
    try {
        console.log("Attempting with Google Gemini...");
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        console.log("Success with Google Gemini.");
        return result.response.text();
    } catch (googleError) {
        // Only fallback on quota errors (429) or overload errors (503)
        if (googleError.status === 429 || googleError.status === 503) {
            console.warn(`Google API failed (${googleError.status}). Falling back to Groq...`);
            
            // --- 2. Second, try to use the Groq API ---
            try {
                console.log("Attempting with Groq...");
                const chatCompletion = await groq.chat.completions.create({
                    messages: [{ role: 'user', content: prompt }],
                    model: 'llama3-8b-8192',
                });
                console.log("Success with Groq.");
                return chatCompletion.choices[0]?.message?.content || "";
            } catch (groqError) {
                console.error("Groq API failed. Falling back to OpenAI...", groqError.message);

                // --- 3. Third, try to use the OpenAI API ---
                try {
                    console.log("Attempting with OpenAI...");
                    const chatCompletion = await openai.chat.completions.create({
                        messages: [{ role: "user", content: prompt }],
                        model: "gpt-4o-mini",
                    });
                    console.log("Success with OpenAI.");
                    return chatCompletion.choices[0]?.message?.content || "";
                } catch (openAIError) {
                    console.error("OpenAI API also failed:", openAIError.message);
                    throw openAIError; // Give up and throw the final error
                }
            }
        } else {
            // If it's a different Google error, throw it
            console.error("An unhandled Google API error occurred:", googleError.message);
            throw googleError;
        }
    }
}

app.post('/analyze', async (req, res) => {
    try {
        const { essay, taskType } = req.body;
        if (!essay) return res.status(400).json({ error: 'Essay text is required.' });

        const prompt = `
            Analyze the following ${taskType}.
            Your response MUST be formatted as a single HTML block.
            - Use <div> as the main container.
            - Use <p> tags for each new paragraph or section. This is for line breaks.
            - Use <strong> tags for section titles like "Content (1/5):".
            - Do not use markdown like **.

            Example response format:
            <div>
                <p><strong>Content (Score/5):</strong> Your analysis here.</p>
                <p><strong>Communicative Achievement (Score/5):</strong> Your analysis here.</p>
                <p><strong>Organisation (Score/5):</strong> Your analysis here.</p>
                <p><strong>Language (Score/5):</strong> Your analysis here.</p>
                <p><strong>Overall Feedback:</strong> Your overall feedback here.</p>
            </div>

            Here is the text to analyze:
            ---
            ${essay}
            ---
        `;

        const feedbackText = await generateWithFallback(prompt);
        let cleanedText = feedbackText.replace(/```html/g, '').replace(/```/g, '').trim();
        res.json({ feedback: cleanedText });

    } catch (error) {
        res.status(500).json({ error: 'Failed to get feedback from all available AI services.' });
    }
});

app.post('/generate-report', async (req, res) => {
    try {
        const { readingResults, writingFeedback } = req.body;
        if (!readingResults || !writingFeedback) {
            return res.status(400).json({ error: 'Reading and Writing data are required.' });
        }

        const prompt = `
            Act as an expert C2-level English tutor. Your task is to provide a final performance report by synthesizing the user's reading performance and the AI's feedback on their writing.
            Your entire response MUST be formatted as a single HTML block. Create three separate collapsible sections using the following structure:
            
            <div class="accordion-item">
                <button class="accordion-header">Section Title</button>
                <div class="accordion-content">
                    <p>Your analysis and feedback for this section go here.</p>
                </div>
            </div>

            Create three sections with these exact titles:
            1. Reading Performance Analysis
            2. Writing Performance Analysis
            3. Actionable Suggestions for Improvement

            For the content:
            - In "Reading Performance Analysis", analyze the user's reading results.
            - In "Writing Performance Analysis", summarize the provided writing feedback.
            - In "Actionable Suggestions", provide 2-3 specific, actionable suggestions based on the combined analysis.

            DATA:
            - Reading Results: ${JSON.stringify(readingResults)}
            - Writing Feedback: ${writingFeedback}
        `;
        
        const reportText = await generateWithFallback(prompt);
        let cleanedText = reportText.replace(/```html/g, '').replace(/```/g, '').trim();
        res.json({ report: cleanedText });
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate report from all available AI services.' });
    }
});

app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});

app.use(express.static(__dirname+"/"))
