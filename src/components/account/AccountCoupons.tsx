import { useState } from "react";
import { Tag, Copy, CheckCircle } from "lucide-react";
import { demoCoupons } from "../../data/demoCoupons";
import { Button } from "../ui/Button";

export function AccountCoupons() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl font-semibold text-elegant-black">
        Cupons
      </h2>
      <div className="grid gap-4">
        {demoCoupons.map((coupon) => (
          <div
            key={coupon.id}
            className="rounded-2xl bg-white p-6 premium-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-gold"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-gold/10 p-3">
                <Tag className="h-6 w-6 text-gold" />
              </div>
              <div>
                <p className="font-serif text-xl font-semibold text-gold">
                  {coupon.code}
                </p>
                <p className="text-graphite mt-1">{coupon.description}</p>
                <p className="text-xs text-graphite mt-2">
                  Válido até{" "}
                  {new Date(coupon.expiresAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
            <Button
              variant={copied === coupon.code ? "secondary" : "gold"}
              size="md"
              onClick={() => copyCode(coupon.code)}
            >
              {copied === coupon.code ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copiar cupom
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
