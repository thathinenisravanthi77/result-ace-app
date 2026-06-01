import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw, Printer, Download, FileCheck2 } from "lucide-react";
import { StudentForm } from "@/components/calculator/StudentForm";
import { MarksForm } from "@/components/calculator/MarksForm";
import { ResultDashboard } from "@/components/calculator/ResultDashboard";
import { ThemeToggle } from "@/components/calculator/ThemeToggle";
import {
  SUBJECTS,
  calculateResult,
  type Marks,
  type StudentInfo,
  type Subject,
} from "@/lib/grading";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Student Result Calculator Pro — Instant Marksheets" },
      {
        name: "description",
        content:
          "Generate professional student marksheets with grades, percentages, charts, and downloadable PDFs in seconds.",
      },
      { property: "og:title", content: "Student Result Calculator Pro" },
      {
        property: "og:description",
        content: "Modern educational dashboard for calculating and sharing student results.",
      },
    ],
  }),
  component: Index,
});

const emptyStudent: StudentInfo = {
  name: "",
  rollNumber: "",
  grade: "",
  academicYear: "",
  institution: "",
};

const emptyMarks: Marks = SUBJECTS.reduce(
  (acc, s) => ({ ...acc, [s]: NaN }),
  {} as Marks
);

const STORAGE_KEY = "srcp:last-result";

function Index() {
  const [student, setStudent] = useState<StudentInfo>(emptyStudent);
  const [marks, setMarks] = useState<Marks>(emptyMarks);
  const [studentErrors, setStudentErrors] = useState<Partial<Record<keyof StudentInfo, string>>>({});
  const [marksErrors, setMarksErrors] = useState<Partial<Record<Subject, string>>>({});
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.student && saved.marks) {
          setStudent(saved.student);
          setMarks(saved.marks);
          setShowResult(true);
        }
      }
    } catch {}
  }, []);

  const result = useMemo(() => calculateResult(marks), [marks]);

  const validate = () => {
    const sErr: Partial<Record<keyof StudentInfo, string>> = {};
    (Object.keys(emptyStudent) as Array<keyof StudentInfo>).forEach((k) => {
      if (!student[k].trim()) sErr[k] = "Required";
    });
    const mErr: Partial<Record<Subject, string>> = {};
    SUBJECTS.forEach((s) => {
      const v = marks[s];
      if (v === undefined || Number.isNaN(v)) mErr[s] = "Enter marks";
      else if (v < 0 || v > 100) mErr[s] = "Must be 0–100";
    });
    setStudentErrors(sErr);
    setMarksErrors(mErr);
    return Object.keys(sErr).length === 0 && Object.keys(mErr).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setLoading(true);
    setShowResult(false);
    setTimeout(() => {
      setShowResult(true);
      setLoading(false);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ student, marks }));
      toast.success(`Result generated — Grade ${calculateResult(marks).grade}`);
      setTimeout(() => {
        dashboardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 600);
  };

  const handleReset = () => {
    setStudent(emptyStudent);
    setMarks(emptyMarks);
    setStudentErrors({});
    setMarksErrors({});
    setShowResult(false);
    localStorage.removeItem(STORAGE_KEY);
    toast("Form cleared");
  };

  const handlePrint = () => window.print();

  const handleDownloadPdf = async () => {
    if (!dashboardRef.current) return;
    toast.loading("Generating PDF…", { id: "pdf" });
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        backgroundColor: getComputedStyle(document.body).backgroundColor,
        useCORS: true,
      });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = pdf.internal.pageSize.getWidth();
      const imgH = (canvas.height * pageW) / canvas.width;
      pdf.addImage(img, "PNG", 0, 0, pageW, imgH);
      pdf.save(`${student.name || "marksheet"}-result.pdf`);
      toast.success("PDF downloaded", { id: "pdf" });
    } catch (e) {
      toast.error("Could not generate PDF", { id: "pdf" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" richColors />

      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,oklch(1_0_0/0.15),transparent_50%),radial-gradient(circle_at_80%_30%,oklch(1_0_0/0.1),transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-4 md:px-8 pt-6 pb-16 md:pt-8 md:pb-24 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-primary-foreground/15 backdrop-blur flex items-center justify-center">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <span className="font-semibold tracking-tight">ResultCalculation Pro</span>
            </div>
            <ThemeToggle />
          </div>

          <div className="mt-12 md:mt-16 max-w-2xl animate-[fade-in_0.6s_ease-out]">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 backdrop-blur px-3 py-1 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" /> Beautiful marksheets in seconds
            </div>
            <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Student Result <br className="hidden md:block" />
              <span className="opacity-90">Calculator Pro</span>
            </h1>
            <p className="mt-4 text-base md:text-lg opacity-90 max-w-xl">
              Enter marks, get instant grades, percentages, and a polished digital marksheet
              you can print or download as PDF.
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 -mt-10 md:-mt-16 pb-24 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StudentForm value={student} onChange={setStudent} errors={studentErrors} />
          <MarksForm value={marks} onChange={setMarks} errors={marksErrors} />
        </div>

        <div className="flex flex-wrap gap-3 justify-center print:hidden">
          <Button
            size="lg"
            onClick={handleCalculate}
            disabled={loading}
            className="bg-gradient-primary text-primary-foreground hover:opacity-95 shadow-elegant rounded-xl px-8 h-12 font-semibold"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 mr-2 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                Calculating…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Result
              </>
            )}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleReset}
            className="rounded-xl h-12 px-6 glass-card"
          >
            <RotateCcw className="h-4 w-4 mr-2" /> Reset
          </Button>
        </div>

        {showResult && (
          <section id="result" className="pt-6 space-y-4 animate-[slide-up_0.5s_ease-out]">
            <ResultDashboard ref={dashboardRef} student={student} marks={marks} result={result} />

            <div className="flex flex-wrap gap-3 justify-center print:hidden">
              <Button
                onClick={handleDownloadPdf}
                className="bg-gradient-primary text-primary-foreground hover:opacity-95 rounded-xl h-11 px-6 shadow-card"
              >
                <Download className="h-4 w-4 mr-2" /> Download PDF
              </Button>
              <Button onClick={handlePrint} variant="outline" className="rounded-xl h-11 px-6 glass-card">
                <Printer className="h-4 w-4 mr-2" /> Print Marksheet
              </Button>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground print:hidden">
        <p>
          © {new Date().getFullYear()} ResultCalculation Pro · Crafted for modern classrooms.
        </p>
      </footer>
    </div>
  );
}
