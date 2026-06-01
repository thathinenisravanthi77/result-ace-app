import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { SUBJECTS, type Marks, PASS_MARK } from "@/lib/grading";

interface Props {
  marks: Marks;
  percentage: number;
}

export function PercentageCircle({ percentage }: { percentage: number }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  return (
    <div className="relative h-44 w-44">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
        <defs>
          <linearGradient id="pctGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.55 0.2 260)" />
            <stop offset="100%" stopColor="oklch(0.7 0.18 290)" />
          </linearGradient>
        </defs>
        <circle cx="80" cy="80" r={radius} stroke="var(--color-muted)" strokeWidth="12" fill="none" />
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="url(#pctGrad)"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold gradient-text">{percentage.toFixed(1)}%</span>
        <span className="text-xs text-muted-foreground mt-1">Overall</span>
      </div>
    </div>
  );
}

export function SubjectBarChart({ marks }: Props) {
  const data = SUBJECTS.map((s) => ({
    subject: s.split(" ")[0],
    marks: Number.isFinite(marks[s]) ? marks[s] : 0,
  }));
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.7 0.18 290)" />
              <stop offset="100%" stopColor="oklch(0.55 0.2 260)" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="subject" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "var(--color-popover)",
              border: "1px solid var(--color-border)",
              borderRadius: "12px",
              color: "var(--color-popover-foreground)",
            }}
            cursor={{ fill: "var(--color-muted)", opacity: 0.3 }}
          />
          <Bar dataKey="marks" radius={[8, 8, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.marks < PASS_MARK ? "oklch(0.6 0.24 27)" : "url(#barGrad)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
