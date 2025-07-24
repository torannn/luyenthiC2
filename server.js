const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define the main endpoint for analysis
app.post('/analyze', async (req, res) => {
    try {
        // 1. Get the essay text AND the taskType from the request
        const { essay, taskType } = req.body;
        if (!essay) {
            return res.status(400).json({ error: 'Essay text is required.' });
        }
        
        // 2. Declare a variable to hold the chosen prompt
        let prompt = '';

        // 3. Use an if/else if block to select the correct prompt based on taskType
        if (taskType === 'essay') {
            prompt = `Act as a Cambridge C2 Proficiency writing examiner. Analyze the following discursive essay based on the two provided input texts.
            Evaluate the essay against the C2 assessment criteria: Content, Communicative Achievement, Organisation, and Language.
            - **Content:** Did the writer accurately summarize the key points from both texts? Did they evaluate the abstract arguments and effectively integrate their own ideas? Is the target reader fully informed?
            - **Communicative Achievement:** Are the conventions of a discursive essay used with complete command? Are complex ideas communicated in a convincing and effective way?
            - **Organisation:** Is the text impressively and coherently organised? Is there a wide range of cohesive devices and organizational patterns used with complete flexibility?
            - **Language:** Is there a wide and sophisticated range of vocabulary and grammatical structures, used with precision and style? Are any inaccuracies only minor slips?
            Provide a score from 1-5 for each subscale and detailed, constructive feedback with specific examples from the text.
            Here is the essay:
            ---
            ${essay}
            ---`;
        } else if (taskType === 'article') {
            prompt = `Act as a Cambridge C2 Proficiency writing examiner. Analyze the following article.
            Evaluate the article against the C2 assessment criteria: Content, Communicative Achievement, Organisation, and Language.
            - **Content:** Is all content relevant to the task? If the task requires describing an event and evaluating benefits, are both parts fully covered? Is the reader fully informed?
            - **Communicative Achievement:** Does the article use an appropriate style and tone (e.g., engaging, personal, humorous) to hold the reader's attention with ease? Are genre conventions like a title and direct/indirect speech used effectively?
            - **Organisation:** Is the text well-organised and coherent? Does it use varied organisational patterns to lead the reader through the topic naturally?
            - **Language:** Is a wide range of vocabulary, including natural turns of phrase and collocations, used with style? Is grammar sophisticated and well-controlled?
            Provide a score from 1-5 for each subscale and detailed, constructive feedback with specific examples from the text.
            Here is the article:
            ---
            ${essay}
            ---`;
        } else if (taskType === 'review') {
            prompt = `Act as a Cambridge C2 Proficiency writing examiner. Analyze the following review.
            Evaluate the review against the C2 assessment criteria: Content, Communicative Achievement, Organisation, and Language.
            - **Content:** Does the review briefly describe the subject (e.g., story plot), explain its personal impact, and assess its wider relevance as required by the task? Is the reader fully informed?
            - **Communicative Achievement:** Does the review use an informative and appealing tone to communicate complex ideas effectively? Are the conventions of a review (description, opinion, recommendation) used with flexibility?
            - **Organisation:** Is the text a well-organised, coherent whole? Are ideas linked flexibly across sentences and paragraphs using cohesive devices like substitution?
            - **Language:** Is a range of topic-specific and evaluative vocabulary used effectively and precisely? Is there a wide range of grammatical forms used with full control?
            Provide a score from 1-5 for each subscale and detailed, constructive feedback with specific examples from the text.
            Here is the review:
            ---
            ${essay}
            ---`;
        } else if (taskType === 'letter') {
             prompt = `Act as a Cambridge C2 Proficiency writing examiner. Analyze the following letter.
            Evaluate the letter against the C2 assessment criteria: Content, Communicative Achievement, Organisation, and Language.
            - **Content:** Does the letter fully address all parts of the prompt, such as describing personal experiences and explaining crucial factors?
            - **Communicative Achievement:** Are the conventions of letter writing (e.g., appropriate salutations, tone) used flexibly and effectively? Is the purpose for writing clear and are all communicative goals fulfilled?
            - **Organisation:** Is the letter well-structured and coherent? Does it use cohesive devices to link ideas, for example, when contrasting different places or ideas?
            - **Language:** Is a wide range of vocabulary and grammar used with control and sophistication to express views convincingly? Are expressions natural and precise?
            Provide a score from 1-5 for each subscale and detailed, constructive feedback with specific examples from the text.
            Here is the letter:
            ---
            ${essay}
            ---`;
        } else {
            // Handle cases where the taskType is unknown
            return res.status(400).json({ error: 'Invalid or unsupported task type provided.' });
        }
        
        // 4. Send the request to the AI model with the correctly chosen prompt
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const feedbackText = response.text();

        res.json({ feedback: feedbackText });

    } catch (error) {
        console.error('Error in AI analysis:', error);
        res.status(500).json({ error: 'Failed to get feedback from AI.' });
    }
});

// --- NEW ENDPOINT: To summarize the writing feedback ---
app.post('/summarize', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text for summarization is required.' });
        }

        const prompt = `Please summarize the following writing feedback. Focus on the main strengths and the two most critical areas for improvement. Present it as a brief, encouraging paragraph.
        
        FEEDBACK TO SUMMARIZE:
        ---
        ${text}
        ---`;

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summaryText = response.text();

        res.json({ summary: summaryText });

    } catch (error) {
        console.error('Error in summarization:', error);
        res.status(500).json({ error: 'Failed to summarize text.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});

