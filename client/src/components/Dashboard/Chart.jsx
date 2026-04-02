/**
 * Chart
 * Lightweight bar/line chart built with pure SVG — no extra dependencies.
 * Suitable for dashboard stats (shipment counts, bookings per day, etc.)
 *
 * @prop {Array}  data    - [{ label: string, value: number }]
 * @prop {string} type    - 'bar' | 'line'
 * @prop {string} title
 * @prop {string} color   - tailwind color token used for fill, e.g. 'teal'
 * @prop {string} unit    - appended to tooltip values e.g. 'kg'
 */
export function Chart({ data = [], type = 'bar', title, color = 'teal', unit = '' }) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-300 text-sm">
        No data to display
      </div>
    );
  }

  const W = 300;
  const H = 120;
  const PAD = { top: 10, right: 10, bottom: 28, left: 30 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const barW = innerW / data.length;

  const colorMap = {
    teal: '#0d9488',
    amber: '#f59e0b',
    blue: '#3b82f6',
    green: '#10b981',
    red: '#ef4444',
  };
  const fill = colorMap[color] || colorMap.teal;

  const toX = (i) => PAD.left + i * barW + barW / 2;
  const toY = (v) => PAD.top + innerH - (v / maxVal) * innerH;

  const linePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(d.value)}`)
    .join(' ');

  return (
    <div className="space-y-1">
      {title && <p className="text-xs font-semibold text-gray-600">{title}</p>}

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label={title}>
        {/* Y-axis gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
          const y = PAD.top + innerH * (1 - frac);
          return (
            <g key={frac}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="#f3f4f6" strokeWidth="1" />
              <text x={PAD.left - 4} y={y + 4} fontSize="7" textAnchor="end" fill="#9ca3af">
                {Math.round(maxVal * frac)}
              </text>
            </g>
          );
        })}

        {type === 'bar' &&
          data.map((d, i) => (
            <g key={i}>
              <rect
                x={PAD.left + i * barW + barW * 0.15}
                y={toY(d.value)}
                width={barW * 0.7}
                height={innerH - (toY(d.value) - PAD.top)}
                rx="3"
                fill={fill}
                fillOpacity="0.85"
              >
                <title>{d.label}: {d.value}{unit}</title>
              </rect>
              <text x={toX(i)} y={H - 6} fontSize="7" textAnchor="middle" fill="#9ca3af">
                {d.label.length > 4 ? d.label.slice(0, 4) : d.label}
              </text>
            </g>
          ))}

        {type === 'line' && (
          <>
            <path d={linePath} fill="none" stroke={fill} strokeWidth="2" strokeLinejoin="round" />
            {data.map((d, i) => (
              <g key={i}>
                <circle cx={toX(i)} cy={toY(d.value)} r="3" fill={fill}>
                  <title>{d.label}: {d.value}{unit}</title>
                </circle>
                <text x={toX(i)} y={H - 6} fontSize="7" textAnchor="middle" fill="#9ca3af">
                  {d.label.length > 4 ? d.label.slice(0, 4) : d.label}
                </text>
              </g>
            ))}
          </>
        )}
      </svg>
    </div>
  );
}
