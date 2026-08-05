import { Link } from "@tanstack/react-router";
import { Eye, Leaf, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatNPR, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const out = product.stock === 0;

  return (
    <article className="surface-card hover-lift group relative flex flex-col overflow-hidden">
      <div className="relative overflow-hidden rounded-t-2xl bg-mist">
        <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
          {product.badges.map((b) => (
            <span
              key={b}
              className="rounded-full bg-navy/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground backdrop-blur"
            >
              {b}
            </span>
          ))}
          {product.efficient && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
              <Leaf className="size-3" /> Efficient
            </span>
          )}
        </div>
        <Link to="/product/$id" params={{ id: product.id }} aria-label={product.name}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={800}
            height={800}
            className="aspect-square w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          />
        </Link>
        <div className="pointer-events-none absolute inset-x-4 bottom-4 flex gap-2 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:pointer-events-auto group-hover:opacity-100">
          <Button
            asChild
            variant="secondary"
            className="h-11 flex-1 rounded-xl bg-card/90 backdrop-blur"
          >
            <Link to="/product/$id" params={{ id: product.id }}>
              <Eye className="size-4" /> Quick view
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {product.category}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold">
            <Star className="size-3.5 fill-lime text-lime" /> {product.rating}
          </span>
        </div>

        <h3 className="font-display text-lg font-bold leading-snug">
          <Link
            to="/product/$id"
            params={{ id: product.id }}
            className="transition-colors hover:text-primary"
          >
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.tagline}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div>
            <div className="font-display text-xl font-extrabold">{formatNPR(product.price)}</div>
            {product.compareAt && (
              <div className="text-xs text-muted-foreground line-through">
                {formatNPR(product.compareAt)}
              </div>
            )}
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold",
              out ? "bg-muted text-muted-foreground" : "bg-primary-soft text-primary",
            )}
          >
            <span
              className={cn("size-1.5 rounded-full", out ? "bg-muted-foreground" : "bg-primary")}
            />
            {out ? "Out of stock" : `${product.stock} in stock`}
          </span>
        </div>

        <Button
          disabled={out}
          onClick={() => toast.success(`${product.name} added to cart`)}
          className="mt-2 h-12 rounded-xl bg-energy font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5 disabled:bg-muted disabled:text-muted-foreground"
        >
          <ShoppingCart className="size-4" /> {out ? "Notify me" : "Add to cart"}
        </Button>
      </div>
    </article>
  );
}
