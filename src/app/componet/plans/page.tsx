
// export default Pricing;
"use client";
import React from "react";

type Plan = {
  name: string;
  price: number | string;
  features: string[];
  buttonText: string;
  planKey: string;
  popular: boolean;
};

const Pricing = () => {
  const plans: Plan[] = [
    {
      name: "Free",
      price: 0,
      features: [
        "Professional Email Rewrite (shorter, formal, casual)",
        "Grammar Fix + Spell Check",
        "Basic Templates (proposal, follow-up, thank you)",
        "Simple Summarization",
        "Limit: 200 emails/day",
      ],
      buttonText: "Get Started Free",
      planKey: "free",
      popular: false,
    },
    {
      name: "Premium",
      price: 10,
      features: [
        "Smart Scope Guard (auto-flag extra work)",
        "Contract Addendums Generator",
        "Context Vault (multi-channel client messages)",
        "Ghosted Client Recovery (AI follow-ups)",
        "Payment Reminder Automation",
        "Coming Soon"
      ],
      buttonText: "Upgrade to Premium",
      planKey: "premium",
      popular: true,
    },
    {
      name: "Pro (Agency)",
      price: 20,
      features: [
        "All Premium features",
        "Negotiation Copilot",
        "Custom Branding (logo, signature, style)",
        "Team Collaboration & Roles",
        "Priority Support",
        "Coming Soon",
      ],
      buttonText: "Go Pro",
      planKey: "pro",
      popular: false,
    },
  ];

  const handleCheckout = async (planKey: string, price: number) => {
    if (planKey === "free") {
      alert("🎉 You’re on the Free Plan now!");
      return;
    }

    try {
      const res = await fetch("https://mailmorph-back-xyz-production.up.railway.app/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          address: "Somewhere",
          items: [
            {
              id: 1,
              title: planKey + " Plan",
              price: price,
              quantity: 1,
            },
          ],
        }),
      });

      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        console.error("Checkout failed", data);
        alert("Something went wrong!");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <section className="relative py-24 px-6 text-center overflow-hidden bg-black min-h-screen">
      <div className="relative max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white">
          Choose Your{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
            Plan
          </span>
        </h2>
        <p className="mt-4 text-gray-300 text-lg max-w-2xl mx-auto">
          Free plan for everyone. Paid plans for serious freelancers & agencies.
        </p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg transition transform hover:-translate-y-2 hover:shadow-cyan-500/30 ${
                plan.popular ? "ring-2 ring-cyan-400" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-semibold px-4 py-1 rounded-full shadow-md">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
              <p className="mt-2 text-gray-300 text-lg">
                {plan.price === 0 ? "$0" : `$${plan.price}/month`}
              </p>

              <ul className="mt-6 text-gray-400 text-sm space-y-3 text-left">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">✓</span> {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.planKey, Number(plan.price))}
                className={`mt-8 w-full px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  plan.popular
                    ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:opacity-90"
                    : "border border-cyan-400 text-cyan-300 hover:bg-cyan-500/10"
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
