import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  BookOpen, Shield, Zap, MessageCircle, User, ClipboardList,
  Calendar, Heart, GraduationCap, Mail, Phone, MapPin,
  Instagram, Youtube, Menu, X, Quote, Check, Sparkles,
  Users, Users2, Globe,
} from "lucide-react";
import { supabase } from "@/lib/supabase-external";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import heroImg from "@/assets/hero.jpg";
import logo from '@/assets/TBI full logo blue.png'

type Course = {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  description: string;
  curriculum: string[];
  features: string[];
  category: "general" | "kids";
  sort_order: number;
  image_url: string | null;
};

const coursesQuery = queryOptions({
  queryKey: ["courses"],
  queryFn: async (): Promise<Course[]> => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("category", { ascending: false })
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Course[];
  },
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Blessed Institute — Online Islamic Education Academy" },
      { name: "description", content: "Learn Qur'an, Arabic and Islamic Studies online — live classes for kids and adults. Preserving Knowledge, Nurturing Faith." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(coursesQuery),
  component: HomePage,
});

const navLinks = [
  { href: "#about", label: "About", type: "hash" as const },
  { href: "/enroll", label: "Enroll Now", type: "route" as const },
  { href: "#courses", label: "Courses", type: "hash" as const },
  { href: "#testimonials", label: "Testimonials", type: "hash" as const },
  { href: "#contact", label: "Contact", type: "hash" as const },
  { href: "#faq", label: "FAQ", type: "hash" as const },
];

function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img src={logo} alt="The Blessed Institute" className="h-10 w-auto" />
      
    </div>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed left-0 right-0 top-4 z-50 px-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-border/60 bg-white/85 px-4 py-2.5 shadow-[0_8px_30px_-12px_rgba(27,58,140,0.15)] backdrop-blur-md md:px-6">
        <a href="#top" className="shrink-0"><Logo /></a>
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            l.type === "route" ? (
              <Link
                key={l.href}
                to={l.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-foreground/70 transition hover:bg-accent hover:text-primary"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-foreground/70 transition hover:bg-accent hover:text-primary"
              >
                {l.label}
              </a>
            )
          ))}
        </nav>
        <Link
          to="/enroll"
          className="hidden rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-dark md:inline-flex"
        >
          Get Started
        </Link>
        <button onClick={() => setOpen(!open)} className="rounded-full p-2 md:hidden" aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="mx-auto mt-2 max-w-6xl rounded-2xl border border-border/60 bg-white p-3 shadow-lg md:hidden">
          {navLinks.map((l) => (
            l.type === "route" ? (
              <Link key={l.href} to={l.href} onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-accent">{l.label}</Link>
            ) : (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-accent">{l.label}</a>
            )
          ))}
          <Link to="/enroll" onClick={() => setOpen(false)}
             className="mt-2 block rounded-lg bg-brand px-4 py-2.5 text-center text-sm font-semibold text-brand-foreground">
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <img
        src={heroImg}
        alt=""
        width={1920}
        height={1280}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
     
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/85 via-primary/80 to-primary/95" />
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 pb-24 pt-40 text-center text-white md:pb-32 md:pt-44">
       <div className="flex items-center gap-3">
  <img src={logo} alt="The Blessed Institute" className="h-10 w-auto brightness-0 invert" />
</div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[oklch(0.78_0.14_264)]">
          Welcome to
        </p>
        <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
          The Blessed Institute
        </h1>
        <p className="mt-5 text-lg font-medium text-white/90 md:text-xl">
          Preserving Knowledge, Nurturing Faith.
        </p>
        <p className="mt-5 max-w-2xl text-balance text-base text-white/75 md:text-lg">
          An online Islamic academy offering live Qur'an, Arabic and Islamic Studies classes
          for kids and adults — taught by qualified teachers, from anywhere in the world.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link to="/enroll" className="rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/30 transition hover:bg-[oklch(0.5_0.22_264)]">
            Enroll Now
          </Link>
          <a href="https://forms.google.com" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/40 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15">
            Apply as a Tutor
          </a>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, subtitle, center = true }: { eyebrow?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{eyebrow}</p>}
      <h2 className="mt-2 text-3xl font-bold text-primary md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-base text-muted-foreground md:text-lg">{subtitle}</p>}
    </div>
  );
}

function About() {
  const stats = [
    { value: "100+", label: "Students Enrolled", icon: Users, color: "#2563EB", bg: "rgba(37,99,235,0.12)" },
    { value: "10+", label: "Courses Offered", icon: ClipboardList, color: "#16A34A", bg: "rgba(22,163,74,0.12)" },
    { value: "20+", label: "Qualified Teachers", icon: Users2, color: "#7C3AED", bg: "rgba(124,58,237,0.12)" },
    { value: "8+", label: "Countries Reached", icon: Globe, color: "#CA8A04", bg: "rgba(202,138,4,0.14)" },
  ];
  return (
    <section id="about" className="bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading eyebrow="About Us" title="Built on faith and excellence" subtitle="A trusted online Islamic academy dedicated to making authentic knowledge accessible to every household." />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border-l-4 border-brand bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand/10 text-brand">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-primary">Our Mission</h3>
            </div>
            <p className="mt-4 text-muted-foreground">
              To provide accessible, high-quality Islamic education that empowers Muslims of all ages
              to connect with the Qur'an, the Arabic language and the rich tradition of Islamic scholarship.
            </p>
          </div>
          <div className="rounded-2xl border-l-4 border-success bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-success/10 text-success">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-primary">Our Vision</h3>
            </div>
            <p className="mt-4 text-muted-foreground">
              A global community of confident, knowledgeable Muslims who carry the light of revelation
              into every home, generation and corner of the world.
            </p>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-white p-6 text-center shadow-sm">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl" style={{ backgroundColor: s.bg, color: s.color }}>
                <s.icon className="h-6 w-6" />
              </div>
              <div className="text-3xl font-extrabold text-brand md:text-4xl">{s.value}</div>
              <div className="mt-1 text-sm font-medium text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Approach() {
  const items = [
    { icon: MessageCircle, color: "brand", title: "Interactive Classes", desc: "Live, engaging sessions with real-time discussion, recitation and feedback from your teacher." },
    { icon: User, color: "success", title: "Personalized Learning Path", desc: "Lessons tailored to your level and pace — from absolute beginners to advanced students." },
    { icon: ClipboardList, color: "purple-accent", title: "Structured Curriculum", desc: "A proven, step-by-step syllabus grounded in classical Islamic scholarship." },
  ];
  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading eyebrow="Teaching Approach" title="How we teach" subtitle="A modern delivery rooted in timeless tradition." />
        <div className="mt-12 rounded-3xl border border-border bg-white p-8 shadow-sm md:p-12">
          <div className="grid gap-10 md:grid-cols-3">
            {items.map((it) => (
              <div key={it.title} className="text-center">
                <div
                  className="mx-auto grid h-14 w-14 place-items-center rounded-2xl"
                  style={{ backgroundColor: `color-mix(in oklab, var(--color-${it.color}) 12%, transparent)`, color: `var(--color-${it.color})` }}
                >
                  <it.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-primary">{it.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function EnrollPrivate() {
  const features = [
    { icon: Calendar, title: "Flexible Scheduling", desc: "Pick days and times that fit your routine." },
    { icon: Heart, title: "Personalized Attention", desc: "One-on-one sessions with a dedicated teacher." },
    { icon: GraduationCap, title: "Custom Curriculum", desc: "A study plan built around your goals." },
  ];
  return (
    <section id="enroll" className="bg-secondary/40 py-20 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Private Classes</p>
          <h2 className="mt-2 text-3xl font-bold text-primary md:text-4xl">Enroll in Our Private Classes</h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Get the focused attention you deserve. Our private classes are designed for students
            who want a tailored learning experience with a personal teacher, flexible timing,
            and a curriculum built around their goals.
          </p>
          <Link to="/enroll" className="mt-7 inline-flex rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-brand-foreground shadow-md transition hover:bg-brand-dark">
            Enroll Now
          </Link>
        </div>
        <div className="rounded-3xl border border-border bg-white p-7 shadow-sm md:p-9">
          <h3 className="text-xl font-bold text-primary">What's Included?</h3>
          <ul className="mt-5 space-y-4">
            {features.map((f) => (
              <li key={f.title} className="flex gap-4">
                <div className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{f.title}</div>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function CourseCard({ course, onOpen }: { course: Course; onOpen: () => void }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-44 w-full overflow-hidden">
        {course.image_url ? (
          <img
            src={course.image_url}
            alt={course.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="relative h-full bg-gradient-to-br from-primary via-brand to-[oklch(0.4_0.2_264)]">
            <div
              className="absolute inset-0 opacity-30"
              style={{ backgroundImage: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 60%)" }}
            />
            <Sparkles className="absolute right-4 top-4 h-5 w-5 text-white/60" />
            <BookOpen className="absolute bottom-4 left-4 h-10 w-10 text-white/90" strokeWidth={1.6} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold text-primary">{course.title}</h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">{course.short_description}</p>
        <button
          onClick={onOpen}
          className="mt-5 inline-flex w-fit items-center gap-1 rounded-full border border-brand/30 bg-brand/5 px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand hover:text-brand-foreground"
        >
          Learn More
        </button>
      </div>
    </div>
  );
}

function Courses() {
  const { data: courses } = useSuspenseQuery(coursesQuery);
  const [active, setActive] = useState<Course | null>(null);
  const general = courses.filter((c) => c.category === "general");
  const kids = courses.filter((c) => c.category === "kids");

  return (
    <section id="courses" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading eyebrow="Our Programs" title="Courses we offer" subtitle="Explore our live, teacher-led programs for every level." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {general.map((c) => (
            <CourseCard key={c.id} course={c} onOpen={() => setActive(c)} />
          ))}
        </div>

        <div className="mt-20">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <h3 className="text-2xl font-bold text-primary">Kids Courses</h3>
            <div className="h-px flex-1 bg-border" />
          </div>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
            Age-appropriate programs designed to nurture young Muslims with love, knowledge and good character.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {kids.map((c) => (
              <CourseCard key={c.id} course={c} onOpen={() => setActive(c)} />
            ))}
          </div>
        </div>
      </div>

      <CourseModal course={active} onClose={() => setActive(null)} />
    </section>
  );
}

function CourseModal({ course, onClose }: { course: Course | null; onClose: () => void }) {
  return (
    <Dialog open={!!course} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-hidden gap-0 border-0 p-0 sm:max-w-2xl [&>button.absolute]:text-white [&>button.absolute]:top-5 [&>button.absolute]:right-5 [&>button.absolute]:opacity-90">
        {course && (
          <div className="flex max-h-[90vh] flex-col">
            <div className="bg-primary px-6 py-5 text-primary-foreground">
              <h3 className="pr-10 text-xl font-bold">{course.title}</h3>
            </div>
            <div className="overflow-y-auto px-6 py-6">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-brand">Course Description</h4>
                <p className="mt-2 text-muted-foreground">{course.description}</p>
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-brand">Curriculum</h4>
                <ul className="mt-3 space-y-2">
                  {course.curriculum.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-brand">Features</h4>
                <ul className="mt-3 space-y-2">
                  {course.features.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-t border-border bg-secondary/30 px-6 py-4">
              <Link to="/enroll" onClick={onClose} className="block w-full rounded-full bg-brand px-6 py-3 text-center text-sm font-semibold text-brand-foreground transition hover:bg-brand-dark">
                Enroll Now
              </Link>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Testimonials() {
  const items = [
    { q: "I'm glad he's doing well. He's always eager every weekend for the Arabic class.", a: "Parent, USA" },
    { q: "Alhamdulillah! The classes have been awesome! What they have achieved in 3 weeks is amazing. Alhamdulillah we are so pleased.", a: "Parent, Canada" },
    { q: "Attending the class has truly been a beautiful journey, Alhamdulillah. The lessons are impactful, the teachers are dedicated and intentional.", a: "Haneefah A., Nigeria" },
    { q: "Good outcome has been recorded. The teaching techniques have been effective.", a: "AbdulMuiz A., Nigeria" },
  ];
  return (
    <section id="testimonials" className="bg-secondary/40 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading eyebrow="Testimonials" title="What Our Students & Parents Say" />
        <div className="mt-12 -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 [scrollbar-width:thin]">
          {items.map((t, i) => (
            <figure key={i} className="flex w-[88%] shrink-0 snap-center flex-col rounded-3xl border border-border bg-white p-7 shadow-sm sm:w-[60%] md:w-[44%] lg:w-[32%]">
              <Quote className="h-9 w-9 text-brand/30" strokeWidth={2.5} />
              <blockquote className="mt-4 flex-1 text-base leading-relaxed text-foreground">"{t.q}"</blockquote>
              <figcaption className="mt-5 text-sm font-semibold text-brand">— {t.a}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABanner() {
  return (
    <section className="bg-primary py-16 text-primary-foreground md:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Secure your spot today!</h2>
        <p className="mt-3 text-base text-white/80 md:text-lg">
          Join live group or private classes based on your preference.
        </p>
        <Link to="/enroll" className="mt-7 inline-flex rounded-full border-2 border-white px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-primary">
          Enroll Now
        </Link>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading eyebrow="Contact" title="Contact Us" subtitle="We'd love to hear from you. Reach out with any question." />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
            <h3 className="text-xl font-bold text-primary">Get In Touch</h3>
            <ul className="mt-6 space-y-4">
              <ContactRow icon={Mail} label="Email" value="theblessedinstitute@gmail.com" />
              <ContactRow icon={Phone} label="Phone" value="+234 902 620 7960" />
              <ContactRow icon={MessageCircle} label="WhatsApp" value="+234 902 620 7960" />
              <ContactRow icon={MapPin} label="Location" value="Virtual Online School" />
            </ul>
            <div className="mt-7 flex gap-3">
          {[
  { Icon: Instagram, label: "Instagram", href: "https://www.instagram.com/theblessedinstitute?igsh=MXd4ODdycTN6bWthdQ%3D%3D&utm_source=qr" },
  { Icon: () => <TikTokIcon className="h-5 w-5" />, label: "TikTok", href: "https://www.tiktok.com/@theblessedinstitute?_r=1&_t=ZS-97jLIYLFFY1" },
  { Icon: MessageCircle, label: "WhatsApp", href: "https://wa.me/2349026207960?text=Assal%C4%81mu+alaykum.+My+name+is+_________.+I+will+like+to+enrol+for+________." },
].map(({ Icon, label, href }) => (
  <a
    key={label}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="grid h-11 w-11 place-items-center rounded-full bg-brand/10 text-brand transition hover:bg-brand hover:text-brand-foreground"
  >
    <Icon className="h-5 w-5" />
  </a>
))}
            </div>
          </div>
          <form 
  className="rounded-3xl border border-border bg-white p-8 shadow-sm" 
  onSubmit={(e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

    const msg = `New Message — The Blessed Institute\n\n👤 Name: ${name}\n📧 Email: ${email}\n\n💬 Message:\n${message}`;
    const url = `https://wa.me/2349026207960?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }}
>
  <h3 className="text-xl font-bold text-primary">Send Us a Message</h3>
  <div className="mt-6 space-y-4">
    <Field label="Name" type="text" name="name" />
    <Field label="Email" type="email" name="email" />
    <div>
      <label className="text-sm font-medium text-foreground">Message</label>
      <textarea 
        required 
        name="message"
        rows={4} 
        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" 
      />
    </div>
    <button 
      type="submit" 
      className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition hover:bg-brand-dark"
    >
      Send Message via WhatsApp
    </button>
  </div>
</form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, type, name }: { label: string; type: string; name: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input required type={type} name={name} className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" />
    </div>
  );
}

function ContactRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <li className="flex items-start gap-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm font-medium text-foreground">{value}</div>
      </div>
    </li>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.81 20.5a6.34 6.34 0 0 0 10.86-4.43V9.74a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.85-1.17Z" />
    </svg>
  );
}

function FAQ() {
  const items = [
    { q: "How do I enroll?", a: "Submit our contact form or message us on WhatsApp with your preferred course, age group and availability. Our team will reach out within 24 hours to schedule a free trial class." },
    { q: "What courses do you offer?", a: "We offer Qur'an recitation and memorization, Tajweed, Arabic (beginner to advanced), Fiqh, Islamic Studies, and a dedicated Kids program. Visit the Courses section above for the full list." },
    { q: "Is the school 100% online?", a: "Yes — all classes are delivered live online so you can learn from anywhere in the world, on a schedule that suits you." },
    { q: "What is the mode of instruction?", a: "Live one-on-one or small-group classes over video call with qualified male and female teachers. Lessons are interactive and include recitation, discussion and homework." },
    { q: "Are the courses accredited?", a: "Our advanced Idaadi and Thanawiy programs follow a structured classical curriculum with internal certification. Tajweed students can also pursue an Ijazah pathway." },
  ];
  return (
    <section id="faq" className="bg-secondary/40 py-20 md:py-24">
      <div className="mx-auto max-w-3xl px-4">
        <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" />
        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {items.map((it, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="rounded-2xl border border-border bg-white px-5 shadow-sm">
              <AccordionTrigger className="py-5 text-left text-base font-semibold text-primary hover:no-underline">
                {it.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-muted-foreground">
                {it.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[oklch(0.22_0.06_264)] text-white/80">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-3">
  <img src={logo} alt="The Blessed Institute" className="h-10 w-auto brightness-0 invert" />
</div>
            <p className="mt-4 max-w-md text-sm">
              An online Islamic academy preserving knowledge and nurturing faith — live classes
              in Qur'an, Arabic and Islamic Studies for every age and level.
            </p>
  <div className="mt-5 flex gap-3">
  {[
    { Icon: Instagram, href: "https://www.instagram.com/theblessedinstitute?igsh=MXd4ODdycTN6bWthdQ%3D%3D&utm_source=qr", label: "Instagram" },
    { Icon: () => <TikTokIcon className="h-4 w-4" />, href: "https://www.tiktok.com/@theblessedinstitute?_r=1&_t=ZS-97jLIYLFFY1", label: "TikTok" },
    { Icon: MessageCircle, href: "https://wa.me/2349026207960?text=Assal%C4%81mu+alaykum.+My+name+is+_________.+I+will+like+to+enrol+for+________.", label: "WhatsApp" },
  ].map(({ Icon, href, label }, i) => (
    <a
      key={i}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-brand"
    >
      <Icon className="h-4 w-4" />
    </a>
  ))}
</div>
          </div>
          <div className="md:justify-self-end">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Contact Us</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="flex items-center gap-2.5"><Mail className="h-4 w-4 text-brand" /> theblessedinstitute@gmail.com</li>
              <li className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-brand" /> +234 902 620 7960</li>
              <li className="flex items-center gap-2.5"><MapPin className="h-4 w-4 text-brand" /> Virtual Online School</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} The Blessed Institute. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <Hero />
        <About />
        <Approach />
        <EnrollPrivate />
        <Courses />
        <Testimonials />
        <CTABanner />
        <Contact />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
