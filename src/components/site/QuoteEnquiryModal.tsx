import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/products";

interface QuoteEnquiryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function QuoteEnquiryModal({ open, onOpenChange, product }: QuoteEnquiryModalProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [district, setDistrict] = useState("Kathmandu");
  const [requirementType, setRequirementType] = useState("Residential Backup");
  const [quantity, setQuantity] = useState("1 Unit");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Pre-fill message when product changes
  useEffect(() => {
    if (product) {
      const modelInfo = product.model ? ` (Model: ${product.model})` : "";
      const capacityInfo = product.capacity ? ` [${product.capacity}]` : "";
      setMessage(
        `Hello OMSUN Nepal, I would like to request an official quotation and availability for ${product.name}${modelInfo}${capacityInfo}. Please provide distributor pricing, warranty details, and delivery timeline.`,
      );
      setSubmitted(false);
    }
  }, [product]);

  if (!product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter your phone or WhatsApp number.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const fullMessage = `[PRODUCT QUOTE REQUEST - ${product.brand.toUpperCase()}]
Product: ${product.name}
Model: ${product.model || "N/A"}
Series: ${product.series || "N/A"}
Capacity: ${product.capacity || "N/A"}
Quantity Needed: ${quantity}
Requirement Type: ${requirementType}
District: ${district}

User Message:
${message}`;

      await api.submitContact({
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company: `${requirementType} - Qty: ${quantity}`,
        inquiryType: "wholesale",
        systemSize: product.capacity || product.model || `${product.brand} System`,
        district: district.trim(),
        message: fullMessage,
      });

      setIsSubmitting(false);
      setSubmitted(true);
      toast.success("Quotation Request Sent!", {
        description: `Our sales engineer will review your request for ${product.name} and provide official pricing shortly.`,
      });
    } catch {
      setIsSubmitting(false);
      toast.error("Failed to submit request. Please reach us via WhatsApp or phone.");
    }
  };

  const isPowerOne = product.brand === "Power-One";

  const whatsappMessage = encodeURIComponent(
    `Hello OMSUN Nepal, I am interested in requesting an official quote for ${product.name} (Model: ${product.model || "N/A"}). Please provide price and stock availability.`,
  );
  const whatsappUrl = `https://wa.me/9779801828498?text=${whatsappMessage}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border-slate-200 dark:border-white/15 bg-white dark:bg-[#061e16] p-6 sm:p-8 shadow-2xl text-foreground">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider",
                isPowerOne
                  ? "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
              )}
            >
              <Sparkles className="size-3.5" />
              <span>Official {product.brand} Product Quotation</span>
            </span>
          </div>
          <DialogTitle className="font-display text-xl sm:text-2xl font-extrabold text-foreground">
            Request a Quote for {product.model || product.name}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Receive direct distributor pricing, project sizing guidance, and delivery timelines from OMSUN Nepal engineers.
          </DialogDescription>
        </DialogHeader>

        {/* Selected Product Summary Card */}
        <div className="mt-4 flex items-center gap-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/25 p-3.5">
          <img
            src={product.image}
            alt={product.name}
            className="size-16 sm:size-18 rounded-xl object-contain border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 p-1 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span
                className={cn(
                  "rounded border px-1.5 py-0.2 text-[9px] font-bold uppercase",
                  isPowerOne
                    ? "bg-blue-500/15 border-blue-500/30 text-blue-700 dark:text-blue-300"
                    : "bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-300",
                )}
              >
                {product.brand}
              </span>
              {product.series && (
                <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-700 dark:text-emerald-300">
                  {product.series}
                </span>
              )}
              {product.capacity && (
                <span className="rounded bg-cyan-500/15 border border-cyan-500/30 px-1.5 py-0.2 text-[9px] font-mono font-semibold text-cyan-700 dark:text-cyan-300">
                  {product.capacity}
                </span>
              )}
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-foreground truncate">
              {product.name}
            </h4>
            <div
              className={cn(
                "mt-0.5 text-[11px] font-bold",
                isPowerOne ? "text-blue-600 dark:text-blue-400" : "text-amber-600 dark:text-amber-400",
              )}
            >
              Pricing: Available Upon Official Enquiry
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 p-6 text-center space-y-4">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
              <CheckCircle2 className="size-8" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-foreground">
                Quotation Request Received!
              </h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-bold text-foreground">{fullName}</span>. Your enquiry for{" "}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{product.name}</span> has been dispatched to our sales desk.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all w-full sm:w-auto"
              >
                <Phone className="size-4" /> Connect on WhatsApp
              </a>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-11 px-5 rounded-xl text-xs font-semibold w-full sm:w-auto"
              >
                Close Window
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">
                  Your Full Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Adhikari"
                  className="h-11 rounded-xl text-xs"
                />
              </div>

              {/* Phone / WhatsApp */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">
                  Phone / WhatsApp <span className="text-rose-500">*</span>
                </Label>
                <Input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+977-98xxxxxxxx"
                  className="h-11 rounded-xl text-xs"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">
                  Email Address <span className="text-rose-500">*</span>
                </Label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="h-11 rounded-xl text-xs"
                />
              </div>

              {/* Location / District */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Delivery District / City</Label>
                <Input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Kathmandu, Pokhara, Butwal"
                  className="h-11 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Requirement Type */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Application Type</Label>
                <select
                  value={requirementType}
                  onChange={(e) => setRequirementType(e.target.value)}
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="Residential Backup">Home UPS / Residential Backup</option>
                  <option value="Solar Hybrid / Off-Grid">Solar Hybrid / Off-Grid System</option>
                  <option value="Commercial / Office">Commercial Office / IT Load</option>
                  <option value="Wholesale / Reseller">Wholesale / Contractor / Reseller</option>
                </select>
              </div>

              {/* Quantity */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Estimated Quantity</Label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="1 Unit">1 Unit (Individual Setup)</option>
                  <option value="2 - 5 Units">2 – 5 Units</option>
                  <option value="6 - 15 Units">6 – 15 Units</option>
                  <option value="15+ Units (Bulk Project)">15+ Units (Bulk Supply)</option>
                </select>
              </div>
            </div>

            {/* Message / Project Notes */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Quotation Details / Specific Questions</Label>
              <Textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Include any specific power requirements or questions..."
                className="rounded-xl text-xs"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-2 space-y-2.5">
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "h-12 w-full rounded-xl text-white font-extrabold text-sm shadow-xl transition-all cursor-pointer",
                  isPowerOne
                    ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600"
                    : "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500",
                )}
              >
                {isSubmitting ? (
                  <span>Submitting Quotation Request...</span>
                ) : (
                  <>
                    <Send className="size-4 mr-2" />
                    Submit Quotation Request
                  </>
                )}
              </Button>

              <div className="flex items-center justify-between pt-2 text-[11px] text-muted-foreground border-t border-slate-200 dark:border-white/10">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <Phone className="size-3.5" />
                  <span>Immediate Assistance via WhatsApp</span>
                </a>

                <Link
                  to="/contact"
                  search={{
                    product: product.name,
                    model: product.model || "",
                    series: product.series || "",
                    inquiryType: "wholesale",
                  }}
                  onClick={() => onOpenChange(false)}
                  className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
                >
                  <span>Open Full Contact Form</span>
                  <ExternalLink className="size-3" />
                </Link>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
