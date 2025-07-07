# Sensory Scribe

A web application that analyzes fiction writing for sensory details and provides genre-specific feedback with visual radar charts.

## Features

- **Sensory Analysis**: Analyzes text for all five senses (sight, sound, touch, taste, smell)
- **Genre-Specific Feedback**: Tailored suggestions based on fiction genre
- **Visual Radar Charts**: Interactive charts showing sensory balance
- **Draft Management**: Save and load drafts with localStorage persistence
- **Dark Mode UI**: Professional, writer-friendly interface
- **AI-Powered**: Uses Claude AI for intelligent analysis

## New: Draft Management ✨

### Save & Load Functionality
- **Save Draft**: Manually save your work with the "Save Draft" button
- **Auto-Save**: Analysis results are automatically saved with drafts
- **Load Latest**: Quick access to your most recent draft
- **All Drafts**: Browse and load from up to 10 saved drafts
- **Persistent Storage**: Uses browser localStorage to maintain drafts between sessions

### Draft Features
- **Smart Preview**: See text preview, genre, and timestamp for each draft
- **Analysis Preservation**: Radar charts and feedback are saved with drafts
- **Easy Navigation**: Click any draft to instantly load it
- **Visual Feedback**: Success/error messages for all draft operations

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts for radar visualization
- **AI**: Claude API with custom prompts
- **Storage**: Browser localStorage for draft persistence
- **Deployment**: Ready for Vercel or Claude Artifacts

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   - Add your Anthropic API key to `.env.local`:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   - Visit `http://localhost:3000`

## Usage

### Basic Analysis
1. Paste your fiction text into the input area
2. Select your genre (Romance, Thriller, Fantasy, etc.)
3. Choose a focus sense or "All Senses"
4. Click "Analyze Sensory Details"
5. View your radar chart and AI feedback

### Draft Management
1. **Save manually**: Click "Save Draft" to preserve your current work
2. **Load quickly**: Click "Load Latest" to restore your most recent draft
3. **Browse all**: Click "All Drafts" to see and select from saved drafts
4. **Auto-save**: Analysis results are automatically saved when completed

## API Key Setup

1. Get your API key from [Anthropic Console](https://console.anthropic.com/)
2. Add it to `.env.local` as `ANTHROPIC_API_KEY`
3. Restart your development server

## Project Structure

```
sensoryscribe/
├── app/
│   ├── api/analyze/        # API endpoint for analysis
│   ├── layout.tsx          # App layout with dark mode
│   └── page.tsx            # Main application page
├── components/
│   ├── InputForm.tsx       # Text input with draft management
│   ├── RadarChart.tsx      # Sensory radar visualization
│   ├── FeedbackPanel.tsx   # AI feedback display
│   └── ui/                 # shadcn/ui components
├── claude/prompts/
│   └── sensory_analysis.yaml # AI prompt configuration
└── lib/
    ├── prompts.ts          # Claude API integration
    ├── localStorage.ts     # Draft management utilities
    └── utils.ts            # Utility functions
```

## Storage & Privacy

- **Local Storage**: Drafts are stored only in your browser
- **No Server Storage**: Your text and analysis never leave your device
- **Privacy First**: Only API calls to Claude for analysis are made
- **Automatic Cleanup**: Keeps only the 10 most recent drafts

## Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Claude Artifacts
- Copy the built application to Claude Artifacts for instant sharing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this for your own projects!