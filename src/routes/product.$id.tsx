import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Award,
  Check,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
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
    const title = p ? `${p.name} | OMSUN Nepal` : "Product | OMSUN Nepal";
    const description = p
      ? `${p.tagline} — ${formatNPR(p.price)}. Nationwide delivery, warranty and installation support from OMSUN Nepal.`
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
      : (product.image ? [product.image] : []);
  const gallery =
    product.image && !rawGallery.includes(product.image)
      ? [product.image, ...rawGallery]
      : rawGallery;
  const related = allProducts.filter((p) => p.id !== product.id).slice(0, 3);
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

  const currentImage = gallery[active] || gallery[0] || product.image;

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
              className="text-xs font-medium text-emerald-300/80 mb-3 flex items-center gap-2"
            >
              <Link to="/" className="hover:text-emerald-300 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link to="/shop" className="hover:text-emerald-300 transition-colors">
                Shop
              </Link>
              <span>/</span>
              <span className="text-white font-semibold">{product.category}</span>
            </nav>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#03C987] mb-2">
                  <Zap className="size-3.5" />
                  <span>{product.category}</span>
                </span>
                <h1 className="font-display text-3xl font-extrabold sm:text-4xl text-white">
                  {product.name}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-emerald-100/70 max-w-2xl font-medium">
                  {product.tagline}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-2.5 text-base font-extrabold text-emerald-400 backdrop-blur-md">
                  {formatNPR(product.price)}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-14 lg:grid-cols-[1.25fr_1fr]">
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
                <TabsList className="h-12 rounded-2xl">
                  <TabsTrigger value="specs" className="rounded-xl px-5">
                    Specifications
                  </TabsTrigger>
                  <TabsTrigger value="details" className="rounded-xl px-5">
                    Product details
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="specs" className="mt-6">
                  <dl className="surface-card divide-y overflow-hidden">
                    {product.specs.map((s) => (
                      <div key={s.label} className="grid grid-cols-2 gap-4 px-6 py-4 text-sm">
                        <dt className="font-medium text-muted-foreground">{s.label}</dt>
                        <dd className="font-semibold">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </TabsContent>
                <TabsContent value="details" className="mt-6">
                  {isGreennVolt ? (
                    <GreenVoltTechnicalDetails product={product} />
                  ) : isOmsunServo ? (
                    <OmsunServoTechnicalDetails product={product} />
                  ) : (
                    <div className="surface-card space-y-4 p-6 text-sm leading-relaxed text-muted-foreground">
                      {product.description && (
                        <p className="font-medium text-foreground">{product.description}</p>
                      )}
                      <p>
                        {product.name} is supplied by OMSUN Nepal with full manufacturer
                        documentation, test certificates and a serialised warranty card. Installation
                        guidance is included with every order.
                      </p>
                      <p>
                        Our engineering team can size, integrate and commission this product as part
                        of a complete system — including load study, protection coordination and
                        remote monitoring.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sticky purchase panel */}
            <div className="lg:sticky lg:top-28 lg:h-fit">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                {product.brand} · {product.category}
              </span>
              <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight">
                {product.name}
              </h1>
              <p className="mt-4 text-muted-foreground">{product.tagline}</p>

              <div className="mt-5 flex items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1 font-bold">
                  <Star className="size-4 fill-lime text-lime" /> {product.rating}
                </span>
                <span className="text-muted-foreground">· 128 verified reviews</span>
              </div>

              <div className="surface-card mt-8 p-7">
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
                <p
                  className={cn(
                    "mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold",
                    out ? "bg-muted text-muted-foreground" : "bg-primary-soft text-primary",
                  )}
                >
                  <Check className="size-3.5" />
                  {out ? "Currently out of stock" : `${product.stock} units available`}
                </p>

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
                      onClick={() => setQty((q) => q + 1)}
                      className="min-h-11 min-w-11 rounded-xl"
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
              </div>

              <ul className="mt-6 grid gap-4">
                {[
                  {
                    icon: ShieldCheck,
                    t: "Warranty included",
                    d:
                      product.specs.find((s) => s.label === "Warranty")?.value ??
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
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Price</div>
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
