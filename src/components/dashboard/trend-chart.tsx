"use client";

import { useId } from "react";

export type TrendWeek = {
  label: string;
  date: string;
  attendance: number;
  incidents: number;
  isCurrent?: boolean;
};

const VIEW_W = 600;
const PLOT_LEFT = 40;
const PLOT_RIGHT = 590;
const PLOT_TOP = 20;
const PLOT_BOTTOM = 140;

export function TrendChart({
  weeks,
  yMin,
  yMax,
  targetValue,
}: {
  weeks: TrendWeek[];
  yMin: number;
  yMax: number;
  targetValue: number;
}) {
  const gradientId = useId();
  const step = (PLOT_RIGHT - PLOT_LEFT) / (weeks.length - 1);
  const scaleY = (value: number) =>
    PLOT_BOTTOM - ((value - yMin) / (yMax - yMin)) * (PLOT_BOTTOM - PLOT_TOP);

  const points = weeks.map((week, index) => ({
    x: PLOT_LEFT + index * step + step * 0.15,
    y: scaleY(week.attendance),
    week,
  }));

  const linePoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPoints = `${linePoints} ${points[points.length - 1].x},${PLOT_BOTTOM} ${points[0].x},${PLOT_BOTTOM}`;

  const maxIncidents = Math.max(...weeks.map((w) => w.incidents), 1);
  const incidentBarMaxHeight = 40;

  const gridLines = [PLOT_TOP, PLOT_TOP + (PLOT_BOTTOM - PLOT_TOP) / 3, PLOT_TOP + ((PLOT_BOTTOM - PLOT_TOP) * 2) / 3];
  const targetY = scaleY(targetValue);

  return (
    <div className="w-full">
      <svg
        role="img"
        aria-label="Weekly attendance and behaviour incident trend"
        className="h-48 w-full overflow-visible"
        preserveAspectRatio="none"
        viewBox={`0 0 ${VIEW_W} 160`}
      >
        {gridLines.map((y) => (
          <line
            key={y}
            x1={PLOT_LEFT}
            x2={PLOT_RIGHT}
            y1={y}
            y2={y}
            stroke="currentColor"
            strokeWidth={1}
            strokeDasharray="4 4"
            className="text-muted"
          />
        ))}
        <line x1={PLOT_LEFT} x2={PLOT_RIGHT} y1={PLOT_BOTTOM} y2={PLOT_BOTTOM} stroke="currentColor" className="text-border" />

        {[yMax, yMax - (yMax - yMin) / 3, yMax - ((yMax - yMin) * 2) / 3, yMin].map((value, index) => (
          <text key={value} x={5} y={gridLines[index] ? gridLines[index] + 4 : PLOT_BOTTOM + 4} className="fill-muted-foreground text-[10px]">
            {value.toFixed(0)}%
          </text>
        ))}

        <line
          x1={PLOT_LEFT}
          x2={PLOT_RIGHT}
          y1={targetY}
          y2={targetY}
          stroke="#B54708"
          strokeDasharray="6 3"
          strokeWidth={1.5}
        />

        {points.map((p) => {
          const barHeight = (p.week.incidents / maxIncidents) * incidentBarMaxHeight;
          return (
            <rect
              key={`bar-${p.week.label}`}
              x={p.x - 10}
              y={PLOT_BOTTOM - barHeight}
              width={20}
              height={barHeight}
              rx={3}
              className={p.week.isCurrent ? "fill-brand-tint" : "fill-muted"}
            />
          );
        })}

        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7A1621" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#7A1621" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon fill={`url(#${gradientId})`} points={areaPoints} />
        <polyline
          fill="none"
          points={linePoints}
          stroke="#7A1621"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p) => (
          <circle
            key={`dot-${p.week.label}`}
            cx={p.x}
            cy={p.y}
            r={p.week.isCurrent ? 5 : 4}
            className="fill-brand"
          />
        ))}
        <text
          x={points[points.length - 1].x - 24}
          y={points[points.length - 1].y - 12}
          className="fill-brand text-[12px] font-bold"
        >
          {weeks[weeks.length - 1].attendance.toFixed(1)}%
        </text>
      </svg>
      <div className="grid pt-2 text-center text-xs text-muted-foreground" style={{ gridTemplateColumns: `repeat(${weeks.length}, 1fr)` }}>
        {weeks.map((week) => (
          <div key={week.label} className={week.isCurrent ? "rounded bg-brand-tint/60 py-0.5" : undefined}>
            <span className={week.isCurrent ? "font-bold text-brand" : "font-medium text-foreground"}>{week.label}</span>
            <br />
            <span className={week.isCurrent ? "text-[11px] text-brand" : "text-[11px]"}>{week.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
