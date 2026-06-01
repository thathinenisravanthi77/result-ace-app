import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { BookOpen, Calculator, Microscope, Globe2, Languages } from "lucide-react";
import { SUBJECTS, type Marks, type Subject } from "@/lib/grading";

interface Props {
  value: Marks;
  onChange: (v: Marks) => void;
  errors: Partial<Record<Subject, string>>;
}

const ICONS: Record<Subject, React.ComponentType<{ className?: string }>> = {
  "Telugu": Languages,
  "Hindi": Languages,
  English: BookOpen,
  Mathematics: Calculator,
  Science: Microscope,
  "Social Studies": Globe2,
};

export function MarksForm({ value, onChange, errors }: Props) {
  return (
    <Card className="glass-card p-6 md:p-8 rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <Calculator className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Subject Marks</h2>
          <p className="text-sm text-muted-foreground">Enter marks out of 100 for each subject.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SUBJECTS.map((sub) => {
          const Icon = ICONS[sub];
          const err = errors[sub];
          return (
            <div key={sub}>
              <Label htmlFor={sub} className="text-sm font-medium flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                {sub}
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id={sub}
                  type="number"
                  min={0}
                  max={100}
                  value={Number.isNaN(value[sub]) ? "" : value[sub]}
                  onChange={(e) => {
                    const v = e.target.value === "" ? NaN : Number(e.target.value);
                    onChange({ ...value, [sub]: v });
                  }}
                  placeholder="0 - 100"
                  className={`h-11 rounded-xl bg-background/50 pr-14 ${
                    err ? "border-destructive ring-2 ring-destructive/30" : ""
                  }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                  / 100
                </span>
              </div>
              {err && <p className="text-xs text-destructive mt-1">{err}</p>}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
