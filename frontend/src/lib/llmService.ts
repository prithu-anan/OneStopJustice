import { AuthorityRef, EscalationRule } from './grievance';

export interface LLMAnalysisResult {
  category: string;
  departmentId: string;
  authorityId: string;
  suggestedSlaDays: number;
  confidence: number;
  reasoning: string;
}

export interface GrievanceAnalysisInput {
  subject: string;
  description: string;
  desiredOutcome?: string;
}

class LLMService {
  private apiKey: string | null = null;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor() {
    // Initialize with API key from environment variable or localStorage
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key') || null;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    localStorage.setItem('gemini_api_key', apiKey);
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  getApiKeySource(): 'env' | 'localStorage' | 'none' {
    if (import.meta.env.VITE_GEMINI_API_KEY) return 'env';
    if (localStorage.getItem('gemini_api_key')) return 'localStorage';
    return 'none';
  }

  private async callGeminiAPI(prompt: string): Promise<any> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not provided');
    }

    const response = await fetch(`${this.baseUrl}/models/gemini-2.0-flash:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': this.apiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  async analyzeGrievance(
    input: GrievanceAnalysisInput,
    authorities: AuthorityRef[],
    rules: EscalationRule[]
  ): Promise<LLMAnalysisResult> {
    const availableCategories = [...new Set(rules.map(r => r.category))];
    const availableDepartments = [...new Set(rules.map(r => r.departmentId))];
    const availableAuthorities = authorities.map(a => ({
      id: a.id,
      name: a.name,
      departmentId: a.departmentId,
      level: a.level
    }));

    const prompt = `
You are an AI assistant helping to categorize and route public grievances in a justice system. 

Available categories: ${availableCategories.join(', ')}
Available departments: ${availableDepartments.join(', ')}
Available authorities: ${JSON.stringify(availableAuthorities, null, 2)}

Grievance details:
Subject: "${input.subject}"
Description: "${input.description}"
Desired Outcome: "${input.desiredOutcome || 'Not specified'}"

Please analyze this grievance and provide:
1. The most appropriate category from the available options
2. The most appropriate department ID from the available options  
3. The most appropriate authority ID from the available options (choose the lowest level authority for the selected department)
4. Suggested SLA days (1-30 days, considering urgency and complexity)
5. Confidence score (0-100)
6. Brief reasoning for your choices

Respond in JSON format:
{
  "category": "selected_category",
  "departmentId": "selected_department_id", 
  "authorityId": "selected_authority_id",
  "suggestedSlaDays": number,
  "confidence": number,
  "reasoning": "brief explanation"
}
`;

    try {
      const response = await this.callGeminiAPI(prompt);
      const generatedText = response.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!generatedText) {
        throw new Error('No response from Gemini API');
      }

      // Extract JSON from the response (handle cases where response might have extra text)
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not parse JSON from Gemini response');
      }

      const result = JSON.parse(jsonMatch[0]);
      
      // Validate the result
      if (!availableCategories.includes(result.category)) {
        throw new Error(`Invalid category: ${result.category}`);
      }
      if (!availableDepartments.includes(result.departmentId)) {
        throw new Error(`Invalid department: ${result.departmentId}`);
      }
      if (!availableAuthorities.find(a => a.id === result.authorityId)) {
        throw new Error(`Invalid authority: ${result.authorityId}`);
      }

      return {
        category: result.category,
        departmentId: result.departmentId,
        authorityId: result.authorityId,
        suggestedSlaDays: Math.max(1, Math.min(30, result.suggestedSlaDays || 7)),
        confidence: Math.max(0, Math.min(100, result.confidence || 0)),
        reasoning: result.reasoning || 'Analysis completed'
      };
    } catch (error) {
      console.error('LLM analysis error:', error);
      // Return fallback values
      return {
        category: availableCategories[0] || 'Utilities',
        departmentId: availableDepartments[0] || 'DPT-UTIL',
        authorityId: availableAuthorities.find(a => a.level === 0)?.id || availableAuthorities[0]?.id || '',
        suggestedSlaDays: 7,
        confidence: 0,
        reasoning: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

export const llmService = new LLMService();
