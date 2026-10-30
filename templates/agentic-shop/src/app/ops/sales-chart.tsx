// Net sales per day as inline SVG bars. No chart library.
type Point = { date: string; net: number };

export function SalesChart({ data, format }: { data: Point[]; format: (n: number) => string }) {
  const width = 720;
  const height = 180;
  const pad = { top: 12, right: 8, bottom: 22, left: 8 };
  const max = Math.max(1, ...data.map((d) => d.net));
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const slot = innerW / data.length;
  const barW = Math.max(2, slot * 0.7);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="Ventas netas por día, últimos 30 días">
      <line x1={pad.left} x2={width - pad.right} y1={pad.top + innerH} y2={pad.top + innerH} className="stroke-neutral-300" />
      {data.map((d, i) => {
        const h = (Math.max(0, d.net) / max) * innerH;
        const x = pad.left + i * slot + (slot - barW) / 2;
        const isLast = i === data.length - 1;
        return (
          <g key={d.date}>
            <rect x={x} y={pad.top + innerH - h} width={barW} height={h} rx={2} className={isLast ? "fill-neutral-900" : "fill-neutral-400"}>
              <title>{`${d.date}: ${format(d.net)}`}</title>
            </rect>
            {(i % 7 === 0 || isLast) && (
              <text x={x + barW / 2} y={height - 6} textAnchor="middle" className="fill-neutral-500 text-[10px]">
                {d.date.slice(5)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
