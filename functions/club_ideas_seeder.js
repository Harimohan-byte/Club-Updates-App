/**
 * CLUB IDEA SEEDER SCRIPT
 * * NOTE: This script is intended to be run ONCE from a Node.js environment 
 * (like your local functions folder) to initialize the Firestore data.
 * You must have the Firebase Admin SDK installed and configured.
 * * 1. npm install firebase-admin
 * 2. Fill in the serviceAccount details below (get a private key from Firebase Console).
 * 3. Run: node club_ideas_seeder.js
 */

const admin = require('firebase-admin');

// 🛑 STEP 1: REPLACE WITH YOUR SERVICE ACCOUNT CREDENTIALS 🛑
// Go to Firebase Console -> Project Settings -> Service Accounts -> Generate new private key
const serviceAccount = {
  "type": "service_account",
  "project_id": "clubupdatesapp", // e.g., "clubupdatesapp"
  "private_key_id": "132d5c7f6eb7e2bd05200adc4277d87fab6cc358",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC80UuxEVRRaj9j\nOk6h+V6pQrJ4gNsiP4uYTc41+QoLJszZ/2h0AK4yTP0L0skIq6N8AHXP0v1nABYf\n7dtRHtfgauH5bEr54ZJKlN+AeUguIKKgx8LITCgcZQC44l7wgdFhj8D3Srx2qVbJ\nnyoZ4oQtXVcIL+4EzXVWJQyqiFcqqRh1GjYJl2d5IQeKSwvAn0wfSR7dS/Q7O9Tv\ntrbI9tT1cP4xsxa4ezT61dukCKto6lmvrom9dsDDOVuqKRMe5L2gbkJ6My9oWbcR\nm4/b2dvQJZkAjxYQAj3cOV4U9R4zfe2La5UQf6kNxSpCSQIPWaS05CdcRE4OipEO\naBGwalTHAgMBAAECggEACjLz97iL6WnnyqBXpwAlUNc9dKzhKVRtYeix/tBY7olF\n/3CAX+O5hRYLhRv5p/I9fnE36+Xlsi6bA1aBxjv4RTMAycxDsIOytzybZgEnGPbC\nUhT4PIGAmSgLhfEUV8FrYe216qWq0G4NNg7W41cM9LZaASM1pCTE9cZCjOOYccFg\nxENhAR6QTA7D6fdy8/8A52yNP0fTjez/S5wtVWzze7iqcj38CJOH4U6Y5HuRIXLP\n4JtpaWStG+INShueuwj2/sH9ofSE0Zj3TPAVXTul8p/xmUO8rwUdD/AuSS8K5s3C\nQquZviN9e0/tul3gD7fZtwjrWNqwf4mNggUPkixM4QKBgQDdSCZLns0qfQCDVQ/b\nbmOBxn+vS/pjfuSkvBAEoPsYwnP0TMwbKc9SnR+kNmopVCHJ46WMZNUoBTxV15TN\nA0/guVXZbnFMJtGZubtCPmhzoYbN79qWfgaYGEdnwx9gr5Bt9pHTt/9Y/jomEfJz\npSRdc6r8mV/xPsUFOPDUlmXILQKBgQDacTV8v92EPm/G+bBGWHS17DT+ehmIOGVG\nJFu1OOKA2eJE+7kdN1hA5TK7HE1lqOQ8PcSTtMGGME8W4K/7kxH30xCSajEN6gtg\nULBoa+fGm4lfFPKMrVVQWyQiMHkrTX+AIQKDByDh7+k94D2A/lGF0RZIbWlTru+0\nEpq0C5BVQwKBgDCLCGOkdauxenBVM8JWiBvLGO2yxD4Zcz00SGtLiWoYFmnsgwYe\neO3NrEhQ658fZr4sY3/WCvDZnS/TuD/1TwukfNHTKaWkCm0n0o2otS9Qqwr4aEKF\naRrqkJeRtYt3WD7XTYxdm/XA5668VyzJeJ3LpyH835BDzeLkZ+irCa8NAoGBANAc\nDO41yK/l4A378bGDMmXjjLVo1AxQVkPV/b0QXdKOQiCghULNaHojIgrbMu2IUzEF\nU9O44KqcOa09EMwn2HV3kxE6tFNiR8ZR+U7yhpVTtzNrvIzD0kTFIA6mibn0kmUa\njc8RKoW2UEsP6OiM4lQP2B/WhQMh5eJz2wlu/uoLAoGAV7su/l99kmWu2d8Y9WsG\nPajNsql/p/noCuFgr+4lYnlMhFsle7tWduLv+6CB24Cvb1m5AaxJSSJNod+ng2z+\nnfzp1JsedfETjyBk7GvKN7AFMQ5H6fEmkNvco25b+jXdiB8HZH8kUFZ7HYMlzYlA\noN+XX1p3f3eUUVIBXSbfkbQ=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@clubupdatesapp.iam.gserviceaccount.com",
  "client_id": "117528326277481494400",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40clubupdatesapp.iam.gserviceaccount.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// -------------------------------------------------------------------
// 🛑 STEP 2: DEFINE ALL CLUB DATA AND IDEAS 🛑
// The document ID will be the club name (e.g., "Atharv").
// -------------------------------------------------------------------
const clubData = [
    {
        name: "Atharv",
        niche: "Sports Club",
        ideas: [
            { title: "Campus Olympics", summary: "Week-long event with mixed sports challenges.", resources: ["Ground booking", "Equipment", "Referees"] },
            { title: "Inter-Club Futsal Tournament", summary: "Fast-paced indoor soccer competition.", resources: ["Court time", "Jerseys", "Trophies"] },
            { title: "3v3 Basketball Blitz", summary: "Quick elimination street-style basketball.", resources: ["Court access", "Whistle", "Scoreboard"] },
            { title: "Midnight Volleyball", summary: "Late-night tournament to boost team spirit.", resources: ["Floodlights", "Nets", "Energy drinks"] },
            { title: "Fitness Challenge Week", summary: "Daily physical tasks like pushups and sprints.", resources: ["Fitness equipment", "Trainer", "Leaderboard app"] },
            { title: "E-Sports FIFA Tournament", summary: "Competitive digital soccer challenge.", resources: ["Consoles/PCs", "Large screens", "Controllers"] },
            { title: "Faculty vs Student Cricket Match", summary: "Fun, low-stakes match for bonding.", resources: ["Cricket gear", "Pitch access", "Snacks"] },
            { title: "Marathon/Fun Run", summary: "Campus-wide charity or awareness run.", resources: ["Route mapping", "Water stations", "Medical staff"] },
            { title: "Chess & Carrom Clash", summary: "Indoor mental acuity tournament.", resources: ["Boards", "Timers", "Quiet room"] },
        ]
    },
    {
        name: "AI ML CLUB",
        niche: "AI/ML/Data Science",
        ideas: [
            { title: "Predictive Modeling Challenge", summary: "Students use data science to solve a real-world problem.", resources: ["Dataset access", "Cloud compute credits", "Judging criteria"] },
            { title: "Neural Network Design Workshop", summary: "Hands-on session building basic neural nets in PyTorch/TensorFlow.", resources: ["Lab access", "Instructor", "Jupyter notebooks"] },
            { title: "Kaggle Competition Prep", summary: "Team up to tackle a live Kaggle competition.", resources: ["Mentor support", "Study room", "Coffee"] },
            { title: "Ethical AI Debate", summary: "Discussion on bias, privacy, and the future of AI regulation.", resources: ["Panelists/Speakers", "Auditorium", "Microphones"] },
            { title: "Deep Learning Study Group", summary: "Weekly meeting to discuss advanced research papers.", resources: ["Whiteboard", "Online paper access"] },
            { title: "AI in Gaming Seminar", summary: "Talk on how AI/ML is used in game development (NPC behavior, graphics).", resources: ["Speaker/Guest", "Projector"] },
            { title: "NLP Hands-on Project", summary: "Building a simple sentiment analyzer or language model.", resources: ["Python library docs", "Sample text data"] },
            { title: "Data Visualization Contest", summary: "Creating compelling visualizations from complex datasets.", resources: ["Tableau/PowerBI license", "Judges"] },
            { title: "Beginner ML Bootcamp", summary: "Weekend crash course on scikit-learn and basic algorithms.", resources: ["Curriculum slides", "Hands-on exercises"] },
        ]
    },
    {
        name: "E- CELL",
        niche: "Entrepreneurship Club",
        ideas: [
            { title: "Idea Pitch Battle", summary: "Students pitch startup ideas to judges in 5 minutes.", resources: ["Panel of investors/alumni", "Presentation slides", "Prizes"] },
            { title: "Startup Case Study Competition", summary: "Analyzing successful and failed startups to learn strategy.", resources: ["Case study materials", "Mentors"] },
            { title: "Mock Stock Market Challenge", summary: "Virtual trading competition over several weeks.", resources: ["Virtual trading platform", "Initial capital (virtual)", "Leaderboard"] },
            { title: "Networking with Alumni", summary: "Meet-and-greet with successful alumni entrepreneurs.", resources: ["Venue rental", "Refreshments", "Invites"] },
            { title: "Venture Capital Workshop", summary: "Understanding funding rounds, term sheets, and valuations.", resources: ["Guest speaker (VC)", "Financial templates"] },
            { title: "Product Launch Simulation", summary: "Simulate marketing and launching a product from concept to market.", resources: ["Marketing budget (virtual)", "Team roles"] },
            { title: "Business Plan Drafting Clinic", summary: "Workshop on creating a professional, investor-ready business plan.", resources: ["Templates", "Expert feedback"] },
            { title: "Sales & Marketing Crash Course", summary: "Basic techniques for customer acquisition and market research.", resources: ["Industry examples", "Role-playing scenarios"] },
            { title: "Design Thinking Workshop", summary: "Hands-on workshop focused on human-centric problem-solving.", resources: ["Sticky notes", "Whiteboard", "Facilitator"] },
        ]
    },
    {
        name: "Money Matters",
        niche: "Finance Club",
        ideas: [
            { title: "Personal Budgeting Workshop", summary: "Teaching students financial discipline and spending tracking.", resources: ["Spreadsheet templates", "Personal finance expert"] },
            { title: "Stock Market Simulation (Virtual)", summary: "A multi-week game testing real-time investment strategies.", resources: ["Virtual trading platform", "Leaderboard display"] },
            { title: "Investment Strategy Masterclass", summary: "Deep dive into value investing, growth investing, and diversification.", resources: ["Financial charts", "Expert speaker"] },
            { title: "Crypto/Blockchain Fundamentals", summary: "Seminar covering the basics of digital assets and decentralization.", resources: ["Tech expert speaker", "Presentation setup"] },
            { title: "Financial Literacy Quiz", summary: "A fun quiz competition testing basic economic and finance knowledge.", resources: ["Questions bank", "Prizes"] },
            { title: "Tax and Saving Seminar", summary: "Workshop focused on income tax basics and maximizing savings.", resources: ["CA/Tax consultant guest"] },
            { title: "Portfolio Management Game", summary: "Teams manage a virtual portfolio based on economic news.", resources: ["News feed access", "Tracking sheet"] },
            { title: "Analyzing Company Reports", summary: "Hands-on session dissecting P&L, balance sheets, and cash flow statements.", resources: ["Sample reports", "Accounting software"] },
            { title: "Intro to Forex Trading", summary: "Beginner session on foreign exchange market dynamics.", resources: ["Forex simulator access", "Market data"] },
        ]
    },
    {
        name: "Igniters",
        niche: "Dance Club",
        ideas: [
            { title: "Choreography Workshop", summary: "A session focusing on hip-hop and contemporary choreographic techniques.", resources: ["Studio space", "Sound system", "Professional instructor"] },
            { title: "Inter-College Dance Battle", summary: "A major event inviting teams from local colleges for a fierce competition.", resources: ["Large venue/stage", "Judges", "Marketing posters"] },
            { title: "Flash Mob Planning Session", summary: "Secret planning and practice sessions for a surprise campus performance.", resources: ["Open space access", "Music tracks"] },
            { title: "Fusion Dance Night", summary: "A showcase blending different styles (e.g., classical and western).", resources: ["Costumes/Props", "Stage lighting"] },
            { title: "Solo Dance Showcase", summary: "An event for solo artists to present self-choreographed pieces.", resources: ["Auditorium booking", "Video recording equipment"] },
            { title: "Fitness & Flexibility Class", summary: "Regular class focused on the physical conditioning needed for dancers.", resources: ["Yoga mats", "Stretching guides"] },
            { title: "Prop Dance Workshop", summary: "Learning to incorporate scarves, hats, or chairs into performances.", resources: ["Specific props", "Safety instructor"] },
            { title: "Theme-based Group Dance Practice", summary: "Weekly practices dedicated to specific themes like 'Bollywood retro'.", resources: ["Themed music playlists"] },
            { title: "Dance History and Styles Seminar", summary: "Lecture and video showcase detailing the evolution of global dance forms.", resources: ["Projector", "Speaker"] },
        ]
    },
    {
        name: "Capriccio",
        niche: "Music Club",
        ideas: [
            { title: "Open Mic Night (Acoustic)", summary: "Relaxed evening event for solo and duo acoustic performances.", resources: ["Coffee shop venue", "Basic sound setup", "Sign-up sheet"] },
            { title: "Band Hunt Competition", summary: "Competition to find the best new band or musical group on campus.", resources: ["Audition judges", "Stage/Venue", "Prizes"] },
            { title: "Music Production Workshop", summary: "Introductory session on Digital Audio Workstations (DAW) like FL Studio or Ableton.", resources: ["Lab access with software", "Instructor"] },
            { title: "Karaoke Challenge", summary: "Fun, competitive event testing vocal range and stage presence.", resources: ["Karaoke machine", "Song library", "Microphones"] },
            { title: "Classical Music Appreciation", summary: "Guided listening session exploring different eras and composers.", resources: ["Quiet room", "High-quality audio system"] },
            { title: "Jamming Session/Improvisation", summary: "Informal meetup for musicians to improvise together.", resources: ["Instruments (guitars, drums)", "Rehearsal room"] },
            { title: "Instrument Exchange Meetup", summary: "Event for buying, selling, or swapping musical equipment.", resources: ["Vendor space", "Safety guidelines"] },
            { title: "Songwriting Clinic", summary: "Workshop focusing on lyric writing, melody, and harmony.", resources: ["Music theory handouts", "Experienced composer"] },
            { title: "Theme-based Musical Performance", summary: "Full-scale performance centered around a theme (e.g., 'Rock Legends').", resources: ["Full PA system", "Lighting rig", "Setlist"] },
        ]
    },
    {
        name: "Club de Theatre",
        niche: "Drama Club",
        ideas: [
            { title: "Improv Comedy Night", summary: "Audience-driven spontaneity and comedy show.", resources: ["Small stage", "Microphones", "Audience chairs"] },
            { title: "Short Play Writing Workshop", summary: "Session on developing characters, conflict, and dialogue for plays.", resources: ["Writing prompts", "Workshop leader"] },
            { title: "Street Play (Nukkad Natak) Performance", summary: "Powerful, socially relevant performance in a public campus space.", resources: ["Props/Costumes", "Permission for public space"] },
            { title: "Monologue Competition", summary: "Competition where actors perform dramatic or comedic monologues.", resources: ["Judges", "Scorecards"] },
            { title: "Stage Lighting and Sound Workshop", summary: "Technical training on running lights and audio for stage productions.", resources: ["Theatre technician", "Control booth access"] },
            { title: "Costume Design Session", summary: "Hands-on session using fabrics and materials to create theatrical costumes.", resources: ["Art supplies", "Sewing machines"] },
            { title: "Voice Modulation/Diction Workshop", summary: "Training focusing on voice control, clarity, and projection.", resources: ["Voice coach", "Recording equipment"] },
            { title: "Script Reading Session", summary: "Actors read through a new script to provide feedback to the writer.", resources: ["Printed scripts", "Comfortable seating"] },
            { title: "Thematic Skit Competition", summary: "Teams write and perform short skits based on a predefined theme.", resources: ["Time limits", "Judging panel"] },
        ]
    },
    {
        name: "The Society of Coders",
        niche: "Coding Club",
        ideas: [
            { title: "Competitive Coding Marathon", summary: "Long-form event testing algorithms and data structures.", resources: ["Online judge system access", "Prizes", "Mentors"] },
            { title: "Algorithmic Puzzle Solving", summary: "Fun session tackling logic puzzles and non-traditional coding problems.", resources: ["Whiteboard space", "Marker pens"] },
            { title: "Git/GitHub Workshop", summary: "Beginner-friendly session on version control and collaboration.", resources: ["Projector", "Sample repositories"] },
            { title: "Web Scraping Basics", summary: "Workshop on collecting data from websites using Python/Node.js.", resources: ["Web access", "Scraping libraries"] },
            { title: "Introduction to Docker/Containers", summary: "Intro to virtualization and deploying applications with Docker.", resources: ["Lab access", "Pre-installed Docker"] },
            { title: "Cloud Computing (AWS/GCP basics)", summary: "Seminar on deploying simple web services to the cloud.", resources: ["Guest speaker", "Cloud service credits (optional)"] },
            { title: "Interview Prep (DSA)", summary: "Weekly mock interviews focusing on Data Structures and Algorithms.", resources: ["Interviewers", "Question bank"] },
            { title: "Code Review Challenge", summary: "Teams find bugs, style issues, and security flaws in sample code.", resources: ["Badly written code samples", "Code linting tools"] },
            { title: "Build a Bot Workshop", summary: "Creating a simple Telegram or Discord bot.", resources: ["API keys (test)", "Bot framework documentation"] },
        ]
    },
];

async function seedDatabase() {
    console.log("Starting database seeding for 8 clubs with 9 ideas each...");
    const batch = db.batch();
    const collectionRef = db.collection('club_ideas');
    let successfulWrites = 0;

    for (const club of clubData) {
        const docRef = collectionRef.doc(club.name); // Use club name as document ID
        
        // Structure the data to include the generated ideas
        const dataToWrite = {
            name: club.name,
            niche: club.niche,
            ideas: club.ideas,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };
        
        batch.set(docRef, dataToWrite);
        successfulWrites++;
    }

    try {
        await batch.commit();
        console.log(`✅ Successfully committed ${successfulWrites} documents to Firestore 'club_ideas' collection.`);
    } catch (error) {
        console.error("❌ Batch write failed:", error);
    }
}
seedDatabase();