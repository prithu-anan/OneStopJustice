# LLM Integration for Grievance Filing

This document describes the AI-powered features integrated into the OneStop Justice grievance filing system.

## Features

### 1. Auto-Detection for Grievances

When filing a grievance, users can now select "Auto Detect" options in the dropdowns to automatically:

- **Analyze the subject and description** to determine the most appropriate category
- **Suggest the correct department** based on the grievance content
- **Recommend the appropriate authority** for handling the case
- **Calculate optimal SLA days** based on complexity and urgency

### 2. Dynamic SLA Calculation

Instead of using hardcoded response times, the system now:

- **Analyzes grievance complexity** using AI
- **Automatically determines optimal SLA periods** (1-30 days)
- **Always uses AI-suggested SLA** for consistent response times
- **Considers urgency factors** in the analysis
- **Performs auto-analysis during submission** if not done manually

## Setup

### 1. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the generated key

### 2. Configure API Key

#### Option A: Through Settings Page
1. Log into your account
2. Navigate to **Settings** (via user menu or `/settings`)
3. Enter your Gemini API key in the "AI Assistant Configuration" section
4. Click "Validate & Save"

#### Option B: Environment Variable (Recommended for Development)
Add to your `.env` file in the project root:
```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Note:** Environment variables are automatically loaded when the application starts. This is the preferred method for development as it keeps your API key secure and doesn't require manual configuration in the UI.

## Usage

### Filing a Grievance with AI Assistance

1. **Navigate to File Grievance** (`/file-grievance`)
2. **Fill in basic details**:
   - Subject (minimum 5 characters)
   - Description (minimum 20 characters)
   - Desired outcome (optional)
3. **Select auto-detection options**:
   - Choose "Auto Detect" in Category dropdown (optional)
   - Choose "Auto Detect" in Department dropdown (optional)
   - Choose "Auto Detect" in Authority dropdown (optional)
4. **Add attachments** (optional)
5. **Submit the grievance**:
   - System automatically analyzes content using LLM
   - Determines optimal SLA based on complexity
   - Uses AI suggestions for auto-detect fields
   - Uses manual selections for regular fields

### Understanding the Process

The AI automatically:
- **Analyzes content** when the form is submitted
- **Determines optimal routing** for auto-detect fields
- **Calculates appropriate SLA** based on complexity and urgency
- **Provides feedback** in the submission confirmation

## Technical Details

### API Integration

- Uses Google's Gemini Pro model via REST API
- Direct communication with Google's servers (no data sent to our backend)
- API key stored locally in browser (localStorage)

### Analysis Process

1. **Input Processing**: Subject, description, and desired outcome are analyzed
2. **Context Matching**: AI matches content against available categories, departments, and authorities
3. **Complexity Assessment**: Determines appropriate SLA based on case complexity
4. **Confidence Scoring**: Provides confidence level for transparency

### Fallback Behavior

If AI analysis fails:
- System falls back to default values
- User can manually select options
- Error messages guide user to configure API key

## Security & Privacy

- **Local Storage**: API keys stored only in user's browser
- **No Server Transmission**: Grievance content sent directly to Google's API
- **Optional Feature**: AI features are completely optional
- **User Control**: Users can disable or reconfigure at any time

## Troubleshooting

### Common Issues

1. **"Gemini API key not provided" Error**
   - **Environment Variable**: Ensure `VITE_GEMINI_API_KEY` is set in your `.env` file
   - **Manual Configuration**: Configure API key through Settings page
   - **Restart Required**: If using environment variable, restart the development server
   - **File Location**: Ensure `.env` file is in the project root directory

2. **"Auto-detection Failed"**
   - Ensure API key is configured in Settings
   - Check internet connection
   - Verify API key is valid

3. **Low Confidence Scores**
   - Provide more detailed descriptions
   - Be specific about the issue
   - Include relevant context

4. **Incorrect Suggestions**
   - Always review AI suggestions
   - Manually override if needed
   - Use as a starting point, not final decision

### Support

For technical issues:
1. Check Settings page for API key status
2. Verify Gemini API quota and billing
3. Contact support if problems persist

## Future Enhancements

Planned improvements:
- Multi-language support for analysis
- Historical learning from user corrections
- Integration with more LLM providers
- Batch analysis for multiple grievances
