import { useState } from "react";
import { Save } from "lucide-react";
import { useSettingsStore } from "../../stores/settingsStore";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function AdminSettings() {
  const { settings, updateSettings } = useSettingsStore();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {saved && (
        <div className="rounded-xl bg-emerald-50 text-emerald-700 px-4 py-3 text-sm">
          Configurações salvas com sucesso!
        </div>
      )}

      <section className="rounded-2xl bg-white p-6 premium-shadow border border-elegant-black/5 space-y-4">
        <h2 className="font-serif text-lg font-semibold text-elegant-black">
          Dados da loja
        </h2>
        {[
          { key: "storeName" as const, label: "Nome da loja" },
          { key: "slogan" as const, label: "Slogan" },
          { key: "email" as const, label: "E-mail" },
          { key: "phone" as const, label: "Telefone" },
          { key: "address" as const, label: "Endereço" },
          { key: "businessHours" as const, label: "Horário de atendimento" },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="text-sm font-medium text-elegant-black">{label}</label>
            <Input
              value={form[key]}
              onChange={(e) => update(key, e.target.value)}
              className="mt-1"
            />
          </div>
        ))}
      </section>

      <section className="rounded-2xl bg-white p-6 premium-shadow border border-elegant-black/5 space-y-4">
        <h2 className="font-serif text-lg font-semibold text-elegant-black">Entrega</h2>
        <div>
          <label className="text-sm font-medium text-elegant-black">Frete fixo (R$)</label>
          <Input
            type="number"
            step="0.01"
            value={form.fixedShipping}
            onChange={(e) => update("fixedShipping", parseFloat(e.target.value) || 0)}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-elegant-black">Prazo de entrega</label>
          <Input
            value={form.deliveryDays}
            onChange={(e) => update("deliveryDays", e.target.value)}
            className="mt-1"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.pickupEnabled}
            onChange={(e) => update("pickupEnabled", e.target.checked)}
            className="h-4 w-4 rounded text-gold"
          />
          <span className="text-sm">Retirada na loja ativa</span>
        </label>
      </section>

      <section className="rounded-2xl bg-white p-6 premium-shadow border border-elegant-black/5 space-y-3">
        <h2 className="font-serif text-lg font-semibold text-elegant-black">Pagamentos</h2>
        {[
          { key: "pixEnabled" as const, label: "Pix ativo" },
          { key: "cardEnabled" as const, label: "Cartão ativo" },
          { key: "cashEnabled" as const, label: "Dinheiro na entrega ativo" },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form[key]}
              onChange={(e) => update(key, e.target.checked)}
              className="h-4 w-4 rounded text-gold"
            />
            <span className="text-sm">{label}</span>
          </label>
        ))}
      </section>

      <section className="rounded-2xl bg-white p-6 premium-shadow border border-elegant-black/5 space-y-4">
        <h2 className="font-serif text-lg font-semibold text-elegant-black">Visual</h2>
        <div>
          <label className="text-sm font-medium text-elegant-black">Cor principal</label>
          <div className="flex gap-3 mt-1">
            <Input
              value={form.primaryColor}
              onChange={(e) => update("primaryColor", e.target.value)}
            />
            <div
              className="h-11 w-11 rounded-xl border border-elegant-black/10 shrink-0"
              style={{ backgroundColor: form.primaryColor }}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-elegant-black">Texto do banner principal</label>
          <Input
            value={form.heroBannerText}
            onChange={(e) => update("heroBannerText", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-elegant-black">Texto do rodapé</label>
          <textarea
            value={form.footerText}
            onChange={(e) => update("footerText", e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-xl border border-elegant-black/10 px-4 py-3 text-sm"
          />
        </div>
      </section>

      <Button variant="gold" size="lg" onClick={handleSave}>
        <Save className="h-5 w-5 mr-2" />
        Salvar configurações
      </Button>
    </div>
  );
}
