import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = 3000;

// Permissive headers for AI Studio iframe embedding and cross-origin assets
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  next();
});

// Body parser
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Initialize GoogleGenAI with server-side API key if available
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Could not initialize GoogleGenAI client:', err);
  }
}

// AI-assisted ICD-10 suggestion endpoint
app.post('/api/gemini/suggest-icd10', async (req, res) => {
  try {
    const { notes, currentCategory, symptoms } = req.body;
    if (!notes || typeof notes !== 'string' || !notes.trim()) {
      return res.status(400).json({ error: 'Symptoms or notes text is required' });
    }

    if (!ai) {
      if (process.env.GEMINI_API_KEY) {
        ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });
      } else {
        return res.status(503).json({
          error: 'GEMINI_API_KEY not configured on server',
          fallbackNeeded: true,
        });
      }
    }

    const prompt = `Based on the following clinical symptoms, psychiatric notes, and patient history, suggest the most accurate psychiatric ICD-10 diagnostic codes (Primary Diagnosis, with differential / comorbidity if applicable).

Patient Notes / Symptoms:
"${notes.trim()}"

${currentCategory && currentCategory.length ? `Selected Diagnostic Categories: ${currentCategory.join(', ')}` : ''}
${symptoms && symptoms.length ? `Associated Symptoms: ${symptoms.join(', ')}` : ''}

Provide 3 to 5 ranked ICD-10 diagnosis suggestions. For substance use disorder (F10-F19), identify if it is dependence (F1x.2) and suggest corresponding induced psychotic disorder (F1x.5) as comorbidity.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are an expert hospital psychiatrist and medical records ICD-10 coding director in Thailand.
Your job is to analyze clinical narrative notes and symptoms typed by psychiatrists, and suggest accurate, standardized ICD-10 psychiatric diagnostic codes (e.g. F20.0, F32.2, F31.1, F10.2, F41.1, etc.).
Output JSON adhering strictly to the schema. Include code, English name, Thai name, formatted string, category, confidence (High, Medium, Low), and concise clinical reasoning in Thai.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              code: { type: Type.STRING, description: 'ICD-10 code, e.g. F20.0' },
              nameEn: { type: Type.STRING, description: 'Standard English diagnosis name' },
              nameTh: { type: Type.STRING, description: 'Standard Thai psychiatric term' },
              formatted: { type: Type.STRING, description: 'Formatted string like "Schizophrenia, Paranoid type (F20.0)"' },
              category: { type: Type.STRING, description: 'Category: F00-F09, F10-F19, F20-F29, F30-F39, F40-F48, etc.' },
              confidence: { type: Type.STRING, description: 'Confidence level: High, Medium, or Low' },
              reason: { type: Type.STRING, description: 'Concise explanation in Thai based on the patient symptoms' },
              suggestedComorbid: { type: Type.STRING, description: 'Optional suggested comorbidity, e.g. F10.5 for F10.2' },
            },
            required: ['code', 'nameEn', 'nameTh', 'formatted', 'category', 'confidence', 'reason'],
          },
        },
      },
    });

    const text = response.text || '[]';
    let suggestions = [];
    try {
      suggestions = JSON.parse(text);
    } catch {
      suggestions = [];
    }

    return res.json({ suggestions });
  } catch (err: any) {
    console.error('Error in /api/gemini/suggest-icd10:', err);
    return res.status(500).json({ error: err.message || 'Internal server error', fallbackNeeded: true });
  }
});

// Mount Vite or serve static
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('.', 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('.', 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening at http://0.0.0.0:${port}`);
  });
}

startServer();

