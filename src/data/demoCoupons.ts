import type { Coupon } from "../types/account";

export const demoCoupons: Coupon[] = [
  {
    id: "1",
    code: "BELLA10",
    description: "10% OFF na próxima compra",
    expiresAt: "2026-12-31",
  },
  {
    id: "2",
    code: "FRETEGRATIS",
    description: "Frete grátis acima de R$ 299",
    expiresAt: "2026-09-30",
  },
  {
    id: "3",
    code: "VOLTEI15",
    description: "15% OFF para clientes especiais",
    expiresAt: "2026-08-15",
  },
];
