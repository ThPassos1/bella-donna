import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle, User } from "lucide-react";
import { useCustomer } from "../../hooks/useCustomer";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface ProfileForm {
  fullName: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
}

export function AccountProfile() {
  const { customer, updateCustomer } = useCustomer();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, reset } = useForm<ProfileForm>();

  useEffect(() => {
    if (customer) {
      reset({
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        cpf: customer.cpf ?? "",
        birthDate: customer.birthDate ?? "",
      });
    }
  }, [customer, reset]);

  const onSave = (data: ProfileForm) => {
    if (!data.fullName.trim() || !data.email.trim() || !data.phone.trim()) return;
    updateCustomer(data);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    if (customer) {
      reset({
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        cpf: customer.cpf ?? "",
        birthDate: customer.birthDate ?? "",
      });
    }
    setEditing(false);
  };

  if (!customer) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-semibold text-elegant-black">
          Meus dados
        </h2>
        {!editing && (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            Editar dados
          </Button>
        )}
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 p-4 text-green-700">
          <CheckCircle className="h-5 w-5" />
          Dados atualizados com sucesso.
        </div>
      )}

      {!editing ? (
        <div className="rounded-2xl bg-white p-6 premium-shadow space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-elegant-black/5">
            <div className="rounded-full bg-gold/10 p-4">
              <User className="h-8 w-8 text-gold" />
            </div>
            <div>
              <p className="font-serif text-xl font-semibold text-elegant-black">
                {customer.fullName}
              </p>
              <p className="text-sm text-graphite">{customer.email}</p>
            </div>
          </div>
          {[
            { label: "Telefone", value: customer.phone },
            { label: "CPF", value: customer.cpf || "Não informado" },
            {
              label: "Data de nascimento",
              value: customer.birthDate
                ? new Date(customer.birthDate + "T12:00:00").toLocaleDateString("pt-BR")
                : "Não informada",
            },
          ].map((row) => (
            <div
              key={row.label}
              className="flex justify-between py-2 border-b border-elegant-black/5 last:border-0"
            >
              <span className="text-sm text-graphite">{row.label}</span>
              <span className="text-sm font-medium text-elegant-black">{row.value}</span>
            </div>
          ))}
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSave)}
          className="rounded-2xl bg-white p-6 premium-shadow space-y-4"
        >
          <Input label="Nome completo *" {...register("fullName", { required: true })} />
          <Input label="E-mail *" type="email" {...register("email", { required: true })} />
          <Input label="Telefone *" {...register("phone", { required: true })} />
          <Input label="CPF" {...register("cpf")} />
          <Input label="Data de nascimento (opcional)" type="date" {...register("birthDate")} />
          <div className="flex gap-3 pt-4">
            <Button variant="gold" size="lg" type="submit" className="flex-1">
              Salvar alterações
            </Button>
            <Button
              variant="secondary"
              size="lg"
              type="button"
              className="flex-1"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
