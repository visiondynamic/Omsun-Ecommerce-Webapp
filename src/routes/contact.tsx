import { createFileRoute } from "@tanstack/react-router";
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
import projectImg from "@/assets/project-nepal.webp";
import bannerNepal from "@/assets/banner-nepal.webp";
import heroContactBg from "@/assets/hero-contact-bg.webp";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us | OMSUN Solar & Electrical Nepal" },
      {
        name: "description",
        content:
          "Get in touch with OMSUN Nepal Pvt. Ltd. for commercial solar EPC, residential hybrid installations, solar equipment distribution, NEA net-metering assistance, and technical consultations across Nepal.",
      },
    ],
  }),
  component: ContactPage,
});

/* ── BRANCH LOCATION DATA ── */
const branchLocations = [
  {
    id: "kathmandu",
    city: "Kathmandu (Central HQ)",
    name: "Teku Solar & Electrical Hub",
    address: "Teku Main Ring Road Corridor, Ward 12, Kathmandu 44600, Nepal",
    landmark: "50m South of Teku Bridge, Opposite Electric Substation",
    phone: "+977 1 5320 118",
    hotline: "+977 9801 234 567",
    email: "info@omsunnepal.com",
    hours: "Mon – Fri: 9:00 AM – 6:00 PM | Sat: 10:00 AM – 4:00 PM",
    isHQ: true,
    mapUrl: "https://maps.google.com/?q=Teku+Kathmandu+Nepal",
    embedCoords: "27.6978° N, 85.3045° E",
    embedUrl: "https://maps.google.com/maps?q=27.6978,85.3045&z=15&output=embed",
  },
  {
    id: "pokhara",
    city: "Pokhara",
    name: "Gandaki Solar & Inverter Depot",
    address: "Naya Bazar Commercial Zone, Pokhara 33700, Kaski, Nepal",
    landmark: "Near Pokhara Bus Park Highway Plaza",
    phone: "+977 61 541 209",
    hotline: "+977 9801 234 568",
    email: "pokhara@omsunnepal.com",
    hours: "Mon – Sat: 9:30 AM – 5:30 PM",
    isHQ: false,
    mapUrl: "https://maps.google.com/?q=Naya+Bazar+Pokhara+Nepal",
    embedCoords: "28.2096° N, 83.9856° E",
    embedUrl: "https://maps.google.com/maps?q=28.2096,83.9856&z=15&output=embed",
  },
  {
    id: "biratnagar",
    city: "Biratnagar",
    name: "Koshi Industrial Logistics Centre",
    address: "Main Road Industrial Area, Ward 4, Biratnagar, Morang, Nepal",
    landmark: "Bargachhi Chowk Logistics Hub",
    phone: "+977 21 470 155",
    hotline: "+977 9801 234 569",
    email: "biratnagar@omsunnepal.com",
    hours: "Mon – Sat: 9:00 AM – 5:00 PM",
    isHQ: false,
    mapUrl: "https://maps.google.com/?q=Biratnagar+Morang+Nepal",
    embedCoords: "26.4525° N, 87.2718° E",
    embedUrl: "https://maps.google.com/maps?q=26.4525,87.2718&z=15&output=embed",
  },
  {
    id: "butwal",
    city: "Butwal",
    name: "Lumbini Energy Distribution Hub",
    address: "Traffic Chowk, Highway Link, Butwal 32907, Rupandehi, Nepal",
    landmark: "Opposite Commercial Bank Tower",
    phone: "+977 71 540 882",
    hotline: "+977 9801 234 570",
    email: "butwal@omsunnepal.com",
    hours: "Mon – Sat: 9:30 AM – 5:30 PM",
    isHQ: false,
    mapUrl: "https://maps.google.com/?q=Traffic+Chowk+Butwal+Nepal",
    embedCoords: "27.7006° N, 83.4484° E",
    embedUrl: "https://maps.google.com/maps?q=27.7006,83.4484&z=15&output=embed",
  },
];

/* ── FAQ DATA ── */
const faqs = [
  {
    question:
      "How quickly can OMSUN perform an on-site solar assessment in Kathmandu or outside the valley?",
    answer:
      "For Kathmandu Valley (Kathmandu, Lalitpur, Bhaktapur), our licensed solar engineers conduct site visits within 24 hours. For major regional hubs (Pokhara, Biratnagar, Chitwan, Butwal), visits are scheduled within 48 to 72 hours.",
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
      "All solar panels come with 25-year performance warranties, inverters carry 5 to 10 year manufacturer warranties, and lithium batteries carry 5 to 10 year warranties. We maintain local spare parts stock in Teku, Kathmandu for fast warranty resolution.",
  },
  {
    question: "What information should I prepare before requesting a commercial solar quote?",
    answer:
      "Having your average monthly NEA electricity bill (in NPR or kWh), roof/ground dimensions, connection type (3-phase or single-phase), and backup runtime expectations helps us prepare a detailed 3D shadow analysis and ROI quote quickly.",
  },
];

function ContactPage() {
  /* ── Form State ── */
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    inquiryType: "residential",
    systemSize: "5kw-15kw",
    district: "Kathmandu",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("kathmandu");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const activeBranch = branchLocations.find((b) => b.id === selectedBranch) || branchLocations[0]!;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success("Inquiry Submitted Successfully!", {
        description:
          "Thank you for reaching out to OMSUN Nepal. Our solar engineering team will review your inquiry and contact you within 2 business hours.",
      });
    }, 1200);
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
        <section className="relative overflow-hidden bg-[#041a12] pt-28 pb-20 lg:pt-36 lg:pb-24 text-white border-b border-emerald-950">
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
                <span>Nepal Solar & Engineering Support</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Let's Power Your Next Solar Project in Nepal
              </h1>

              <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Have questions about custom solar sizing, NEA net-metering, equipment supply, or
                warranty support? Contact our Kathmandu engineering team or regional hubs.
              </p>

              {/* Fast Action Stats Strip */}
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md text-white">
                <div>
                  <div className="font-display text-2xl font-extrabold text-[#03C987]">2 Hours</div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">
                    Average Response Time
                  </div>
                </div>
                <div>
                  <div className="font-display text-2xl font-extrabold text-[#03C987]">24/7</div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">
                    Emergency Site Support
                  </div>
                </div>
                <div>
                  <div className="font-display text-2xl font-extrabold text-[#03C987]">4 Hubs</div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">
                    Kathmandu, Pokhara, Biratnagar, Butwal
                  </div>
                </div>
                <div>
                  <div className="font-display text-2xl font-extrabold text-[#03C987]">
                    100% Free
                  </div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">
                    3D Shadow Analysis & Quote
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 4 DIRECT CONTACT CARDS ── */}
        <section className="relative -mt-10 z-20 mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Teku HQ */}
            <div className="rounded-2xl border border-emerald-900/40 bg-[#06241a] p-6 text-white shadow-xl transition-all duration-300 hover:border-[#03C987]/50 hover:shadow-2xl hover:shadow-[#03C987]/10 group">
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-[#03C987]/15 text-[#03C987] border border-[#03C987]/30 group-hover:bg-[#03C987] group-hover:text-[#041a12] transition-colors">
                <MapPin className="size-6" />
              </div>
              <h3 className="text-base font-extrabold text-white">Central Hub (Kathmandu)</h3>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed font-medium">
                Teku Main Ring Road Corridor, Ward 12, Kathmandu, Nepal
              </p>
              <a
                href="https://maps.google.com/?q=Teku+Kathmandu+Nepal"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#03C987] hover:underline"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="size-3.5" />
              </a>
            </div>

            {/* Card 2: Phone & WhatsApp */}
            <div className="rounded-2xl border border-emerald-900/40 bg-[#06241a] p-6 text-white shadow-xl transition-all duration-300 hover:border-[#03C987]/50 hover:shadow-2xl hover:shadow-[#03C987]/10 group">
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-[#03C987]/15 text-[#03C987] border border-[#03C987]/30 group-hover:bg-[#03C987] group-hover:text-[#041a12] transition-colors">
                <Phone className="size-6" />
              </div>
              <h3 className="text-base font-extrabold text-white">Direct Phone & WhatsApp</h3>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed font-medium">
                Landline: +977 1 5320 118
                <br />
                Hotline / WhatsApp: +977 9801 234 567
              </p>
              <a
                href="https://wa.me/9779801234567"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#03C987] hover:underline"
              >
                <span>Chat on WhatsApp</span>
                <ArrowRight className="size-3.5" />
              </a>
            </div>

            {/* Card 3: Email Channels */}
            <div className="rounded-2xl border border-emerald-900/40 bg-[#06241a] p-6 text-white shadow-xl transition-all duration-300 hover:border-[#03C987]/50 hover:shadow-2xl hover:shadow-[#03C987]/10 group">
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-[#03C987]/15 text-[#03C987] border border-[#03C987]/30 group-hover:bg-[#03C987] group-hover:text-[#041a12] transition-colors">
                <Mail className="size-6" />
              </div>
              <h3 className="text-base font-extrabold text-white">Email Engineering</h3>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed font-medium">
                General: info@omsunnepal.com
                <br />
                Commercial Sales: sales@omsunnepal.com
              </p>
              <a
                href="mailto:info@omsunnepal.com"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#03C987] hover:underline"
              >
                <span>Send Direct Email</span>
                <ArrowRight className="size-3.5" />
              </a>
            </div>

            {/* Card 4: Operating Hours */}
            <div className="rounded-2xl border border-emerald-900/40 bg-[#06241a] p-6 text-white shadow-xl transition-all duration-300 hover:border-[#03C987]/50 hover:shadow-2xl hover:shadow-[#03C987]/10 group">
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-[#03C987]/15 text-[#03C987] border border-[#03C987]/30 group-hover:bg-[#03C987] group-hover:text-[#041a12] transition-colors">
                <Clock className="size-6" />
              </div>
              <h3 className="text-base font-extrabold text-white">Business Hours</h3>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed font-medium">
                Monday – Friday: 9:00 AM – 6:00 PM
                <br />
                Saturday: 10:00 AM – 4:00 PM
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
                </span>
                <span>Offices Open Today</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── MAIN INQUIRY FORM & SIDEBAR SECTION ── */}
        <section className="relative py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-12 items-start">
              {/* Left Column: Interactive Contact Form (7 cols) */}
              <div className="lg:col-span-7">
                <Reveal>
                  <div className="rounded-3xl border border-emerald-900/30 bg-[#041f16] p-8 sm:p-10 shadow-2xl text-white">
                    <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#03C987]/30 bg-[#03C987]/10 px-3 py-1 text-[11px] font-bold text-[#03C987] mb-2 uppercase">
                          <MessageSquare className="size-3.5" />
                          <span>Fast Technical Inquiry</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                          Send a Direct Inquiry or Request a Quote
                        </h2>
                        <p className="mt-1 text-xs text-slate-300 font-medium">
                          Fill out the form below. Our engineering leads in Kathmandu will review
                          and get back to you with custom pricing and recommendations.
                        </p>
                      </div>
                    </div>

                    {submitted ? (
                      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-8 text-center">
                        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[#03C987] text-[#041a12] shadow-lg">
                          <Check className="size-8 stroke-[3]" />
                        </div>
                        <h3 className="text-xl font-extrabold text-white">
                          Thank You, {formData.fullName}!
                        </h3>
                        <p className="mt-2 text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                          Your project inquiry for{" "}
                          <span className="text-[#03C987] font-bold">
                            {formData.inquiryType.toUpperCase()}
                          </span>{" "}
                          has been submitted to OMSUN Nepal's engineering dispatch desk.
                        </p>
                        <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-4 text-left text-xs space-y-2 text-slate-300">
                          <div>
                            <span className="text-slate-400 font-medium">Email:</span>{" "}
                            {formData.email}
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">Phone:</span>{" "}
                            {formData.phone}
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">District / Location:</span>{" "}
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
                            <label className="text-xs font-bold text-slate-200">
                              Full Name <span className="text-emerald-400">*</span>
                            </label>
                            <Input
                              type="text"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              placeholder="e.g. Sujan Shrestha"
                              required
                              className="h-12 rounded-xl border-white/15 bg-black/40 text-xs text-white placeholder:text-slate-500 focus-visible:ring-[#03C987]"
                            />
                          </div>

                          {/* Email Address */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-200">
                              Email Address <span className="text-emerald-400">*</span>
                            </label>
                            <Input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="e.g. sujan@company.com.np"
                              required
                              className="h-12 rounded-xl border-white/15 bg-black/40 text-xs text-white placeholder:text-slate-500 focus-visible:ring-[#03C987]"
                            />
                          </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                          {/* Phone / WhatsApp */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-200">
                              Phone / WhatsApp Number <span className="text-emerald-400">*</span>
                            </label>
                            <Input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="e.g. +977 9801234567"
                              required
                              className="h-12 rounded-xl border-white/15 bg-black/40 text-xs text-white placeholder:text-slate-500 focus-visible:ring-[#03C987]"
                            />
                          </div>

                          {/* Organization / Company */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-200">
                              Organization / Business Name{" "}
                              <span className="text-slate-400 font-normal">(Optional)</span>
                            </label>
                            <Input
                              type="text"
                              name="company"
                              value={formData.company}
                              onChange={handleInputChange}
                              placeholder="e.g. Everest Hotel & Resort"
                              className="h-12 rounded-xl border-white/15 bg-black/40 text-xs text-white placeholder:text-slate-500 focus-visible:ring-[#03C987]"
                            />
                          </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-3">
                          {/* Inquiry Type */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-200">
                              Inquiry Category <span className="text-emerald-400">*</span>
                            </label>
                            <select
                              name="inquiryType"
                              value={formData.inquiryType}
                              onChange={handleInputChange}
                              className="h-12 w-full rounded-xl border border-white/15 bg-[#041a12] px-3.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#03C987]"
                            >
                              <option value="residential">Residential Solar</option>
                              <option value="commercial">Commercial & Industrial EPC</option>
                              <option value="offgrid">Off-Grid Himalayan System</option>
                              <option value="wholesale">Wholesale / Distributor Supply</option>
                              <option value="service">Maintenance & Technical Support</option>
                            </select>
                          </div>

                          {/* Sizing Expectation */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-200">
                              System Sizing
                            </label>
                            <select
                              name="systemSize"
                              value={formData.systemSize}
                              onChange={handleInputChange}
                              className="h-12 w-full rounded-xl border border-white/15 bg-[#041a12] px-3.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#03C987]"
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
                            <label className="text-xs font-bold text-slate-200">
                              Project District / City
                            </label>
                            <Input
                              type="text"
                              name="district"
                              value={formData.district}
                              onChange={handleInputChange}
                              placeholder="e.g. Kathmandu / Pokhara"
                              className="h-12 rounded-xl border-white/15 bg-black/40 text-xs text-white placeholder:text-slate-500 focus-visible:ring-[#03C987]"
                            />
                          </div>
                        </div>

                        {/* Project Details Message */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-200">
                            Project Description & Specific Requirements{" "}
                            <span className="text-emerald-400">*</span>
                          </label>
                          <Textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Tell us about your rooftop type, current monthly electricity bill, grid connection type, or specific solar module/inverter preferences..."
                            required
                            className="rounded-xl border-white/15 bg-black/40 text-xs text-white placeholder:text-slate-500 focus-visible:ring-[#03C987] resize-none"
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

                        <p className="text-[11px] text-slate-400 text-center font-medium">
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
                  <div className="rounded-3xl border border-emerald-900/30 bg-[#06241a] p-8 text-white shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="grid size-10 place-items-center rounded-xl bg-[#03C987] text-[#041a12] font-black">
                        <ShieldCheck className="size-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold text-white">
                          The OMSUN Support Standard
                        </h3>
                        <p className="text-xs text-slate-400 font-medium">
                          Engineered for Nepalese grid conditions
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-4 text-xs text-slate-200">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="size-4 text-[#03C987] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white block font-bold">
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
                          <strong className="text-white block font-bold">
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
                          <strong className="text-white block font-bold">
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
                  <div className="rounded-3xl border border-[#03C987]/30 bg-gradient-to-br from-[#03C987]/15 to-[#041a12] p-8 text-white shadow-xl">
                    <div className="flex items-center gap-3">
                      <Zap className="size-6 text-[#03C987]" />
                      <h4 className="text-base font-extrabold text-white">
                        Prefer to speak directly?
                      </h4>
                    </div>
                    <p className="mt-2 text-xs text-slate-300 leading-relaxed font-medium">
                      Call our Teku Kathmandu main desk during business hours for instant technical
                      answers and site scheduling.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <a
                        href="tel:+97715320118"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#03C987] px-4 py-2.5 text-xs font-extrabold text-[#041a12] hover:bg-white transition-colors"
                      >
                        <Phone className="size-3.5" />
                        <span>+977 1 5320 118</span>
                      </a>
                      <a
                        href="tel:+9779801234567"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-colors"
                      >
                        <span>+977 9801 234 567</span>
                      </a>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── INTERACTIVE MULTI-BRANCH LOCATION TAB SECTION (SIGNATURE LIGHT LEAF MINT SECTION 🌿) ── */}
        <section className="relative bg-gradient-to-r from-[#E5F7EF] via-[#F2FBF6] to-[#EFF8FF] py-20 lg:py-24 border-t border-b border-[#43B987]/30 text-[#173226]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#43B987]/40 bg-[#43B987]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#173226] mb-3">
                <Building2 className="size-4 text-[#03C987]" />
                <span>Nationwide Presence</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#173226]">
                OMSUN Offices & Warehouses Across Nepal
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#475569] font-medium">
                Select a regional center to view full address details, local contact lines,
                operating hours, and map locations.
              </p>
            </Reveal>

            {/* Branch Selector Tabs */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
              {branchLocations.map((branch) => {
                const isActive = branch.id === selectedBranch;
                return (
                  <button
                    key={branch.id}
                    onClick={() => setSelectedBranch(branch.id)}
                    className={`rounded-2xl px-5 py-3 text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? "bg-[#03C987] text-[#041a12] shadow-lg shadow-[#03C987]/20 scale-105"
                        : "border border-[#43B987]/20 bg-white text-[#173226] hover:bg-white/80"
                    }`}
                  >
                    <Building2 className="size-3.5" />
                    <span>{branch.city}</span>
                    {branch.isHQ && (
                      <span className="rounded-full bg-[#041a12] px-2 py-0.5 text-[9px] font-black uppercase text-[#03C987]">
                        HQ
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Branch Display Card & Visual Map Box */}
            <div className="grid gap-8 lg:grid-cols-12 items-center rounded-3xl border border-emerald-900/40 bg-[#06241a] p-8 sm:p-10 shadow-2xl text-white">
              {/* Branch Information (6 cols) */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-2xl bg-[#03C987]/15 text-[#03C987] border border-[#03C987]/30">
                    <Building2 className="size-6" />
                  </span>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                      {activeBranch.name}
                    </h3>
                    <p className="text-xs text-[#03C987] font-bold">
                      {activeBranch.city} Regional Center
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <MapPin className="size-4 text-[#03C987] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Address & Landmark</div>
                      <div className="text-slate-300">{activeBranch.address}</div>
                      <div className="text-slate-400 font-medium italic mt-0.5">
                        {activeBranch.landmark}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="size-4 text-[#03C987] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Landline & Hotline</div>
                      <div className="text-slate-300">Office: {activeBranch.phone}</div>
                      <div className="text-slate-300">Hotline: {activeBranch.hotline}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="size-4 text-[#03C987] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Direct Email</div>
                      <div className="text-slate-300">{activeBranch.email}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="size-4 text-[#03C987] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Operating Hours</div>
                      <div className="text-slate-300">{activeBranch.hours}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={activeBranch.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#03C987] px-5 py-3 text-xs font-extrabold text-[#041a12] hover:bg-white transition-colors shadow-md"
                  >
                    <Compass className="size-4" />
                    <span>Get Google Maps Directions</span>
                  </a>
                </div>
              </div>

              {/* Interactive Google Map Embed (6 cols) */}
              <div className="lg:col-span-6">
                <div className="relative overflow-hidden rounded-2xl border border-[#03C987]/30 bg-[#02130d] shadow-2xl min-h-[320px] flex flex-col">
                  {/* Google Maps Iframe */}
                  <iframe
                    src={activeBranch.embedUrl}
                    title={`${activeBranch.city} OMSUN Branch Map`}
                    className="w-full h-80 sm:h-96 rounded-2xl border-0 filter opacity-95 hover:opacity-100 transition-opacity"
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="p-3 bg-[#041a12] border-t border-white/10 flex items-center justify-between text-xs text-white">
                    <span className="flex items-center gap-1.5 font-bold text-[#03C987]">
                      <MapPin className="size-3.5" />
                      <span>GPS: {activeBranch.embedCoords}</span>
                    </span>
                    <a
                      href={activeBranch.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-white hover:text-[#03C987] flex items-center gap-1 transition-colors"
                    >
                      <span>Open Full Map</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
