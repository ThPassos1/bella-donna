import { useState } from "react";
import { Search, Users, Eye } from "lucide-react";
import { useAdminCustomers } from "../../hooks/useAdminCustomers";
import { AdminEmptyState } from "./shared/AdminEmptyState";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import { AdminStatusBadge } from "./shared/AdminStatusBadge";
import type { AdminCustomerView } from "../../hooks/useAdminCustomers";

export function AdminCustomers() {
  const {
    searchCustomers,
    getCustomerOrders,
    getTopProductsForCustomer,
    updateMeta,
  } = useAdminCustomers();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminCustomerView | null>(null);
  const [notes, setNotes] = useState("");
  const [toast, setToast] = useState("");

  const filtered = searchCustomers(search);

  const openDetails = (customer: AdminCustomerView) => {
    setSelected(customer);
    setNotes(customer.internalNotes);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-20 right-4 z-50 rounded-xl bg-elegant-black text-white px-5 py-3 text-sm shadow-lg">
          {toast}
        </div>
      )}

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-graphite" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar cliente..."
          className="pl-11"
        />
      </div>

      {filtered.length === 0 ? (
        <AdminEmptyState
          icon={Users}
          title="Nenhum cliente cadastrado"
          description="Os clientes que se cadastrarem na loja aparecerão aqui."
        />
      ) : (
        <div className="rounded-2xl bg-white premium-shadow border border-elegant-black/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="bg-cream-dark/50 text-sm text-graphite">
                  <th className="px-4 py-4 font-medium">Nome</th>
                  <th className="px-4 py-4 font-medium hidden md:table-cell">E-mail</th>
                  <th className="px-4 py-4 font-medium hidden lg:table-cell">Telefone</th>
                  <th className="px-4 py-4 font-medium">Pedidos</th>
                  <th className="px-4 py-4 font-medium">Total gasto</th>
                  <th className="px-4 py-4 font-medium hidden sm:table-cell">Status</th>
                  <th className="px-4 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c.user.id}
                    className="border-t border-elegant-black/5 hover:bg-cream/50"
                  >
                    <td className="px-4 py-4 text-sm font-medium text-elegant-black">
                      {c.user.customer.fullName}
                    </td>
                    <td className="px-4 py-4 text-sm text-graphite hidden md:table-cell">
                      {c.user.email}
                    </td>
                    <td className="px-4 py-4 text-sm text-graphite hidden lg:table-cell">
                      {c.user.customer.phone}
                    </td>
                    <td className="px-4 py-4 text-sm text-graphite">{c.orderCount}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-elegant-black">
                      {formatCurrency(c.totalSpent)}
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          c.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {c.isActive ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => openDetails(c)}
                        className="p-2 rounded-lg hover:bg-cream-dark text-graphite"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <Modal
          open={!!selected}
          onOpenChange={(v) => !v && setSelected(null)}
          title={selected.user.customer.fullName}
          size="lg"
        >
          <div className="space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-cream-dark/50 p-4">
                <h4 className="text-sm font-semibold mb-2">Dados pessoais</h4>
                <p className="text-sm text-graphite">{selected.user.email}</p>
                <p className="text-sm text-graphite">{selected.user.customer.phone}</p>
                {selected.user.customer.cpf && (
                  <p className="text-sm text-graphite">CPF: {selected.user.customer.cpf}</p>
                )}
              </div>
              <div className="rounded-xl bg-cream-dark/50 p-4">
                <h4 className="text-sm font-semibold mb-2">Resumo</h4>
                <p className="text-sm text-graphite">
                  Total gasto: {formatCurrency(selected.totalSpent)}
                </p>
                <p className="text-sm text-graphite">
                  Ticket médio: {formatCurrency(selected.averageTicket)}
                </p>
                <p className="text-sm text-graphite">Pedidos: {selected.orderCount}</p>
                {selected.lastPurchase && (
                  <p className="text-sm text-graphite">
                    Última compra:{" "}
                    {new Date(selected.lastPurchase).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </div>
            </div>

            {selected.user.addresses.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Endereços</h4>
                {selected.user.addresses.map((addr) => (
                  <p key={addr.id} className="text-sm text-graphite mb-1">
                    {addr.street}, {addr.number} — {addr.city}/{addr.state}
                    {addr.isPrimary && " (principal)"}
                  </p>
                ))}
              </div>
            )}

            <div>
              <h4 className="text-sm font-semibold mb-2">Produtos mais comprados</h4>
              {getTopProductsForCustomer(selected.user.id, selected.user.email).map(
                (p, i) => (
                  <p key={i} className="text-sm text-graphite">
                    {p.name} — {p.qty} un.
                  </p>
                )
              )}
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Pedidos recentes</h4>
              {getCustomerOrders(selected.user.id, selected.user.email)
                .slice(0, 5)
                .map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-2 border-b border-elegant-black/5"
                  >
                    <span className="text-sm text-elegant-black">{order.orderNumber}</span>
                    <AdminStatusBadge status={order.status} />
                    <span className="text-sm font-medium">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                ))}
            </div>

            <div>
              <label className="text-sm font-semibold text-elegant-black">
                Observações internas
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-xl border border-elegant-black/10 px-4 py-3 text-sm"
                placeholder="Anotações visíveis apenas no admin..."
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.isActive}
                onChange={(e) => {
                  updateMeta(selected.user.id, { isActive: e.target.checked });
                  setSelected({ ...selected, isActive: e.target.checked });
                  showToast("Status do cliente atualizado.");
                }}
                className="h-4 w-4 rounded text-gold"
              />
              <span className="text-sm text-elegant-black">Cliente ativo</span>
            </label>

            <Button
              variant="gold"
              size="lg"
              onClick={() => {
                updateMeta(selected.user.id, { internalNotes: notes });
                showToast("Observações salvas!");
              }}
            >
              Salvar observações
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
