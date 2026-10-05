"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Layers,
  Lock,
  LogOut,
  Mail,
  ShieldCheck,
  TimerReset,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { DotPattern } from "@/components/ui/dot-pattern";
import { ShimmerButton } from "@/components/ui/shimmer-button";

export type LoginNotice = "session_expired" | "signed_out";

const SCHOOL = {
  name: "St Jude & St Bede Academy",
  trust: "Church of England Academy Trust",
  dfeNumber: "886/4012",
  urn: "139420",
};

const TRUST_POINTS = [
  {
    icon: ShieldCheck,
    title: "Secure school information",
    description:
      "GDPR-aligned data isolation with encryption for safeguarding notes and healthcare plans.",
  },
  {
    icon: Users,
    title: "Role-based access",
    description:
      "Dedicated views for headteachers, teachers, DSLs, SENCOs, and verified parents & carers.",
  },
  {
    icon: Layers,
    title: "One connected platform",
    description:
      "Attendance, behaviour, curriculum, and finance in one place — no double entry.",
  },
] as const;

const NOTICE_COPY: Record<
  LoginNotice,
  { icon: typeof AlertTriangle; title: string; description: string }
> = {
  session_expired: {
    icon: TimerReset,
    title: "Session expired",
    description:
      "You were signed out after a period of inactivity, in line with school data protection policy. Please sign in again.",
  },
  signed_out: {
    icon: LogOut,
    title: "Signed out",
    description: "You have been signed out of your school account.",
  },
};

type FieldErrors = { email?: string; password?: string };

export function LoginScreen({ notice }: { notice?: LoginNotice }) {
  const router = useRouter();
  const emailId = useId();
  const passwordId = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [forgotOpen, setForgotOpen] = useState(false);

  const disabled = status === "loading";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FieldErrors = {};
    if (!email.trim()) {
      nextErrors.email = "Enter your school email address.";
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!password) {
      nextErrors.password = "Enter your password.";
    }

    setErrors(nextErrors);
    setServerError(null);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null) as { message?: string } | null;
        setServerError(result?.message ?? "Sign-in failed. Check your details and try again.");
        setStatus("idle");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setServerError("The sign-in service is unavailable. Please try again shortly.");
      setStatus("idle");
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col lg:flex-row">
      {/* Mobile brand bar */}
      <header className="flex items-center justify-between gap-3 border-b border-brand-dark bg-brand px-5 py-4 lg:hidden">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white">
            <GraduationCap className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold leading-tight text-white">{SCHOOL.name}</p>
            <p className="text-xs text-white/70">UK School ERP / MIS Portal</p>
          </div>
        </div>
      </header>

      {/* Left panel — branding & trust */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-brand-dark p-10 text-white lg:flex lg:w-[56%] xl:w-[58%] xl:p-14">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 88% 28%, rgba(180,58,70,0.28) 0%, transparent 48%), radial-gradient(ellipse at 12% 92%, rgba(35,5,10,0.52) 0%, transparent 54%), linear-gradient(128deg, #4b0d15 0%, #60111b 48%, #791722 100%)",
          }}
        />
        <DotPattern
          glow
          width={28}
          height={28}
          className="absolute inset-0 text-white/15 [mask-image:radial-gradient(78%_72%_at_76%_48%,white,transparent)]"
        />
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <path
            d="M 846 1000 C 685 805 771 685 971 574 C 1164 467 1308 468 1490 271"
            stroke="#e7a0a0"
            strokeOpacity=".045"
            strokeWidth="118"
          />
          <path
            d="M 804 1000 C 644 805 730 685 930 574 C 1123 467 1267 468 1449 271"
            stroke="white"
            strokeOpacity=".12"
            strokeWidth="1.5"
          />
          <path
            d="M 886 1000 C 726 805 812 685 1012 574 C 1205 467 1349 468 1531 271"
            stroke="white"
            strokeOpacity=".08"
            strokeWidth="1.5"
          />
          <path
            d="M 968 1000 C 808 805 894 685 1094 574 C 1287 467 1431 468 1613 271"
            stroke="white"
            strokeOpacity=".055"
            strokeWidth="1.5"
          />
          <path
            d="M 1070 1040 C 920 860 998 740 1180 640 C 1350 546 1464 532 1602 390"
            stroke="#f2c5bd"
            strokeOpacity=".06"
            strokeWidth="46"
          />
        </svg>

        <BlurFade className="relative z-10">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/20 bg-white/10">
              <GraduationCap className="h-7 w-7" />
            </span>
            <div>
              <span className="mb-1 inline-block rounded-full border border-white/20 bg-white/15 px-2.5 py-0.5 font-sans text-xs font-semibold text-brand-tint">
                {SCHOOL.trust}
              </span>
              <h2 className="font-heading text-2xl font-bold leading-tight tracking-tight xl:text-3xl">
                {SCHOOL.name}
              </h2>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 pl-1 text-xs text-brand-tint/80">
            <span>DfE No: {SCHOOL.dfeNumber}</span>
            <span aria-hidden>•</span>
            <span>URN: {SCHOOL.urn}</span>
            <span aria-hidden>•</span>
            <span className="flex items-center gap-1 font-medium text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" /> System status: nominal
            </span>
          </div>
        </BlurFade>

        <div className="relative z-10 max-w-xl py-10">
          <BlurFade delay={0.08}>
            <h3 className="font-heading text-3xl font-extrabold leading-tight tracking-tight xl:text-4xl">
              Supporting every pupil,
              <br />
              <span className="text-brand-tint">every day.</span>
            </h3>
            <p className="mt-4 text-base leading-relaxed text-white/80">
              One connected platform for attendance, safeguarding, SEND provision, academic
              attainment, and parent communication.
            </p>
          </BlurFade>

          <div className="mt-8 space-y-3">
            {TRUST_POINTS.map((point, index) => (
              <BlurFade key={point.title} delay={0.14 + index * 0.06}>
                <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-3.5">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <point.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{point.title}</h4>
                    <p className="mt-0.5 text-xs leading-relaxed text-white/75">
                      {point.description}
                    </p>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6 text-xs text-white/60">
          <span>© {new Date().getFullYear()} {SCHOOL.name}</span>
          <div className="flex items-center gap-4">
            <a href="#" className="transition-colors hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Safeguarding Statement
            </a>
          </div>
        </div>
      </section>

      {/* Right panel — sign in */}
      <section className="flex flex-1 flex-col items-center justify-center overflow-y-auto bg-background p-6 sm:p-10 lg:p-12 xl:p-16">
        <div className="mx-auto my-auto w-full max-w-md py-4">
          {notice ? (
            <div
              className={cn(
                "mb-5 flex items-start gap-2.5 rounded-xl border p-3.5 text-xs",
                "border-info-border bg-info-bg text-info-text"
              )}
              role="alert"
            >
              {(() => {
                const Icon = NOTICE_COPY[notice].icon;
                return <Icon className="mt-0.5 h-4 w-4 flex-shrink-0" />;
              })()}
              <div>
                <strong className="block font-semibold">{NOTICE_COPY[notice].title}</strong>
                {NOTICE_COPY[notice].description}
              </div>
            </div>
          ) : null}

          <Card className="relative overflow-hidden rounded-2xl border-border p-7 shadow-[0_4px_20px_-2px_rgba(16,24,40,0.08),0_2px_6px_-1px_rgba(16,24,40,0.04)] sm:p-8">
            <BorderBeam
              size={140}
              duration={14}
              borderWidth={1.5}
              colorFrom="#7A1621"
              colorTo="#F9ECEE00"
            />

            <div className="mb-7 flex items-center gap-2.5 lg:hidden">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-border bg-brand-tint text-brand">
                <GraduationCap className="h-5 w-5" />
              </span>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-brand">
                  {SCHOOL.name}
                </span>
                <span className="block text-[11px] text-muted-foreground">
                  Academic Portal • UK MIS
                </span>
              </div>
            </div>

            <div className="mb-7">
              <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                Welcome back
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Sign in to your school account to access registers, curriculum, and pastoral
                services.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {serverError ? (
                  <p className="rounded-lg border border-danger-border bg-danger-bg px-3 py-2 text-sm text-danger-text" role="alert">
                    {serverError}
                  </p>
                ) : null}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <Label htmlFor={emailId} className="text-xs font-semibold uppercase tracking-wider text-foreground">
                      School email
                    </Label>
                  </div>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id={emailId}
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="e.g. s.davies@school.sch.uk"
                      value={email}
                      disabled={disabled}
                      aria-invalid={Boolean(errors.email)}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      className="h-11 pl-10"
                    />
                  </div>
                  {errors.email ? (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
                      <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                      {errors.email}
                    </p>
                  ) : null}
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <Label htmlFor={passwordId} className="text-xs font-semibold uppercase tracking-wider text-foreground">
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={() => setForgotOpen((open) => !open)}
                      className="text-xs font-medium text-brand transition hover:text-brand-hover hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id={passwordId}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      disabled={disabled}
                      aria-invalid={Boolean(errors.password)}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setErrors((prev) => ({ ...prev, password: undefined }));
                      }}
                      className="h-11 pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((show) => !show)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password ? (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
                      <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                      {errors.password}
                    </p>
                  ) : null}
                  {forgotOpen ? (
                    <p className="mt-1.5 rounded-lg bg-muted px-2.5 py-1.5 text-xs text-muted-foreground">
                      Password reset isn&apos;t connected yet — contact your school&apos;s IT
                      helpdesk to reset your password.
                    </p>
                  ) : null}
                </div>

                <ShimmerButton
                  type="submit"
                  disabled={disabled}
                  background="linear-gradient(135deg, #7A1621, #5E1018)"
                  shimmerColor="#F9ECEE"
                  borderRadius="10px"
                  className="mt-2 w-full py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Authenticating credentials…
                    </span>
                  ) : (
                    <span>Sign in to school portal</span>
                  )}
                </ShimmerButton>
              </form>

          </Card>

          <div className="mt-6 space-y-2 text-center">
            <p className="text-xs text-muted-foreground">
              Need sign-in assistance?{" "}
              <a href="#" className="font-medium text-brand hover:text-brand-hover hover:underline">
                Contact your school&apos;s IT helpdesk
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
