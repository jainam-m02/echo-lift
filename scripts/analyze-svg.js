
const fs = require('fs');
const path = require('path');

// Read the temp file
const inputPath = path.join(__dirname, '../src/lib/temp-svg-input.tsx');
const content = fs.readFileSync(inputPath, 'utf8');

// Extract SVG content from the backticks
const svgMatch = content.match(/export const rawSVG = `([\s\S]*)`;/);
if (!svgMatch) {
    console.error("Could not find SVG content");
    process.exit(1);
}
const svg = svgMatch[1];

// Extract paths
const paths = [];
const regex = /d="([^"]+)"/g;
let match;
while ((match = regex.exec(svg)) !== null) {
    paths.push(match[1]);
}

console.log(`Found ${paths.length} paths.`);

// Helper to get centroid
const getCentroid = (d, index) => {
    // Extract all numbers
    const nums = d.match(/-?\d+(\.\d+)?/g).map(Number);
    let xSum = 0, ySum = 0, count = 0;

    // SVG path commands often come in pairs, but not always. 
    // We'll just average all X-like and Y-like numbers roughly.
    // A better way is to parse "M x y" and "L x y".
    // For this specific SVG (MuscleWiki style), it seems to be absolute coordinates often?
    // Let's look at the first few. "M1608 4139" -> x=1608, y=4139.

    // Simple parser for M and L commands which dominate
    const pointRegex = /[ML] ?(-?\d+) (-?\d+)/g;
    let pMatch;
    while ((pMatch = pointRegex.exec(d)) !== null) {
        xSum += parseFloat(pMatch[1]);
        ySum += parseFloat(pMatch[2]);
        count++;
    }

    if (count === 0) return { x: 0, y: 0, i: index };
    return { x: xSum / count, y: ySum / count, i: index };
};

const centroids = paths.map((p, i) => getCentroid(p, i));

// Analyze bounds
const minX = Math.min(...centroids.map(c => c.x));
const maxX = Math.max(...centroids.map(c => c.x));
const minY = Math.min(...centroids.map(c => c.y));
const maxY = Math.max(...centroids.map(c => c.y));

console.log(`Bounds: X[${minX}-${maxX}], Y[${minY}-${maxY}]`);

// Heuristic Grouping
// Center X is approx (minX + maxX) / 2
const centerX = (minX + maxX) / 2;
// In this SVG, Y increases upwards? No, standard SVG Y is down. 
// But the transform was scale(0.1, -0.1), so coordinate system Y is UP.
// "M1608 4139" -> 4139 is Top.

const groups = {
    leftArm: [],
    rightArm: [],
    chest: [],
    legs: [],
    abs: [],
    head: []
};

centroids.forEach(c => {
    // Normalize X (-1 to 1)
    const nX = (c.x - centerX) / (maxX - minX) * 2;
    // Normalize Y (0 to 1, 1 is top)
    const nY = (c.y - minY) / (maxY - minY);

    if (nY > 0.85) groups.head.push(c.i);
    else if (nY > 0.6 && Math.abs(nX) < 0.3) groups.chest.push(c.i);
    else if (nY > 0.4 && nY <= 0.6 && Math.abs(nX) < 0.3) groups.abs.push(c.i);
    else if (nY < 0.45 && Math.abs(nX) < 0.4) groups.legs.push(c.i);
    else if (nX < -0.3 && nY > 0.4) groups.leftArm.push(c.i); // Viewers Left (Right Arm)
    else if (nX > 0.3 && nY > 0.4) groups.rightArm.push(c.i); // Viewers Right (Left Arm)
    else console.log(`Unclassified: ID ${c.i} at ${nX.toFixed(2)}, ${nY.toFixed(2)}`);
});

console.log("--- GROUPS ---");
console.log("Head/Neck:", groups.head);
console.log("Chest/UpperBack:", groups.chest);
console.log("Abs/LowerBack:", groups.abs);
console.log("Legs:", groups.legs);
console.log("Left Arm (Viewer):", groups.leftArm);
console.log("Right Arm (Viewer):", groups.rightArm);
