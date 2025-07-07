# Sensory Scribe

A web application that analyzes fiction writing for sensory details and provides genre-specific feedback with visual radar charts.

## Features

- **Sensory Analysis**: Analyzes text for all five senses (sight, sound, touch, taste, smell)
- **Genre-Specific Feedback**: Tailored suggestions based on fiction genre
- **Visual Radar Charts**: Interactive charts showing sensory balance
- **Dark Mode UI**: Professional, writer-friendly interface
- **AI-Powered**: Uses Claude AI for intelligent analysis

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts for radar visualization
- **AI**: Claude API with custom prompts
- **Deployment**: Ready for Vercel or Claude Artifacts

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   - Copy `.env.local` and add your Anthropic API key:
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

1. Paste your fiction text into the input area
2. Select your genre (Romance, Thriller, Fantasy, etc.)
3. Choose a focus sense or "All Senses"
4. Click "Analyze Sensory Details"
5. View your radar chart and AI feedback

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
│   ├── InputForm.tsx       # Text input and controls
│   ├── RadarChart.tsx      # Sensory radar visualization
│   └── FeedbackPanel.tsx   # AI feedback display
├── claude/prompts/
│   └── sensory_analysis.yaml # AI prompt configuration
└── lib/
    └── prompts.ts          # Claude API integration
```

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