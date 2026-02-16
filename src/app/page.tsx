
import Link from "next/link";
import AudioRecorder from "@/components/AudioRecorder";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-12 tracking-tighter bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">
          ECHO <span className="text-primary">LIFT</span>
        </h1>

        <div className="flex justify-center mb-8">
          <Link href="/dashboard" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-1">
            View Lab Data →
          </Link>
        </div>

        <AudioRecorder />

        <div className="mt-12 grid grid-cols-1 max-w-[200px] mx-auto text-center">
          <div className="p-4 border border-white/5 rounded-lg bg-white/5 backdrop-blur-sm">
            <div className="text-2xl font-bold text-white mb-1">0</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Workouts</div>
          </div>
        </div>
      </div>
    </main>
  );
}
