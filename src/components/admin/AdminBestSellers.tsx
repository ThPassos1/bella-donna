import { Trophy, AlertTriangle, Crown } from "lucide-react";
import { useAdminOrders } from "../../hooks/useAdminOrders";
import { useProductStore } from "../../stores/productStore";
import { formatCurrency } from "../../utils/formatCurrency";
import { AdminEmptyState } from "./shared/AdminEmptyState";
import { Badge } from "../ui/Badge";

export function AdminBestSellers() {
  const { bestSellersFromOrders } = useAdminOrders();
  const products = useProductStore((s) => s.products);

  const ranking = bestSellersFromOrders.map((item, i) => {
    const product = products.find((p) => p.id === item.productId);
    return { ...item, product, rank: i + 1 };
  });

  const topRevenue = [...ranking].sort((a, b) => b.revenue - a.revenue)[0];

  if (ranking.length === 0) {
    return (
      <AdminEmptyState
        icon={Trophy}
        title="Sem dados de vendas"
        description="Quando houver pedidos na loja, o ranking de mais vendidos aparecerá aqui."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        {ranking.slice(0, 3).map((item, i) => (
          <div
            key={item.productId}
            className={`rounded-2xl p-5 premium-shadow border ${
              i === 0
                ? "bg-gradient-to-br from-gold/10 to-champagne border-gold/30"
                : "bg-white border-elegant-black/5"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Crown
                className={`h-5 w-5 ${i === 0 ? "text-gold fill-gold" : "text-graphite"}`}
              />
              <span className="text-sm font-semibold text-gold">Top {item.rank}</span>
            </div>
            {item.product && (
              <img
                src={item.product.image}
                alt={item.name}
                className="h-20 w-20 rounded-xl object-cover mb-3"
              />
            )}
            <p className="font-medium text-elegant-black text-sm">{item.name}</p>
            <p className="text-2xl font-semibold text-elegant-black mt-1">{item.qty} un.</p>
            <p className="text-sm text-graphite">{formatCurrency(item.revenue)}</p>
          </div>
        ))}
      </div>

      {topRevenue && (
        <div className="rounded-xl bg-gold/10 border border-gold/20 p-4 flex items-center gap-3">
          <Trophy className="h-6 w-6 text-gold" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-elegant-black truncate">
              Maior faturamento: {topRevenue.name}
            </p>
            <p className="text-sm text-graphite">{formatCurrency(topRevenue.revenue)}</p>
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-white premium-shadow border border-elegant-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="bg-cream-dark/50 text-sm text-graphite">
                <th className="px-4 py-4 font-medium">#</th>
                <th className="px-4 py-4 font-medium">Produto</th>
                <th className="px-4 py-4 font-medium hidden md:table-cell">Categoria</th>
                <th className="px-4 py-4 font-medium">Qtd vendida</th>
                <th className="px-4 py-4 font-medium">Faturamento</th>
                <th className="px-4 py-4 font-medium hidden sm:table-cell">Estoque</th>
                <th className="px-4 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((item) => {
                const lowStock = (item.product?.stock ?? 0) <= 5;
                return (
                  <tr
                    key={item.productId}
                    className="border-t border-elegant-black/5 hover:bg-cream/50"
                  >
                    <td className="px-4 py-4 font-bold text-gold">{item.rank}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {item.product && (
                          <img
                            src={item.product.image}
                            alt={item.name}
                            className="h-10 w-10 rounded-lg object-cover shrink-0"
                          />
                        )}
                        <span className="text-sm font-medium text-elegant-black truncate max-w-[160px]">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-graphite hidden md:table-cell">
                      {item.product?.category ?? "—"}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold">{item.qty}</td>
                    <td className="px-4 py-4 text-sm font-semibold">
                      {formatCurrency(item.revenue)}
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className={lowStock ? "text-red-500 font-medium" : "text-graphite"}>
                        {item.product?.stock ?? "—"}
                        {lowStock && (
                          <AlertTriangle className="inline h-3 w-3 ml-1" />
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {item.product?.isActive === false ? (
                        <Badge variant="default">Inativo</Badge>
                      ) : (
                        <Badge variant="gold">Ativo</Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
