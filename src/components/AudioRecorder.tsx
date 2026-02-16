"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, StopCircle, Upload, Loader2 } from "lucide-react";

export default function AudioRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                chunksRef.current = [];
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone. Please allow permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            // Stop all tracks to release mic
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const processAudio = async () => {
        if (!audioUrl) return;
        setIsProcessing(true);

        try {
            const blob = await fetch(audioUrl).then(r => r.blob());
            const formData = new FormData();
            formData.append("file", blob, "recording.webm");

            const res = await fetch("/api/process-workout", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Processing failed");

            console.log("Processed Data:", data);
            alert("Workout Logged! Check console for JSON.");

        } catch (err: any) {
            console.error(err);
            alert(`Error: ${err.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 p-8 border border-border rounded-xl bg-card w-full max-w-md mx-auto shadow-2xl">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-white">Voice Log</h2>
                <p className="text-muted-foreground text-sm">
                    Tap to record your session details. Speak naturally.
                </p>
            </div>

            <div className="relative group">
                <div className={`absolute inset-0 bg-primary/20 blur-xl rounded-full transition-all duration-500 ${isRecording ? "scale-150 opacity-100" : "scale-100 opacity-0"}`} />

                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isProcessing}
                    className={`relative z-10 p-8 rounded-full transition-all duration-300 transform active:scale-95 ${isRecording
                        ? "bg-red-500 hover:bg-red-600 shadow-[0_0_30px_rgba(239,68,68,0.5)]"
                        : "bg-primary hover:bg-blue-600 shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                        }`}
                >
                    {isRecording ? (
                        <StopCircle className="w-12 h-12 text-white animate-pulse" />
                    ) : (
                        <Mic className="w-12 h-12 text-white" />
                    )}
                </button>
            </div>

            {audioUrl && !isRecording && (
                <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <audio src={audioUrl} controls className="w-full h-10 rounded-lg" />

                    <button
                        onClick={processAudio}
                        disabled={isProcessing}
                        className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Analyzing (GPT-4o)...
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" />
                                Process Workout
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
