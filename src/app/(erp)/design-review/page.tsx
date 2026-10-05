import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "Design Review",
};

const DASHBOARDS = [
  {
    href: "/dashboard/headteacher",
    module: "Module 01.1",
    title: "Headteacher & SLT Dashboard",
    description:
      "Executive overview for school leadership — attendance and behaviour trends, statutory deadlines, safeguarding queue, and DfE census status.",
    preview: "/previews/headteacher.png",
  },
  {
    href: "/dashboard/teacher",
    module: "Module 01.2",
    title: "Teacher Dashboard",
    description:
      "Daily workspace for classroom teachers — today's timetable and registers, homework marking queue, behaviour & merit logging, and staff notices.",
    preview: "/previews/teacher.png",
  },
];

export default function DesignReviewPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 py-14 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-tint text-brand">
            <GraduationCap className="h-6 w-6" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            UK School ERP / MIS
          </p>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-brand sm:text-3xl">
            Dashboard Design Review
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Each card below opens a fully interactive build of that dashboard. Review the layout, content,
            and interactions, then open a design to explore it in full.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {DASHBOARDS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-muted">
                <Image
                  src={item.preview}
                  alt={`Preview of the ${item.title}`}
                  fill
                  sizes="(min-width: 640px) 480px, 100vw"
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <span className="w-fit rounded-full bg-brand-tint px-2 py-0.5 text-xs font-semibold text-brand">
                  {item.module}
                </span>
                <h2 className="font-heading text-lg font-semibold text-foreground">{item.title}</h2>
                <p className="flex-1 text-sm text-muted-foreground">{item.description}</p>
                <span className="mt-2 flex items-center gap-1 text-sm font-semibold text-brand">
                  View design
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
