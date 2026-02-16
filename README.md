# EchoLift 🏋️‍♂️🎙️

**Voice-First Gym Tracker & Analytics Dashboard**

EchoLift is a next-generation fitness tracking application that lets you log workouts using natural language voice commands. No more typing between sets—just speak, and EchoLift parses your exercise, weight, reps, and RPE into structured data using advanced AI.

## Features

- **🎙️ Voice Logging**: Uses OpenAI Whisper for transcription and Google Gemini for intelligent parsing.
- **🔥 Muscle Heatmap**: Real-time 3D-style visualization of trained muscle groups based on recent volume.
- **📈 Progression Tracking**: Charts for volume and estimated 1RM (One Rep Max) over time.
- **📊 Monthly Strength Reports**: Compare your max lifts month-over-month with percentage change indicators.
- **📱 Mobile-First Design**: Fully responsive PWA that installs on your phone home screen.
- **🔒 Privacy First**: Client-side PIN protection (AuthGuard) ensures your data remains private.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI Whisper API, Google Gemini Pro API
- **Deployment**: Vercel

## Getting Started

### Prerequisites

You need API keys for:
1. **Supabase** (URL & Anon Key)
2. **OpenAI** (API Key)
3. **Google AI Studio** (Gemini API Key)

### Local Development

1. **Clone the repo**
   ```bash
   git clone https://github.com/jainam-m02/echo-lift.git
   cd echo-lift
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   OPENAI_API_KEY=your_openai_key
   GOOGLE_API_KEY=your_google_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deployment

This project is optimized for deployment on **Vercel**.

1. Push your code to GitHub.
2. Import the project in Vercel.
3. Add the environment variables from your `.env.local`.
4. Deploy!

## Privacy

The app includes a client-side PIN lock mechanism (`AuthGuard`).
- **Default PIN**: `1111`
- To change it, edit `src/components/AuthGuard.tsx`.

## License

Personal Project - All Rights Reserved.
