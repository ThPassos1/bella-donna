import { useState } from "react";
import { CreditCard, Plus, Trash2, Shield, Smartphone } from "lucide-react";
import { useCustomer } from "../../hooks/useCustomer";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function AccountPayments() {
  const {
    getPaymentMethods,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPayment,
  } = useCustomer();
  const methods = getPaymentMethods();
  const [showAddCard, setShowAddCard] = useState(false);
  const [lastFour, setLastFour] = useState("");

  const handleAddCard = () => {
    if (lastFour.length !== 4) return;
    addPaymentMethod({
      type: "credit",
      label: `Cartão terminado em ${lastFour}`,
      lastFour,
      isDefault: methods.length === 0,
    });
    setLastFour("");
    setShowAddCard(false);
  };

  const handleAddPix = () => {
    if (methods.some((m) => m.type === "pix")) return;
    addPaymentMethod({
      type: "pix",
      label: "Pix cadastrado",
      isDefault: methods.length === 0,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl font-semibold text-elegant-black">
        Pagamentos
      </h2>

      <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
        <Shield className="h-5 w-5 shrink-0 mt-0.5" />
        Por segurança, os dados completos do cartão não são armazenados nesta
        demonstração.
      </div>

      {methods.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center premium-shadow">
          <CreditCard className="h-14 w-14 text-gold/30 mx-auto mb-4" />
          <p className="text-graphite mb-6">
            Nenhuma forma de pagamento cadastrada.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {methods.map((method) => (
            <div
              key={method.id}
              className="rounded-2xl bg-white p-6 premium-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-gold/10 p-3">
                  {method.type === "pix" ? (
                    <Smartphone className="h-6 w-6 text-gold" />
                  ) : (
                    <CreditCard className="h-6 w-6 text-gold" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-elegant-black">{method.label}</p>
                  {method.isDefault && (
                    <span className="text-xs text-gold font-semibold">
                      Pagamento padrão
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {!method.isDefault && (
                  <Button variant="outline" size="sm" onClick={() => setDefaultPayment(method.id)}>
                    Definir padrão
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => removePaymentMethod(method.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddCard ? (
        <div className="rounded-2xl bg-white p-6 premium-shadow space-y-4">
          <Input
            label="Últimos 4 dígitos do cartão"
            placeholder="1234"
            maxLength={4}
            value={lastFour}
            onChange={(e) => setLastFour(e.target.value.replace(/\D/g, ""))}
          />
          <div className="flex gap-3">
            <Button variant="gold" size="md" onClick={handleAddCard} className="flex-1">
              Salvar cartão
            </Button>
            <Button variant="secondary" size="md" onClick={() => setShowAddCard(false)} className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="md" onClick={() => setShowAddCard(true)}>
            <Plus className="h-4 w-4" />
            Adicionar cartão
          </Button>
          {!methods.some((m) => m.type === "pix") && (
            <Button variant="outline" size="md" onClick={handleAddPix}>
              <Smartphone className="h-4 w-4" />
              Cadastrar Pix
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
