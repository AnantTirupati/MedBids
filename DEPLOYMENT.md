# Production Deployment Guide

This document lists steps for hosting MedBids on Vercel or Firebase.

---

## Deploy to Vercel

1. Push your codebase to a GitHub, GitLab, or Bitbucket repository.
2. Import the project in the [Vercel Dashboard](https://vercel.com).
3. Set the Environment Variables:
   * `NEXT_PUBLIC_USE_FIREBASE=firebase`
   * `NEXT_PUBLIC_FIREBASE_API_KEY=your_key`
   * `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain`
   * `NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id`
   * `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket`
   * `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id`
   * `NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id`
4. Click **Deploy**. Vercel will automatically compile, optimize, and serve the Next.js application.
5. Setup domain redirections and SSL certs directly in the Vercel Settings panel.
