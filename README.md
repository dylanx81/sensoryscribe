# Sensory Scribe

A Next.js application that analyzes text for sensory language using AI-powered analysis. The app identifies and scores sensory elements (sight, sound, touch, smell, taste) in written content.

## Features

- **AI-Powered Analysis**: Uses AbacusAI to analyze text for sensory content
- **Multi-Sensory Scoring**: Provides scores for all five senses
- **Interactive Dashboard**: Visual representation of sensory analysis results
- **Database Storage**: Persistent storage of analysis results using PostgreSQL
- **Modern UI**: Built with Next.js, React, and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: PostgreSQL with Prisma ORM
- **AI Integration**: AbacusAI API
- **Charts**: Plotly.js, Chart.js, Recharts
- **Deployment**: Vercel-ready

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- AbacusAI API key

## Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd sensory-scribe
   ```

2. **Install dependencies**
   ```bash
   cd app
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/sensory_scribe"
   ABACUSAI_API_KEY="your_abacus_ai_api_key_here"
   ```

4. **Set up the database**
   ```bash
   # Push the schema to your database
   npm run db:push
   
   # Or run migrations (if you have migration files)
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `ABACUSAI_API_KEY` | AbacusAI API key for text analysis | Yes |
| `NEXTAUTH_URL` | Base URL for NextAuth (production only) | No |
| `NEXTAUTH_SECRET` | Secret for NextAuth sessions | No |

## Deployment on Vercel

### Step 1: Prepare Your Repository

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

### Step 2: Set Up Database

Choose one of these database hosting options:

#### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Navigate to Storage → Create Database → Postgres
3. Copy the connection string provided

#### Option B: Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → Database
3. Copy the connection string
4. Replace `[YOUR-PASSWORD]` with your database password

#### Option C: Railway/PlanetScale/Neon
Follow their respective documentation for PostgreSQL setup.

### Step 3: Deploy to Vercel

1. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set the root directory to `app`

2. **Configure Environment Variables**
   In the Vercel deployment settings, add:
   ```
   DATABASE_URL=your_database_connection_string
   ABACUSAI_API_KEY=your_abacus_ai_api_key
   ```

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Step 4: Set Up Database Schema

After deployment, you need to push your database schema:

1. **Using Vercel CLI** (Recommended)
   ```bash
   npm i -g vercel
   vercel login
   vercel link
   vercel env pull .env.local
   npm run db:push
   ```

2. **Using Prisma Studio** (Alternative)
   ```bash
   npx prisma studio
   ```

## Database Management

- **View data**: `npm run db:studio`
- **Push schema changes**: `npm run db:push`
- **Create migrations**: `npm run db:migrate`
- **Reset database**: `npx prisma migrate reset`

## Project Structure

```
sensory-scribe/
├── app/                    # Next.js application
│   ├── components/         # React components
│   ├── lib/               # Utility functions
│   ├── pages/             # Next.js pages
│   ├── prisma/            # Database schema
│   ├── public/            # Static assets
│   ├── styles/            # CSS styles
│   └── package.json       # Dependencies
├── README.md              # This file
└── .gitignore            # Git ignore rules
```

## API Endpoints

- `POST /api/analyze` - Analyze text for sensory content
- `GET /api/analyses` - Retrieve stored analyses
- `GET /api/analyses/[id]` - Get specific analysis

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify your `DATABASE_URL` is correct
   - Ensure your database is accessible from Vercel
   - Check if you need to whitelist Vercel's IP addresses

2. **Build Failures**
   - Make sure all environment variables are set in Vercel
   - Check that `prisma generate` runs successfully
   - Verify all dependencies are listed in `package.json`

3. **API Key Issues**
   - Confirm your `ABACUSAI_API_KEY` is valid
   - Check API rate limits and usage

### Vercel-Specific Issues

1. **Function Timeout**
   - Upgrade to Vercel Pro for longer function timeouts
   - Optimize database queries

2. **Cold Starts**
   - Consider using Vercel's Edge Runtime for faster cold starts
   - Implement connection pooling for database

### Getting Help

- Check the [Next.js documentation](https://nextjs.org/docs)
- Review [Vercel deployment docs](https://vercel.com/docs)
- Visit [Prisma documentation](https://www.prisma.io/docs)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
