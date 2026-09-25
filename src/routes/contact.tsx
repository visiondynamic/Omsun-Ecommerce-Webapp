import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  Building2,
  ShieldCheck,
  Headphones,
  ArrowRight,
  ChevronDown,
  ExternalLink,
  HelpCircle,
  Zap,
  Check,
  Compass,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { api } from "@/lib/api";
import bannerNepal from "@/assets/banner-nepal.webp";
import heroContactBg from "@/assets/hero-contact-bg.webp";

type ContactSearch = {
  product?: string | undefined;
  model?: string | undefined;
  series?: string | undefined;
  inquiryType?: string | undefined;
};

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): ContactSearch => {
    return {
      product: typeof search["product"] === "string" ? search["product"] : undefined,
      model: typeof search["model"] === "string" ? search["model"] : undefined,
      series: typeof search["series"] === "string" ? search["series"] : undefined,
      inquiryType: typeof search["inquiryType"] === "string" ? search["inquiryType"] : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Contact Us & Request a Quote | OMSUN Solar & Electrical Nepal" },
      {
        name: "description",
        content:
          "Get in touch with OMSUN Nepal Pvt. Ltd. for commercial solar EPC, residential hybrid installations, solar equipment distribution, Smarten product quotes, and technical consultations across Nepal.",
      },
    ],
  }),
  component: ContactPage,
});

/* ── HEAD OFFICE LOCATION DATA ── */
const headOffice = {
  city: "Kathmandu",
  name: "OMSUN Nepal Pvt. Ltd. – Regd. Office",
  address: "Budhanilkantha-8, Kathmandu, Nepal",
  landmark: "Showroom: Bhotebahal Marg-11, Kathmandu, Nepal",
  phone: "+977-01-53114114",
  hotline: "+977-9801828498",
  email: "nepalomsun@gmail.com",
  hours: "Sunday – Friday: 10:00 AM – 7:00 PM | Saturday: Closed",
  mapUrl: "https://maps.google.com/?q=Budhanilkantha+Kathmandu+Nepal",
  embedCoords: "27.7667° N, 85.3567° E",
  embedUrl: "https://maps.google.com/maps?q=27.7667,85.3567&z=15&output=embed",
};

/* ── FAQ DATA ── */
const faqs = [
  {
    question:
      "How quickly can OMSUN perform an on-site solar assessment in Kathmandu or outside the valley?",
    answer:
      "For Kathmandu Valley (Kathmandu, Lalitpur, Bhaktapur), our licensed solar engineers conduct site visits within 24 hours. For major cities outside the valley, visits are scheduled within 48 to 72 hours.",
  },
  {
    question: "Does OMSUN handle NEA Net-Metering paperwork and Grid Connection approvals?",
    answer:
      "Yes! OMSUN Nepal provides end-to-end turnkey EPC services. We handle 3D shadow analysis, system engineering design, single-line diagrams (SLD), and complete coordination with Nepal Electricity Authority (NEA) for net-metering bi-directional meter setup.",
  },
  {
    question:
      "Can I request wholesale distributor pricing for bulk solar panel or inverter orders?",
    answer:
      "Absolutely. We are direct importers and authorized distributors of Tier-1 N-type solar modules, hybrid/off-grid inverters, LiFePO4 batteries, and switchgear in Nepal. Select 'Wholesale / Distributor Supply' in the contact form or call our sales line.",
  },
  {
    question: "What warranties and post-installation support do you provide?",
    answer:
      "All solar panels come with 25-year performance warranties, inverters carry 5 to 10 year manufacturer warranties, and lithium batteries carry 5 to 10 year warranties. We maintain local spare parts stock in Kathmandu for fast warranty resolution.",
  },
  {
    question: "What information should I prepare before requesting a commercial solar quote?",
    answer:
      "Having your average monthly NEA electricity bill (in NPR or kWh), roof/ground dimensions, connection type (3-phase or single-phase), and backup runtime expectations helps us prepare a detailed 3D shadow analysis and ROI quote quickly.",
  },
];

function ContactPage() {
  const search = Route.useSearch();
  const defaultMessage = search.product
    ? `Hello OMSUN Nepal, I would like to request an official quotation and pricing for ${search.product}${search.model ? ` (Model: ${search.model})` : ""}${search.series ? ` [${search.series}]` : ""}. Please provide distributor pricing, warranty details, and delivery timeline.`
    : "";

  /* ── Form State ── */
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: search.product ? `Quotation: ${search.product}` : "",
    inquiryType: search.inquiryType || "wholesale",
    systemSize: search.model || "5kw-15kw",
    district: "Kathmandu",
    message: defaultMessage,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone or WhatsApp number.");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Please include a brief message or project details.");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.submitContact({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        inquiryType: formData.inquiryType,
        systemSize: formData.systemSize,
        district: formData.district,
        message: formData.message,
      });
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success("Inquiry Submitted Successfully!", {
        description:
          "Thank you for reaching out to OMSUN Nepal. Our solar engineering team will review your inquiry and contact you within 2 business hours.",
      });
    } catch {
      setIsSubmitting(false);
      toast.error("Submission failed. Please try again or call us directly.");
    }
  };

  const handleResetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      company: "",
      inquiryType: "residential",
      systemSize: "5kw-15kw",
      district: "Kathmandu",
      message: "",
    });
    setSubmitted(false);
  };

  return (
    <div className="min-h-dvh overflow-x-clip bg-background text-foreground">
      <Navbar />

      <main>
        {/* ── HERO BANNER ── */}
        <section className="relative overflow-hidden bg-[#041a12] pt-28 pb-28 lg:pt-36 lg:pb-32 text-white border-b border-emerald-950">
          {/* Subtle background graphics */}
          <img
            src={heroContactBg}
            alt="OMSUN Nepal Contact & Engineering Support"
            decoding="async"
            className="absolute inset-0 size-full object-cover object-center pointer-events-none opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#03150e]/90 via-[#03150e]/70 to-[#03150e]/85" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#03150e]/40 via-transparent to-[#041a12]" />
          <div className="pointer-events-none absolute -top-32 left-1/3 size-[500px] rounded-full bg-[#03C987]/15 blur-[140px]" />
          <div className="pointer-events-none absolute bottom-0 right-10 size-[350px] rounded-full bg-emerald-500/10 blur-[120px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#03C987] mb-6">
                <Headphones className="size-4" />
                <span>Power & Energy Solutions Nepal</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Let's Find the Right Power Solution for You
              </h1>

              <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed font-medium">
                Have a question about UPS systems, inverters, stabilizers, batteries, solar
                products, or need a quote? Our team is ready to help you find the right solution.
              </p>

              {/* Fast Action Stats Strip */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 divide-y divide-white/10 sm:divide-y-0 sm:divide-x rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md text-white">
                <div className="px-6 py-5">
                  <div className="font-display text-2xl font-extrabold text-[#03C987]">2 Hours</div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">
                    Average Response Time
                  </div>
                </div>
                <div className="px-6 py-5">
                  <div className="font-display text-2xl font-extrabold text-[#03C987]">24/7</div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">
                    Emergency Site Support
                  </div>
                </div>
                <div className="px-6 py-5">
                  <div className="font-display text-2xl font-extrabold text-[#03C987]">
                    Nepal-Wide
                  </div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">
                    Delivery & Installation Coverage
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 4 DIRECT CONTACT CARDS ── */}
        <section className="relative -mt-12 z-20 mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Kathmandu HQ */}
            <Reveal delay={0}>
              <div className="group h-full hover-lift rounded-3xl border border-slate-200 dark:border-white/10 bg-card p-6 shadow-xl transition-all hover:border-[#03C987]/50">
                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-[#03C987]/15 text-[#03C987] border border-[#03C987]/25 transition-colors group-hover:bg-[#03C987] group-hover:text-[#041a12]">
                  <MapPin className="size-6" />
                </div>
                <h3 className="text-base font-extrabold text-foreground">
                  Central Hub (Kathmandu)
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed font-medium">
                  Regd. Office: Budhanilkantha-8, Kathmandu, Nepal
                  <br />
                  Showroom: Bhotebahal Marg-11, Kathmandu, Nepal
                </p>
                <a
                  href="https://maps.google.com/?q=Budhanilkantha+Kathmandu+Nepal"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#03C987] hover:underline"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </Reveal>

            {/* Card 2: Phone & WhatsApp */}
            <Reveal delay={80}>
              <div className="group h-full hover-lift rounded-3xl border border-slate-200 dark:border-white/10 bg-card p-6 shadow-xl transition-all hover:border-[#03C987]/50">
                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-[#03C987]/15 text-[#03C987] border border-[#03C987]/25 transition-colors group-hover:bg-[#03C987] group-hover:text-[#041a12]">
                  <Phone className="size-6" />
                </div>
                <h3 className="text-base font-extrabold text-foreground">
                  Direct Phone & WhatsApp
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed font-medium">
                  Landline: +977-01-53114114
                  <br />
                  Mobile / WhatsApp: +977-9801828498
                  <br />
                  +977-9841403747 / +977-9841285760
                </p>
                <a
                  href="https://wa.me/9779801828498"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#03C987] hover:underline"
                >
                  <span>Chat on WhatsApp</span>
                  <ArrowRight className="size-3.5" />
                </a>
              </div>
            </Reveal>

            {/* Card 3: Email Channels */}
            <Reveal delay={160}>
              <div className="group h-full hover-lift rounded-3xl border border-slate-200 dark:border-white/10 bg-card p-6 shadow-xl transition-all hover:border-[#03C987]/50">
                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-[#03C987]/15 text-[#03C987] border border-[#03C987]/25 transition-colors group-hover:bg-[#03C987] group-hover:text-[#041a12]">
                  <Mail className="size-6" />
                </div>
                <h3 className="text-base font-extrabold text-foreground">Email Engineering</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed font-medium">
                  Official Email: nepalomsun@gmail.com
                </p>
                <a
                  href="mailto:nepalomsun@gmail.com"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#03C987] hover:underline"
                >
                  <span>Send Direct Email</span>
                  <ArrowRight className="size-3.5" />
                </a>
              </div>
            </Reveal>

            {/* Card 4: Operating Hours */}
            <Reveal delay={240}>
              <div className="group h-full hover-lift rounded-3xl border border-slate-200 dark:border-white/10 bg-card p-6 shadow-xl transition-all hover:border-[#03C987]/50">
                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-[#03C987]/15 text-[#03C987] border border-[#03C987]/25 transition-colors group-hover:bg-[#03C987] group-hover:text-[#041a12]">
                  <Clock className="size-6" />
                </div>
                <h3 className="text-base font-extrabold text-foreground">Business Hours</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed font-medium">
                  Sunday – Friday: 10:00 AM – 7:00 PM
                  <br />
                  Saturday: Closed
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
                  </span>
                  <span>Offices Open Today</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── MAIN INQUIRY FORM & SIDEBAR SECTION ── */}
        <section className="relative py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-12 items-start">
              {/* Left Column: Interactive Contact Form (7 cols) */}
              <div className="lg:col-span-7">
                <Reveal>
                  <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-card p-8 sm:p-10 shadow-xl text-foreground">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-6 mb-8">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#03C987]/30 bg-[#03C987]/10 px-3 py-1 text-[11px] font-bold text-[#03C987] mb-2 uppercase">
                          <MessageSquare className="size-3.5" />
                          <span>Fast Technical Inquiry</span>
                        </div>
                        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
                          Send a Direct Inquiry or Request a Quote
                        </h2>
                        <p className="mt-2 text-xs text-muted-foreground font-medium leading-relaxed">
                          Fill out the form below. Our engineering leads in Kathmandu will review
                          and get back to you with custom pricing and recommendations.
                        </p>
                      </div>
                    </div>

                    {search.product && (
                      <div className="mb-6 rounded-2xl border border-[#03C987]/40 bg-[#03C987]/10 p-4 sm:p-5 flex items-start gap-3.5">
                        <div className="size-9 rounded-xl bg-[#03C987]/15 border border-[#03C987]/40 flex items-center justify-center text-[#03C987] shrink-0 mt-0.5">
                          <Zap className="size-4.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#03C987] bg-[#03C987]/15 px-2 py-0.5 rounded-full mb-1">
                            Quotation Request
                          </span>
                          <h3 className="text-sm sm:text-base font-bold text-foreground truncate">
                            {search.product}
                            {search.model ? (
                              <span className="text-muted-foreground font-normal">
                                {" "}
                                — Model: {search.model}
                              </span>
                            ) : null}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            We have automatically configured your request for this product. You can
                            customize the details and quantity in the message below.
                          </p>
                        </div>
                      </div>
                    )}

                    {submitted ? (
                      <div className="rounded-2xl border border-[#03C987]/40 bg-[#03C987]/10 p-8 text-center">
                        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[#03C987] text-[#041a12] shadow-lg">
                          <Check className="size-8 stroke-[3]" />
                        </div>
                        <h3 className="font-display text-xl font-extrabold text-foreground">
                          Thank You, {formData.fullName}!
                        </h3>
                        <p className="mt-2 text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                          Your project inquiry for{" "}
                          <span className="text-[#03C987] font-bold">
                            {formData.inquiryType.toUpperCase()}
                          </span>{" "}
                          has been submitted to OMSUN Nepal's engineering dispatch desk.
                        </p>
                        <div className="mt-6 rounded-xl border border-slate-200 dark:border-white/10 bg-background/60 p-4 text-left text-xs space-y-2 text-muted-foreground">
                          <div>
                            <span className="text-foreground font-bold">Email:</span>{" "}
                            {formData.email}
                          </div>
                          <div>
                            <span className="text-foreground font-bold">Phone:</span>{" "}
                            {formData.phone}
                          </div>
                          <div>
                            <span className="text-foreground font-bold">District / Location:</span>{" "}
                            {formData.district}
                          </div>
                        </div>
                        <Button
                          onClick={handleResetForm}
                          className="mt-8 rounded-full bg-[#03C987] text-[#041a12] font-extrabold text-xs px-8 h-11 hover:bg-white transition-colors"
                        >
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                          {/* Full Name */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-foreground">
                              Full Name <span className="text-emerald-400">*</span>
                            </label>
                            <Input
                              type="text"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              placeholder="e.g. Sujan Shrestha"
                              required
                              className="h-12 rounded-xl text-xs focus-visible:ring-[#03C987]"
                            />
                          </div>

                          {/* Email Address */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-foreground">
                              Email Address <span className="text-emerald-400">*</span>
                            </label>
                            <Input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="e.g. sujan@company.com.np"
                              required
                              className="h-12 rounded-xl text-xs focus-visible:ring-[#03C987]"
                            />
                          </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                          {/* Phone / WhatsApp */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-foreground">
                              Phone / WhatsApp Number <span className="text-emerald-400">*</span>
                            </label>
                            <Input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="e.g. +977 9801234567"
                              required
                              className="h-12 rounded-xl text-xs focus-visible:ring-[#03C987]"
                            />
                          </div>

                          {/* Organization / Company */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-foreground">
                              Organization / Business Name{" "}
                              <span className="text-muted-foreground font-normal">(Optional)</span>
                            </label>
                            <Input
                              type="text"
                              name="company"
                              value={formData.company}
                              onChange={handleInputChange}
                              placeholder="e.g. Everest Hotel & Resort"
                              className="h-12 rounded-xl text-xs focus-visible:ring-[#03C987]"
                            />
                          </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-3">
                          {/* Inquiry Type */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-foreground">
                              Inquiry Category <span className="text-emerald-400">*</span>
                            </label>
                            <select
                              name="inquiryType"
                              value={formData.inquiryType}
                              onChange={handleInputChange}
                              className="h-12 w-full cursor-pointer rounded-xl border border-input bg-background px-3.5 text-xs text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-[#03C987]"
                            >
                              <option value="ups">UPS System</option>
                              <option value="inverter">Inverter</option>
                              <option value="battery">Battery</option>
                              <option value="stabilizer">Voltage Stabilizer</option>
                              <option value="solar">Solar Products</option>
                              <option value="powerbackup">Power Backup Solution</option>
                              <option value="other">Other / General Inquiry</option>
                            </select>
                          </div>

                          {/* Sizing Expectation */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-foreground">
                              System Sizing
                            </label>
                            <select
                              name="systemSize"
                              value={formData.systemSize}
                              onChange={handleInputChange}
                              className="h-12 w-full cursor-pointer rounded-xl border border-input bg-background px-3.5 text-xs text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-[#03C987]"
                            >
                              <option value="under-5kw">Under 5 kW (Home)</option>
                              <option value="5kw-15kw">5 kW – 15 kW (Standard)</option>
                              <option value="15kw-50kw">15 kW – 50 kW (Commercial)</option>
                              <option value="50kw-200kw">50 kW – 200 kW (Industrial)</option>
                              <option value="200kw-plus">200 kW+ Megawatt Scale</option>
                              <option value="not-sure">Not Sure / Sizing Needed</option>
                            </select>
                          </div>

                          {/* District / Location in Nepal */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-foreground">
                              Project District / City
                            </label>
                            <Input
                              type="text"
                              name="district"
                              value={formData.district}
                              onChange={handleInputChange}
                              placeholder="e.g. Kathmandu / Lalitpur"
                              className="h-12 rounded-xl text-xs focus-visible:ring-[#03C987]"
                            />
                          </div>
                        </div>

                        {/* Project Details Message */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-foreground">
                            Project Description & Specific Requirements{" "}
                            <span className="text-emerald-400">*</span>
                          </label>
                          <Textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Tell us your power requirement — e.g. UPS for office, inverter capacity needed, solar system size, backup hours required, or any other details..."
                            required
                            className="rounded-xl text-xs focus-visible:ring-[#03C987] resize-none"
                          />
                        </div>

                        {/* Submit Button */}
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="h-13 w-full rounded-2xl bg-[#03C987] text-[#041a12] font-extrabold text-sm hover:bg-white transition-all shadow-xl hover:shadow-[#03C987]/20 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {isSubmitting ? (
                            <span>Submitting Inquiry...</span>
                          ) : (
                            <>
                              <Send className="size-4" />
                              <span>Submit Engineering Inquiry</span>
                            </>
                          )}
                        </Button>

                        <p className="text-[11px] text-muted-foreground text-center font-medium">
                          🔒 Your data is kept strictly confidential. No spam policy guaranteed.
                        </p>
                      </form>
                    )}
                  </div>
                </Reveal>
              </div>

              {/* Right Column: Key Commitments & Regional Branch Directory (5 cols) */}
              <div className="lg:col-span-5 space-y-8">
                {/* Engineering Commitment Card */}
                <Reveal delay={0.1}>
                  <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-card p-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="grid size-10 place-items-center rounded-xl bg-[#03C987] text-[#041a12] font-black">
                        <ShieldCheck className="size-6" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-extrabold text-foreground">
                          The OMSUN Support Standard
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium">
                          Engineered for Nepalese grid conditions
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-4 text-xs text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="size-4 text-[#03C987] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-foreground block font-bold">
                            Licensed Engineering Team
                          </strong>
                          <span>
                            In-house solar EPC engineers certified for NEA grid connections &
                            high-voltage wiring.
                          </span>
                        </div>
                      </li>

                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="size-4 text-[#03C987] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-foreground block font-bold">
                            48-Hour Spare Parts Replacement
                          </strong>
                          <span>
                            Local Kathmandu inventory for Tier-1 solar panel modules, lithium
                            battery packs, and hybrid inverters.
                          </span>
                        </div>
                      </li>

                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="size-4 text-[#03C987] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-foreground block font-bold">
                            Turnkey Net-Metering (NEA)
                          </strong>
                          <span>
                            Complete assistance with paper submissions, SLD diagrams, and
                            bi-directional meter sanctioning.
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </Reveal>

                {/* Direct Call Quick Box */}
                <Reveal delay={0.2}>
                  <div className="rounded-3xl border border-[#03C987]/30 bg-gradient-to-br from-[#041a12] via-[#073d2c] to-[#041a12] p-8 text-white shadow-2xl">
                    <div className="flex items-center gap-3">
                      <Zap className="size-6 text-[#03C987]" />
                      <h4 className="font-display text-base font-extrabold text-white">
                        Prefer to speak directly?
                      </h4>
                    </div>
                    <p className="mt-2 text-xs text-slate-300 leading-relaxed font-medium">
                      Call our Kathmandu main desk during business hours for instant technical
                      answers and site scheduling.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <a
                        href="tel:+97701531144114"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#03C987] px-4 py-2.5 text-xs font-extrabold text-[#041a12] hover:bg-white transition-colors"
                      >
                        <Phone className="size-3.5" />
                        <span>+977-01-53114114</span>
                      </a>
                      <a
                        href="tel:+9779801828498"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-colors"
                      >
                        <span>+977-9801828498</span>
                      </a>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── HEAD OFFICE & MAP SECTION (SIGNATURE LIGHT LEAF MINT SECTION 🌿) ── */}
        <section className="relative bg-gradient-to-r from-[#E5F7EF] via-[#F2FBF6] to-[#EFF8FF] py-20 lg:py-24 border-y border-[#43B987]/30 text-[#173226]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#43B987]/40 bg-[#43B987]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#173226] mb-4">
                <Building2 className="size-4 text-[#03C987]" />
                <span>Visit Our Office</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#173226]">
                OMSUN Office &amp; Showroom in Kathmandu
              </h2>
              <p className="mt-3 text-sm text-[#475569] font-medium leading-relaxed">
                Walk in to see UPS systems, inverters, stabilizers and solar products in person — or
                use the map below for turn-by-turn directions.
              </p>
            </Reveal>

            <div className="grid gap-8 lg:grid-cols-12 items-stretch">
              {/* Office Details (5 cols) */}
              <Reveal className="lg:col-span-5">
                <div className="h-full rounded-3xl border border-[#43B987]/30 bg-white p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-7">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#03C987]/15 text-[#03C987]">
                      <Building2 className="size-6" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg sm:text-xl font-extrabold text-[#173226] leading-snug">
                        {headOffice.name}
                      </h3>
                      <p className="text-xs font-bold text-[#03C987]">Head Office &amp; Showroom</p>
                    </div>
                  </div>

                  <div className="space-y-5 text-xs">
                    <div className="flex items-start gap-3">
                      <MapPin className="size-4 text-[#03C987] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-extrabold text-[#173226]">Address &amp; Landmark</div>
                        <div className="text-[#475569] font-medium mt-0.5">
                          {headOffice.address}
                        </div>
                        <div className="text-[#475569] font-medium italic mt-0.5">
                          {headOffice.landmark}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="size-4 text-[#03C987] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-extrabold text-[#173226]">Landline &amp; Hotline</div>
                        <a
                          href={`tel:${headOffice.phone}`}
                          className="block text-[#475569] font-medium mt-0.5 hover:text-[#03C987] transition-colors"
                        >
                          Office: {headOffice.phone}
                        </a>
                        <a
                          href={`tel:${headOffice.hotline}`}
                          className="block text-[#475569] font-medium hover:text-[#03C987] transition-colors"
                        >
                          Hotline: {headOffice.hotline}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="size-4 text-[#03C987] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-extrabold text-[#173226]">Direct Email</div>
                        <a
                          href={`mailto:${headOffice.email}`}
                          className="text-[#475569] font-medium mt-0.5 hover:text-[#03C987] transition-colors"
                        >
                          {headOffice.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="size-4 text-[#03C987] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-extrabold text-[#173226]">Operating Hours</div>
                        <div className="text-[#475569] font-medium mt-0.5">{headOffice.hours}</div>
                      </div>
                    </div>
                  </div>

                  <a
                    href={headOffice.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#03C987] px-5 py-3 text-xs font-extrabold text-[#041a12] hover:bg-[#173226] hover:text-white transition-colors shadow-md"
                  >
                    <Compass className="size-4" />
                    <span>Get Google Maps Directions</span>
                  </a>
                </div>
              </Reveal>

              {/* Interactive Google Map Embed (7 cols) */}
              <Reveal className="lg:col-span-7">
                <div className="h-full overflow-hidden rounded-3xl border border-[#43B987]/30 bg-white shadow-xl flex flex-col">
                  <iframe
                    src={headOffice.embedUrl}
                    title={`${headOffice.city} OMSUN Office Map`}
                    className="w-full flex-1 min-h-[320px] sm:min-h-[420px] border-0"
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="flex items-center justify-between gap-3 border-t border-[#43B987]/25 bg-[#F6FCF9] px-5 py-3.5 text-xs">
                    <span className="flex items-center gap-1.5 font-extrabold text-[#173226]">
                      <MapPin className="size-3.5 text-[#03C987]" />
                      <span>GPS: {headOffice.embedCoords}</span>
                    </span>
                    <a
                      href={headOffice.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 font-bold text-[#475569] hover:text-[#03C987] transition-colors"
                    >
                      <span>Open Full Map</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── FREQUENTLY ASKED QUESTIONS ── */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <Reveal className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#03C987]/30 bg-[#03C987]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#03C987] mb-4">
                <HelpCircle className="size-4" />
                <span>Before You Write to Us</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">
                Questions We Answer Every Day
              </h2>
              <p className="mt-3 text-sm text-muted-foreground font-medium leading-relaxed">
                A quick read here often answers your question faster than waiting for a reply.
              </p>
            </Reveal>

            <div className="space-y-3">
              {faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <Reveal key={faq.question} delay={i * 60}>
                    <div
                      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                        isOpen
                          ? "border-[#03C987]/50 bg-[#03C987]/5 shadow-lg shadow-[#03C987]/5"
                          : "border-slate-200 dark:border-white/10 bg-card hover:border-[#03C987]/30"
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                        aria-expanded={isOpen}
                      >
                        <span className="text-sm font-bold text-foreground leading-snug">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`size-5 text-[#03C987] shrink-0 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-5 pt-4 border-t border-[#03C987]/15 text-sm text-muted-foreground leading-relaxed font-medium">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <Reveal className="mt-10 text-center">
              <Link
                to="/faq"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#03C987] hover:underline"
              >
                <span>Browse the full FAQ library</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ── CLOSING SUPPORT BAND ── */}
        <section className="px-4 sm:px-6 pb-24">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-[#03C987]/30 shadow-2xl">
                <img
                  src={bannerNepal}
                  alt="OMSUN Nepal nationwide power solutions"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#041a12]/95 via-[#073d2c]/90 to-[#041a12]/95" />

                <div className="relative p-10 sm:p-14 text-center text-white">
                  <div className="flex justify-center mb-4">
                    <div className="size-14 rounded-2xl bg-[#03C987]/15 border border-[#03C987]/30 grid place-items-center">
                      <Headphones className="size-7 text-[#03C987]" />
                    </div>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                    Need an Answer Right Now?
                  </h2>
                  <p className="mt-3 text-sm text-slate-300 font-medium max-w-md mx-auto leading-relaxed">
                    Our Kathmandu desk picks up during business hours — call us or message on
                    WhatsApp for instant technical guidance.
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Button
                      asChild
                      className="h-12 rounded-2xl bg-[#03C987] hover:bg-white text-[#041a12] font-extrabold px-8 text-sm shadow-xl cursor-pointer transition-colors"
                    >
                      <a href="tel:+9779801828498">
                        <Phone className="size-4 mr-2" />
                        Call +977-9801828498
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-12 rounded-2xl border-white/25 bg-white/10 text-white font-bold px-8 text-sm hover:bg-white/20 backdrop-blur-md"
                    >
                      <a href="https://wa.me/9779801828498" target="_blank" rel="noreferrer">
                        <MessageSquare className="size-4 mr-2" />
                        Chat on WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
