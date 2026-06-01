import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import type { StudentInfo } from "@/lib/grading";

interface Props {
  value: StudentInfo;
  onChange: (v: StudentInfo) => void;
  errors: Partial<Record<keyof StudentInfo, string>>;
}

const fields: Array<{ key: keyof StudentInfo; label: string; placeholder: string }> = [
  { key: "name", label: "Student Name", placeholder: "e.g. Sravanthi" },
  { key: "rollNumber", label: "Roll Number", placeholder: "e.g. 2025-014" },
  { key: "grade", label: "Class / Grade", placeholder: "e.g. Grade 10" },
  { key: "academicYear", label: "Academic Year", placeholder: "e.g. 2025-2026" },
  { key: "institution", label: "Institution Name", placeholder: "e.g. Rathnam School" },
];

export function StudentForm({ value, onChange, errors }: Props) {
  return (
    <Card className="glass-card p-6 md:p-8 rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Student Information</h2>
          <p className="text-sm text-muted-foreground">Tell us who this marksheet is for.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.key} className={f.key === "institution" ? "md:col-span-2" : ""}>
            <Label htmlFor={f.key} className="text-sm font-medium">
              {f.label}
            </Label>
            <Input
              id={f.key}
              value={value[f.key]}
              onChange={(e) => onChange({ ...value, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              className={`mt-1.5 h-11 rounded-xl bg-background/50 ${
                errors[f.key] ? "border-destructive ring-2 ring-destructive/30" : ""
              }`}
            />
            {errors[f.key] && (
              <p className="text-xs text-destructive mt-1">{errors[f.key]}</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
