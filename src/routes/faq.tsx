import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, HelpCircle, MessageSquare, Phone } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | OMSUN Nepal Private Limited" },
      {
        name: "description",
        content:
          "Frequently asked questions about OMSUN Nepal products including UPS systems, inverters, batteries, voltage stabilizers, solar products, installation support, and after-sales service.",
      },
    ],
  }),
  component: FaqPage,
});

const faqs = [
  {
    category: "Products",
    items: [
      {
        q: "What products does OMSUN Nepal provide?",
        a: "OMSUN Nepal provides products including UPS systems, inverters, batteries, voltage stabilizers, solar products, power backup products, and related electrical and energy solutions.",
      },
      {
        q: "Do you provide products for homes?",
        a: "Yes. OMSUN offers products and solutions suitable for residential power backup and energy requirements.",
      },
      {
        q: "Do you provide commercial power solutions?",
        a: "Yes. We provide products suitable for different commercial and business applications, depending on the required capacity and application.",
      },
    ],
  },
  {
    category: "Choosing the Right Product",
    items: [
      {
        q: "How do I choose the right UPS or inverter?",
        a: "The correct product depends on your total load, required backup time, appliances/equipment, battery capacity, usage pattern, and budget. Contact our team for assistance in selecting a suitable option.",
      },
      {
        q: "Which battery is suitable for my inverter?",
        a: "Battery selection depends on the inverter specification, required backup time, load, usage pattern, and system configuration. Our team can help you identify a suitable battery based on your requirements.",
      },
      {
        q: "Do you provide solar solutions?",
        a: "Yes, OMSUN's product range includes solar-related products and energy solutions. Product availability may vary.",
      },
    ],
  },
  {
    category: "Installation & Support",
    items: [
      {
        q: "Do you provide installation support?",
        a: "Installation and support may be available depending on the product and requirement. Please contact our team before purchase to confirm the available service.",
      },
      {
        q: "Do you provide after-sales support?",
        a: "Yes, OMSUN aims to provide customer support after purchase. Specific warranty and service terms depend on the individual product.",
      },
    ],
  },
  {
    category: "Ordering & Delivery",
    items: [
      {
        q: "Can I request a quotation?",
        a: "Yes. You can contact OMSUN with your required product, quantity, application, and specifications to request a quotation.",
      },
      {
        q: "Can I purchase products online?",
        a: "Yes. Customers can explore available products through the OMSUN website and contact the company regarding product availability, pricing, delivery, and purchase.",
      },
      {
        q: "Do you deliver across Nepal?",
        a: "Delivery availability and charges may vary depending on the product and destination. Please contact OMSUN to confirm delivery options for your location.",
      },
      {
        q: "How can I contact OMSUN?",
        a: "You can contact us through phone, email, or the contact form available on our website. Call: +977-9801828498 | +977-9841403747 | +977-01-53114114. Email: nepalomsun@gmail.com",
      },
    ],
  },
];

function FaqPage() {
  const [openItem, setOpenItem] = useState<string | null>("0-0");

  const toggle = (key: string) => setOpenItem((prev) => (prev === key ? null : key));

  return (
    <div className="min-h-dvh overflow-x-clip bg-background text-foreground">
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#041a12] pt-28 pb-20 lg:pt-36 lg:pb-24 text-white border-b border-emerald-950">
          <div className="pointer-events-none absolute -top-32 left-1/3 size-[500px] rounded-full bg-[#03C987]/12 blur-[140px]" />
          <div className="pointer-events-none absolute bottom-0 right-10 size-[350px] rounded-full bg-emerald-500/8 blur-[120px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#03C987] mb-6">
                <HelpCircle className="size-4" />
                <span>Frequently Asked Questions</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] max-w-3xl mx-auto">
                Got Questions? We Have Answers.
              </h1>
              <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
                Find answers to common questions about OMSUN Nepal products, services,
                installation, delivery, and support.
              </p>
            </Reveal>
          </div>
        </section>

        {/* FAQ CONTENT */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="space-y-12">
              {faqs.map((group, gi) => (
                <Reveal key={group.category} delay={gi * 60}>
                  <div>
                    {/* Category heading */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="size-8 rounded-lg bg-[#03C987]/15 grid place-items-center">
                        <HelpCircle className="size-4 text-[#03C987]" />
                      </div>
                      <h2 className="text-base font-extrabold text-foreground uppercase tracking-wider">
                        {group.category}
                      </h2>
                    </div>

                    {/* Accordion items */}
                    <div className="space-y-3">
                      {group.items.map((item, ii) => {
                        const key = `${gi}-${ii}`;
                        const isOpen = openItem === key;
                        return (
                          <div
                            key={key}
                            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                              isOpen
                                ? "border-[#03C987]/50 bg-[#03C987]/5 shadow-lg shadow-[#03C987]/5"
                                : "border-slate-200 dark:border-white/10 bg-card hover:border-[#03C987]/30"
                            }`}
                          >
                            <button
                              id={`faq-${key}`}
                              onClick={() => toggle(key)}
                              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                              aria-expanded={isOpen}
                            >
                              <span className="text-sm font-bold text-foreground leading-snug">
                                {item.q}
                              </span>
                              <ChevronDown
                                className={`size-5 text-[#03C987] shrink-0 transition-transform duration-300 ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            {isOpen && (
                              <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed font-medium border-t border-[#03C987]/15 pt-4">
                                {item.a}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-24 px-4 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <div className="rounded-3xl bg-gradient-to-r from-[#041a12] via-[#073d2c] to-[#041a12] border border-[#03C987]/30 p-10 sm:p-14 text-white text-center shadow-2xl">
                <div className="flex justify-center mb-4">
                  <div className="size-14 rounded-2xl bg-[#03C987]/15 grid place-items-center">
                    <MessageSquare className="size-7 text-[#03C987]" />
                  </div>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                  Still Have Questions?
                </h2>
                <p className="mt-3 text-sm text-slate-300 font-medium max-w-md mx-auto leading-relaxed">
                  Our team is ready to help. Contact OMSUN Nepal for product information,
                  quotes, or any assistance you need.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Button
                    asChild
                    className="h-12 rounded-2xl bg-[#03C987] hover:bg-white text-[#041a12] font-extrabold px-8 text-sm shadow-xl cursor-pointer transition-colors"
                  >
                    <Link to="/contact">
                      <MessageSquare className="size-4 mr-2" />
                      Send an Inquiry
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 rounded-2xl border-white/25 bg-white/10 text-white font-bold px-8 text-sm hover:bg-white/20 backdrop-blur-md"
                  >
                    <a href="tel:+9779801828498">
                      <Phone className="size-4 mr-2" />
                      Call Us Now
                    </a>
                  </Button>
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
