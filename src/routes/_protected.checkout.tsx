import { createFileRoute } from "@tanstack/react-router";
import { ShoppingCart, CreditCard, Lock } from "lucide-react";

export const Route = createFileRoute("/_protected/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  return (
    <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart className="text-emerald-400 size-6" />
        <h2 className="text-2xl font-bold">Secure Checkout</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping & Payment */}
        <div className="space-y-6">
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/50">
            <h3 className="font-semibold mb-4 text-lg">Shipping Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                placeholder="Address"
                className="col-span-2 bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                placeholder="City"
                className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                placeholder="Postal Code"
                className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/50">
            <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
              <CreditCard className="size-5" /> Payment Method
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Card Number"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-emerald-500"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  placeholder="CVC"
                  className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-700 sticky top-24">
            <h3 className="font-semibold mb-6 text-lg">Order Summary</h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-slate-300">
                <span>Solar Panel 500W x 2</span>
                <span>NPR 42,000</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Shipping</span>
                <span>NPR 1,500</span>
              </div>
              <div className="h-px bg-slate-700 w-full my-4" />
              <div className="flex justify-between text-white font-bold text-lg">
                <span>Total</span>
                <span>NPR 43,500</span>
              </div>
            </div>

            <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <Lock className="size-4" /> Place Order
            </button>
            <p className="text-center text-xs text-slate-500 mt-4">
              Secure, encrypted transaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
