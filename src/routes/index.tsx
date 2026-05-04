import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Building2,
  Users,
  BellRing,
  ReceiptText,
  Wrench,
  CalendarClock,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  BanknoteArrowUp,
  Menu,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RentEase NG — Rent Collection & Property Management for Nigeria" },
      {
        name: "description",
        content:
          "Modern rent collection and property management for Nigerian landlords, agents and property managers. Track tenants, payments, receipts, maintenance and lease renewals.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: Users, title: "Tenant records", desc: "Keep tenant details, lease terms and contacts in one organised place." },
  { icon: BellRing, title: "Rent reminders", desc: "Automated reminders so rent never slips through the cracks." },
  { icon: BanknoteArrowUp, title: "Payment history", desc: "Complete payment trail per tenant and per property." },
  { icon: ReceiptText, title: "Digital receipts", desc: "Generate and send professional receipts in seconds." },
  { icon: Wrench, title: "Maintenance complaints", desc: "Tenants log issues; you assign and track to resolution." },
  { icon: CalendarClock, title: "Lease expiry reminders", desc: "Know who is due for renewal weeks in advance." },
];

const NIGERIA = [
  "Annual rent support",
  "Agent commission tracking",
  "Caution fee tracking",
  "Service charge tracking",
  "WhatsApp-style reminders",
  "Bank transfer confirmation",
];

const PLANS = [
  {
    name: "Starter",
    price: "₦5,000",
    period: "/month",
    desc: "For individual landlords with a few units.",
    features: ["Up to 5 properties", "Up to 20 tenants", "Rent reminders", "Digital receipts"],
  },
  {
    name: "Professional",
    price: "₦15,000",
    period: "/month",
    desc: "For active landlords and small agencies.",
    features: ["Up to 25 properties", "Unlimited tenants", "Maintenance management", "Lease renewals", "Reports"],
    highlight: true,
  },
  {
    name: "Agency",
    price: "₦40,000",
    period: "/month",
    desc: "For estate agents and property managers.",
    features: ["Unlimited properties", "Multi-user team", "Agent commission tracking", "Priority support"],
  },
];

const FAQS = [
  { q: "Is RentEase NG built specifically for Nigeria?", a: "Yes. We support Naira, annual rent cycles, caution fees, service charges, agent commissions and reminder workflows that match how property is managed in Nigeria." },
  { q: "Can my tenants pay through the app?", a: "We are integrating with Paystack and Flutterwave. Today you can record bank transfers, POS, card and cash payments, then issue digital receipts." },
  { q: "Do tenants need to download anything?", a: "No. Tenants can view their rent and submit complaints directly from any browser on their phone." },
  { q: "Is my data secure?", a: "Yes. Each user only sees what their role allows. Landlords see their own properties; agents see what's assigned to them; tenants see their own records." },
];

function Landing() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">R</div>
            <span className="text-lg font-bold tracking-tight">RentEase <span className="text-primary-glow">NG</span></span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#features" className="text-muted-foreground hover:text-foreground">Features</a>
            <a href="#nigeria" className="text-muted-foreground hover:text-foreground">Why Nigeria</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground">Pricing</a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground">FAQ</a>
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Link to="/login"><Button variant="ghost">Log in</Button></Link>
            <Link to="/signup"><Button>Get Started</Button></Link>
          </div>
          <button className="md:hidden" onClick={() => setOpen(!open)}><Menu /></button>
        </div>
        {open && (
          <div className="border-t bg-background md:hidden">
            <div className="container mx-auto flex flex-col gap-3 p-4">
              <a href="#features" onClick={() => setOpen(false)}>Features</a>
              <a href="#nigeria" onClick={() => setOpen(false)}>Why Nigeria</a>
              <a href="#pricing" onClick={() => setOpen(false)}>Pricing</a>
              <a href="#faq" onClick={() => setOpen(false)}>FAQ</a>
              <Link to="/login"><Button variant="outline" className="w-full">Log in</Button></Link>
              <Link to="/signup"><Button className="w-full">Get Started</Button></Link>
            </div>
          </div>
        )}
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary via-primary to-primary-glow opacity-95" />
        <div className="absolute inset-0 -z-10 opacity-30" style={{ background: "radial-gradient(60% 60% at 80% 0%, white 0%, transparent 60%)" }} />
        <div className="container mx-auto max-w-6xl px-4 py-20 text-primary-foreground md:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5" /> Trusted by Nigerian landlords & agents
            </span>
            <h1 className="mt-6 text-4xl font-extrabold text-gray-700 leading-tight md:text-6xl">
              Collect rent. Manage properties. <span className="text-primary-glow">Sleep well.</span>
            </h1>
            <p className="mt-5 text-lg text-white/85 md:text-xl">
              RentEase NG is the simplest way for Nigerian landlords, agents and property managers
              to track tenants, rent, receipts and maintenance — all from one clean dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup"><Button size="lg" variant="secondary" className="font-semibold">Get Started Free</Button></Link>
              <Link to="/login"><Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">View Demo</Button></Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/80">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Naira-first</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> No card required</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Mobile friendly</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="container mx-auto max-w-6xl px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Everything you need to run your rentals</h2>
          <p className="mt-3 text-muted-foreground">Built for the realities of Nigerian property management.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title} className="border-border/60 transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="nigeria" className="bg-secondary py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Smartphone className="h-3.5 w-3.5" /> Built for Nigeria
              </span>
              <h2 className="mt-4 text-3xl font-bold md:text-4xl">
                Rent management that works the Nigerian way
              </h2>
              <p className="mt-4 text-muted-foreground">
                From annual rent to caution fees and agent commissions — RentEase NG fits how
                property is actually managed across Lagos, Abuja, Port Harcourt and beyond.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {NIGERIA.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl bg-background p-4 shadow-sm">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="container mx-auto max-w-6xl px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-3 text-muted-foreground">Pay monthly. Cancel anytime.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((p) => (
            <Card key={p.name} className={p.highlight ? "border-primary shadow-xl ring-2 ring-primary/20" : ""}>
              <CardContent className="p-8">
                {p.highlight && (
                  <div className="mb-4 inline-flex rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Most popular
                  </div>
                )}
                <h3 className="text-xl font-bold">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">{p.price}</span>
                  <span className="text-muted-foreground">{p.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/signup"><Button className="mt-8 w-full" variant={p.highlight ? "default" : "outline"}>Choose {p.name}</Button></Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="faq" className="bg-secondary py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Frequently asked questions</h2>
          </div>
          <Accordion type="single" collapsible className="rounded-xl bg-background p-2 shadow-sm">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={"i" + i}>
                <AccordionTrigger className="px-4 text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="px-4 text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-primary-glow p-10 text-center text-primary-foreground md:p-16">
          <Building2 className="mx-auto mb-4 h-10 w-10" />
          <h2 className="text-3xl font-bold md:text-4xl">Start managing your rentals today</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">
            Join landlords across Nigeria saving hours every week with RentEase NG.
          </p>
          <Link to="/signup"><Button size="lg" variant="secondary" className="mt-6 font-semibold">Create your free account</Button></Link>
        </div>
      </section>

      <footer className="border-t bg-background">
        <div className="container mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">R</div>
                <span className="font-bold">RentEase NG</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">Modern rent collection and property management for Nigeria.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Product</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Company</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>About</li>
                <li>Contact</li>
                <li>Privacy</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Get started</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><Link to="/signup">Sign up</Link></li>
                <li><Link to="/login">Log in</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} RentEase NG. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
