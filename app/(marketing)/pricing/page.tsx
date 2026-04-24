import Link from "next/link";
import UpgradeButton from "@/components/UpgradeButton";

type Tier = {
  name: string;
  price: string;
  cadence: string;
  minutes: string;
  features: string[];
  cta:
    | { type: "link"; label: string; href: string }
    | { type: "upgrade"; label: string };
};

const tiers: Tier[] = [
  {
    name: "Free",
    price: "$0",
    cadence: "/month",
    minutes: "60 minutes/month",
    features: ["Hosted API", "60 min/month", "Email support"],
    cta: { type: "link", label: "Sign up", href: "/sign-up" },
  },
  {
    name: "Pro",
    price: "$29",
    cadence: "/month + usage",
    minutes: "Then $0.05/min",
    features: ["Hosted API", "Includes 600 min", "$0.05/min after", "Priority support"],
    cta: { type: "upgrade", label: "Start free trial" },
  },
  {
    name: "Scale",
    price: "Custom",
    cadence: "",
    minutes: "Volume + on-prem options",
    features: ["Self-host license", "Volume pricing", "SLA support", "Dedicated worker"],
    cta: { type: "link", label: "Contact us", href: "mailto:hello@syvr.dev?subject=Whisker%20Scale" },
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-10">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Pricing</h1>
        <p className="text-zinc-600">Pay only for what you transcribe. Cancel anytime.</p>
      </header>
      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((t) => (
          <div key={t.name} className="border rounded-lg p-6 space-y-4 flex flex-col">
            <div>
              <h2 className="text-2xl font-semibold">{t.name}</h2>
              <p className="text-3xl font-bold mt-2">
                {t.price}<span className="text-sm font-normal text-zinc-500">{t.cadence}</span>
              </p>
              <p className="text-sm text-zinc-600 mt-1">{t.minutes}</p>
            </div>
            <ul className="text-sm space-y-1 flex-1">
              {t.features.map((f) => <li key={f}>· {f}</li>)}
            </ul>
            {t.cta.type === "upgrade" ? (
              <UpgradeButton label={t.cta.label} />
            ) : (
              <Link href={t.cta.href} className="bg-black text-white rounded px-4 py-2 text-center">
                {t.cta.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
