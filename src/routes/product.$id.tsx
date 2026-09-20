import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Award,
  Check,
  CheckCircle2,
  Download,
  ExternalLink,
  FileDown,
  FileText,
  MessageSquare,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { QuoteEnquiryModal } from "@/components/site/QuoteEnquiryModal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNPR, fallbackProducts, mapApiProductToProduct, getProduct } from "@/lib/products";
import type { Product } from "@/lib/products";
import { GreenVoltTechnicalDetails } from "@/components/site/GreenVoltTechnicalDetails";
import { OmsunServoTechnicalDetails } from "@/components/site/OmsunServoTechnicalDetails";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import heroProductBg from "@/assets/hero-product-bg.webp";

export const Route = createFileRoute("/product/$id")({
  loader: async ({ params }) => {
    try {
      const row = await api.getProduct(params.id);
      if (row) return { product: mapApiProductToProduct(row) };
    } catch {
      // ignore and use fallback
    }
    const product = getProduct(params.id);
    if (product) return { product };
    throw notFound();
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const isQuoteOnly = p?.brand === "Smarten" || p?.brand === "Power-One" || p?.price === 0;
    const title = p ? `${p.name} | OMSUN Nepal` : "Product | OMSUN Nepal";
    const description = p
      ? isQuoteOnly
        ? `${p.name}${p.model ? ` (${p.model})` : ""}. Request an official quotation and distributor pricing from OMSUN Nepal. Nationwide delivery, manufacturer warranty, and certified technical support across Nepal.`
        : `${p.tagline} — ${formatNPR(p.price)}. Nationwide delivery, warranty and installation support from OMSUN Nepal.`
      : "OMSUN Nepal product details.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product: fallbackProduct } = Route.useLoaderData() as { product: Product };
  const { addToCart, buyNow } = useCart();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const { data: apiProduct } = useQuery<Product>({
    queryKey: ["product", fallbackProduct.id],
    queryFn: async () => {
      const row = await api.getProduct(fallbackProduct.id);
      return mapApiProductToProduct(row);
    },
    staleTime: 0,
    refetchOnMount: "always",
  });

  const { data: apiProducts } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const rows = await api.getProducts();
      return rows.map(mapApiProductToProduct);
    },
    staleTime: 0,
  });

  const product = apiProduct ?? fallbackProduct;
  const allProducts = apiProducts ?? fallbackProducts;
  const rawGallery =
    product.images && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];
  const gallery =
    product.image && !rawGallery.includes(product.image)
      ? [product.image, ...rawGallery]
      : rawGallery;

  // Filter out any SMF batteries strictly and sort by category/series relevance
  const related = allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        p.category !== "SMF Battery" &&
        !p.name.toLowerCase().includes("smf") &&
        !p.subcategory?.toLowerCase().includes("smf"),
    )
    .sort((a, b) => {
      if (a.category === product.category && b.category !== product.category) return -1;
      if (b.category === product.category && a.category !== product.category) return 1;
      if (product.series && a.series === product.series && b.series !== product.series) return -1;
      if (product.series && b.series === product.series && a.series !== product.series) return 1;
      if (a.brand === product.brand && b.brand !== product.brand) return -1;
      if (b.brand === product.brand && a.brand !== product.brand) return 1;
      return 0;
    })
    .slice(0, 3);

  const out = product.stock === 0;
  const isGreennVolt =
    product.brand?.toLowerCase().includes("green volt") ||
    product.brand?.toLowerCase().includes("greenn volt") ||
    product.name.toLowerCase().includes("green volt") ||
    product.name.toLowerCase().includes("greenn volt");
  const isOmsunServo =
    product.brand === "OMSUN" &&
    (product.category === "Stabilizer" ||
      product.subcategory?.toLowerCase().includes("servo") ||
      product.name.toLowerCase().includes("servo"));
  const isSmarten = product.brand === "Smarten";
  const isPowerOne = product.brand === "Power-One";
  const isQuoteOnly = isSmarten || isPowerOne || product.price === 0;

  const currentImage = gallery[active] || gallery[0] || product.image;

  // Build unified specifications list
  const specMap = new Map<string, string>();
  if (product.specs) {
    for (const s of product.specs) {
      if (s.label && s.value) specMap.set(s.label.trim(), s.value.trim());
    }
  }
  if (product.specifications) {
    for (const [k, v] of Object.entries(product.specifications)) {
      if (k && v && !specMap.has(k.trim())) {
        specMap.set(k.trim(), String(v).trim());
      }
    }
  }
  const combinedSpecs = Array.from(specMap.entries()).map(([label, value]) => ({ label, value }));

  const hasFeatures = Boolean(product.features && product.features.length > 0);
  const hasApplications = Boolean(product.applications && product.applications.length > 0);

  return (
    <div className="min-h-dvh">
      <Navbar />
      <main className="pb-24">
        {/* ── HERO BANNER ── */}
        <section className="relative overflow-hidden bg-[#041a12] pt-28 pb-12 sm:pt-36 sm:pb-14 text-white border-b border-emerald-950 mb-8">
          <img
            src={heroProductBg}
            alt={product.name}
            decoding="async"
            className="absolute inset-0 size-full object-cover object-center pointer-events-none opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#03150e]/90 via-[#03150e]/70 to-[#03150e]/85" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#03150e]/40 via-transparent to-[#041a12]" />

          <div className="relative mx-auto max-w-7xl px-6">
            <nav
              aria-label="Breadcrumb"
              className="text-xs font-medium text-emerald-300/80 mb-3 flex items-center gap-2 flex-wrap"
            >
              <Link to="/" className="hover:text-emerald-300 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link to="/shop" className="hover:text-emerald-300 transition-colors">
                Product
              </Link>
              <span>/</span>
              <Link
                to="/shop"
                search={{ category: product.category }}
                className="hover:text-emerald-300 transition-colors font-semibold"
              >
                {product.category}
              </Link>
              {product.series && (
                <>
                  <span>/</span>
                  <span className="text-emerald-200/90">{product.series}</span>
                </>
              )}
            </nav>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#03C987]">
                    <Zap className="size-3.5" />
                    <span>{product.category}</span>
                  </span>
                  {product.brand && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border",
                        isSmarten
                          ? "border-amber-400/40 bg-amber-400/15 text-amber-300"
                          : isPowerOne
                            ? "border-blue-400/40 bg-blue-400/15 text-blue-300"
                            : "border-sky-400/30 bg-sky-400/10 text-sky-300",
                      )}
                    >
                      {product.brand}
                    </span>
                  )}
                  {product.series && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                      {product.series}
                    </span>
                  )}
                  {product.model && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-mono font-bold text-white/90">
                      {product.model}
                    </span>
                  )}
                  {product.capacity && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs font-bold text-teal-300">
                      {product.capacity}
                    </span>
                  )}
                </div>

                <h1 className="font-display text-3xl font-extrabold sm:text-4xl text-white">
                  {product.name}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-emerald-100/70 max-w-2xl font-medium">
                  {product.tagline}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {product.brochureUrl && (
                  <a
                    href={product.brochureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/20 hover:bg-red-500/30 px-4 py-2.5 text-xs font-bold text-red-300 backdrop-blur-md transition-all shadow-lg hover:scale-105"
                  >
                    <FileDown className="size-4" />
                    <span>Official Brochure (PDF)</span>
                  </a>
                )}
                {isQuoteOnly ? (
                  <Button
                    onClick={() => setQuoteModalOpen(true)}
                    className="rounded-2xl border border-emerald-400/40 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 px-6 py-2.5 text-sm font-extrabold text-white shadow-xl shadow-emerald-950/30 backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
                  >
                    <MessageSquare className="size-4 mr-1.5" />
                    <span>Request a Quote</span>
                  </Button>
                ) : (
                  <span className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-2.5 text-base font-extrabold text-emerald-400 backdrop-blur-md">
                    {formatNPR(product.price)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 lg:gap-14 lg:grid-cols-[1.25fr_1fr]">
            <div>
              <div className="overflow-hidden rounded-[2rem] border border-[#D8F2DF] dark:border-white/10 bg-white dark:bg-[#071f17] shadow-xl p-4 sm:p-6 flex items-center justify-center">
                <img
                  src={currentImage}
                  alt={product.name}
                  width={800}
                  height={800}
                  className="aspect-square w-full max-h-[500px] object-contain transition-transform duration-300 ease-out hover:scale-105"
                />
              </div>

              {gallery.length > 1 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {gallery.map((g, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      aria-label={`View showcase image ${i + 1}`}
                      className={cn(
                        "size-20 sm:size-24 overflow-hidden rounded-2xl border-2 transition-all p-1 bg-white dark:bg-black/30 cursor-pointer shadow-xs",
                        active === i
                          ? "border-[#38B46A] ring-3 ring-[#38B46A]/25 scale-105"
                          : "border-slate-200 dark:border-white/10 hover:border-[#38B46A]/50 opacity-70 hover:opacity-100",
                      )}
                    >
                      <img src={g} alt="" loading="lazy" className="size-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              <Tabs defaultValue="specs" className="mt-12">
                <TabsList className="h-auto p-1.5 gap-1.5 flex flex-wrap rounded-2xl bg-muted/60">
                  <TabsTrigger value="specs" className="rounded-xl px-4 py-2 text-xs sm:text-sm">
                    Specifications
                  </TabsTrigger>
                  {hasFeatures && (
                    <TabsTrigger value="features" className="rounded-xl px-4 py-2 text-xs sm:text-sm">
                      Features
                    </TabsTrigger>
                  )}
                  {hasApplications && (
                    <TabsTrigger value="applications" className="rounded-xl px-4 py-2 text-xs sm:text-sm">
                      Applications
                    </TabsTrigger>
                  )}
                  <TabsTrigger value="details" className="rounded-xl px-4 py-2 text-xs sm:text-sm">
                    Product Overview
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="specs" className="mt-6">
                  <dl className="surface-card divide-y overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/10">
                    {combinedSpecs.map((s) => (
                      <div
                        key={s.label}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm"
                      >
                        <dt className="font-medium text-muted-foreground">{s.label}</dt>
                        <dd className="font-semibold text-foreground break-words">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </TabsContent>

                {hasFeatures && (
                  <TabsContent value="features" className="mt-6">
                    <div className="surface-card rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-7">
                      <h3 className="font-display text-lg font-bold mb-5 flex items-center gap-2 text-foreground">
                        <Sparkles className="size-5 text-emerald-500" />
                        Key Features & Engineered Advantages
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {product.features?.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] p-3.5"
                          >
                            <CheckCircle2 className="size-4.5 shrink-0 text-emerald-500 mt-0.5" />
                            <span className="text-xs sm:text-sm font-medium text-foreground/90 leading-snug">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                )}

                {hasApplications && (
                  <TabsContent value="applications" className="mt-6">
                    <div className="surface-card rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-7">
                      <h3 className="font-display text-lg font-bold mb-5 flex items-center gap-2 text-foreground">
                        <Zap className="size-5 text-amber-500" />
                        Recommended Applications & Suitable Equipment
                      </h3>
                      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                        {product.applications?.map((app, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 px-4 py-3 text-xs sm:text-sm font-semibold text-foreground"
                          >
                            <div className="size-2 rounded-full bg-amber-500 shrink-0" />
                            <span>{app}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                )}

                <TabsContent value="details" className="mt-6">
                  {isGreennVolt ? (
                    <GreenVoltTechnicalDetails product={product} />
                  ) : isOmsunServo ? (
                    <OmsunServoTechnicalDetails product={product} />
                  ) : (
                    <div className="surface-card space-y-4 p-6 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-white/10 text-sm leading-relaxed text-muted-foreground">
                      {product.description && (
                        <p className="font-medium text-foreground text-base leading-relaxed">
                          {product.description}
                        </p>
                      )}
                      <p>
                        {product.name} is supplied by OMSUN Nepal with full manufacturer
                        documentation, factory quality verification, and a serialised warranty card.
                        Professional installation guidance and engineering consultation are included.
                      </p>
                      <p>
                        Our engineering team can size, integrate, and commission this product as part
                        of a complete energy ecosystem — including load analysis, battery bank
                        balancing, surge protection, and remote solar monitoring.
                      </p>

                      {product.brochureUrl && (
                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-foreground">Official Product Documentation</h4>
                            <p className="text-xs text-muted-foreground">
                              Download official {product.brand} specifications sheet and manufacturer brochure
                            </p>
                          </div>
                          <a
                            href={product.brochureUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 px-4 py-2.5 text-xs font-bold transition-all"
                          >
                            <FileDown className="size-4" /> Download PDF Brochure
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sticky purchase panel */}
            <div className="lg:sticky lg:top-28 lg:h-fit">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  {product.brand} · {product.category}
                </span>
                {product.series && (
                  <span className="text-xs font-bold text-amber-500 dark:text-amber-400">
                    · {product.series}
                  </span>
                )}
              </div>

              <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight">
                {product.name}
              </h1>
              <p className="mt-4 text-muted-foreground">{product.tagline}</p>

              {/* Series, Model, Capacity Badges */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {product.series && (
                  <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    Series: {product.series}
                  </span>
                )}
                {product.model && (
                  <span className="rounded-md border border-slate-300 dark:border-white/20 bg-slate-100 dark:bg-white/10 px-2.5 py-0.5 text-xs font-mono font-semibold text-foreground">
                    Model: {product.model}
                  </span>
                )}
                {product.capacity && (
                  <span className="rounded-md border border-teal-500/30 bg-teal-500/10 px-2.5 py-0.5 text-xs font-semibold text-teal-600 dark:text-teal-400">
                    {product.capacity}
                  </span>
                )}
              </div>

              <div className="mt-5 flex items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1 font-bold">
                  <Star className="size-4 fill-lime text-lime" /> {product.rating}
                </span>
                <span className="text-muted-foreground">· 128 verified reviews</span>
              </div>

              {isQuoteOnly ? (
                <div className="surface-card mt-8 p-7 rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-card to-emerald-950/10 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200/80 dark:border-white/10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      <Zap className="size-3.5" />
                      <span>Official Quotation</span>
                    </div>
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Model: {product.model || product.name}
                    </span>
                  </div>

                  <div className="mt-5">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Pricing & Availability
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#38B46A] mt-1">
                      Price on Request
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      Official {product.brand} distributor and bulk project rates available for Nepal. Submit your inquiry to receive personalized pricing, warranty terms, and delivery timeline.
                    </p>
                  </div>

                  <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20 p-3.5 text-xs space-y-2 text-foreground">
                    <div className="flex items-center gap-2 font-medium">
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                      <span>Authorized {product.brand} Partner & Direct Importer</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium">
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                      <span>Official Manufacturer Warranty & Serialized Card</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium">
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                      <span>Ready Stock at Kathmandu Central Depot</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium">
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                      <span>System Engineering & Sizing Support Included</span>
                    </div>
                  </div>

                  {/* Primary & Secondary CTAs */}
                  <div className="mt-6 space-y-3">
                    <Button
                      size="lg"
                      onClick={() => setQuoteModalOpen(true)}
                      className="h-14 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-base shadow-xl shadow-emerald-950/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="size-5" />
                      <span>Request a Quote</span>
                    </Button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <Button
                        asChild
                        variant="outline"
                        className="h-12 rounded-xl border-slate-300 dark:border-white/20 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5"
                      >
                        <Link
                          to="/contact"
                          search={{
                            product: product.name,
                            model: product.model,
                            series: product.series,
                            inquiryType: isPowerOne ? "powerone-quote" : "smarten-quote",
                          }}
                        >
                          <ExternalLink className="size-3.5" />
                          <span>Enquire Now</span>
                        </Link>
                      </Button>

                      <a
                        href={`https://wa.me/9779801828498?text=${encodeURIComponent(
                          `Hello OMSUN Nepal, I would like to request an official quotation for ${product.name}${product.model ? ` (Model: ${product.model})` : ""}.`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-12 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="size-3.5" />
                        <span>WhatsApp Desk</span>
                      </a>
                    </div>

                    {product.brochureUrl && (
                      <a
                        href={product.brochureUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 h-12 w-full rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold transition-all"
                      >
                        <FileDown className="size-4" />
                        <span>Download Official Brochure (PDF)</span>
                      </a>
                    )}
                  </div>

                  {/* Flow breadcrumb */}
                  <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-white/10 text-center">
                    <p className="text-[11px] font-semibold text-muted-foreground">
                      Browse Product → View Details → View Specifications → <span className="text-[#38B46A] font-bold">Request a Quote</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="surface-card mt-8 p-7 rounded-2xl border border-slate-200/80 dark:border-white/10">
                  <div className="flex items-end gap-3">
                    <span className="font-display text-4xl font-extrabold">
                      {formatNPR(product.price)}
                    </span>
                    {product.compareAt && (
                      <span className="pb-1 text-sm text-muted-foreground line-through">
                        {formatNPR(product.compareAt)}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold border",
                        out
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                          : product.stock <= 5
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                      )}
                    >
                      <span
                        className={cn(
                          "size-2 rounded-full shrink-0",
                          out
                            ? "bg-rose-500"
                            : product.stock <= 5
                              ? "bg-amber-500 animate-pulse"
                              : "bg-emerald-500",
                        )}
                      />
                      {out
                        ? "Currently Out of Stock"
                        : product.stock <= 5
                          ? `Hurry, only ${product.stock} units left in stock!`
                          : `In Stock: ${product.stock} units available`}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      • Kathmandu Central Warehouse
                    </span>
                  </div>

                  <div className="mt-7 flex items-center gap-4">
                    <div className="flex items-center rounded-2xl border p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Decrease quantity"
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="min-h-11 min-w-11 rounded-xl"
                      >
                        <Minus className="size-4" />
                      </Button>
                      <span className="w-10 text-center font-display font-bold">{qty}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Increase quantity"
                        disabled={out || qty >= (product.stock || 1)}
                        onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))}
                        className="min-h-11 min-w-11 rounded-xl disabled:opacity-30"
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Total {formatNPR(product.price * qty)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <Button
                      disabled={out}
                      onClick={() => addToCart(product, qty)}
                      className="h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-sm font-bold hover:bg-emerald-500 hover:text-black transition-all"
                    >
                      <ShoppingCart className="size-4 mr-1.5" />{" "}
                      {out ? "Out of Stock" : "Add to Cart"}
                    </Button>

                    <Button
                      disabled={out}
                      onClick={() => buyNow(product, qty)}
                      className="h-14 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-sm shadow-xl hover:from-orange-400 hover:to-amber-500 transition-all hover:scale-[1.02]"
                    >
                      <Zap className="size-4 mr-1.5" /> Buy Now
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    className="mt-3 h-14 w-full rounded-2xl border-2 text-base font-semibold"
                    onClick={() => toast.success("Quote request sent to our sales engineer.")}
                  >
                    Request a bulk quote
                  </Button>

                  {product.brochureUrl && (
                    <a
                      href={product.brochureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center justify-center gap-2 h-12 w-full rounded-2xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs sm:text-sm font-bold transition-all"
                    >
                      <FileDown className="size-4" />
                      <span>Download Official Brochure (PDF)</span>
                    </a>
                  )}
                </div>
              )}

              <ul className="mt-6 grid gap-4">
                {[
                  {
                    icon: ShieldCheck,
                    t: "Warranty included",
                    d:
                      product.warranty ??
                      product.specs.find((s) => s.label.toLowerCase().includes("warranty"))?.value ??
                      "Manufacturer warranty",
                  },
                  {
                    icon: Truck,
                    t: "Nationwide delivery",
                    d: "Dispatched within 48 hours from Kathmandu",
                  },
                  {
                    icon: Award,
                    t: "Cash on delivery",
                    d: "Pay when your order arrives, anywhere in Nepal",
                  },
                ].map((t) => (
                  <li key={t.t} className="flex items-start gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-leaf-tint text-primary">
                      <t.icon className="size-5" strokeWidth={1.8} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold">{t.t}</span>
                      <span className="block text-sm text-muted-foreground">{t.d}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <section className="mt-16 sm:mt-28">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold">Related products</h2>
            <div className="mt-6 sm:mt-10 grid gap-3 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        </div>

        {/* ── MOBILE STICKY BOTTOM ACTION BAR (Daraz/Amazon Style) ── */}
        <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#071f17]/95 p-3 backdrop-blur-xl shadow-2xl flex items-center gap-2.5">
          {isQuoteOnly ? (
            <>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  {product.brand} Product
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-[#38B46A] truncate">
                  Official Quote on Request
                </div>
              </div>
              <Button
                onClick={() => setQuoteModalOpen(true)}
                className="h-11 rounded-xl px-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="size-3.5" />
                <span>Request a Quote</span>
              </Button>
            </>
          ) : (
            <>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total</div>
                  <span
                    className={cn(
                      "text-[9.5px] font-bold px-1.5 py-0.2 rounded",
                      out
                        ? "text-rose-600 bg-rose-500/10"
                        : product.stock <= 5
                          ? "text-amber-600 bg-amber-500/10"
                          : "text-emerald-600 bg-emerald-500/10",
                    )}
                  >
                    {out ? "Out of Stock" : `${product.stock} left`}
                  </span>
                </div>
                <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono truncate">
                  {formatNPR(product.price * qty)}
                </div>
              </div>
              <Button
                disabled={out}
                onClick={() => addToCart(product, qty)}
                variant="outline"
                className="h-11 rounded-xl px-3 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 text-xs font-bold shrink-0"
              >
                <ShoppingCart className="size-3.5 mr-1" /> Add
              </Button>
              <Button
                disabled={out}
                onClick={() => buyNow(product, qty)}
                className="h-11 rounded-xl px-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-md shrink-0"
              >
                <Zap className="size-3.5 mr-1" /> Buy Now
              </Button>
            </>
          )}
        </div>
      </main>
      <Footer />

      <QuoteEnquiryModal
        open={quoteModalOpen}
        onOpenChange={setQuoteModalOpen}
        product={product}
      />
    </div>
  );
}
