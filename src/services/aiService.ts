import { AppLanguage } from '../types';

export interface AiChatResponse {
  reply: string;
  source: 'gemini' | 'heuristic' | 'local';
}

export async function askCitizenAssistant(
  message: string,
  language: AppLanguage = 'en',
  userRole: string = 'citizen'
): Promise<AiChatResponse> {
  // 1. Attempt server-side API call
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language, userRole })
    });

    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.reply) {
          return { reply: data.reply, source: data.source || 'gemini' };
        }
      }
    }
  } catch (err) {
    // Network or static host environment - fallback to local heuristic engine
  }

  // 2. Client-side intelligent multilingual heuristic engine
  const lowerMsg = message.toLowerCase();

  if (language === 'hi') {
    if (lowerMsg.includes('income') || lowerMsg.includes('आय') || lowerMsg.includes('scholarship') || lowerMsg.includes('छात्रवृत्ति')) {
      return {
        reply: `आय प्रमाण पत्र (Income Certificate) के लिए आवश्यक दस्तावेज़:\n\n• पहचान प्रमाण: आधार कार्ड (मास्क्ड) या मतदाता पहचान पत्र\n• निवास प्रमाण: हालिया बिजली बिल (3 माह के भीतर) या राशन कार्ड\n• आय का प्रमाण: पिछले 3 महीनों की वेतन पर्ची (Salary Slip), फॉर्म 16 या तलाटी/पटवारी की आधिकारिक आय जांच रिपोर्ट\n• आवेदक का हालिया पासपोर्ट साइज रंगीन फोटो\n\nअनुमानित समय: 7 कार्य दिवस। सरकारी शुल्क: ₹50.\n\n⚠️ सूचना: एआई-जनित सहायता केवल मार्गदर्शन के लिए है। कृपया आधिकारिक पोर्टल से नियमों की पुष्टि करें।`,
        source: 'heuristic'
      };
    } else if (lowerMsg.includes('caste') || lowerMsg.includes('जाति') || lowerMsg.includes('आरक्षण')) {
      return {
        reply: `जाति प्रमाण पत्र (Caste Certificate) के लिए:\n\n• पहचान प्रमाण (स्वयं अथवा पिता का)\n• पिता अथवा दादा का 1978 से पूर्व का स्कूल छोड़ने का प्रमाण पत्र (School Leaving Certificate) जिसमें जाति अंकित हो\n• पासपोर्ट साइज फोटो\n\nअनुमानित समय: 15 कार्य दिवस। सरकारी शुल्क: ₹40.\n\n⚠️ सूचना: एआई-जनित सहायता केवल मार्गदर्शन के लिए है।`,
        source: 'heuristic'
      };
    } else if (lowerMsg.includes('status') || lowerMsg.includes('स्थिति') || lowerMsg.includes('ट्रैक') || lowerMsg.includes('करेक्शन')) {
      return {
        reply: `आवेदन की स्थिति जांचने के लिए:\n\n1. 'मेरे आवेदन' या 'ट्रैक स्टेटस' पर क्लिक करें।\n2. यदि अधिकारी ने दस्तावेज़ में सुधार (Correction) मांगा है, तो आपको कारण दिखेगा।\n3. 'दस्तावेज़ पुनः सबमिट करें' पर क्लिक कर स्पष्ट स्कैन अपलोड करें।\n\n⚠️ सूचना: एआई-जनित सहायता केवल मार्गदर्शन के लिए है।`,
        source: 'heuristic'
      };
    } else {
      return {
        reply: `नमस्ते! मैं गॉवफ्लो डिजिटल सहायक हूँ। मैं आपको आय प्रमाण पत्र, जाति प्रमाण पत्र, अधिवास (Domicile), निवास प्रमाण पत्र और छात्रवृत्ति योजनाओं के नियम व दस्तावेज़ समझने में सहायता कर सकता हूँ। आप क्या जानना चाहते हैं?\n\n⚠️ सूचना: एआई-जनित सहायता केवल मार्गदर्शन के लिए है।`,
        source: 'heuristic'
      };
    }
  } else if (language === 'gu') {
    if (lowerMsg.includes('income') || lowerMsg.includes('આવક') || lowerMsg.includes('scholarship') || lowerMsg.includes('શિષ્યવૃત્તિ')) {
      return {
        reply: `આવકના દાખલા (Income Certificate) માટે જરૂરી પુરાવા:\n\n• ઓળખ પુરાવો: આધાર કાર્ડ (માસ્ક કરેલું) અથવા ચૂંટણી કાર્ડ\n• રહેઠાણ પુરાવો: તાજેતરનું લાઇટ બિલ અથવા રેશનકાર્ડ\n• આવકનો પુરાવો: છેલ્લા ૩ મહિનાની પગાર સ્લિપ અથવા તલાટીનો આવક પંચનામું રિપોર્ટ\n• પાસપોર્ટ સાઇઝ રંગીન ફોટોગ્રાફ\n\nઅંદાજિત સમય: 7 કામકાજના દિવસો. સરકારી ફી: ₹50.\n\n⚠️ નોંધ: એઆઈ સહાય માત્ર માર્ગદર્શન માટે છે.`,
        source: 'heuristic'
      };
    } else if (lowerMsg.includes('domicile') || lowerMsg.includes('રહેઠાણ') || lowerMsg.includes('ડોમિસાઇલ')) {
      return {
        reply: `ડોમિસાઇલ પ્રમાણપત્ર (Domicile Certificate) માટે:\n\n• રાજ્યમાં ઓછામાં ઓછા 10 વર્ષનો સતત વસવાટ પુરાવો\n• ધોરણ 1 થી 10 ના શાળા છોડ્યાના પ્રમાણપત્રો\n• ચૂંટણી કાર્ડ અથવા પાસપોર્ટ\n\nઅંદાજિત સમય: 10 દિવસ. સરકારી ફી: ₹60.\n\n⚠️ નોંધ: એઆઈ સહાય માત્ર માર્ગદર્શન માટે છે.`,
        source: 'heuristic'
      };
    } else {
      return {
        reply: `નમસ્તે! હું ગવફ્લો ડિજિટલ સહાયક છું. હું તમને આવકનો દાખલો, જાતિ પ્રમાણપત્ર અથવા શિક્ષણ શિષ્યવૃત્તિ માટે જરૂરી પુરાવા અને અરજી પ્રક્રિયા સમજવામાં મદદ કરી શકું છું.\n\n⚠️ નોંધ: એઆઈ સહાય માત્ર માર્ગદર્શન માટે છે.`,
        source: 'heuristic'
      };
    }
  } else {
    // English responses
    if (lowerMsg.includes('income') || lowerMsg.includes('scholarship') || lowerMsg.includes('fee')) {
      return {
        reply: `For an Income Certificate (frequently required for higher education scholarships, fee concessions, and government welfare schemes):\n\n• Identity Proof: Synthetic Electoral Photo ID, Passport, or Govt Photo Card\n• Address Proof: Recent Electricity bill (within 3 months) or Ration Card copy\n• Income Proof: Salary slips (last 3 months), Form 16, or Talati / Patwari verified inquiry report\n• Photograph: Recent color passport photograph\n\nProcessing timeline: ~7 business days. Statutory fee: ₹50.\n\nDisclaimer: AI-generated guidance is for assistance only. Verify requirements with the relevant official authority.`,
        source: 'heuristic'
      };
    } else if (lowerMsg.includes('correction') || lowerMsg.includes('resubmit') || lowerMsg.includes('smudge') || lowerMsg.includes('stamp')) {
      return {
        reply: `How to resolve a Document Correction Request:\n\n1. Navigate to "My Applications" and select "Track Progress".\n2. Review the amber alert box containing the reviewing officer's specific remarks (e.g. faint seal or blurry scan).\n3. Click "Resubmit Document" to upload an unobstructed, high-contrast 300 DPI scan.\n4. Your application will automatically return to the officer's priority scrutiny queue.\n\nDisclaimer: AI-generated guidance is for assistance only.`,
        source: 'heuristic'
      };
    } else if (lowerMsg.includes('domicile') || lowerMsg.includes('residence') || lowerMsg.includes('difference')) {
      return {
        reply: `Difference between Domicile and Residence Certificate:\n\n• Residence Certificate: Confirms current living address in a particular municipal ward/village (typically requires 3 years continuous stay).\n• Domicile Certificate: Legal declaration of permanent state belonging (requires minimum 10 years continuous schooling or family roots; critical for state quota admissions in engineering/medical colleges).\n\nDisclaimer: AI-generated guidance is for assistance only.`,
        source: 'heuristic'
      };
    } else if (lowerMsg.includes('caste') || lowerMsg.includes('quota') || lowerMsg.includes('reservation')) {
      return {
        reply: `For a Caste Certificate:\n\n• Identity proof of applicant or father\n• Historical paternal lineage document (e.g., father's or grandfather's school leaving certificate from before the state base year with community entry)\n• Processing SLA: ~15 working days. Fee: ₹40.\n\nDisclaimer: AI-generated guidance is for assistance only.`,
        source: 'heuristic'
      };
    } else {
      return {
        reply: `Hello! I am your GovFlow Citizen Assistant.\n\nI can assist you with:\n• Identifying the right certificate for your specific purpose (scholarships, college admissions, public recruitment)\n• Mandatory document checklists and accepted file formats\n• Understanding real-time application stages and officer scrutiny remarks\n• Resolving correction requests and resubmitting clear documentation\n\nHow can I help you today?\n\nDisclaimer: AI-generated guidance is for assistance only. Verify requirements with the relevant official authority.`,
        source: 'heuristic'
      };
    }
  }
}
