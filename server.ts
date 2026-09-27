import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google Gen AI client if key exists
let genAI: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
  try {
    genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI with provided key, using simulated responses:', err);
  }
}

// 1. AI Citizen Assistant Route
app.post('/api/ai/chat', async (req, res) => {
  const { message, language = 'en', userRole = 'citizen', context = {} } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message query is required' });
  }

  // System prompt enforcing strict government digital services boundaries & disclaimer
  const systemInstruction = `You are the GovFlow AI Citizen Assistant, an intelligent, empathetic digital assistant for a public service prototype platform.
CRITICAL RULES:
1. You assist citizens with understanding government certificates (Income, Domicile, Caste, Residence, Birth, Senior Citizen, Scholarships).
2. Clarify required documents, eligibility rules, why a correction might have been requested, and how to resubmit.
3. NEVER make binding legal claims or pretend to be an official government officer or magistrate.
4. Always maintain a professional, polite, helpful tone.
5. Keep answers concise, actionable, and structured with bullet points.
6. Language requested: ${language}. Answer in ${language === 'hi' ? 'Hindi' : language === 'gu' ? 'Gujarati' : 'English'}.
7. Note: This is an academic/hackathon prototype. Remind the citizen: "AI-generated guidance is for assistance only. Verify requirements with the relevant official authority."`;

  if (genAI) {
    try {
      const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nUser Question: ${message}` }] }
        ]
      });

      const reply = response.text || 'I am here to guide you through your service application. Please select a service or ask about required documents.';
      return res.json({ reply, source: 'gemini' });
    } catch (err) {
      console.error('Gemini API call failed, falling back to heuristic assistant:', err);
    }
  }

  // Intelligent heuristic fallback
  const lowerMsg = message.toLowerCase();
  let fallbackReply = '';

  if (language === 'hi') {
    if (lowerMsg.includes('income') || lowerMsg.includes('आय') || lowerMsg.includes('scholarship') || lowerMsg.includes('छात्रवृत्ति')) {
      fallbackReply = `आय प्रमाण पत्र (Income Certificate) के लिए आवश्यक दस्तावेज़:\n• पहचान प्रमाण (आधार/मतदाता पत्र)\n• निवास प्रमाण (बिजली बिल/राशन कार्ड)\n• आय का प्रमाण (वेतन पर्ची / तलाटी या पटवारी रिपोर्ट)\n• हालिया पासपोर्ट फोटो\n\nअनुमानित समय: 7 कार्य दिवस। शुल्क: ₹50.\n\n⚠️ सूचना: एआई-जनित सहायता केवल मार्गदर्शन के लिए है।`;
    } else if (lowerMsg.includes('status') || lowerMsg.includes('स्थिति') || lowerMsg.includes('ट्रैक')) {
      fallbackReply = `आप अपने आवेदन को 'मेरे आवेदन' या 'स्थिति ट्रैक करें' टैब में जाकर वास्तविक समय में देख सकते हैं। यदि अधिकारी ने कोई सुधार मांगा है, तो आपको तुरंत सूचना मिलेगी।\n\n⚠️ सूचना: एआई-जनित सहायता केवल मार्गदर्शन के लिए है।`;
    } else {
      fallbackReply = `नमस्ते! मैं गॉवफ्लो सहायक हूँ। मैं आपको आय प्रमाण पत्र, जाति प्रमाण पत्र, निवास प्रमाण पत्र या छात्रवृत्ति योजना के नियम समझने में सहायता कर सकता हूँ। आप क्या जानना चाहते हैं?\n\n⚠️ सूचना: एआई-जनित सहायता केवल मार्गदर्शन के लिए है।`;
    }
  } else if (language === 'gu') {
    if (lowerMsg.includes('income') || lowerMsg.includes('આવક') || lowerMsg.includes('scholarship') || lowerMsg.includes('શિષ્યવૃત્તિ')) {
      fallbackReply = `આવકના દાખલા (Income Certificate) માટે જરૂરી પુરાવા:\n• ઓળખ કાર્ડ (આધાર / ચૂંટણી કાર્ડ)\n• રહેઠાણ પુરાવો (લાઇટ બિલ / રેશનકાર્ડ)\n• આવકનો પુરાવો (પગાર સ્લિપ અથવા તલાટીનો રિપોર્ટ)\n• પાસપોર્ટ સાઇઝ ફોટો\n\nઅંદાજિત સમય: 7 કામકાજના દિવસો. ફી: ₹50.\n\n⚠️ નોંધ: એઆઈ સહાય માત્ર માર્ગદર્શન માટે છે.`;
    } else {
      fallbackReply = `નમસ્તે! હું ગવફ્લો ડિજિટલ સહાયક છું. હું તમને આવકનો દાખલો, જાતિ પ્રમાણપત્ર અથવા રહેઠાણ પુરાવા વિશે વિગતો આપવામાં મદદ કરી શકું છું.\n\n⚠️ નોંધ: એઆઈ સહાય માત્ર માર્ગદર્શન માટે છે.`;
    }
  } else {
    if (lowerMsg.includes('income') || lowerMsg.includes('scholarship') || lowerMsg.includes('college')) {
      fallbackReply = `For an Income Certificate (most frequently needed for scholarships and fee concessions):\n\n• Identity Proof: Masked Electoral ID, Passport, or Govt ID\n• Address Proof: Electricity bill (within 3 months) or Ration Card\n• Income Proof: Salary slips (last 3 months), Form 16, or Patwari/Talati income inquiry report\n• Photograph: Recent color passport photograph\n\nProcessing timeline: ~7 business days. Statutory fee: ₹50.\n\nDisclaimer: AI-generated guidance is for assistance only. Verify requirements with the relevant official authority.`;
    } else if (lowerMsg.includes('correction') || lowerMsg.includes('resubmit') || lowerMsg.includes('reject')) {
      fallbackReply = `If an officer has requested a correction:\n\n1. Open "My Applications" and click "Track Status".\n2. Look for the flagged document highlighted in amber with the officer's specific remark.\n3. Click "Resubmit Document" to upload a clearer, un-smudged scan with all required official stamps.\n4. Your application automatically returns to the officer's review queue.\n\nDisclaimer: AI-generated guidance is for assistance only.`;
    } else if (lowerMsg.includes('caste') || lowerMsg.includes('reservation')) {
      fallbackReply = `For a Caste Certificate:\n• Identity Proof of applicant/father\n• Pre-notified base-year paternal lineage document (e.g., father's or grandfather's school leaving certificate with recorded caste)\n• Processing SLA: ~15 working days. Fee: ₹40.\n\nDisclaimer: AI-generated guidance is for assistance only.`;
    } else {
      fallbackReply = `Hello! I am your GovFlow Citizen Assistant. I can assist you with:\n• Identifying the right certificate for your purpose (scholarship, admissions, job quota)\n• Eligibility criteria and mandatory document checklists\n• How to address and resubmit flagged correction notices\n• Understanding your application's real-time timeline stage\n\nHow may I help you today?\n\nDisclaimer: AI-generated guidance is for assistance only.`;
    }
  }

  return res.json({ reply: fallbackReply, source: 'heuristic' });
});

// 2. AI Document Analysis Route
app.post('/api/ai/analyze-document', async (req, res) => {
  const { documentType, fileName, fileSize } = req.body;

  // Simulate realistic document analyzer response
  const isIncome = (documentType || '').toLowerCase().includes('income') || (fileName || '').toLowerCase().includes('salary');

  const analysis = {
    detectedType: isIncome ? 'Income Declaration / Salary Slip' : 'Statutory Proof Document',
    detectedFields: isIncome ? [
      { field: 'Applicant / Employee Name', value: 'Matches Citizen Record', found: true },
      { field: 'Stated Annual Gross', value: '₹1,80,000 / annum', found: true },
      { field: 'Issuing Employer / Revenue Stamp', value: 'Present with mild perimeter noise', found: true }
    ] : [
      { field: 'Citizen Identity Name', value: 'Exact Match', found: true },
      { field: 'Residential Address', value: 'Within Jurisdiction', found: true }
    ],
    readabilityScore: isIncome ? 86 : 95,
    qualityStatus: isIncome ? 'Good' : 'Good',
    potentialIssues: isIncome ? ['Employer seal has slight fading; officer manual review advised'] : [],
    confidenceScore: isIncome ? 88 : 96,
    recommendation: isIncome ? 'Needs Officer Review' : 'Auto-Approved'
  };

  return res.json({ analysis });
});

// Vite middleware for frontend development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production if dist exists
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GovFlow server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
