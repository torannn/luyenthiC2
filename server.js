const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/analyze', async (req, res) => {
    try {
        const { essay, taskType } = req.body;
        if (!essay) return res.status(400).json({ error: 'Essay text is required.' });

        // --- NEW, MORE ROBUST PROMPT ---
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

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let feedbackText = response.text();

        // Clean the response to ensure it's valid HTML
        feedbackText = feedbackText.replace(/```html/g, '').replace(/```/g, '').trim();

        res.json({ feedback: feedbackText });

    } catch (error) {
        console.error('Error in AI analysis:', error);
        res.status(500).json({ error: 'Failed to get feedback from AI.' });
    }
});

// --- This is the NEW endpoint that replaces /summarize ---
// --- This is the NEW endpoint that generates an HTML accordion ---
app.post('/generate-report', async (req, res) => {
    const { readingResults, writingFeedback } = req.body;
    if (!readingResults || !writingFeedback) {
        return res.status(400).json({ error: 'Reading and Writing data are required.' });
    }

    // Inside app.post('/generate-report', ...)

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

    // --- NEW RETRY LOGIC STARTS HERE ---
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        try {
            // This is your original code, now inside the 'try' block
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            let reportText = response.text();

            // Clean the response
            reportText = reportText.replace(/```html/g, '').replace(/```/g, '').trim();

            // If successful, send the response and exit the function
            return res.json({ report: reportText });

        } catch (error) {
            attempts++;
            console.error(`Attempt ${attempts} failed:`, error.message);

            // Check if it's the specific "overloaded" error and if we have attempts left
            if (attempts < maxAttempts && error.status === 503) {
                console.log(`Model is overloaded. Retrying in 1 second...`);
                // Wait for 1 second before the next attempt
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                // If it's a different error or we're out of retries, fail permanently
                console.error('Error in report generation:', error);
                return res.status(500).json({ error: 'Failed to generate report after multiple attempts.' });
            }
        }
    }
    // --- RETRY LOGIC ENDS HERE ---
});

app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});