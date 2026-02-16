
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { format, subDays, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isToday, isBefore, startOfDay } from "date-fns";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";
import { ArrowLeft, AlertCircle, ChevronLeft, ChevronRight, Calendar, Dumbbell, TrendingUp, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import HumanBody from "@/components/HumanBody";
import { getActivations } from "@/lib/muscle-map";

// Initialize Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Dashboard() {
    const [workouts, setWorkouts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [muscleVolumes, setMuscleVolumes] = useState<Record<string, number>>({});
    const [calendarMonth, setCalendarMonth] = useState(new Date());
    const [selectedExercise, setSelectedExercise] = useState<string>("");
    const [viewMode, setViewMode] = useState<'volume' | '1rm'>('volume');

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const fetchWorkouts = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from("workouts")
                .select(`
          *,
          exercises (*)
        `)
                .order("date", { ascending: false });

            if (error) {
                console.error("Supabase Error:", error);
                setError(error.message);
            } else {
                setWorkouts(data || []);
                calculateMuscleVolumes(data || []);
            }
        } catch (err: any) {
            console.error("Fetch Error:", err);
            setError(err.message || "Unknown error occurred");
        } finally {
            setLoading(false);
        }
    };

    const calculateMuscleVolumes = (data: any[]) => {
        // Filter for last 7 days for "Weekly Volume"
        // Or just do ALL time for now to show something? 
        // User asked for "needed to be done that week", so let's do LAST 7 DAYS.
        const oneWeekAgo = subDays(new Date(), 7);

        const volumes: Record<string, number> = {};

        data.forEach(workout => {
            const workoutDate = new Date(workout.date);
            if (workoutDate >= oneWeekAgo) {
                workout.exercises.forEach((ex: any) => {
                    const sets = ex.sets || 0;
                    const activations = getActivations(ex.name);

                    activations.forEach(act => {
                        const volume = sets * act.ratio;
                        // Round to 2 decimal places to avoid floating point weirdness
                        const current = volumes[act.muscle] || 0;
                        volumes[act.muscle] = Math.round((current + volume) * 100) / 100;
                    });
                });
            }
        });

        setMuscleVolumes(volumes);
    };

    // Merge workouts that share the same date into a single entry
    const mergedWorkouts = useMemo(() => {
        const byDate: Record<string, any> = {};
        workouts.forEach(w => {
            const dateKey = w.date;
            if (byDate[dateKey]) {
                // Merge into existing
                byDate[dateKey].exercises = [...byDate[dateKey].exercises, ...w.exercises];
                byDate[dateKey].difficulty = Math.max(byDate[dateKey].difficulty || 0, w.difficulty || 0);
                byDate[dateKey].user_notes = [byDate[dateKey].user_notes, w.user_notes]
                    .filter(Boolean).join(' | ');
                byDate[dateKey].raw_transcript = [byDate[dateKey].raw_transcript, w.raw_transcript]
                    .filter(Boolean).join('\n');
            } else {
                byDate[dateKey] = { ...w, exercises: [...w.exercises] };
            }
        });
        return Object.values(byDate).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [workouts]);


    // Collect all unique exercise names (excluding non-weight exercises like Sauna)
    const exerciseNames = useMemo(() => {
        const names = new Set<string>();
        workouts.forEach(w => {
            w.exercises.forEach((ex: any) => {
                if (ex.weight && ex.weight > 0) names.add(ex.name);
            });
        });
        return Array.from(names).sort();
    }, [workouts]);

    // Auto-select first exercise when data loads
    useEffect(() => {
        if (exerciseNames.length > 0 && !selectedExercise) {
            setSelectedExercise(exerciseNames[0]);
        }
    }, [exerciseNames, selectedExercise]);

    // Build per-exercise progression data for the selected exercise
    const exerciseProgressionData = useMemo(() => {
        if (!selectedExercise) return [];

        const dataByDate: Record<string, { date: string; volume: number; oneRepMax: number; bestSet: string }> = {};

        workouts
            .slice()
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .forEach(w => {
                w.exercises
                    .filter((ex: any) => ex.name === selectedExercise)
                    .forEach((ex: any) => {
                        const dateKey = format(new Date(w.date), "MMM d");
                        const vol = (ex.weight || 0) * (ex.reps || 0) * (ex.sets || 0);
                        const est1RM = (ex.weight || 0) * (1 + (ex.reps || 0) / 30);
                        const setLabel = `${ex.sets}x${ex.reps} @ ${ex.weight}${ex.unit || 'lbs'}`;

                        if (dataByDate[dateKey]) {
                            dataByDate[dateKey].volume += vol;
                            // Keep max estimates 1RM for the day
                            if (est1RM > dataByDate[dateKey].oneRepMax) {
                                dataByDate[dateKey].oneRepMax = est1RM;
                            }
                            dataByDate[dateKey].bestSet += `, ${setLabel}`;
                        } else {
                            dataByDate[dateKey] = { date: dateKey, volume: vol, oneRepMax: est1RM, bestSet: setLabel };
                        }
                    });
            });

        return Object.values(dataByDate);
    }, [workouts, selectedExercise]);

    // Monthly Strength Report: compare max weight per exercise (current month vs previous month)
    const strengthReport = useMemo(() => {
        const now = new Date();
        const currentMonthStart = startOfMonth(now);
        const currentMonthEnd = endOfMonth(now);
        const prevMonthStart = startOfMonth(subMonths(now, 1));
        const prevMonthEnd = endOfMonth(subMonths(now, 1));

        const maxByExercise = (start: Date, end: Date) => {
            const maxes: Record<string, { weight: number; sets: number; reps: number; unit: string }> = {};
            workouts.forEach(w => {
                const d = new Date(w.date);
                if (d >= start && d <= end) {
                    w.exercises.forEach((ex: any) => {
                        if (ex.weight && ex.weight > 0) {
                            if (!maxes[ex.name] || ex.weight > maxes[ex.name].weight) {
                                maxes[ex.name] = {
                                    weight: ex.weight,
                                    sets: ex.sets || 0,
                                    reps: ex.reps || 0,
                                    unit: ex.unit || 'lbs',
                                };
                            }
                        }
                    });
                }
            });
            return maxes;
        };

        const currentMaxes = maxByExercise(currentMonthStart, currentMonthEnd);
        const prevMaxes = maxByExercise(prevMonthStart, prevMonthEnd);

        // Build comparison entries
        const allExercises = new Set([...Object.keys(currentMaxes), ...Object.keys(prevMaxes)]);
        const entries: {
            name: string;
            current: number | null;
            previous: number | null;
            unit: string;
            change: number | null; // percentage
            detail: string;
        }[] = [];

        allExercises.forEach(name => {
            const curr = currentMaxes[name];
            const prev = prevMaxes[name];
            const currentW = curr?.weight ?? null;
            const previousW = prev?.weight ?? null;
            const unit = curr?.unit || prev?.unit || 'lbs';
            let change: number | null = null;
            if (currentW !== null && previousW !== null && previousW > 0) {
                change = ((currentW - previousW) / previousW) * 100;
            }
            const detail = curr
                ? `${curr.sets}x${curr.reps} @ ${curr.weight}${unit}`
                : 'No data this month';
            entries.push({ name, current: currentW, previous: previousW, unit, change, detail });
        });

        return entries.sort((a, b) => a.name.localeCompare(b.name));
    }, [workouts]);

    return (
        <main className="min-h-screen p-8 bg-background text-foreground">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justifying-between">
                    <div>
                        <Link href="/" className="flex items-center text-muted-foreground hover:text-white transition-colors mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Recorder
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tighter">Lab Data</h1>
                        <p className="text-muted-foreground">Visualize your progress.</p>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <div>
                            <h3 className="font-bold">Error Loading Data</h3>
                            <p className="text-sm font-mono">{error}</p>
                            <p className="text-xs text-muted-foreground mt-1">Check console for full details.</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Main Chart */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Heatmap Section */}
                        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500" />
                                    Hypertrophy Heatmap (Last 7 Days)
                                </h2>
                                <span className="text-xs text-muted-foreground">Hover for details</span>
                            </div>
                            <div className="w-full flex justify-center">
                                <HumanBody muscleVolumes={muscleVolumes} className="w-full max-w-[400px]" />
                            </div>
                            <div className="mt-6 grid grid-cols-4 gap-2 text-[10px] text-muted-foreground text-center">
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 rounded bg-gray-700 mb-1" />
                                    <span>Resting</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 rounded bg-red-500 mb-1" />
                                    <span>Low (1-5)</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 rounded bg-yellow-500 mb-1" />
                                    <span>Moderate (5-12)</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 rounded bg-green-500 mb-1" />
                                    <span>Optimal (12+)</span>
                                </div>
                            </div>
                        </div>

                        {/* Per-Exercise Progression Chart */}
                        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-blue-500" />
                                    Exercise Progression
                                </h2>
                                {exerciseNames.length > 0 && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex bg-secondary/50 rounded-lg p-0.5 border border-border">
                                            <button
                                                onClick={() => setViewMode('volume')}
                                                className={cn(
                                                    "px-3 py-1 text-xs font-medium rounded-md transition-all",
                                                    viewMode === 'volume' ? "bg-blue-500/20 text-blue-400 shadow-sm" : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                Volume
                                            </button>
                                            <button
                                                onClick={() => setViewMode('1rm')}
                                                className={cn(
                                                    "px-3 py-1 text-xs font-medium rounded-md transition-all",
                                                    viewMode === '1rm' ? "bg-purple-500/20 text-purple-400 shadow-sm" : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                Est. 1RM
                                            </button>
                                        </div>
                                        <select
                                            value={selectedExercise}
                                            onChange={(e) => setSelectedExercise(e.target.value)}
                                            className="text-sm bg-secondary border border-border rounded-lg px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            {exerciseNames.map(name => (
                                                <option key={name} value={name} className="text-black">{name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                            <div className="h-[200px] w-full">
                                {exerciseProgressionData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={exerciseProgressionData}>
                                            <XAxis
                                                dataKey="date"
                                                stroke="#888888"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <YAxis
                                                stroke="#888888"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) => `${Math.round(value)}`}
                                            />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", fontSize: "12px" }}
                                                labelStyle={{ color: "#9ca3af" }}
                                                formatter={(value: any) => [`${Math.round(value)} lbs`, viewMode === 'volume' ? "Volume" : "Est. 1RM"]}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey={viewMode === 'volume' ? "volume" : "oneRepMax"}
                                                stroke={viewMode === 'volume' ? "#3b82f6" : "#a855f7"}
                                                strokeWidth={2}
                                                dot={{ r: 4, fill: viewMode === 'volume' ? "#3b82f6" : "#a855f7" }}
                                                activeDot={{ r: 6, fill: "#fff" }}
                                                name={selectedExercise}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                                        {loading ? "Loading data..." : exerciseNames.length === 0 ? "No exercises recorded yet." : "No data for this exercise."}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Monthly Strength Report */}
                        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <Dumbbell className="w-4 h-4 text-purple-400" />
                                    Monthly Strength Report
                                </h2>
                                <span className="text-xs text-muted-foreground font-mono">
                                    {format(startOfMonth(new Date()), 'MMM yyyy')} vs {format(startOfMonth(subMonths(new Date(), 1)), 'MMM yyyy')}
                                </span>
                            </div>

                            {strengthReport.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No exercises recorded yet.</p>
                            ) : (
                                <div className="space-y-2">
                                    {strengthReport.map(entry => (
                                        <div
                                            key={entry.name}
                                            className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 border border-border/50 hover:bg-secondary/60 transition-colors"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-200">{entry.name}</span>
                                                <span className="text-xs text-muted-foreground font-mono">{entry.detail}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {/* Weight comparison */}
                                                <div className="text-right">
                                                    {entry.previous !== null && entry.current !== null ? (
                                                        <span className="text-xs text-muted-foreground font-mono">
                                                            {entry.previous}{entry.unit} → <span className="text-white font-semibold">{entry.current}{entry.unit}</span>
                                                        </span>
                                                    ) : entry.current !== null ? (
                                                        <span className="text-xs text-sky-400 font-mono">New: {entry.current}{entry.unit}</span>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground font-mono">—</span>
                                                    )}
                                                </div>

                                                {/* Percentage change badge */}
                                                {entry.change !== null ? (
                                                    <div className={cn(
                                                        "flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold min-w-[60px] justify-center",
                                                        entry.change > 0
                                                            ? "bg-emerald-500/20 text-emerald-400"
                                                            : entry.change < 0
                                                                ? "bg-red-500/20 text-red-400"
                                                                : "bg-gray-500/20 text-gray-400"
                                                    )}>
                                                        {entry.change > 0 ? (
                                                            <ArrowUpRight className="w-3 h-3" />
                                                        ) : entry.change < 0 ? (
                                                            <ArrowDownRight className="w-3 h-3" />
                                                        ) : (
                                                            <Minus className="w-3 h-3" />
                                                        )}
                                                        {entry.change > 0 ? "+" : ""}{entry.change.toFixed(1)}%
                                                    </div>
                                                ) : (
                                                    <div className="min-w-[60px]" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Calendar + Transmissions */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Monthly Gym Calendar */}
                        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    Training Calendar
                                </h2>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                                        className="p-1 rounded hover:bg-white/10 transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <span className="text-sm font-mono text-muted-foreground min-w-[110px] text-center">
                                        {format(calendarMonth, 'MMMM yyyy')}
                                    </span>
                                    <button
                                        onClick={() => setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                                        className="p-1 rounded hover:bg-white/10 transition-colors"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {(() => {
                                const monthStart = startOfMonth(calendarMonth);
                                const monthEnd = endOfMonth(calendarMonth);
                                const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
                                const startDayOfWeek = getDay(monthStart); // 0=Sun

                                // Get unique gym dates for this month
                                const gymDates = workouts
                                    .map(w => startOfDay(new Date(w.date)))
                                    .filter(d => d >= monthStart && d <= monthEnd);
                                const uniqueGymDays = new Set(gymDates.map(d => d.toISOString()));

                                // Elapsed days = min(today, monthEnd) - monthStart + 1
                                const today = startOfDay(new Date());
                                const effectiveEnd = isBefore(today, monthEnd) ? today : monthEnd;
                                const elapsedDays = isBefore(effectiveEnd, monthStart)
                                    ? 0
                                    : eachDayOfInterval({ start: monthStart, end: effectiveEnd }).length;

                                const totalWorkouts = mergedWorkouts.length;

                                return (
                                    <>
                                        {/* Day headers */}
                                        <div className="grid grid-cols-7 gap-1 mb-1">
                                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                                <div key={i} className="text-center text-[10px] text-muted-foreground font-mono">{d}</div>
                                            ))}
                                        </div>

                                        {/* Calendar grid */}
                                        <div className="grid grid-cols-7 gap-1">
                                            {/* Empty cells for offset */}
                                            {Array.from({ length: startDayOfWeek }).map((_, i) => (
                                                <div key={`empty-${i}`} className="aspect-square" />
                                            ))}

                                            {daysInMonth.map(day => {
                                                const isGymDay = uniqueGymDays.has(startOfDay(day).toISOString());
                                                const isTodayDate = isToday(day);
                                                const isPast = isBefore(day, today) && !isTodayDate;

                                                return (
                                                    <div
                                                        key={day.toISOString()}
                                                        className={cn(
                                                            "aspect-square flex items-center justify-center rounded-md text-xs font-mono transition-all",
                                                            isGymDay
                                                                ? "bg-primary/80 text-white font-bold shadow-sm shadow-primary/30"
                                                                : isPast
                                                                    ? "text-muted-foreground/40"
                                                                    : "text-muted-foreground",
                                                            isTodayDate && !isGymDay && "ring-1 ring-primary/50 text-white",
                                                            isTodayDate && isGymDay && "ring-2 ring-white"
                                                        )}
                                                    >
                                                        {format(day, 'd')}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Tally stats */}
                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            <div className="p-3 rounded-lg bg-secondary/50 border border-border text-center">
                                                <div className="text-xl font-bold text-white">
                                                    {uniqueGymDays.size}<span className="text-muted-foreground text-sm font-normal">/{elapsedDays}</span>
                                                </div>
                                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Gym Days This Month</div>
                                            </div>
                                            <div className="p-3 rounded-lg bg-secondary/50 border border-border text-center">
                                                <div className="text-xl font-bold text-white flex items-center justify-center gap-1">
                                                    <Dumbbell className="w-4 h-4 text-primary" />
                                                    {totalWorkouts}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Total Workouts Logged</div>
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>

                        {/* Recent Transmissions List */}
                        <div className="p-6 rounded-xl border border-border bg-card shadow-sm h-fit min-w-[340px]">
                            <h2 className="text-lg font-semibold mb-4">Recent Transmissions</h2>
                            <div className="space-y-4">
                                {loading ? (
                                    <p className="text-sm text-muted-foreground animate-pulse">Scanning database...</p>
                                ) : workouts.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No transmissions loged.</p>
                                ) : (
                                    mergedWorkouts.slice(0, 5).map((workout) => (
                                        <div key={workout.id} className="p-3 rounded-lg bg-secondary/50 border border-border hover:bg-secondary transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-mono text-blue-400">
                                                    {format(new Date(workout.date), "yyyy-MM-dd")}
                                                </span>
                                                <span className={cn(
                                                    "text-[10px] px-2 py-0.5 rounded-full font-bold",
                                                    workout.difficulty >= 8 ? "bg-red-900/30 text-red-400" :
                                                        workout.difficulty >= 5 ? "bg-yellow-900/30 text-yellow-400" :
                                                            "bg-green-900/30 text-green-400"
                                                )}>
                                                    RPE {workout.difficulty}
                                                </span>
                                            </div>
                                            <div className="space-y-1">
                                                {workout.exercises.map((ex: any) => (
                                                    <div key={ex.id} className="text-sm flex justify-between gap-4">
                                                        <span className="text-gray-300 whitespace-nowrap">{ex.name}</span>
                                                        <span className="text-muted-foreground font-mono whitespace-nowrap text-xs">
                                                            {ex.sets}x{ex.reps} @ {ex.weight}{ex.unit}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            {workout.user_notes && (
                                                <p className="mt-2 text-xs text-muted-foreground italic border-l-2 border-border pl-2">
                                                    "{workout.user_notes}"
                                                </p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
