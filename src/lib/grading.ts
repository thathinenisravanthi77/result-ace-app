export const SUBJECTS = [
  "Telugu",
  "Hindi",
  "English",
  "Mathematics",
  "Science",
  "Social Studies",
] as const;

export type Subject = (typeof SUBJECTS)[number];
export type Marks = Record<Subject, number>;

export interface StudentInfo {
  name: string;
  rollNumber: string;
  grade: string;
  academicYear: string;
  institution: string;
}

export interface ResultSummary {
  total: number;
  maxTotal: number;
  percentage: number;
  grade: string;
  gradeColor: string;
  passed: boolean;
  failedSubjects: Subject[];
}

export const PASS_MARK = 35;
export const MAX_PER_SUBJECT = 100;

export function getGrade(pct: number): { grade: string; color: string } {
  if (pct >= 90) return { grade: "A+", color: "success" };
  if (pct >= 80) return { grade: "A", color: "success" };
  if (pct >= 70) return { grade: "B", color: "primary" };
  if (pct >= 60) return { grade: "C", color: "primary" };
  if (pct >= 50) return { grade: "D", color: "warning" };
  return { grade: "F", color: "destructive" };
}

export function calculateResult(marks: Marks): ResultSummary {
  const total = SUBJECTS.reduce((s, sub) => s + (marks[sub] || 0), 0);
  const maxTotal = SUBJECTS.length * MAX_PER_SUBJECT;
  const percentage = (total / maxTotal) * 100;
  const { grade, color } = getGrade(percentage);
  const failedSubjects = SUBJECTS.filter((s) => (marks[s] ?? 0) < PASS_MARK);
  const passed = failedSubjects.length === 0 && percentage >= 50;
  return {
    total,
    maxTotal,
    percentage: Math.round(percentage * 100) / 100,
    grade,
    gradeColor: color,
    passed,
    failedSubjects,
  };
}
