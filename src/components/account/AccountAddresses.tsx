import { useState } from "react";
import { MapPin, Plus, Star, Trash2, Pencil } from "lucide-react";
import { useCustomer } from "../../hooks/useCustomer";
import type { CustomerAddress } from "../../types/customer";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

const emptyAddress: Omit<CustomerAddress, "id"> = {
  label: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "SP",
  isPrimary: false,
};

const stateOptions = [
  { value: "SP", label: "São Paulo" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "MG", label: "Minas Gerais" },
];

export function AccountAddresses() {
  const {
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setPrimaryAddress,
  } = useCustomer();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyAddress);

  const openNew = () => {
    setForm({ ...emptyAddress, isPrimary: addresses.length === 0 });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (addr: CustomerAddress) => {
    setForm(addr);
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.label.trim() || !form.cep.trim() || !form.street.trim() || !form.number.trim()) {
      return;
    }
    if (editingId) {
      updateAddress(editingId, form);
    } else {
      addAddress(form);
    }
    setShowForm(false);
    setForm(emptyAddress);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-semibold text-elegant-black">
          Endereços
        </h2>
        <Button variant="gold" size="sm" onClick={openNew}>
          <Plus className="h-4 w-4" />
          Adicionar endereço
        </Button>
      </div>

      {showForm && (
        <div className="rounded-2xl bg-white p-6 premium-shadow space-y-4">
          <h3 className="font-medium text-elegant-black">
            {editingId ? "Editar endereço" : "Novo endereço"}
          </h3>
          <Input
            label="Nome do endereço"
            placeholder="Casa, Trabalho..."
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
          />
          <Input
            label="CEP"
            value={form.cep}
            onChange={(e) => setForm({ ...form, cep: e.target.value })}
          />
          <Input
            label="Rua"
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Número"
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
            />
            <Input
              label="Complemento"
              value={form.complement}
              onChange={(e) => setForm({ ...form, complement: e.target.value })}
            />
          </div>
          <Input
            label="Bairro"
            value={form.neighborhood}
            onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Cidade"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            <Select
              label="Estado"
              value={form.state}
              onValueChange={(v) => setForm({ ...form, state: v })}
              options={stateOptions}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="gold" size="md" onClick={handleSave} className="flex-1">
              Salvar
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setShowForm(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center premium-shadow">
          <MapPin className="h-16 w-16 text-gold/30 mx-auto mb-4" />
          <p className="text-graphite">Nenhum endereço cadastrado.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="rounded-2xl bg-white p-6 premium-shadow flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-gold" />
                  <span className="font-semibold text-elegant-black">{addr.label}</span>
                  {addr.isPrimary && (
                    <span className="rounded-full bg-gold/10 px-2 py-0.5 text-xs font-semibold text-gold flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Principal
                    </span>
                  )}
                </div>
                <p className="text-sm text-graphite">
                  {addr.street}, {addr.number}
                  {addr.complement && ` — ${addr.complement}`}
                </p>
                <p className="text-sm text-graphite">
                  {addr.neighborhood} — {addr.city}/{addr.state}
                </p>
                <p className="text-sm text-graphite">CEP: {addr.cep}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {!addr.isPrimary && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPrimaryAddress(addr.id)}
                  >
                    Definir principal
                  </Button>
                )}
                <Button variant="secondary" size="sm" onClick={() => openEdit(addr)}>
                  <Pencil className="h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteAddress(addr.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
