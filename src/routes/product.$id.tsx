import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Award, Check, Minus, Plus, ShieldCheck, ShoppingCart, Star, Truck } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNPR, getProduct, products, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
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
  const { product } = Route.useLoaderData() as { product: Product };
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const gallery = [product.image, product.image, product.image];
  const related = products.filter((p) => p.id !== product.id).slice(0, 3);
  const out = product.stock === 0;

  return (
    <div className="min-h-dvh">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32 sm:pt-40">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span className="px-2">/</span>
          <Link to="/shop" className="hover:text-primary">
            Shop
          </Link>
          <span className="px-2">/</span>
          <span className="font-semibold text-foreground">{product.category}</span>
        </nav>

        <div className="mt-8 grid gap-14 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <div className="overflow-hidden rounded-[2rem] border bg-mist shadow-[var(--shadow-float)]">
              <img
                src={gallery[active]}
                alt={product.name}
                width={800}
                height={800}
                className="aspect-square w-full object-cover"
              />
            </div>
            <div className="mt-4 flex gap-3">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`View image ${i + 1}`}
                  className={cn(
                    "size-20 overflow-hidden rounded-2xl border-2 transition-colors",
                    active === i ? "border-primary" : "border-border hover:border-primary/40",
                  )}
                >
                  <img src={g} alt="" loading="lazy" className="size-full object-cover" />
                </button>
              ))}
            </div>

            <Tabs defaultValue="specs" className="mt-12">
              <TabsList className="h-12 rounded-2xl">
                <TabsTrigger value="specs" className="rounded-xl px-5">
                  Specifications
                </TabsTrigger>
                <TabsTrigger value="details" className="rounded-xl px-5">
                  Technical details
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
                <div className="surface-card space-y-4 p-6 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    {product.name} is supplied by OMSUN Nepal with full manufacturer documentation,
                    test certificates and a serialised warranty card. Installation guidance is
                    included with every order.
                  </p>
                  <p>
                    Our engineering team can size, integrate and commission this product as part of
                    a complete system — including load study, protection coordination and remote
                    monitoring.
                  </p>
                </div>
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

              <Button
                disabled={out}
                onClick={() => addToCart(product, qty)}
                className="mt-6 h-14 w-full rounded-2xl bg-energy text-base font-semibold text-primary-foreground shadow-glow transition-transform duration-300 hover:-translate-y-0.5 disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
              >
                <ShoppingCart className="size-5" /> {out ? "Notify me" : "Add to cart"}
              </Button>
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

        <section className="mt-28">
          <h2 className="font-display text-3xl font-extrabold">Related products</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
