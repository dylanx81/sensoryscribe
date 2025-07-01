# Quick Deployment Steps

## 1. Push to GitHub

```bash
# If you haven't set up a remote repository yet:
git remote add origin https://github.com/YOUR_USERNAME/sensory-scribe.git
git branch -M main
git push -u origin main

# If you already have a remote:
git push origin main
```

## 2. Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. **Important**: Set the root directory to `app`
5. Add environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `ABACUSAI_API_KEY`: Your AbacusAI API key
6. Click "Deploy"

### Option B: Using Vercel CLI
```bash
npm i -g vercel
cd app
vercel login
vercel --prod
```

## 3. Set Up Database

### For Vercel Postgres:
1. In Vercel dashboard → Storage → Create Database → Postgres
2. Copy the connection string
3. Update your environment variables in Vercel

### For Supabase:
1. Create project at [supabase.com](https://supabase.com)
2. Go to Settings → Database
3. Copy connection string and update password

## 4. Initialize Database Schema

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Link your project and pull environment variables
vercel link
vercel env pull .env.local

# Push database schema
cd app
npm run db:push
```

## 5. Verify Deployment

1. Visit your Vercel deployment URL
2. Test the sensory analysis functionality
3. Check that data persists in your database

## Environment Variables Needed

```env
DATABASE_URL="postgresql://username:password@host:port/database"
ABACUSAI_API_KEY="your_abacus_ai_api_key_here"
```

## Troubleshooting Commands

```bash
# Check build logs
vercel logs

# Redeploy
vercel --prod

# Check database connection
cd app && npx prisma studio

# Reset database (if needed)
npx prisma migrate reset
```

## Database Hosting Options

1. **Vercel Postgres** (Easiest integration)
2. **Supabase** (Free tier available)
3. **Railway** (Simple setup)
4. **PlanetScale** (Serverless MySQL alternative)
5. **Neon** (Serverless PostgreSQL)

Choose based on your needs and budget!
