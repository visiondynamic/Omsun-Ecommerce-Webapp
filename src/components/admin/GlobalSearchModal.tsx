import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Package, ShoppingBag, Users, FolderTree, ArrowRight, Zap } from "lucide-react";
import { Product } from "@/lib/products";
import { AdminOrder, AdminCustomer } from "@/lib/adminData";
import { AdminSection } from "./AdminSidebar";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: AdminOrder[];
  customers: AdminCustomer[];
  onSelectSection: (section: AdminSection) => void;
  onSelectOrder?: (order: AdminOrder) => void;
}

export function GlobalSearchModal({
  isOpen,
  onClose,
  products,
  orders,
  customers,
  onSelectSection,
  onSelectOrder,
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const filteredProducts = query
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredOrders = query
    ? orders.filter(
        (o) =>
          o.id.toLowerCase().includes(query.toLowerCase()) ||
          o.customerName.toLowerCase().includes(query.toLowerCase()) ||
          o.customerEmail.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredCustomers = query
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.email.toLowerCase().includes(query.toLowerCase()) ||
          c.city.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleNavigate = (section: AdminSection) => {
    onSelectSection(section);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl bg-white dark:bg-[#0c241c] border-[#E2EDE7] dark:border-white/10 shadow-2xl">
        <DialogTitle className="sr-only">Search Command Palette</DialogTitle>
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E2EDE7] dark:border-white/10 bg-[#F2FBF4] dark:bg-[#12342B]">
          <Search className="size-5 text-[#38B46A]" />
          <input
            type="text"
            placeholder="Search products, SKUs, orders, customer names, or commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-sm font-semibold text-[#173226] dark:text-white placeholder:text-slate-400 focus:outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-block px-2 py-1 text-[10px] font-mono font-bold bg-white dark:bg-white/10 text-slate-500 rounded border border-slate-200 dark:border-white/10">
            ESC to close
          </kbd>
        </div>

        <div className="max-h-[420px] overflow-y-auto p-4 space-y-5">
          {!query && (
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2 px-2">
                Quick Navigation Shortcuts
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { section: "products" as AdminSection, label: "Product Catalog", icon: Package },
                  { section: "orders" as AdminSection, label: "Orders List", icon: ShoppingBag },
                  { section: "inventory" as AdminSection, label: "Inventory Levels", icon: Zap },
                  { section: "customers" as AdminSection, label: "Customers", icon: Users },
                  { section: "categories" as AdminSection, label: "Categories", icon: FolderTree },
                ].map((item) => (
                  <button
                    key={item.section}
                    onClick={() => handleNavigate(item.section)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-[#ECFDF3] dark:hover:bg-emerald-950/40 text-left text-xs font-bold text-[#173226] dark:text-slate-200 transition-colors border border-slate-200/60 dark:border-white/5 group"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="size-4 text-[#38B46A]" />
                      <span>{item.label}</span>
                    </div>
                    <ArrowRight className="size-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && (
            <div className="space-y-4">
              {/* Products Results */}
              {filteredProducts.length > 0 && (
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2 px-2">
                    Products ({filteredProducts.length})
                  </span>
                  <div className="space-y-1.5">
                    {filteredProducts.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleNavigate("products")}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-left transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt="" className="size-8 rounded-lg object-cover" />
                          <div>
                            <div className="text-xs font-bold text-[#173226] dark:text-white">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium">
                              {p.category} • Rs {p.price.toLocaleString("en-IN")}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#38B46A]">
                          {p.stock} in stock
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Orders Results */}
              {filteredOrders.length > 0 && (
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2 px-2">
                    Orders ({filteredOrders.length})
                  </span>
                  <div className="space-y-1.5">
                    {filteredOrders.map((o) => (
                      <button
                        key={o.id}
                        onClick={() => {
                          if (onSelectOrder) onSelectOrder(o);
                          handleNavigate("orders");
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-left transition-colors cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-extrabold text-[#173226] dark:text-white font-mono">
                            {o.id} — {o.customerName}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Rs {o.totalAmount.toLocaleString("en-IN")} • {o.orderStatus}
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-[#38B46A]">
                          View Details &rarr;
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customers Results */}
              {filteredCustomers.length > 0 && (
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2 px-2">
                    Customers ({filteredCustomers.length})
                  </span>
                  <div className="space-y-1.5">
                    {filteredCustomers.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleNavigate("customers")}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-left transition-colors cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-bold text-[#173226] dark:text-white">
                            {c.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {c.email} • {c.city}
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                          {c.totalOrders} Orders
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredProducts.length === 0 &&
                filteredOrders.length === 0 &&
                filteredCustomers.length === 0 && (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No results found for &ldquo;{query}&rdquo;
                  </div>
                )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
