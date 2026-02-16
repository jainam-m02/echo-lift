
"use client";

import React, { useState } from 'react';
import { anteriorData, posteriorData } from '@/lib/body-data';

interface HumanBodyProps {
    muscleVolumes?: Record<string, number>;
    className?: string;
    onClick?: (muscle: string) => void;
}

const HumanBody: React.FC<HumanBodyProps> = ({
    muscleVolumes = {},
    className = "",
    onClick
}) => {
    const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);

    // Helper to determine color based on volume
    // Thresholds: 1-5 Low, 5-12 Moderate, 12-18 Optimal
    const getMuscleColor = (muscle: string) => {
        const volume = muscleVolumes[muscle] || 0;
        const isHovered = hoveredMuscle === muscle;

        // Base colors
        let fill = "#374151"; // Default gray-700 (untrained)

        if (volume > 0) {
            if (volume >= 12) fill = "#22c55e"; // Green-500 (Optimal: 12-18 sets)
            else if (volume >= 5) fill = "#eab308"; // Yellow-500 (Moderate: 5-12 sets)
            else fill = "#ef4444"; // Red-500 (Low: 1-5 sets)
        }

        // Hover effect (lighten slightly)
        if (isHovered) {
            if (volume > 0) {
                if (volume >= 12) return "#4ade80"; // Green-400
                if (volume >= 5) return "#facc15"; // Yellow-400
                return "#f87171"; // Red-400
            }
            return "#4b5563"; // Gray-600 for hover if inactive
        }

        return fill;
    };

    // Background color used for gap strokes between muscles
    const BG_COLOR = "#0c0c14";

    // Non-muscle structural parts — always neutral, no hover/tooltip
    const STRUCTURAL_PARTS = new Set(['head', 'knees', 'neck', 'left-soleus', 'right-soleus']);

    const renderMuscles = (data: typeof anteriorData) => {
        return data.map((item, index) => {
            const muscleKey = item.muscle as string;
            const isStructural = STRUCTURAL_PARTS.has(muscleKey);

            if (isStructural) {
                // Static rendering — no hover, no color change, no tooltip
                return (
                    <g key={`${muscleKey}-${index}`}>
                        {item.svgPoints.map((points, pIndex) => (
                            <polygon
                                key={pIndex}
                                points={points}
                                fill="#2a2a35"
                                stroke={BG_COLOR}
                                strokeWidth="1.2"
                                strokeLinejoin="round"
                            />
                        ))}
                    </g>
                );
            }

            const color = getMuscleColor(muscleKey);
            const isHovered = hoveredMuscle === muscleKey;

            return (
                <g
                    key={`${muscleKey}-${index}`}
                    onMouseEnter={() => setHoveredMuscle(muscleKey)}
                    onMouseLeave={() => setHoveredMuscle(null)}
                    onClick={() => onClick && onClick(muscleKey)}
                    className="cursor-pointer"
                    style={{ transition: 'opacity 0.15s ease' }}
                >
                    {item.svgPoints.map((points, pIndex) => (
                        <polygon
                            key={pIndex}
                            points={points}
                            fill={color}
                            stroke={isHovered ? "#ffffff" : BG_COLOR}
                            strokeWidth={isHovered ? "1.0" : "1.5"}
                            strokeLinejoin="round"
                        />
                    ))}
                </g>
            );
        });
    };

    // Format muscle name for display
    const formatMuscle = (muscle: string) => {
        return muscle.replace(/-/g, ' ');
    };

    return (
        <div className={`flex gap-12 justify-center items-start ${className}`}>
            {/* Anterior (Front) */}
            <div className="relative">
                <h3 className="text-center text-sm font-mono text-muted-foreground mb-2">FRONT</h3>
                <svg viewBox="0 0 100 220" className="h-[500px] w-auto">
                    {renderMuscles(anteriorData)}
                </svg>

                {/* Tooltip Overlay */}
                {hoveredMuscle && anteriorData.some(m => m.muscle === hoveredMuscle) && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-black/90 text-white px-3 py-1.5 rounded-md text-xs whitespace-nowrap z-10 border border-white/20 shadow-lg backdrop-blur-sm">
                        <span className="font-bold capitalize">{formatMuscle(hoveredMuscle)}</span>
                        <br />
                        <span className="text-gray-300">{muscleVolumes[hoveredMuscle] || 0} Sets</span>
                    </div>
                )}
            </div>

            {/* Posterior (Back) */}
            <div className="relative">
                <h3 className="text-center text-sm font-mono text-muted-foreground mb-2">BACK</h3>
                <svg viewBox="0 0 100 220" className="h-[500px] w-auto">
                    {renderMuscles(posteriorData)}
                </svg>

                {/* Tooltip Overlay */}
                {hoveredMuscle && posteriorData.some(m => m.muscle === hoveredMuscle) && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-black/90 text-white px-3 py-1.5 rounded-md text-xs whitespace-nowrap z-10 border border-white/20 shadow-lg backdrop-blur-sm">
                        <span className="font-bold capitalize">{formatMuscle(hoveredMuscle)}</span>
                        <br />
                        <span className="text-gray-300">{muscleVolumes[hoveredMuscle] || 0} Sets</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HumanBody;
