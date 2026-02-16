
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

// Initialize Clients
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // 1. Transcribe with Whisper
        let text = "";
        try {
            const transcription = await openai.audio.transcriptions.create({
                file: file,
                model: "whisper-1",
            });
            text = transcription.text;
            console.log("Whisper Transcript:", text);
        } catch (whisperError: any) {
            console.error("Whisper Error:", whisperError);
            return NextResponse.json({ error: "OpenAI Whisper Failed: " + whisperError.message }, { status: 500 });
        }

        // 2. Parse with Gemini 2.5 Pro
        const modelName = "gemini-2.5-pro";
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: `You are an expert fitness data parser. Parse the user's natural language log into structured JSON.
        
        Rules:
        1. **Date Handling**: 
           - Default to TODAY's date: "${today}" unless the user EXPLICITLY says "Yesterday" or a specific date.
           - DO NOT hallucinate a date from the past (like 2024) if not mentioned.
        2. Extract exercises, sets, reps, weight. 
           - For calisthenics, use 'progression' (e.g. Tuck Front Lever) and 'duration_seconds' if applicable.
           - For regular lifts, use 'unit' (lbs/kg).
        3. Extract metadata:
           - 'difficulty' (1-10 integer).
           - 'notes' (Summary of pain, feelings, equipment used).
        
        Output JSON Schema:
        {
          "date": "YYYY-MM-DD",
          "difficulty": number,
          "notes": string,
          "exercises": [
            { 
              "name": string, 
              "sets": number | null, 
              "reps": number | null, 
              "weight": number | null, 
              "unit": "lbs" | "kg" | null,
              "duration_seconds": number | null,
              "progression": string | null,
              "muscle_group": string (e.g "Chest", "Back", "Legs", "Cardio")
            }
          ]
        }`
        });

        let result;
        try {
            result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: `Parse this log: "${text}"` }] }],
                generationConfig: { responseMimeType: "application/json" }
            });
        } catch (geminiError: any) {
            if (geminiError.message.includes("429")) {
                console.log("Gemini 429, retrying in 2s...");
                await delay(2000);
                result = await model.generateContent({
                    contents: [{ role: "user", parts: [{ text: `Parse this log: "${text}"` }] }],
                    generationConfig: { responseMimeType: "application/json" }
                });
            } else {
                throw geminiError;
            }
        }

        const responseText = result.response.text();
        console.log("Gemini Response:", responseText);
        const parsedData = JSON.parse(responseText);

        // Force date correction if null or invalid
        if (!parsedData.date || parsedData.date.startsWith("2024") || parsedData.date.startsWith("2025")) {
            // If LLM creates a weird old date without explicit instruction, overwrite it with today.
            // (Simple heuristic: if text doesn't contain "2024", assume today).
            if (!text.includes("2024") && !text.includes("2025")) {
                parsedData.date = today;
            }
        }

        // 3. Save to Supabase — merge into existing workout for the same date
        const workoutDate = parsedData.date || new Date().toISOString().split('T')[0];

        // Check if a workout already exists for this date
        const { data: existingWorkout } = await supabase
            .from('workouts')
            .select('*')
            .eq('date', workoutDate)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        let workoutId: string;

        if (existingWorkout) {
            // Merge into existing workout: append transcript/notes, keep higher RPE
            const mergedTranscript = [existingWorkout.raw_transcript, text]
                .filter(Boolean)
                .join('\n');
            const mergedNotes = [existingWorkout.user_notes, parsedData.notes]
                .filter(Boolean)
                .join(' | ');
            const mergedDifficulty = Math.max(
                existingWorkout.difficulty || 0,
                parsedData.difficulty || 5
            );

            const { error: updateError } = await supabase
                .from('workouts')
                .update({
                    raw_transcript: mergedTranscript,
                    user_notes: mergedNotes,
                    difficulty: mergedDifficulty,
                })
                .eq('id', existingWorkout.id);

            if (updateError) throw new Error(`Supabase Error (Update Workout): ${updateError.message}`);
            workoutId = existingWorkout.id;
            console.log(`Merged into existing workout ${workoutId} for date ${workoutDate}`);
        } else {
            // Create new workout
            const { data: workoutData, error: workoutError } = await supabase
                .from('workouts')
                .insert({
                    raw_transcript: text,
                    date: workoutDate,
                    difficulty: parsedData.difficulty || 5,
                    user_notes: parsedData.notes
                })
                .select()
                .single();

            if (workoutError) throw new Error(`Supabase Error (Workouts): ${workoutError.message}`);
            workoutId = workoutData.id;
            console.log(`Created new workout ${workoutId} for date ${workoutDate}`);
        }

        if (parsedData.exercises && parsedData.exercises.length > 0) {
            const exercisesToInsert = parsedData.exercises.map((ex: any) => ({
                workout_id: workoutId,
                name: ex.name,
                sets: ex.sets,
                reps: ex.reps,
                weight: ex.weight,
                unit: ex.unit || 'lbs',
                duration_seconds: ex.duration_seconds,
                progression: ex.progression,
                muscle_group: ex.muscle_group
            }));

            const { error: exerciseError } = await supabase
                .from('exercises')
                .insert(exercisesToInsert);

            if (exerciseError) throw new Error(`Supabase Error (Exercises): ${exerciseError.message}`);
        }

        return NextResponse.json({
            success: true,
            text,
            parsedData,
            workoutId,
            merged: !!existingWorkout
        });

    } catch (error: any) {
        console.error("Error processing workout:", error);
        const msg = error.error?.message || error.message || "Unknown error";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
