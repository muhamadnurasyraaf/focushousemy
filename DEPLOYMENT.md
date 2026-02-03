# Deploying FocusHouse to Vercel

This guide will help you deploy your FocusHouse photography booking system to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. Your Neon PostgreSQL database (already set up)
3. Your Brevo SMTP credentials (already configured)

## Deployment Steps

### 1. Push to GitHub (if not already done)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project

### 3. Configure Environment Variables

In the Vercel project settings, add these environment variables:

**Database Configuration:**
```
DATABASE_URL=your_neon_database_url_here
DIRECT_URL=your_neon_direct_url_here
```

**NextAuth Configuration:**
```
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret_here
```

**Email Configuration:**
```
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_brevo_email
SMTP_PASS=your_brevo_api_key
EMAIL_FROM=your_sender_email
```

**Important Notes:**
- Get `DATABASE_URL` from your Neon dashboard (use the pooled connection string)
- Get `DIRECT_URL` from Neon dashboard (use the direct connection string)
- Generate `NEXTAUTH_SECRET` using: `openssl rand -base64 32`
- Update `NEXTAUTH_URL` after deployment with your actual Vercel URL

### 4. Deploy

1. Click "Deploy" in Vercel
2. Vercel will automatically:
   - Install dependencies
   - Run `prisma generate` (via postinstall script)
   - Build your Next.js app
   - Deploy to production

### 5. Run Database Migrations

After the first deployment, you need to run migrations:

**Option A: Using Vercel CLI (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Run migrations
vercel env pull .env.local
npx prisma migrate deploy
```

**Option B: From your local machine**
```bash
# Make sure your .env has production DATABASE_URL
npx prisma migrate deploy
```

### 6. Verify Deployment

1. Visit your Vercel URL
2. Test the homepage
3. Try creating a booking
4. Login to admin: `https://your-domain.vercel.app/admin`

## Prisma in Vercel - What Happens Automatically

✅ **Prisma Generate**: Runs automatically via `postinstall` script
✅ **Build Process**: `prisma generate` runs before `next build`
✅ **Edge Functions**: Compatible with Vercel's serverless functions
✅ **Connection Pooling**: Using `@prisma/adapter-pg` with Neon's pooled connection

## Common Issues & Solutions

### Issue: "PrismaClient is not configured"
**Solution**: Ensure `postinstall` script is in package.json and environment variables are set

### Issue: Database migration errors
**Solution**: Run `npx prisma migrate deploy` manually after first deployment

### Issue: "Module not found: @prisma/client"
**Solution**: Clear Vercel build cache and redeploy

### Issue: Connection timeout
**Solution**: Verify you're using the pooled DATABASE_URL from Neon, not the direct URL

## Post-Deployment Checklist

- [ ] Homepage loads correctly
- [ ] Can view photography packages
- [ ] Can create a booking
- [ ] Admin login works
- [ ] Admin can approve/cancel bookings
- [ ] Email notifications are sent
- [ ] Accessories page works
- [ ] Repair service page works
- [ ] Calendar displays confirmed sessions
- [ ] WhatsApp contact links work

## Updating Your Deployment

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main

# Vercel will automatically redeploy
```

## Environment Variables Reference

Copy this template for your Vercel environment variables:

```env
# Database (Neon)
DATABASE_URL="postgresql://username:password@host/database?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://username:password@host/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-secret-key-here"

# Email (Brevo)
SMTP_HOST="smtp-relay.brevo.com"
SMTP_PORT="587"
SMTP_USER="your-brevo-email@example.com"
SMTP_PASS="your-brevo-api-key"
EMAIL_FROM="FocusHouse Photography <noreply@focushouse.com>"
```

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Prisma + Vercel: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel
- Neon Docs: https://neon.tech/docs/introduction

---

**Your FocusHouse photography booking system is production-ready! 🎉**
