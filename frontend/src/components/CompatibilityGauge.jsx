import { useEffect, useState } from "react";

const getGaugeState = (score) => {
  const normalizedScore = Math.min(100, Math.max(0, Number(score) || 0));

  if (normalizedScore >= 90) return { color: "#16a34a", label: "Excellent Match" };
  if (normalizedScore >= 75) return { color: "#eab308", label: "Good Match" };
  if (normalizedScore >= 50) return { color: "#f97316", label: "Moderate Match" };
  return { color: "#dc2626", label: "Poor Match" };
};

export default function CompatibilityGauge({ score = 0 }) {
  const normalizedScore = Math.min(100, Math.max(0, Number(score) || 0));
  const { color, label } = getGaugeState(normalizedScore);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => setAnimatedScore(normalizedScore));
    return () => window.cancelAnimationFrame(animationFrame);
  }, [normalizedScore]);

  return (
    <div className="compatibility-gauge" role="img" aria-label={`Compatibility score ${normalizedScore} out of 100, ${label}`}>
      <svg className="compatibility-gauge-svg" viewBox="0 0 120 120" aria-hidden="true">
        <circle className="compatibility-gauge-track" cx="60" cy="60" r="50" pathLength="100" />
        <circle
          className="compatibility-gauge-progress"
          cx="60"
          cy="60"
          r="50"
          pathLength="100"
          stroke={color}
          strokeDasharray={`${animatedScore} ${100 - animatedScore}`}
        />
      </svg>
      <div className="compatibility-gauge-value">
        <strong>{normalizedScore}</strong>
        <span>/100</span>
      </div>
      <span className="compatibility-gauge-label" style={{ color }}>{label}</span>
      <span className="sr-only">Score: {normalizedScore} out of 100. Rating: {label}.</span>
    </div>
  );
}
