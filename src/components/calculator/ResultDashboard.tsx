import { forwardRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, CheckCircle2, XCircle, TrendingUp } from "lucide-react";
import { SUBJECTS, type Marks, type StudentInfo, type ResultSummary, PASS_MARK, MAX_PER_SUBJECT } from "@/lib/grading";
import { PercentageCircle, SubjectBarChart } from "./PerformanceCharts";

interface Props {
  student: StudentInfo;
  marks: Marks;
  result: ResultSummary;
}

const gradeStyles: Record<string, string> = {
  success: "bg-success text-success-foreground",
  primary: "bg-gradient-primary text-primary-foreground",
  warning: "bg-warning text-warning-foreground",
  destructive: "bg-destructive text-destructive-foreground",
};

export const ResultDashboard = forwardRef<HTMLDivElement, Props>(({ student, marks, result }, ref) => {
  return (
    <div ref={ref} className="space-y-6 animate-[fade-in_0.5s_ease-out]">
      {/* Marksheet header */}
      <Card className="glass-card rounded-2xl overflow-hidden">
        <div className="bg-gradient-hero p-6 md:p-8 text-primary-foreground">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest opacity-80">Official Marksheet</p>
              <h2 className="text-2xl md:text-3xl font-bold mt-1">{student.institution || "—"}</h2>
              <p className="text-sm opacity-90 mt-1">Academic Year {student.academicYear || "—"}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-widest opacity-80">Grade</p>
              <div className="text-5xl font-bold mt-1">{result.grade}</div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoCell label="Student" value={student.name || "—"} />
          <InfoCell label="Roll No." value={student.rollNumber || "—"} />
          <InfoCell label="Class" value={student.grade || "—"} />
          <InfoCell label="Status">
            {result.passed ? (
              <Badge className="bg-success text-success-foreground gap-1 px-3 py-1 rounded-full">
                <CheckCircle2 className="h-3.5 w-3.5" /> Passed
              </Badge>
            ) : (
              <Badge className="bg-destructive text-destructive-foreground gap-1 px-3 py-1 rounded-full">
                <XCircle className="h-3.5 w-3.5" /> Failed
              </Badge>
            )}
          </InfoCell>
        </div>
      </Card>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Percentage</p>
          <PercentageCircle percentage={result.percentage} />
        </Card>

        <Card className="glass-card rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Subject Performance</p>
              <h3 className="text-lg font-semibold">Marks Distribution</h3>
            </div>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <SubjectBarChart marks={marks} percentage={result.percentage} />
        </Card>
      </div>

      {/* Marks table */}
      <Card className="glass-card rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Subject-wise Marks</h3>
          </div>
          <Badge className={`${gradeStyles[result.gradeColor]} px-3 py-1 rounded-full`}>
            Grade {result.grade}
          </Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="py-3 px-2">Subject</th>
                <th className="py-3 px-2 text-right">Marks</th>
                <th className="py-3 px-2 text-right">Max</th>
                <th className="py-3 px-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {SUBJECTS.map((s) => {
                const m = Number.isFinite(marks[s]) ? marks[s] : 0;
                const passed = m >= PASS_MARK;
                return (
                  <tr key={s} className="border-b border-border/50 hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-2 font-medium">{s}</td>
                    <td className="py-3 px-2 text-right font-semibold tabular-nums">{m}</td>
                    <td className="py-3 px-2 text-right text-muted-foreground tabular-nums">{MAX_PER_SUBJECT}</td>
                    <td className="py-3 px-2 text-right">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          passed
                            ? "bg-success/15 text-success"
                            : "bg-destructive/15 text-destructive"
                        }`}
                      >
                        {passed ? "Pass" : "Fail"}
                      </span>
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-muted/40">
                <td className="py-3 px-2 font-bold">Total</td>
                <td className="py-3 px-2 text-right font-bold tabular-nums">{result.total}</td>
                <td className="py-3 px-2 text-right text-muted-foreground tabular-nums">{result.maxTotal}</td>
                <td className="py-3 px-2 text-right font-bold tabular-nums">{result.percentage}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
});
ResultDashboard.displayName = "ResultDashboard";

function InfoCell({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <div className="mt-1 font-semibold">{children ?? value}</div>
    </div>
  );
}
