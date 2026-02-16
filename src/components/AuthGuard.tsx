"use client";

import { useState, useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState("");
    const [error, setError] = useState(false);

    // Read PIN from environment variable, fallback to '1111' if not set
    // This keeps your actual PIN secret (in .env.local) while the code is public
    const CORRECT_PIN = process.env.NEXT_PUBLIC_ACCESS_PIN || "1111";

    useEffect(() => {
        // Check if valid session already exists
        const session = sessionStorage.getItem("echolift_auth");
        if (session === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        if (pin === CORRECT_PIN) {
            setIsAuthenticated(true);
            sessionStorage.setItem("echolift_auth", "true");
            setError(false);
        } else {
            setError(true);
            setPin("");
        }
    };

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
            <div className="max-w-xs w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight">ECHO LIFT</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Enter access code to view data</p>
                </div>

                <form onSubmit={handleUnlock} className="mt-8 space-y-6">
                    <div>
                        <input
                            type="password"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            required
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-border bg-secondary placeholder-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-center text-2xl tracking-[1em]"
                            placeholder="••••"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            maxLength={4}
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-xs text-center">Incorrect code. Try again.</p>
                    )}

                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                    >
                        Unlock
                    </button>
                </form>
            </div>
        </div>
    );
}
