// functions/index.js (V2 Migrated)

/**
 * AI Club Head: Firebase Cloud Functions
 * Includes:
 * 1. generateClubIdeas (callable from React Native)
 * 2. checkFlagshipReminders (scheduled cron job)
 */

// --- V2 ENVIRONMENT PARAMETER CONFIGURATION ---
// Import necessary Firebase modules
const functions = require('firebase-functions');
const { defineString } = require('firebase-functions/params');

// Define the environment variable (this name must match the one you set later)
const aiApiKey = defineString('AI_API_KEY');

// Import Admin SDK and initialize Firestore
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

// Import the Google Gen AI SDK
const { GoogleGenAI } = require('@google/genai');

// Initialize the AI client using the new parameter access
const ai = new GoogleGenAI({ apiKey: aiApiKey.value() }); 
const modelName = 'gemini-2.5-flash';

// --- GLOBAL OPTIONS (V1/V2 compatible runtime options) ---
const runtimeOptions = {
    // Sets max concurrent requests/instances for cost control
    maxInstances: 10, 
    // Recommended region for most users
    region: 'us-central1' 
};

// ======================================================================
// 1. CALLABLE FUNCTION: Event Idea Generation
// ======================================================================

exports.generateClubIdeas = functions.runWith(runtimeOptions).https.onCall(async (data, context) => {
    functions.logger.info("Function 'generateClubIdeas' called.", data);
    
    // 1. Authentication and Input Validation
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated', 
            'Authentication is required to call this function.'
        );
    }

    const { clubName, clubNiche, targetAudience, numIdeas = 3 } = data;

    // Check if the parameter value is accessible
    if (!clubName || !clubNiche || !aiApiKey.value()) { 
        throw new functions.https.HttpsError(
            'invalid-argument', 
            'Missing required parameters (clubName, clubNiche) or AI Key is not configured.'
        );
    }
    
    // 2. Define the Prompt (Remains the same)
    const prompt = `
        Act as a highly creative and experienced college club event planner.
        The club is called: ${clubName}. Its primary niche/focus is: ${clubNiche}.
        The target audience for the events is: ${targetAudience || 'All college students'}.
        
        Generate exactly ${numIdeas} unique, engaging, and feasible event ideas for this college club.
        
        For each idea, provide a:
        - title (short, catchy name)
        - summary (1-2 sentences explaining the event)
        - requiredResources (a short list of 3-4 key resources, e.g., "Projector, Pizza, Room Booking")
        
        Respond only with a single JSON object that adheres strictly to the following structure:
        { "ideas": [ {"title": "...", "summary": "...", "requiredResources": ["...", "..."]}, ... ] }
    `;

    try {
        // 3. Call the Gemini API
        const result = await ai.models.generateContent({ 
            model: modelName, 
            contents: prompt,
            config: {
                responseMimeType: "application/json", 
            }
        });

        // 4. Parse the JSON response
        const jsonText = result.text.trim();
        const responseData = JSON.parse(jsonText);
        functions.logger.info("AI response parsed successfully.");

        // 5. Return the structured data
        return { 
            status: 'success', 
            ideas: responseData.ideas || []
        };

    } catch (error) {
        functions.logger.error("AI Idea Generation Failed:", error);
        
        throw new functions.https.HttpsError(
            'internal', 
            'Failed to generate ideas from the AI model.',
            error.message
        );
    }
});


// ======================================================================
// 2. SCHEDULED FUNCTION: Flagship Event Reminder (V2 Migration applied)
// ======================================================================

// Runs every day at 10:00 AM in the us-central1 region
exports.checkFlagshipReminders = functions.runWith(runtimeOptions).pubsub.schedule('0 10 * * *')
    .onRun(async (context) => {
        // ... (Reminder logic remains the same)
        // ... (Reminder logic remains the same)
        // ...
        return null;
    });