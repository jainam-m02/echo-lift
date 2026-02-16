
import { MuscleType, Muscle } from './body-data';

// How much an exercise counts towards a muscle (0.0 - 1.0)
// 1.0 = Direct work (Primary mover)
// 0.5 = Secondary mover
// 0.2 = Stabilizer

interface MuscleActivation {
    muscle: Muscle;
    ratio: number;
}

export const EXERCISE_MAP: Record<string, MuscleActivation[]> = {
    // ── CHEST ─────────────────────────────────
    "Bench Press": [
        { muscle: MuscleType.MID_CHEST, ratio: 1.0 },
        { muscle: MuscleType.LOWER_CHEST, ratio: 0.6 },
        { muscle: MuscleType.UPPER_CHEST, ratio: 0.4 },
        { muscle: MuscleType.FRONT_DELT, ratio: 0.5 },
        { muscle: MuscleType.TRICEP_LONG_HEAD, ratio: 0.2 },
        { muscle: MuscleType.TRICEP_SHORT_HEAD, ratio: 0.3 },
    ],
    "Incline Bench Press": [
        { muscle: MuscleType.UPPER_CHEST, ratio: 1.0 },
        { muscle: MuscleType.MID_CHEST, ratio: 0.5 },
        { muscle: MuscleType.FRONT_DELT, ratio: 0.7 },
        { muscle: MuscleType.TRICEP_LONG_HEAD, ratio: 0.2 },
        { muscle: MuscleType.TRICEP_SHORT_HEAD, ratio: 0.3 },
    ],
    "Decline Bench Press": [
        { muscle: MuscleType.LOWER_CHEST, ratio: 1.0 },
        { muscle: MuscleType.MID_CHEST, ratio: 0.6 },
        { muscle: MuscleType.TRICEP_LONG_HEAD, ratio: 0.3 },
        { muscle: MuscleType.TRICEP_SHORT_HEAD, ratio: 0.3 },
    ],
    "Push-ups": [
        { muscle: MuscleType.MID_CHEST, ratio: 1.0 },
        { muscle: MuscleType.LOWER_CHEST, ratio: 0.5 },
        { muscle: MuscleType.UPPER_CHEST, ratio: 0.3 },
        { muscle: MuscleType.FRONT_DELT, ratio: 0.4 },
        { muscle: MuscleType.TRICEP_LONG_HEAD, ratio: 0.2 },
        { muscle: MuscleType.TRICEP_SHORT_HEAD, ratio: 0.3 },
    ],
    "Cable Flyes": [
        { muscle: MuscleType.MID_CHEST, ratio: 1.0 },
        { muscle: MuscleType.UPPER_CHEST, ratio: 0.4 },
        { muscle: MuscleType.LOWER_CHEST, ratio: 0.4 },
    ],
    // ── BACK ──────────────────────────────────
    "Pull-ups": [
        { muscle: MuscleType.LATS, ratio: 1.0 },
        { muscle: MuscleType.UPPER_BACK, ratio: 0.6 },
        { muscle: MuscleType.BICEP_LONG_HEAD, ratio: 0.4 },
        { muscle: MuscleType.BICEP_SHORT_HEAD, ratio: 0.5 },
        { muscle: MuscleType.BRACHIALIS, ratio: 0.3 },
        { muscle: MuscleType.FOREARM, ratio: 0.3 },
    ],
    "Lat Pulldown": [
        { muscle: MuscleType.LATS, ratio: 1.0 },
        { muscle: MuscleType.UPPER_BACK, ratio: 0.4 },
        { muscle: MuscleType.BICEP_LONG_HEAD, ratio: 0.3 },
        { muscle: MuscleType.BICEP_SHORT_HEAD, ratio: 0.4 },
        { muscle: MuscleType.BRACHIALIS, ratio: 0.3 },
    ],
    "Seated Rows": [
        { muscle: MuscleType.UPPER_BACK, ratio: 1.0 },
        { muscle: MuscleType.LATS, ratio: 0.7 },
        { muscle: MuscleType.BICEP_LONG_HEAD, ratio: 0.3 },
        { muscle: MuscleType.BICEP_SHORT_HEAD, ratio: 0.3 },
        { muscle: MuscleType.REAR_DELT, ratio: 0.5 },
    ],
    "Barbell Rows": [
        { muscle: MuscleType.UPPER_BACK, ratio: 1.0 },
        { muscle: MuscleType.LATS, ratio: 0.8 },
        { muscle: MuscleType.BICEP_LONG_HEAD, ratio: 0.3 },
        { muscle: MuscleType.BICEP_SHORT_HEAD, ratio: 0.3 },
        { muscle: MuscleType.REAR_DELT, ratio: 0.5 },
        { muscle: MuscleType.LOWER_BACK, ratio: 0.3 },
    ],
    // ── LEGS ──────────────────────────────────
    "Squat": [
        { muscle: MuscleType.QUADRICEPS, ratio: 1.0 },
        { muscle: MuscleType.GLUTEAL, ratio: 0.7 },
        { muscle: MuscleType.LOWER_BACK, ratio: 0.3 },
        { muscle: MuscleType.UPPER_ABS, ratio: 0.2 },
        { muscle: MuscleType.LOWER_ABS, ratio: 0.2 },
    ],
    "Deadlift": [
        { muscle: MuscleType.HAMSTRING, ratio: 0.8 },
        { muscle: MuscleType.GLUTEAL, ratio: 1.0 },
        { muscle: MuscleType.LOWER_BACK, ratio: 0.7 },
        { muscle: MuscleType.TRAPEZIUS, ratio: 0.3 },
        { muscle: MuscleType.FOREARM, ratio: 0.3 },
    ],
    "Leg Press": [
        { muscle: MuscleType.QUADRICEPS, ratio: 1.0 },
        { muscle: MuscleType.GLUTEAL, ratio: 0.6 },
        { muscle: MuscleType.HAMSTRING, ratio: 0.3 },
    ],
    "Romanian Deadlift": [
        { muscle: MuscleType.HAMSTRING, ratio: 1.0 },
        { muscle: MuscleType.GLUTEAL, ratio: 0.8 },
        { muscle: MuscleType.LOWER_BACK, ratio: 0.5 },
    ],
    "Leg Extensions": [
        { muscle: MuscleType.QUADRICEPS, ratio: 1.0 },
    ],
    "Leg Curls": [
        { muscle: MuscleType.HAMSTRING, ratio: 1.0 },
    ],
    // ── BICEPS ────────────────────────────────
    "Bicep Curls": [
        { muscle: MuscleType.BICEP_LONG_HEAD, ratio: 0.8 },
        { muscle: MuscleType.BICEP_SHORT_HEAD, ratio: 1.0 },
        { muscle: MuscleType.BRACHIALIS, ratio: 0.4 },
        { muscle: MuscleType.FOREARM, ratio: 0.2 },
    ],
    "Hammer Curls": [
        { muscle: MuscleType.BRACHIALIS, ratio: 1.0 },
        { muscle: MuscleType.BICEP_LONG_HEAD, ratio: 0.6 },
        { muscle: MuscleType.BICEP_SHORT_HEAD, ratio: 0.4 },
        { muscle: MuscleType.FOREARM, ratio: 0.4 },
    ],
    "Preacher Curls": [
        { muscle: MuscleType.BICEP_SHORT_HEAD, ratio: 1.0 },
        { muscle: MuscleType.BICEP_LONG_HEAD, ratio: 0.6 },
        { muscle: MuscleType.BRACHIALIS, ratio: 0.5 },
    ],
    "Incline Curls": [
        { muscle: MuscleType.BICEP_LONG_HEAD, ratio: 1.0 },
        { muscle: MuscleType.BICEP_SHORT_HEAD, ratio: 0.5 },
        { muscle: MuscleType.BRACHIALIS, ratio: 0.3 },
    ],
    // ── TRICEPS ───────────────────────────────
    "Tricep Extensions": [
        { muscle: MuscleType.TRICEP_LONG_HEAD, ratio: 1.0 },
        { muscle: MuscleType.TRICEP_SHORT_HEAD, ratio: 0.6 },
    ],
    "Tricep Pushdowns": [
        { muscle: MuscleType.TRICEP_SHORT_HEAD, ratio: 1.0 },
        { muscle: MuscleType.TRICEP_LONG_HEAD, ratio: 0.5 },
    ],
    "Skull Crushers": [
        { muscle: MuscleType.TRICEP_LONG_HEAD, ratio: 1.0 },
        { muscle: MuscleType.TRICEP_SHORT_HEAD, ratio: 0.7 },
    ],
    "Dips": [
        { muscle: MuscleType.TRICEP_LONG_HEAD, ratio: 0.8 },
        { muscle: MuscleType.TRICEP_SHORT_HEAD, ratio: 0.8 },
        { muscle: MuscleType.LOWER_CHEST, ratio: 0.6 },
        { muscle: MuscleType.MID_CHEST, ratio: 0.4 },
        { muscle: MuscleType.FRONT_DELT, ratio: 0.3 },
    ],
    // ── SHOULDERS ─────────────────────────────
    "Overhead Press": [
        { muscle: MuscleType.FRONT_DELT, ratio: 1.0 },
        { muscle: MuscleType.SIDE_DELT, ratio: 0.5 },
        { muscle: MuscleType.TRICEP_LONG_HEAD, ratio: 0.4 },
        { muscle: MuscleType.TRICEP_SHORT_HEAD, ratio: 0.4 },
        { muscle: MuscleType.UPPER_BACK, ratio: 0.2 },
    ],
    "Lateral Raises": [
        { muscle: MuscleType.SIDE_DELT, ratio: 1.0 },
        { muscle: MuscleType.FRONT_DELT, ratio: 0.2 },
        { muscle: MuscleType.TRAPEZIUS, ratio: 0.3 },
    ],
    "Front Raises": [
        { muscle: MuscleType.FRONT_DELT, ratio: 1.0 },
        { muscle: MuscleType.SIDE_DELT, ratio: 0.2 },
        { muscle: MuscleType.UPPER_CHEST, ratio: 0.2 },
    ],
    "Face Pulls": [
        { muscle: MuscleType.REAR_DELT, ratio: 1.0 },
        { muscle: MuscleType.TRAPEZIUS, ratio: 0.5 },
        { muscle: MuscleType.UPPER_BACK, ratio: 0.3 },
    ],
    "Reverse Flyes": [
        { muscle: MuscleType.REAR_DELT, ratio: 1.0 },
        { muscle: MuscleType.UPPER_BACK, ratio: 0.4 },
        { muscle: MuscleType.TRAPEZIUS, ratio: 0.3 },
    ],
    // ── ABS ───────────────────────────────────
    "Crunches": [
        { muscle: MuscleType.UPPER_ABS, ratio: 1.0 },
        { muscle: MuscleType.LOWER_ABS, ratio: 0.3 },
    ],
    "Leg Raises": [
        { muscle: MuscleType.LOWER_ABS, ratio: 1.0 },
        { muscle: MuscleType.UPPER_ABS, ratio: 0.3 },
    ],
    "Planks": [
        { muscle: MuscleType.UPPER_ABS, ratio: 0.7 },
        { muscle: MuscleType.LOWER_ABS, ratio: 0.7 },
        { muscle: MuscleType.OBLIQUES, ratio: 0.5 },
    ],
    // ── CALVES ────────────────────────────────
    "Calf Raises": [
        { muscle: MuscleType.CALVES, ratio: 1.0 },
    ],
    // ── TRAPS ─────────────────────────────────
    "Shrugs": [
        { muscle: MuscleType.TRAPEZIUS, ratio: 1.0 },
    ],
};

// Default fallback for unknown exercises (try to match name)
export const getActivations = (exerciseName: string): MuscleActivation[] => {
    // 1. Exact match
    if (EXERCISE_MAP[exerciseName]) return EXERCISE_MAP[exerciseName];

    const lower = exerciseName.toLowerCase();

    // 2. Heuristic matching (most specific first)
    if (lower.includes('incline') && lower.includes('curl')) return EXERCISE_MAP["Incline Curls"];
    if (lower.includes('incline') && lower.includes('bench')) return EXERCISE_MAP["Incline Bench Press"];
    if (lower.includes('incline') && lower.includes('press')) return EXERCISE_MAP["Incline Bench Press"];
    if (lower.includes('decline') && lower.includes('bench')) return EXERCISE_MAP["Decline Bench Press"];
    if (lower.includes('decline') && lower.includes('press')) return EXERCISE_MAP["Decline Bench Press"];
    if (lower.includes('bench')) return EXERCISE_MAP["Bench Press"];
    if (lower.includes('cable fl')) return EXERCISE_MAP["Cable Flyes"];
    if (lower.includes('squat')) return EXERCISE_MAP["Squat"];
    if (lower.includes('romanian') && lower.includes('deadlift')) return EXERCISE_MAP["Romanian Deadlift"];
    if (lower.includes('rdl')) return EXERCISE_MAP["Romanian Deadlift"];
    if (lower.includes('deadlift')) return EXERCISE_MAP["Deadlift"];
    if (lower.includes('pull-up') || lower.includes('pull up') || lower.includes('pullup') || lower.includes('chin')) return EXERCISE_MAP["Pull-ups"];
    if (lower.includes('lat pull')) return EXERCISE_MAP["Lat Pulldown"];
    if (lower.includes('hammer curl')) return EXERCISE_MAP["Hammer Curls"];
    if (lower.includes('preacher curl')) return EXERCISE_MAP["Preacher Curls"];
    if (lower.includes('curl')) return EXERCISE_MAP["Bicep Curls"];
    if (lower.includes('row')) return EXERCISE_MAP["Seated Rows"];
    if (lower.includes('overhead') && lower.includes('press')) return EXERCISE_MAP["Overhead Press"];
    if (lower.includes('ohp')) return EXERCISE_MAP["Overhead Press"];
    if (lower.includes('military')) return EXERCISE_MAP["Overhead Press"];
    if (lower.includes('lateral raise')) return EXERCISE_MAP["Lateral Raises"];
    if (lower.includes('front raise')) return EXERCISE_MAP["Front Raises"];
    if (lower.includes('face pull')) return EXERCISE_MAP["Face Pulls"];
    if (lower.includes('reverse fl')) return EXERCISE_MAP["Reverse Flyes"];
    if (lower.includes('tricep') && lower.includes('push')) return EXERCISE_MAP["Tricep Pushdowns"];
    if (lower.includes('skull crush')) return EXERCISE_MAP["Skull Crushers"];
    if (lower.includes('tricep')) return EXERCISE_MAP["Tricep Extensions"];
    if (lower.includes('dip')) return EXERCISE_MAP["Dips"];
    if (lower.includes('push-up') || lower.includes('push up') || lower.includes('pushup')) return EXERCISE_MAP["Push-ups"];
    if (lower.includes('crunch')) return EXERCISE_MAP["Crunches"];
    if (lower.includes('leg raise')) return EXERCISE_MAP["Leg Raises"];
    if (lower.includes('plank')) return EXERCISE_MAP["Planks"];
    if (lower.includes('calf') || lower.includes('calves')) return EXERCISE_MAP["Calf Raises"];
    if (lower.includes('shrug')) return EXERCISE_MAP["Shrugs"];
    if (lower.includes('leg press')) return EXERCISE_MAP["Leg Press"];
    if (lower.includes('leg ext')) return EXERCISE_MAP["Leg Extensions"];
    if (lower.includes('leg curl')) return EXERCISE_MAP["Leg Curls"];

    return [];
};
