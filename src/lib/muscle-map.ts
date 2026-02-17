
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
    "Incline Smith Machine Press": [
        { muscle: MuscleType.UPPER_CHEST, ratio: 1.0 },
        { muscle: MuscleType.MID_CHEST, ratio: 0.5 },
        { muscle: MuscleType.FRONT_DELT, ratio: 0.6 },
        { muscle: MuscleType.TRICEP_LONG_HEAD, ratio: 0.2 },
        { muscle: MuscleType.TRICEP_SHORT_HEAD, ratio: 0.3 },
    ],
    "Incline Dumbbell Press": [
        { muscle: MuscleType.UPPER_CHEST, ratio: 1.0 },
        { muscle: MuscleType.MID_CHEST, ratio: 0.5 },
        { muscle: MuscleType.FRONT_DELT, ratio: 0.65 },
        { muscle: MuscleType.TRICEP_LONG_HEAD, ratio: 0.2 },
        { muscle: MuscleType.TRICEP_SHORT_HEAD, ratio: 0.25 },
    ],
    "Decline Bench Press": [
        { muscle: MuscleType.LOWER_CHEST, ratio: 1.0 },
        { muscle: MuscleType.MID_CHEST, ratio: 0.6 },
        { muscle: MuscleType.TRICEP_LONG_HEAD, ratio: 0.3 },
        { muscle: MuscleType.TRICEP_SHORT_HEAD, ratio: 0.3 },
    ],
    "Decline Chest Press": [
        { muscle: MuscleType.LOWER_CHEST, ratio: 1.0 },
        { muscle: MuscleType.MID_CHEST, ratio: 0.6 },
        { muscle: MuscleType.FRONT_DELT, ratio: 0.2 },
        { muscle: MuscleType.TRICEP_LONG_HEAD, ratio: 0.25 },
        { muscle: MuscleType.TRICEP_SHORT_HEAD, ratio: 0.25 },
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
    "Low to High Cable Fly": [
        { muscle: MuscleType.UPPER_CHEST, ratio: 1.0 },
        { muscle: MuscleType.MID_CHEST, ratio: 0.5 },
        { muscle: MuscleType.FRONT_DELT, ratio: 0.3 },
    ],
    "High to Low Cable Fly": [
        { muscle: MuscleType.LOWER_CHEST, ratio: 1.0 },
        { muscle: MuscleType.MID_CHEST, ratio: 0.5 },
    ],
    "Dips": [
        { muscle: MuscleType.LOWER_CHEST, ratio: 0.8 },
        { muscle: MuscleType.MID_CHEST, ratio: 0.5 },
        { muscle: MuscleType.TRICEP_LONG_HEAD, ratio: 0.7 },
        { muscle: MuscleType.TRICEP_SHORT_HEAD, ratio: 0.7 },
        { muscle: MuscleType.FRONT_DELT, ratio: 0.4 },
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
    "Wide Grip Pullups": [
        { muscle: MuscleType.LATS, ratio: 1.0 },
        { muscle: MuscleType.UPPER_BACK, ratio: 0.7 },
        { muscle: MuscleType.REAR_DELT, ratio: 0.3 },
        { muscle: MuscleType.BICEP_LONG_HEAD, ratio: 0.3 },
        { muscle: MuscleType.BICEP_SHORT_HEAD, ratio: 0.3 },
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
    "Low to High Rows": [
        { muscle: MuscleType.UPPER_BACK, ratio: 1.0 },
        { muscle: MuscleType.TRAPEZIUS, ratio: 0.6 },
        { muscle: MuscleType.REAR_DELT, ratio: 0.7 },
        { muscle: MuscleType.LATS, ratio: 0.3 },
        { muscle: MuscleType.BICEP_LONG_HEAD, ratio: 0.3 },
        { muscle: MuscleType.BICEP_SHORT_HEAD, ratio: 0.3 },
    ],
    "High to Low Rows": [
        { muscle: MuscleType.LATS, ratio: 1.0 },
        { muscle: MuscleType.UPPER_BACK, ratio: 0.5 },
        { muscle: MuscleType.REAR_DELT, ratio: 0.3 },
        { muscle: MuscleType.BICEP_LONG_HEAD, ratio: 0.3 },
        { muscle: MuscleType.BICEP_SHORT_HEAD, ratio: 0.3 },
    ],
    "Chest Supported Machine Rows": [
        { muscle: MuscleType.UPPER_BACK, ratio: 1.0 },
        { muscle: MuscleType.LATS, ratio: 0.6 },
        { muscle: MuscleType.REAR_DELT, ratio: 0.5 },
        { muscle: MuscleType.BICEP_LONG_HEAD, ratio: 0.25 },
        { muscle: MuscleType.BICEP_SHORT_HEAD, ratio: 0.25 },
    ],
    "Barbell Rows": [
        { muscle: MuscleType.UPPER_BACK, ratio: 1.0 },
        { muscle: MuscleType.LATS, ratio: 0.8 },
        { muscle: MuscleType.BICEP_LONG_HEAD, ratio: 0.3 },
        { muscle: MuscleType.BICEP_SHORT_HEAD, ratio: 0.3 },
        { muscle: MuscleType.REAR_DELT, ratio: 0.5 },
        { muscle: MuscleType.LOWER_BACK, ratio: 0.3 },
    ],
    "Machine 45 Degree Back Extension": [
        { muscle: MuscleType.LOWER_BACK, ratio: 1.0 },
        { muscle: MuscleType.GLUTEAL, ratio: 0.6 },
        { muscle: MuscleType.HAMSTRING, ratio: 0.4 },
    ],
    // ── LEGS ──────────────────────────────────
    "Squat": [
        { muscle: MuscleType.QUADRICEPS, ratio: 1.0 },
        { muscle: MuscleType.GLUTEAL, ratio: 0.7 },
        { muscle: MuscleType.LOWER_BACK, ratio: 0.3 },
        { muscle: MuscleType.UPPER_ABS, ratio: 0.2 },
        { muscle: MuscleType.LOWER_ABS, ratio: 0.2 },
    ],
    "Hack Squat": [
        { muscle: MuscleType.QUADRICEPS, ratio: 1.0 },
        { muscle: MuscleType.GLUTEAL, ratio: 0.5 },
        { muscle: MuscleType.HAMSTRING, ratio: 0.2 },
    ],
    "Bulgarian Split Squat": [
        { muscle: MuscleType.QUADRICEPS, ratio: 1.0 },
        { muscle: MuscleType.GLUTEAL, ratio: 0.8 },
        { muscle: MuscleType.HAMSTRING, ratio: 0.3 },
        { muscle: MuscleType.ABDUCTOR, ratio: 0.3 },
        { muscle: MuscleType.CALVES, ratio: 0.15 },
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
    "Seated Hamstring Curls": [
        { muscle: MuscleType.HAMSTRING, ratio: 1.0 },
        { muscle: MuscleType.CALVES, ratio: 0.1 },
    ],
    "Abductor Machine": [
        { muscle: MuscleType.ABDUCTORS, ratio: 1.0 },
        { muscle: MuscleType.GLUTEAL, ratio: 0.4 },
    ],
    "Adductor Machine": [
        { muscle: MuscleType.ABDUCTOR, ratio: 1.0 },
    ],
    "Seated Calf Raises": [
        { muscle: MuscleType.CALVES, ratio: 1.0 },
        { muscle: MuscleType.LEFT_SOLEUS, ratio: 0.8 },
        { muscle: MuscleType.RIGHT_SOLEUS, ratio: 0.8 },
    ],
    // ── BICEPS ────────────────────────────────
    "Bicep Curls": [
        { muscle: MuscleType.BICEP_LONG_HEAD, ratio: 0.8 },
        { muscle: MuscleType.BICEP_SHORT_HEAD, ratio: 1.0 },
        { muscle: MuscleType.BRACHIALIS, ratio: 0.4 },
        { muscle: MuscleType.FOREARM, ratio: 0.2 },
    ],
    "Hammer Curls": [
        // 45-degree preacher bench (standing) — emphasizes brachialis & long head
        { muscle: MuscleType.BRACHIALIS, ratio: 1.0 },
        { muscle: MuscleType.BICEP_LONG_HEAD, ratio: 0.8 },
        { muscle: MuscleType.BICEP_SHORT_HEAD, ratio: 0.3 },
        { muscle: MuscleType.FOREARM, ratio: 0.5 },
    ],
    "Bayesian Curls": [
        // Cable behind body — fully stretched long head bias
        { muscle: MuscleType.BICEP_LONG_HEAD, ratio: 1.0 },
        { muscle: MuscleType.BICEP_SHORT_HEAD, ratio: 0.5 },
        { muscle: MuscleType.BRACHIALIS, ratio: 0.3 },
    ],
    "Preacher Curls": [
        // Seated machine preacher curls — short head emphasis
        { muscle: MuscleType.BICEP_SHORT_HEAD, ratio: 1.0 },
        { muscle: MuscleType.BICEP_LONG_HEAD, ratio: 0.4 },
        { muscle: MuscleType.BRACHIALIS, ratio: 0.6 },
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
    "Overhead Cable Tricep Extensions": [
        // Overhead position — maximal long head stretch
        { muscle: MuscleType.TRICEP_LONG_HEAD, ratio: 1.0 },
        { muscle: MuscleType.TRICEP_SHORT_HEAD, ratio: 0.4 },
    ],
    "Tricep Pushdowns": [
        { muscle: MuscleType.TRICEP_SHORT_HEAD, ratio: 1.0 },
        { muscle: MuscleType.TRICEP_LONG_HEAD, ratio: 0.5 },
    ],
    "Tricep Pushdown Machine": [
        { muscle: MuscleType.TRICEP_SHORT_HEAD, ratio: 1.0 },
        { muscle: MuscleType.TRICEP_LONG_HEAD, ratio: 0.5 },
    ],
    "Skull Crushers": [
        { muscle: MuscleType.TRICEP_LONG_HEAD, ratio: 1.0 },
        { muscle: MuscleType.TRICEP_SHORT_HEAD, ratio: 0.7 },
    ],
    // ── SHOULDERS ─────────────────────────────
    "Overhead Press": [
        { muscle: MuscleType.FRONT_DELT, ratio: 1.0 },
        { muscle: MuscleType.SIDE_DELT, ratio: 0.5 },
        { muscle: MuscleType.TRICEP_LONG_HEAD, ratio: 0.4 },
        { muscle: MuscleType.TRICEP_SHORT_HEAD, ratio: 0.4 },
        { muscle: MuscleType.UPPER_BACK, ratio: 0.2 },
    ],
    "Dumbbell Shoulder Press": [
        // Seated — front delt primary, more side delt than barbell OHP
        { muscle: MuscleType.FRONT_DELT, ratio: 1.0 },
        { muscle: MuscleType.SIDE_DELT, ratio: 0.6 },
        { muscle: MuscleType.TRICEP_LONG_HEAD, ratio: 0.35 },
        { muscle: MuscleType.TRICEP_SHORT_HEAD, ratio: 0.35 },
    ],
    "Lateral Raises": [
        { muscle: MuscleType.SIDE_DELT, ratio: 1.0 },
        { muscle: MuscleType.FRONT_DELT, ratio: 0.2 },
        { muscle: MuscleType.TRAPEZIUS, ratio: 0.3 },
    ],
    "Single Arm Cable Lateral Raise": [
        { muscle: MuscleType.SIDE_DELT, ratio: 1.0 },
        { muscle: MuscleType.FRONT_DELT, ratio: 0.15 },
        { muscle: MuscleType.TRAPEZIUS, ratio: 0.2 },
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
    "Rear Delt Fly Machine": [
        { muscle: MuscleType.REAR_DELT, ratio: 1.0 },
        { muscle: MuscleType.UPPER_BACK, ratio: 0.35 },
        { muscle: MuscleType.TRAPEZIUS, ratio: 0.25 },
    ],
    // ── ABS ───────────────────────────────────
    "Crunches": [
        { muscle: MuscleType.UPPER_ABS, ratio: 1.0 },
        { muscle: MuscleType.LOWER_ABS, ratio: 0.3 },
    ],
    "Cable Ab Crunch": [
        { muscle: MuscleType.UPPER_ABS, ratio: 1.0 },
        { muscle: MuscleType.LOWER_ABS, ratio: 0.4 },
        { muscle: MuscleType.OBLIQUES, ratio: 0.3 },
    ],
    "Leg Raises": [
        { muscle: MuscleType.LOWER_ABS, ratio: 1.0 },
        { muscle: MuscleType.UPPER_ABS, ratio: 0.3 },
    ],
    "Hanging Leg Raises": [
        // Straight legs — more lower abs & hip flexor demand, grip work
        { muscle: MuscleType.LOWER_ABS, ratio: 1.0 },
        { muscle: MuscleType.UPPER_ABS, ratio: 0.4 },
        { muscle: MuscleType.OBLIQUES, ratio: 0.3 },
        { muscle: MuscleType.FOREARM, ratio: 0.2 },
    ],
    "Dragon Flags": [
        // Full core anti-extension — extremely demanding
        { muscle: MuscleType.UPPER_ABS, ratio: 1.0 },
        { muscle: MuscleType.LOWER_ABS, ratio: 1.0 },
        { muscle: MuscleType.OBLIQUES, ratio: 0.6 },
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

    // ── CHEST ─────────────────────────────────
    if (lower.includes('incline') && lower.includes('smith')) return EXERCISE_MAP["Incline Smith Machine Press"];
    if (lower.includes('incline') && lower.includes('dumbbell') && lower.includes('press')) return EXERCISE_MAP["Incline Dumbbell Press"];
    if (lower.includes('incline') && lower.includes('dumbell') && lower.includes('press')) return EXERCISE_MAP["Incline Dumbbell Press"];
    if (lower.includes('incline') && lower.includes('db') && lower.includes('press')) return EXERCISE_MAP["Incline Dumbbell Press"];
    if (lower.includes('incline') && lower.includes('curl')) return EXERCISE_MAP["Incline Curls"];
    if (lower.includes('incline') && lower.includes('bench')) return EXERCISE_MAP["Incline Bench Press"];
    if (lower.includes('incline') && lower.includes('press')) return EXERCISE_MAP["Incline Bench Press"];
    if (lower.includes('decline') && lower.includes('chest') && lower.includes('press')) return EXERCISE_MAP["Decline Chest Press"];
    if (lower.includes('decline') && lower.includes('machine')) return EXERCISE_MAP["Decline Chest Press"];
    if (lower.includes('decline') && lower.includes('bench')) return EXERCISE_MAP["Decline Bench Press"];
    if (lower.includes('decline') && lower.includes('press')) return EXERCISE_MAP["Decline Bench Press"];
    if (lower.includes('low') && lower.includes('high') && lower.includes('fl')) return EXERCISE_MAP["Low to High Cable Fly"];
    if (lower.includes('high') && lower.includes('low') && lower.includes('fl')) return EXERCISE_MAP["High to Low Cable Fly"];
    if (lower.includes('cable fl')) return EXERCISE_MAP["Cable Flyes"];
    if (lower.includes('bench')) return EXERCISE_MAP["Bench Press"];
    if (lower.includes('push-up') || lower.includes('push up') || lower.includes('pushup')) return EXERCISE_MAP["Push-ups"];
    if (lower.includes('dip')) return EXERCISE_MAP["Dips"];

    // ── BACK ──────────────────────────────────
    if (lower.includes('wide') && lower.includes('pull')) return EXERCISE_MAP["Wide Grip Pullups"];
    if (lower.includes('pull-up') || lower.includes('pull up') || lower.includes('pullup') || lower.includes('chin')) return EXERCISE_MAP["Pull-ups"];
    if (lower.includes('lat pull')) return EXERCISE_MAP["Lat Pulldown"];
    if (lower.includes('chest supported') && lower.includes('row')) return EXERCISE_MAP["Chest Supported Machine Rows"];
    if (lower.includes('low') && lower.includes('high') && lower.includes('row')) return EXERCISE_MAP["Low to High Rows"];
    if (lower.includes('high') && lower.includes('low') && lower.includes('row')) return EXERCISE_MAP["High to Low Rows"];
    if (lower.includes('seated') && lower.includes('row')) return EXERCISE_MAP["Seated Rows"];
    if (lower.includes('barbell') && lower.includes('row')) return EXERCISE_MAP["Barbell Rows"];
    if (lower.includes('45') && lower.includes('back')) return EXERCISE_MAP["Machine 45 Degree Back Extension"];
    if (lower.includes('back ext')) return EXERCISE_MAP["Machine 45 Degree Back Extension"];
    if (lower.includes('hyperext')) return EXERCISE_MAP["Machine 45 Degree Back Extension"];
    if (lower.includes('row')) return EXERCISE_MAP["Seated Rows"];

    // ── LEGS ──────────────────────────────────
    if (lower.includes('bulgarian')) return EXERCISE_MAP["Bulgarian Split Squat"];
    if (lower.includes('hack') && lower.includes('squat')) return EXERCISE_MAP["Hack Squat"];
    if (lower.includes('squat')) return EXERCISE_MAP["Squat"];
    if (lower.includes('romanian') && lower.includes('deadlift')) return EXERCISE_MAP["Romanian Deadlift"];
    if (lower.includes('rdl')) return EXERCISE_MAP["Romanian Deadlift"];
    if (lower.includes('deadlift')) return EXERCISE_MAP["Deadlift"];
    if (lower.includes('abductor')) return EXERCISE_MAP["Abductor Machine"];
    if (lower.includes('adductor')) return EXERCISE_MAP["Adductor Machine"];
    if (lower.includes('seated') && lower.includes('hamstring')) return EXERCISE_MAP["Seated Hamstring Curls"];
    if (lower.includes('hamstring') && lower.includes('curl')) return EXERCISE_MAP["Seated Hamstring Curls"];
    if (lower.includes('leg press')) return EXERCISE_MAP["Leg Press"];
    if (lower.includes('leg ext')) return EXERCISE_MAP["Leg Extensions"];
    if (lower.includes('leg curl')) return EXERCISE_MAP["Leg Curls"];
    if (lower.includes('seated') && lower.includes('calf')) return EXERCISE_MAP["Seated Calf Raises"];
    if (lower.includes('calf') || lower.includes('calves')) return EXERCISE_MAP["Calf Raises"];

    // ── BICEPS ────────────────────────────────
    if (lower.includes('bayesian')) return EXERCISE_MAP["Bayesian Curls"];
    if (lower.includes('hammer curl')) return EXERCISE_MAP["Hammer Curls"];
    if (lower.includes('preacher curl') || lower.includes('preacher bench')) return EXERCISE_MAP["Preacher Curls"];
    if (lower.includes('incline') && lower.includes('curl')) return EXERCISE_MAP["Incline Curls"];
    if (lower.includes('curl')) return EXERCISE_MAP["Bicep Curls"];

    // ── TRICEPS ───────────────────────────────
    if (lower.includes('overhead') && lower.includes('tricep')) return EXERCISE_MAP["Overhead Cable Tricep Extensions"];
    if (lower.includes('ovhead') && lower.includes('tricep')) return EXERCISE_MAP["Overhead Cable Tricep Extensions"];
    if (lower.includes('overhead') && lower.includes('ext')) return EXERCISE_MAP["Overhead Cable Tricep Extensions"];
    if (lower.includes('tricep') && lower.includes('push') && lower.includes('machine')) return EXERCISE_MAP["Tricep Pushdown Machine"];
    if (lower.includes('tricep') && lower.includes('push')) return EXERCISE_MAP["Tricep Pushdowns"];
    if (lower.includes('skull crush')) return EXERCISE_MAP["Skull Crushers"];
    if (lower.includes('tricep') && lower.includes('machine')) return EXERCISE_MAP["Tricep Pushdown Machine"];
    if (lower.includes('tricep')) return EXERCISE_MAP["Tricep Extensions"];

    // ── SHOULDERS ─────────────────────────────
    if (lower.includes('dumbbell') && lower.includes('shoulder') && lower.includes('press')) return EXERCISE_MAP["Dumbbell Shoulder Press"];
    if (lower.includes('dumbell') && lower.includes('shoulder') && lower.includes('press')) return EXERCISE_MAP["Dumbbell Shoulder Press"];
    if (lower.includes('db') && lower.includes('shoulder') && lower.includes('press')) return EXERCISE_MAP["Dumbbell Shoulder Press"];
    if (lower.includes('shoulder') && lower.includes('press')) return EXERCISE_MAP["Dumbbell Shoulder Press"];
    if (lower.includes('overhead') && lower.includes('press')) return EXERCISE_MAP["Overhead Press"];
    if (lower.includes('ohp')) return EXERCISE_MAP["Overhead Press"];
    if (lower.includes('military')) return EXERCISE_MAP["Overhead Press"];
    if (lower.includes('single') && lower.includes('lateral')) return EXERCISE_MAP["Single Arm Cable Lateral Raise"];
    if (lower.includes('cable') && lower.includes('lateral')) return EXERCISE_MAP["Single Arm Cable Lateral Raise"];
    if (lower.includes('lateral raise')) return EXERCISE_MAP["Lateral Raises"];
    if (lower.includes('front raise')) return EXERCISE_MAP["Front Raises"];
    if (lower.includes('face pull')) return EXERCISE_MAP["Face Pulls"];
    if (lower.includes('rear delt') && lower.includes('machine')) return EXERCISE_MAP["Rear Delt Fly Machine"];
    if (lower.includes('rear delt') && lower.includes('fly')) return EXERCISE_MAP["Rear Delt Fly Machine"];
    if (lower.includes('reverse fl')) return EXERCISE_MAP["Reverse Flyes"];

    // ── ABS ───────────────────────────────────
    if (lower.includes('cable') && lower.includes('crunch')) return EXERCISE_MAP["Cable Ab Crunch"];
    if (lower.includes('cable') && lower.includes('ab')) return EXERCISE_MAP["Cable Ab Crunch"];
    if (lower.includes('hanging') && lower.includes('leg')) return EXERCISE_MAP["Hanging Leg Raises"];
    if (lower.includes('dragon')) return EXERCISE_MAP["Dragon Flags"];
    if (lower.includes('crunch')) return EXERCISE_MAP["Crunches"];
    if (lower.includes('leg raise')) return EXERCISE_MAP["Leg Raises"];
    if (lower.includes('plank')) return EXERCISE_MAP["Planks"];

    // ── TRAPS ─────────────────────────────────
    if (lower.includes('shrug')) return EXERCISE_MAP["Shrugs"];

    return [];
};
