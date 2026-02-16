
"use client";

import { rawSVG } from '@/lib/temp-svg-input';
import { useEffect, useState } from 'react';

// Simple regex to extract d attribute from paths
const extractPaths = (svgString: string) => {
    const paths: string[] = [];
    const regex = /d="([^"]+)"/g;
    let match;
    while ((match = regex.exec(svgString)) !== null) {
        paths.push(match[1]);
    }
    return paths;
};

export default function DebugSVG() {
    const [paths, setPaths] = useState<string[]>([]);

    useEffect(() => {
        setPaths(extractPaths(rawSVG));
    }, []);

    // Helper to estimate center of a path for text placement
    const getCentroid = (d: string) => {
        // Very rough approximation: average of first few coordinates
        const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number).filter(n => !isNaN(n));
        if (!nums || nums.length < 4) return { x: 0, y: 0 };

        // Take a sample of points to find average X and Y
        let xSum = 0, ySum = 0, count = 0;
        for (let i = 0; i < Math.min(nums.length, 40); i += 2) {
            xSum += nums[i];
            ySum += nums[i + 1];
            count++;
        }
        return { x: xSum / count, y: ySum / count };
    };

    return (
        <div className="w-full h-screen bg-neutral-900 overflow-auto p-10">
            <h1 className="text-white mb-4">SVG Path Debugger (Hover to find ID)</h1>
            <svg
                viewBox="0 0 6000 4500"
                className="w-full h-full border border-white"
                style={{ transform: "scale(1, -1)" }} // Flip Y as per original SVG transform
            >
                {/* Original transform from user SVG: transform="translate(0.000000,422.000000) scale(0.100000,-0.100000)" 
                   We need to replicate this coordinate space.
                   The input SVG viewbox is 600x422.
                   The paths seem to be in a 6000x4000 coordinate space (scaled by 0.1).
               */}
                <g transform="scale(1, -1) translate(0, -4220)">
                    {paths.map((d, i) => {
                        const center = getCentroid(d);
                        return (
                            <g key={i} className="hover:opacity-50 transition-opacity">
                                <path
                                    d={d}
                                    fill="#374151"
                                    stroke="white"
                                    strokeWidth="5"
                                />
                                {/* Text needs to be un-flipped to be readable if we flip the group */}
                                <text
                                    x={center.x}
                                    y={center.y}
                                    fill="red"
                                    fontSize="120"
                                    transform={`scale(1, -1)`} // Flip text back up? No, complex.
                                // Let's just render visuals first.
                                >
                                    {i}
                                </text>
                            </g>
                        );
                    })}
                </g>
            </svg>

            <div className="fixed top-0 right-0 bg-black text-xs text-green-400 p-4 h-full overflow-y-auto w-48">
                {paths.map((_, i) => (
                    <div key={i}>Path {i}</div>
                ))}
            </div>
        </div>
    );
}
