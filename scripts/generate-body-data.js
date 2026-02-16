
const fs = require('fs');
const path = require('path');

// Read the temp file
const inputPath = path.join(__dirname, '../src/lib/temp-svg-input.tsx');
const content = fs.readFileSync(inputPath, 'utf8');
const svgMatch = content.match(/export const rawSVG = `([\s\S]*)`;/);
if (!svgMatch) process.exit(1);
const svg = svgMatch[1];

const paths = [];
const regex = /d="([^"]+)"/g;
let match;
while ((match = regex.exec(svg)) !== null) {
    paths.push(match[1]);
}

const getCentroid = (d) => {
    const pointRegex = /[ML] ?(-?\d+) (-?\d+)/g;
    let pMatch;
    let xSum = 0, ySum = 0, count = 0;
    while ((pMatch = pointRegex.exec(d)) !== null) {
        xSum += parseFloat(pMatch[1]);
        ySum += parseFloat(pMatch[2]);
        count++;
    }
    return count === 0 ? { x: 0, y: 0 } : { x: xSum / count, y: ySum / count };
};

const muscleMap = [];
const SPLIT_X = 3300; // Guessing mid point for Front/Back

paths.forEach((d, i) => {
    const c = getCentroid(d);
    let type = 'unknown';

    if (c.x < SPLIT_X) {
        // FRONT VIEW
        if (c.y > 3600) type = 'head';
        else if (c.y > 3000) {
            if (c.x < 1200 || c.x > 2100) type = 'front-deltoids';
            else type = 'chest';
        }
        else if (c.y > 2500) {
            if (c.x < 1200 || c.x > 2100) type = 'biceps';
            else type = 'abs';
        }
        else if (c.y > 1800) {
            if (c.x < 1000 || c.x > 2300) type = 'forearm';
            else type = 'abs';
        }
        else if (c.y > 1000) type = 'quadriceps';
        else type = 'calves';

    } else {
        // BACK VIEW
        if (c.y > 3400) type = 'trapezius';
        else if (c.y > 2800) {
            if (c.x < 4200 || c.x > 5300) type = 'back-deltoids';
            else type = 'upper-back';
        }
        else if (c.y > 2300) {
            if (c.x < 4000 || c.x > 5500) type = 'triceps';
            else type = 'lower-back'; // or Lats
        }
        else if (c.y > 1900) {
            if (c.x < 4000 || c.x > 5500) type = 'forearm';
            else type = 'gluteal';
        }
        else if (c.y > 1000) type = 'hamstring';
        else type = 'calves';
    }

    // Filter out head/neck if requested by user previously? 
    // User said "Head, Neck, Knees are not muscle groups". 
    // We will map 'head' to a dummy or just exclude. 
    // Let's keep data but allow component to ignore 'head'.

    // Correction for specific requested muscles:
    if (type === 'upper-back' && c.y < 2800) type = 'lats'; // Simple heuristic

    muscleMap.push({
        muscle: type,
        svgPoints: [d] // We use the raw Path d string here. The interface expects string[] but usually these are points. 
        // Wait, existing code used Polygon points? 
        // No, existing code used `d` path strings in the example I saw earlier?
        // Let's check `body-data.ts` format again.
        // It was objects with `svgPoints: string[]`.
        // The component probably iterates them and creates <polygon> or <path>.
        // Check `node_modules/react-body-highlighter/src/assets/index.ts` content I viewed.
        // It usually takes polygon points. 
        // BUT `react-body-highlighter` expects POINTS for polygons.
        // IF these are PATH strings (M... L...), we might need to change the Component to use <path d={...}> instead of <polygon points={...}>.
        // Refactoring `HumanBody.tsx` to accept Paths is easier than converting Paths to Polygons.
    });
});

// Output format
const output = `
import { MuscleType } from './body-data'; // We will circular ref or just redefine types? Best to use separate file.
// Actually let's just make this the main file.

export const MuscleType = {
  TRAPEZIUS: 'trapezius',
  UPPER_BACK: 'upper-back',
  LOWER_BACK: 'lower-back',
  CHEST: 'chest',
  BICEPS: 'biceps',
  TRICEPS: 'triceps',
  FOREARM: 'forearm',
  BACK_DELTOIDS: 'back-deltoids',
  FRONT_DELTOIDS: 'front-deltoids',
  ABS: 'abs',
  OBLIQUES: 'obliques',
  ABDUCTOR: 'adductor',
  ABDUCTORS: 'abductors',
  HAMSTRING: 'hamstring',
  QUADRICEPS: 'quadriceps',
  CALVES: 'calves',
  GLUTEAL: 'gluteal',
  LATS: 'lats',
  HEAD: 'head', // Maps to nothing visible maybe
} as const;

export type Muscle = typeof MuscleType[keyof typeof MuscleType];

export interface ISVGModelData {
  muscle: Muscle | string;
  path: string; // Changed from svgPoints to path for valid SVG d attribute
}

export const anteriorData: ISVGModelData[] = ${JSON.stringify(muscleMap.filter(m => getCentroid(m.svgPoints[0]).x < SPLIT_X).map(m => ({ muscle: m.muscle, path: m.svgPoints[0] })), null, 2)};

export const posteriorData: ISVGModelData[] = ${JSON.stringify(muscleMap.filter(m => getCentroid(m.svgPoints[0]).x >= SPLIT_X).map(m => ({ muscle: m.muscle, path: m.svgPoints[0] })), null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/lib/body-data.ts'), output);
console.log("Generated body-data.ts");
