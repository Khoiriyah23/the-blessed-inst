import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BookOpen, Check, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase-external";

export const Route = createFileRoute("/enroll")({
  head: () => ({
    meta: [
      { title: "Enroll — The Blessed Institute" },
      { name: "description", content: "Register for private 1-on-1 Islamic classes at The Blessed Institute." },
    ],
  }),
  component: EnrollPage,
});

const GENERAL_COURSES = [
  "Quran from Scratch", "Beginner Arabic", "Fiqh An-Nisaa", "Idaadi Program",
  "Thanawiy Program", "Islamic Studies", "Quran memorization", "Tejweed", "Advanced Arabic",
];
const KIDS_COURSES = [
  "Arabic reading (Kids)", "Arabic writing (Kids)", "Quran memorization (Kids)",
  "Adab - Islamic morals (Kids)", "Hadith (Kids)", "Seerah - Story of the prophets (Kids)",
];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type SessionOption = "2 or 3 Sessions" | "4 Sessions" | "5 Sessions";

const PRICING: Record<SessionOption, [number, number, number]> = {
  "2 or 3 Sessions": [40000, 60000, 80000],
  "4 Sessions": [50000, 75000, 100000],
  "5 Sessions": [60000, 90000, 120000],
};

function calcPrice(courseCount: number, sessions: SessionOption): number {
  const idx = courseCount <= 1 ? 0 : courseCount === 2 ? 1 : 2;
  return PRICING[sessions][idx];
}

type FormState = {
  who: "myself" | "someone_else" | "";
  fullName: string;
  email: string;
  phone: string;
  courses: string[];
  level: "" | "Beginner" | "Intermediate" | "Advanced";
  region: string;
  sessions: SessionOption;
  availability: Record<string, { checked: boolean; time: string }>;
  students: number;
  requirements: string;
};

const initialState: FormState = {
  who: "",
  fullName: "",
  email: "",
  phone: "",
  courses: [],
  level: "",
  region: "Africa (NGN)",
  sessions: "2 or 3 Sessions",
  availability: Object.fromEntries(DAYS.map((d) => [d, { checked: false, time: "" }])),
  students: 1,
  requirements: "",
};

function EnrollPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = 5;
  const price = useMemo(() => calcPrice(Math.max(form.courses.length, 1), form.sessions), [form.courses.length, form.sessions]);

  const canProceed = () => {
    if (step === 1) return form.who && form.fullName.trim() && /\S+@\S+\.\S+/.test(form.email) && form.phone.trim();
    if (step === 2) return form.courses.length > 0 && form.level;
    if (step === 3) return true;
    if (step === 4) {
      const anyDay = DAYS.some((d) => form.availability[d].checked && form.availability[d].time.trim());
      return anyDay && form.students >= 1;
    }
    return true;
  };

  const toggleCourse = (c: string) => {
    setForm((f) => ({ ...f, courses: f.courses.includes(c) ? f.courses.filter((x) => x !== c) : [...f.courses, c] }));
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    const availability = DAYS
      .filter((d) => form.availability[d].checked)
      .map((d) => ({ day: d, time: form.availability[d].time }));

    const { error } = await supabase.from("registrations").insert({
      registering_for: form.who === "myself" ? "Myself" : "Someone Else",
      full_name: form.fullName,
      email: form.email,
      phone: form.phone,
      selected_courses: form.courses,
      knowledge_level: form.level,
      sessions_per_week: form.sessions,
      monthly_price: price,
      availability,
      number_of_students: form.students,
      special_requirements: form.requirements || null,
      status: "pending_payment",
    });

    if (error) {
      setSubmitting(false);
      setSubmitError(error.message);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);

    const days = availability.map((a) => `${a.day}: ${a.time}`).join("\n");
    const msg = `New Registration — The Blessed Institute\n\n👤 REGISTRANT\n\nRegistering for: ${form.who === "myself" ? "Myself" : "Someone Else"}\nFull Name: ${form.fullName}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n📚 CLASS PREFERENCES\n\nCourses: ${form.courses.join(", ")}\nKnowledge Level: ${form.level}\n\n💰 PRICING\n\nRegion: Africa (NGN)\nSessions/Week: ${form.sessions}\nMonthly Payment: ₦${price.toLocaleString()}\n\n📅 AVAILABILITY\n\n${days || "—"}\n\n👥 Students: ${form.students}\n📝 Special Requirements: ${form.requirements || "None"}`;
    const url = `https://wa.me/2349026207960?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-brand-foreground shadow-sm">
              <BookOpen className="h-5 w-5" strokeWidth={2.4} />
            </div>
            <span className="font-display text-base font-bold leading-tight text-primary">
              The Blessed Institute
            </span>
          </Link>
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary">← Back to home</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="grid gap-8 md:grid-cols-[1fr_1.4fr] md:gap-10">
          {/* Left summary */}
          <aside className="md:sticky md:top-8 md:h-fit">
            <div className="rounded-3xl bg-primary p-8 text-white shadow-lg">
              <h2 className="font-display text-2xl font-bold md:text-3xl">Secure Your Private Spot</h2>
              <p className="mt-2 text-white/80">Join our exclusive 1-on-1 classes</p>
              <ul className="mt-7 space-y-4">
                {[
                  "Clear and transparent fixed monthly rate",
                  "Flexible scheduling tailored to you",
                  "Access to premium learning materials",
                  "Monthly progress reports",
                ].map((b) => (
                  <li key={b} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[oklch(0.78_0.17_155)]" />
                    <span className="text-sm text-white/90">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Right form */}
          <section className="rounded-3xl border border-border bg-white p-6 shadow-sm md:p-9">
            {submitted ? (
              <div className="py-10 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success">
                  <Check className="h-8 w-8" />
                </div>
                <h3 className="mt-5 text-2xl font-bold text-primary">JazakAllahu Khairan!</h3>
                <p className="mt-3 text-muted-foreground">
                  Your registration has been received. We will contact you via WhatsApp within 24 hours to confirm your schedule.
                </p>
                <Link to="/" className="mt-8 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground hover:bg-brand-dark">
                  Back to home
                </Link>
              </div>
            ) : (
              <>
                <StepIndicator step={step} total={totalSteps} />

                {step === 1 && <Step1 form={form} setForm={setForm} />}
                {step === 2 && <Step2 form={form} setForm={setForm} toggleCourse={toggleCourse} />}
                {step === 3 && <Step3 form={form} setForm={setForm} price={price} />}
                {step === 4 && <Step4 form={form} setForm={setForm} />}
                {step === 5 && <Step5 form={form} price={price} />}

                <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
                  <button
                    onClick={() => setStep((s) => Math.max(1, s - 1))}
                    disabled={step === 1}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground/70 transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowLeft className="h-4 w-4" /> Previous
                  </button>
                  {step < totalSteps ? (
                    <button
                      onClick={() => canProceed() && setStep((s) => s + 1)}
                      disabled={!canProceed()}
                      className="inline-flex items-center gap-1.5 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <div className="flex flex-col items-end gap-2">
                      {submitError && <p className="text-xs text-red-600">{submitError}</p>}
                      <button
                        onClick={submit}
                        disabled={submitting}
                        className="rounded-full bg-brand px-7 py-2.5 text-sm font-semibold text-brand-foreground transition hover:bg-brand-dark disabled:opacity-60"
                      >
                        {submitting ? "Submitting…" : "Submit Registration"}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">Step {step} of {total}</p>
        <p className="text-xs text-muted-foreground">{Math.round((step / total) * 100)}% complete</p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${(step / total) * 100}%` }} />
      </div>
    </div>
  );
}

function TextField({ label, type = "text", value, onChange, placeholder }: { label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </div>
  );
}

function Step1({ form, setForm }: { form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>> }) {
  return (
    <div>
      <h3 className="text-xl font-bold text-primary">Who are you registering?</h3>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {(["myself", "someone_else"] as const).map((v) => {
          const active = form.who === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => setForm((f) => ({ ...f, who: v }))}
              className={`rounded-2xl border-2 p-5 text-left transition ${active ? "border-brand bg-brand/5 ring-2 ring-brand/20" : "border-border hover:border-brand/50"}`}
            >
              <div className={`text-base font-bold ${active ? "text-brand" : "text-primary"}`}>
                {v === "myself" ? "Myself" : "Someone Else"}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {v === "myself" ? "I am registering for my own classes." : "e.g. Child, sibling or family member."}
              </p>
            </button>
          );
        })}
      </div>
      <div className="mt-7 space-y-4">
        <TextField label="Full Name" value={form.fullName} onChange={(v) => setForm((f) => ({ ...f, fullName: v }))} placeholder="Enter full name" />
        <TextField label="Email" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} placeholder="you@example.com" />
        <TextField label="Phone" type="tel" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} placeholder="+234 …" />
      </div>
    </div>
  );
}

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${active ? "border-brand bg-brand text-brand-foreground" : "border-border bg-white text-foreground/80 hover:border-brand/50 hover:text-brand"}`}
    >
      {label}
    </button>
  );
}

function Step2({ form, setForm, toggleCourse }: { form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>>; toggleCourse: (c: string) => void }) {
  return (
    <div>
      <h3 className="text-xl font-bold text-primary">Class Preferences</h3>
      <p className="mt-1 text-sm text-muted-foreground">Select one or more courses.</p>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">General Courses</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {GENERAL_COURSES.map((c) => <Pill key={c} label={c} active={form.courses.includes(c)} onClick={() => toggleCourse(c)} />)}
        </div>
      </div>

      <div className="mt-7">
        <p className="text-xs font-semibold uppercase tracking-wider text-success">Kids Courses — Recommended for Children</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {KIDS_COURSES.map((c) => <Pill key={c} label={c} active={form.courses.includes(c)} onClick={() => toggleCourse(c)} />)}
        </div>
      </div>

      <div className="mt-7">
        <label className="text-sm font-medium text-foreground">Knowledge Level</label>
        <select
          value={form.level}
          onChange={(e) => setForm((f) => ({ ...f, level: e.target.value as FormState["level"] }))}
          className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        >
          <option value="">Select your level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>
    </div>
  );
}

function Step3({ form, setForm, price }: { form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>>; price: number }) {
  return (
    <div>
      <h3 className="text-xl font-bold text-primary">Pricing & Plan</h3>
      <div className="mt-5 space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground">Region</label>
          <input
            readOnly
            value={form.region}
            className="mt-1.5 w-full rounded-xl border border-input bg-secondary/50 px-4 py-2.5 text-sm text-muted-foreground"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Sessions per Week</label>
          <select
            value={form.sessions}
            onChange={(e) => setForm((f) => ({ ...f, sessions: e.target.value as SessionOption }))}
            className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          >
            <option>2 or 3 Sessions</option>
            <option>4 Sessions</option>
            <option>5 Sessions</option>
          </select>
        </div>
      </div>

      <div className="mt-7 rounded-2xl border-2 border-brand bg-brand/5 p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">Monthly Payment</p>
        <p className="mt-2 font-display text-4xl font-extrabold text-primary">₦{price.toLocaleString()}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {form.courses.length || 0} course{form.courses.length === 1 ? "" : "s"} · {form.sessions}
        </p>
      </div>
    </div>
  );
}

function Step4({ form, setForm }: { form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>> }) {
  const setDay = (day: string, patch: Partial<{ checked: boolean; time: string }>) => {
    setForm((f) => ({
      ...f,
      availability: { ...f.availability, [day]: { ...f.availability[day], ...patch } },
    }));
  };
  return (
    <div>
      <h3 className="text-xl font-bold text-primary">Select Your Availability</h3>
      <p className="mt-1 text-sm text-muted-foreground">Check the days you're available and add a time range.</p>
      <div className="mt-5 space-y-2">
        {DAYS.map((day) => {
          const d = form.availability[day];
          return (
            <div key={day} className={`flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center ${d.checked ? "border-brand/50 bg-brand/5" : "border-border"}`}>
              <label className="flex min-w-32 items-center gap-3 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={d.checked}
                  onChange={(e) => setDay(day, { checked: e.target.checked })}
                  className="h-4 w-4 accent-[color:var(--color-brand)]"
                />
                {day}
              </label>
              {d.checked && (
                <input
                  type="text"
                  value={d.time}
                  onChange={(e) => setDay(day, { time: e.target.value })}
                  placeholder="e.g. 6 PM - 8 PM"
                  className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
  <div>
    <label className="text-sm font-medium text-foreground">Number of Students</label>
    <div className="mt-1.5 flex items-center gap-4">
      <button
        type="button"
        onClick={() => setForm((f) => ({ ...f, students: Math.max(1, f.students - 1) }))}
        className="h-10 w-10 rounded-full border border-input bg-white text-xl font-semibold text-primary hover:bg-slate-50 transition flex items-center justify-center"
      >
        −
      </button>
      <span className="text-lg font-semibold text-primary w-6 text-center">
        {form.students}
      </span>
      <button
        type="button"
        onClick={() => setForm((f) => ({ ...f, students: f.students + 1 }))}
        className="h-10 w-10 rounded-full border border-input bg-white text-xl font-semibold text-primary hover:bg-slate-50 transition flex items-center justify-center"
      >
        +
      </button>
    </div>
  </div>
</div>
      <div className="mt-4">
        <label className="text-sm font-medium text-foreground">Special Requirements</label>
        <textarea
          rows={4}
          value={form.requirements}
          onChange={(e) => setForm((f) => ({ ...f, requirements: e.target.value }))}
          placeholder="Any specific goals or needs?"
          className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>
    </div>
  );
}

function Step5({ form, price }: { form: FormState; price: number }) {
  const days = DAYS.filter((d) => form.availability[d].checked);
  return (
    <div>
      <h3 className="text-xl font-bold text-primary">Review & Submit</h3>
      <p className="mt-1 text-sm text-muted-foreground">Confirm your details below before submitting.</p>

      <div className="mt-6 space-y-4">
        <ReviewBlock title="Registrant">
          <Row k="Registering for" v={form.who === "myself" ? "Myself" : "Someone Else"} />
          <Row k="Full Name" v={form.fullName} />
          <Row k="Email" v={form.email} />
          <Row k="Phone" v={form.phone} />
        </ReviewBlock>
        <ReviewBlock title="Class Preferences">
          <Row k="Courses" v={form.courses.join(", ") || "—"} />
          <Row k="Level" v={form.level || "—"} />
        </ReviewBlock>
        <ReviewBlock title="Pricing">
          <Row k="Region" v={form.region} />
          <Row k="Sessions / Week" v={form.sessions} />
          <Row k="Monthly Payment" v={`₦${price.toLocaleString()}`} highlight />
        </ReviewBlock>
        <ReviewBlock title="Availability">
          {days.length === 0 ? (
            <p className="text-sm text-muted-foreground">No days selected</p>
          ) : (
            days.map((d) => <Row key={d} k={d} v={form.availability[d].time || "—"} />)
          )}
          <Row k="Students" v={String(form.students)} />
          {form.requirements && <Row k="Notes" v={form.requirements} />}
        </ReviewBlock>
      </div>
    </div>
  );
}

function ReviewBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/30 p-5">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-brand">{title}</h4>
      <dl className="mt-3 space-y-1.5">{children}</dl>
    </div>
  );
}

function Row({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className={`text-right font-medium ${highlight ? "text-brand font-bold" : "text-foreground"}`}>{v}</dd>
    </div>
  );
}
