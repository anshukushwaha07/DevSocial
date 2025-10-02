const { Octokit } = require("@octokit/rest");
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
];

const generateRepoSummary = async (repoFullName, userAccessToken) => {
    let readmeContent = '';
    try {
        const octokit = new Octokit({ auth: userAccessToken });
        const [owner, repo] = repoFullName.split('/');
        const { data: readmeData } = await octokit.repos.getReadme({ owner, repo });
        readmeContent = Buffer.from(readmeData.content, 'base64').toString('utf8');
    } catch (error) {
        console.error(`Error fetching README for ${repoFullName}. GitHub API may have failed. Full error:`, error);
        readmeContent = "No README file found or there was an error fetching it.";
    }

    try {
        const prompt = `
            Please provide a concise summary for a GitHub repository. Based on the following README content, analyze what this project is about.
            README Content: ---
            ${readmeContent.substring(0, 20000)} 
            ---
            Based on the content, please generate a summary in the following structure:
            1.  **Project Purpose:** A one or two-sentence explanation of what this project does.
            2.  **Key Features:** A bulleted list of 2-4 main features or capabilities.
            3.  **Tech Stack:** A brief mention of the primary technologies or languages used if evident from the README.
        `;
        
       const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest", safetySettings });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;

        if (!response.text) {
             console.error("AI response was blocked. Finish reason:", response.promptFeedback?.blockReason);
             throw new Error("The AI response was blocked due to safety settings.");
        }
        return response.text();
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate AI summary from the Gemini API.");
    }
};

module.exports = { generateRepoSummary };