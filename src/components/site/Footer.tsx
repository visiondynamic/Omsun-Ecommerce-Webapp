import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Sun } from "lucide-react";

const columns = [
  {
    title: "Products",
    items: ["Solar Panels", "Inverters", "Energy Storage", "Cables & Wiring", "Lighting"],
  },
  {
    title: "Solutions",
    items: ["Residential Solar", "Commercial EPC", "Industrial Power", "Off-grid"],
  },
  { title: "Company", items: ["About OMSUN", "Projects", "Careers", "Support"] },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-mist">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.4fr_2fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-2xl bg-energy shadow-glow">
              <Sun className="size-5 text-primary-foreground" strokeWidth={2.2} />
            </span>
            <span className="font-display text-lg font-extrabold">OMSUN Nepal Pvt. Ltd.</span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Electrical, renewable energy and solar solutions engineered for Nepal — from a single
            switch to megawatt-scale installations.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-3">
              <MapPin className="size-4 shrink-0 text-primary" /> Teku, Kathmandu, Nepal
            </li>
            <li className="flex items-center gap-3">
              <Phone className="size-4 shrink-0 text-primary" /> +977 1 5320 118
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-4 shrink-0 text-primary" /> hello@omsunnepal.com
            </li>
          </ul>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.items.map((item) => (
                  <li key={item}>
                    <Link
                      to="/shop"
                      className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} OMSUN Nepal Pvt. Ltd. All rights reserved.</p>
          <p>Powering a cleaner Nepal, one connection at a time.</p>
        </div>
      </div>
    </footer>
  );
}
