import { useState } from "react";
import { RefreshCw, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useCustomerOrders } from "../../hooks/useOrders";
import { useCustomer } from "../../hooks/useCustomer";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { Modal } from "../ui/Modal";
import type { ReturnPreference } from "../../types/account";

const preferenceLabels: Record<ReturnPreference, string> = {
  size_exchange: "Trocar tamanho",
  product_exchange: "Trocar produto",
  coupon: "Receber cupom",
  refund: "Solicitar reembolso",
};

export function AccountReturns() {
  const { user } = useAuth();
  const orders = useCustomerOrders(user?.id ?? null, user?.email ?? null);
  const { addReturnRequest, returnRequests } = useCustomer();
  const [modalOpen, setModalOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState({ orderNumber: "", productName: "" });
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [preference, setPreference] = useState<ReturnPreference>("size_exchange");

  const eligibleOrders = orders.filter((o) => o.status === "delivered");

  const openRequest = (orderNumber: string, productName: string) => {
    setSelected({ orderNumber, productName });
    setReason("");
    setNotes("");
    setError("");
    setModalOpen(true);
    setSuccess(false);
  };

  const submitRequest = () => {
    if (!reason.trim()) {
      setError("Informe o motivo da troca.");
      return;
    }
    addReturnRequest({
      orderNumber: selected.orderNumber,
      productName: selected.productName,
      reason,
      notes,
      preference,
    });
    setSuccess(true);
    setTimeout(() => {
      setModalOpen(false);
      setSuccess(false);
    }, 2500);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-elegant-black mb-2">
          Trocas e devoluções
        </h2>
        <p className="text-graphite">
          Você tem até 30 dias após o recebimento para solicitar troca ou devolução.
        </p>
      </div>

      {returnRequests.length > 0 && (
        <div className="rounded-2xl bg-white p-6 premium-shadow">
          <h3 className="font-medium text-elegant-black mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-gold" />
            Suas solicitações
          </h3>
          <div className="space-y-3">
            {returnRequests.map((req) => (
              <div
                key={req.id}
                className="rounded-xl border border-elegant-black/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <p className="font-medium text-elegant-black">{req.productName}</p>
                  <p className="text-sm text-graphite">
                    Pedido {req.orderNumber} · {preferenceLabels[req.preference]}
                  </p>
                </div>
                <span className="text-xs font-semibold rounded-full bg-amber-100 text-amber-700 px-3 py-1 w-fit">
                  {req.status === "pending" ? "Em análise" : req.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {eligibleOrders.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center premium-shadow">
          <RefreshCw className="h-16 w-16 text-gold/30 mx-auto mb-4" />
          <p className="text-graphite">
            Nenhum pedido entregue disponível para troca no momento.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="font-medium text-elegant-black">Pedidos elegíveis</h3>
          {eligibleOrders.map((order) =>
            order.items.map((item) => (
              <div
                key={`${order.id}-${item.productId}`}
                className="rounded-2xl bg-white p-6 premium-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-14 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium text-elegant-black">{item.name}</p>
                    <p className="text-sm text-graphite">
                      Pedido {order.orderNumber} ·{" "}
                      {new Date(order.date).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="text-xs text-gold mt-1">Prazo: até 30 dias</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => openRequest(order.orderNumber, item.name)}
                >
                  Solicitar troca
                </Button>
              </div>
            ))
          )}
        </div>
      )}

      <Modal open={modalOpen} onOpenChange={setModalOpen} title="Solicitar troca" size="md">
        {success ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle className="h-12 w-12 text-gold" />
            <p className="text-elegant-black font-medium">
              Solicitação enviada! Nossa equipe analisará seu pedido.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-graphite">
              <strong>Produto:</strong> {selected.productName}
            </p>
            <p className="text-sm text-graphite">
              <strong>Pedido:</strong> {selected.orderNumber}
            </p>
            <div>
              <label className="text-sm font-medium text-graphite block mb-1.5">
                Motivo da troca *
              </label>
              <input
                className="w-full rounded-xl border border-elegant-black/10 px-4 py-3 focus:border-gold focus:outline-none"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex: Tamanho não serviu"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-graphite block mb-1.5">
                Observação (opcional)
              </label>
              <textarea
                className="w-full rounded-xl border border-elegant-black/10 px-4 py-3 min-h-[80px] focus:border-gold focus:outline-none"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Detalhes adicionais..."
              />
            </div>
            <Select
              label="O que você prefere?"
              value={preference}
              onValueChange={(v) => setPreference(v as ReturnPreference)}
              options={[
                { value: "size_exchange", label: "Trocar tamanho" },
                { value: "product_exchange", label: "Trocar produto" },
                { value: "coupon", label: "Receber cupom" },
                { value: "refund", label: "Solicitar reembolso" },
              ]}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button variant="gold" size="lg" className="w-full" onClick={submitRequest}>
              Enviar solicitação
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
