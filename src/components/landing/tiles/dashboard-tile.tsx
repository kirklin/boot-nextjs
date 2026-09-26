import { useTranslations } from "next-intl";
import { BentoTile, Scene } from "~/components/landing/bento";
import { glass } from "~/components/landing/glass";
import { cn } from "~/lib/utils";

// Daily AI tokens (thousands) over the last 30 days.
const USAGE = [18, 21, 19, 24, 22, 26, 25, 23, 27, 30, 28, 26, 31, 33, 29, 32, 35, 31, 34, 37, 36, 33, 38, 41, 39, 37, 42, 45, 43, 47];
const CHART = { width: 400, height: 160 };
const MARKER = 23;

/** Smooth path through the points: Catmull-Rom segments as cubic Béziers. */
function smoothPath(points: [number, number][]) {
  return points.reduce((path, [x, y], i) => {
    if (i === 0) {
      return `M${x},${y}`;
    }
    const [x0, y0] = points[i - 2] ?? points[i - 1];
    const [x1, y1] = points[i - 1];
    const [x3, y3] = points[i + 1] ?? [x, y];
    return `${path} C${x1 + (x - x0) / 6},${y1 + (y - y0) / 6} ${x - (x3 - x1) / 6},${y - (y3 - y1) / 6} ${x},${y}`;
  }, "");
}

export function DashboardTile() {
  const t = useTranslations("HomeFeatures.dashboard");
  const max = Math.max(...USAGE) * 1.1;
  const points = USAGE.map((value, i): [number, number] => [
    (i / (USAGE.length - 1)) * CHART.width,
    CHART.height - (value / max) * CHART.height,
  ]);
  const line = smoothPath(points);
  const [markerX, markerY] = points[MARKER];
  const marker = { left: `${(markerX / CHART.width) * 100}%`, top: `${(markerY / CHART.height) * 100}%` };

  return (
    <BentoTile id="dashboard" eyebrow={t("eyebrow")} title={t("title")} description={t("description")}>
      <Scene className="bg-[#f5f6f9]">
        <div aria-hidden className="relative flex flex-1 flex-col p-6">
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div>
              <p className="text-[13px] font-medium text-muted-foreground">{t("tokens")}</p>
              <p className="mt-1 flex items-baseline gap-1.5">
                <span className="text-5xl font-semibold tracking-[-0.045em] tabular-nums">764k</span>
                <span className="text-[15px] font-medium text-muted-foreground">/ 1M</span>
              </p>
              <p className="mt-1 text-[13px] font-medium text-[#1a7f37] dark:text-[#34c759]">↑ 18%</p>
            </div>
            <p className={cn(glass, "flex rounded-full p-1 text-[12px] font-medium text-foreground/60")}>
              <span className="px-2.5 py-1">7D</span>
              <span className="rounded-full bg-white px-2.5 py-1 text-zinc-900 shadow-[0_1px_3px_rgb(0_0_0/0.12)] dark:bg-white/20 dark:text-white">30D</span>
              <span className="px-2.5 py-1">90D</span>
            </p>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-[58%] text-brand">
            <svg viewBox={`0 0 ${CHART.width} ${CHART.height}`} preserveAspectRatio="none" className="size-full overflow-visible">
              <defs>
                <linearGradient id="dashboard-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`${line} L${CHART.width},${CHART.height} L0,${CHART.height} Z`} fill="url(#dashboard-fill)" />
              <path d={line} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
            <span style={marker} className="absolute size-3 -translate-1/2 rounded-full border-[2.5px] border-white bg-brand shadow-md dark:border-black" />
            <span style={marker} className={cn(glass, "absolute -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded-full px-3 py-1 text-[12px] font-semibold whitespace-nowrap text-foreground tabular-nums")}>
              41.2k
            </span>
          </div>
        </div>
      </Scene>
    </BentoTile>
  );
}
