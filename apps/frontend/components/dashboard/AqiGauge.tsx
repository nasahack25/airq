"use client";

interface AqiGaugeProps {
    aqi: number;
}

const AqiGauge = ({ aqi }: AqiGaugeProps) => {
    const AQI_CATEGORIES = [
        { name: "Good", color: "#22c55e", range: [0, 50] },
        { name: "Moderate", color: "#facc15", range: [51, 100] },
        { name: "Unhealthy for SG", color: "#f97316", range: [101, 150] },
        { name: "Unhealthy", color: "#ef4444", range: [151, 200] },
        { name: "Very Unhealthy", color: "#a855f7", range: [201, 300] },
        { name: "Hazardous", color: "#7f1d1d", range: [301, 500] },
    ];
    const MAX_AQI = 300; // Cap the visual gauge at 300 for better scaling

    const percentage = Math.min(aqi / MAX_AQI, 1);
    const rotation = percentage * 180 - 90;

    return (
        <div className="relative w-full max-w-sm mx-auto flex justify-center items-center">
            <svg viewBox="0 0 100 55" className="w-full">
                {/* Gauge background arcs */}
                {AQI_CATEGORIES.map((cat, index) => {
                    const startAngle = (cat.range[0] / MAX_AQI) * 180 - 90;
                    const endAngle = (Math.min(cat.range[1], MAX_AQI) / MAX_AQI) * 180 - 90;
                    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
                    const start = {
                        x: 50 + 45 * Math.cos(startAngle * Math.PI / 180),
                        y: 50 + 45 * Math.sin(startAngle * Math.PI / 180),
                    };
                    const end = {
                        x: 50 + 45 * Math.cos(endAngle * Math.PI / 180),
                        y: 50 + 45 * Math.sin(endAngle * Math.PI / 180),
                    };
                    return (
                        <path
                            key={cat.name}
                            d={`M ${start.x} ${start.y} A 45 45 0 ${largeArcFlag} 1 ${end.x} ${end.y}`}
                            fill="none"
                            stroke={cat.color}
                            strokeWidth="10"
                        />
                    );
                })}
                {/* Needle */}
                <g transform={`rotate(${rotation} 50 50)`}>
                    <path d="M 50 50 L 50 10" stroke="white" strokeWidth="2" />
                    <circle cx="50" cy="50" r="3" fill="white" />
                </g>
            </svg>
        </div>
    );
};

export default AqiGauge;
