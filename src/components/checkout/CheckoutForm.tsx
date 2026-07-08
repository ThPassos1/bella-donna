import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import type { DeliveryMethod } from "../../types/checkout";
import { Copy, QrCode } from "lucide-react";
import { useState } from "react";

const customerSchema = z.object({
  fullName: z.string().min(3, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone é obrigatório"),
  cpf: z.string().optional(),
});

const addressSchema = z.object({
  cep: z.string().min(8, "CEP é obrigatório"),
  street: z.string().min(3, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Bairro é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
});

const paymentSchema = z.object({
  method: z.enum(["pix", "credit", "debit", "cash"]),
  cardName: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  installments: z.string().optional(),
  changeFor: z.string().optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;

interface CheckoutFormProps {
  step: number;
  customerData: CustomerFormData;
  addressData: AddressFormData;
  paymentData: PaymentFormData;
  deliveryMethod: DeliveryMethod;
  onCustomerSubmit: (data: CustomerFormData) => void;
  onAddressSubmit: (data: AddressFormData) => void;
  onPaymentSubmit: (data: PaymentFormData) => void;
  onDeliveryMethodChange: (method: DeliveryMethod) => void;
  onBack: () => void;
}

const stateOptions = [
  { value: "SP", label: "São Paulo" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PR", label: "Paraná" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "SC", label: "Santa Catarina" },
  { value: "BA", label: "Bahia" },
  { value: "PE", label: "Pernambuco" },
];

const installmentOptions = Array.from({ length: 6 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1}x sem juros`,
}));

const PIX_CODE =
  "00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426655440000520400005303986540510.005802BR5920BELLA DONNA LTDA6009SAO PAULO62070503***6304ABCD";

export function CheckoutForm({
  step,
  customerData,
  addressData,
  paymentData,
  deliveryMethod,
  onCustomerSubmit,
  onAddressSubmit,
  onPaymentSubmit,
  onDeliveryMethodChange,
  onBack,
}: CheckoutFormProps) {
  const [copied, setCopied] = useState(false);

  const customerForm = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: customerData,
  });

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: addressData,
  });

  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: paymentData,
  });

  const paymentMethod = paymentForm.watch("method");

  const copyPixCode = () => {
    navigator.clipboard.writeText(PIX_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (step === 1) {
    return (
      <form onSubmit={customerForm.handleSubmit(onCustomerSubmit)} className="space-y-4">
        <h3 className="font-serif text-xl font-semibold text-elegant-black mb-4">
          Dados do cliente
        </h3>
        <Input
          label="Nome completo *"
          {...customerForm.register("fullName")}
          error={customerForm.formState.errors.fullName?.message}
        />
        <Input
          label="E-mail *"
          type="email"
          {...customerForm.register("email")}
          error={customerForm.formState.errors.email?.message}
        />
        <Input
          label="Telefone *"
          type="tel"
          placeholder="(11) 99999-9999"
          {...customerForm.register("phone")}
          error={customerForm.formState.errors.phone?.message}
        />
        <Input
          label="CPF (opcional)"
          placeholder="000.000.000-00"
          {...customerForm.register("cpf")}
        />
        <Button variant="gold" size="lg" type="submit" className="w-full mt-4">
          Continuar para entrega
        </Button>
      </form>
    );
  }

  if (step === 2) {
    return (
      <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4">
        <h3 className="font-serif text-xl font-semibold text-elegant-black mb-4">
          Entrega
        </h3>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            type="button"
            onClick={() => onDeliveryMethodChange("delivery")}
            className={`rounded-xl border-2 p-4 text-left transition-all ${
              deliveryMethod === "delivery"
                ? "border-gold bg-gold/5"
                : "border-elegant-black/10 hover:border-gold/30"
            }`}
          >
            <p className="font-medium text-elegant-black">Entrega local</p>
            <p className="text-xs text-graphite mt-1">1 a 3 dias úteis</p>
          </button>
          <button
            type="button"
            onClick={() => onDeliveryMethodChange("pickup")}
            className={`rounded-xl border-2 p-4 text-left transition-all ${
              deliveryMethod === "pickup"
                ? "border-gold bg-gold/5"
                : "border-elegant-black/10 hover:border-gold/30"
            }`}
          >
            <p className="font-medium text-elegant-black">Retirada na loja</p>
            <p className="text-xs text-graphite mt-1">Disponível em até 24h</p>
          </button>
        </div>

        {deliveryMethod === "delivery" && (
          <>
            <Input
              label="CEP *"
              placeholder="00000-000"
              {...addressForm.register("cep")}
              error={addressForm.formState.errors.cep?.message}
            />
            <Input
              label="Rua *"
              {...addressForm.register("street")}
              error={addressForm.formState.errors.street?.message}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Número *"
                {...addressForm.register("number")}
                error={addressForm.formState.errors.number?.message}
              />
              <Input
                label="Complemento"
                {...addressForm.register("complement")}
              />
            </div>
            <Input
              label="Bairro *"
              {...addressForm.register("neighborhood")}
              error={addressForm.formState.errors.neighborhood?.message}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Cidade *"
                {...addressForm.register("city")}
                error={addressForm.formState.errors.city?.message}
              />
              <Select
                label="Estado *"
                value={addressForm.watch("state") || ""}
                onValueChange={(v) => addressForm.setValue("state", v)}
                options={stateOptions}
                error={addressForm.formState.errors.state?.message}
              />
            </div>
          </>
        )}

        <div className="flex gap-3 mt-4">
          <Button variant="secondary" size="lg" type="button" onClick={onBack} className="flex-1">
            Voltar
          </Button>
          <Button variant="gold" size="lg" type="submit" className="flex-1">
            Continuar para pagamento
          </Button>
        </div>
      </form>
    );
  }

  if (step === 3) {
    return (
      <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-4">
        <h3 className="font-serif text-xl font-semibold text-elegant-black mb-4">
          Pagamento
        </h3>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {(
            [
              { value: "pix", label: "Pix" },
              { value: "credit", label: "Crédito" },
              { value: "debit", label: "Débito" },
              { value: "cash", label: "Dinheiro" },
            ] as const
          ).map((method) => (
            <button
              key={method.value}
              type="button"
              onClick={() => paymentForm.setValue("method", method.value)}
              className={`rounded-xl border-2 p-3 text-sm font-medium transition-all ${
                paymentMethod === method.value
                  ? "border-gold bg-gold/5 text-gold-dark"
                  : "border-elegant-black/10 hover:border-gold/30"
              }`}
            >
              {method.label}
            </button>
          ))}
        </div>

        {paymentMethod === "pix" && (
          <div className="rounded-2xl bg-cream-dark/50 p-6 text-center">
            <div className="mx-auto mb-4 flex h-40 w-40 items-center justify-center rounded-xl bg-white premium-shadow">
              <QrCode className="h-24 w-24 text-elegant-black" />
            </div>
            <p className="text-sm text-graphite mb-3">
              Escaneie o QR Code ou copie o código Pix
            </p>
            <div className="flex items-center gap-2 rounded-xl bg-white p-3 border border-elegant-black/10">
              <code className="flex-1 text-xs text-graphite truncate">{PIX_CODE}</code>
              <button
                type="button"
                onClick={copyPixCode}
                className="shrink-0 rounded-lg bg-gold px-3 py-2 text-xs font-medium text-white hover:bg-gold-dark transition-colors"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            {copied && (
              <p className="text-sm text-green-600 mt-2">Código copiado!</p>
            )}
          </div>
        )}

        {(paymentMethod === "credit" || paymentMethod === "debit") && (
          <div className="space-y-4">
            <Input
              label="Nome impresso no cartão"
              {...paymentForm.register("cardName")}
            />
            <Input
              label="Número do cartão"
              placeholder="0000 0000 0000 0000"
              {...paymentForm.register("cardNumber")}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Validade"
                placeholder="MM/AA"
                {...paymentForm.register("cardExpiry")}
              />
              <Input
                label="CVV"
                placeholder="000"
                {...paymentForm.register("cardCvv")}
              />
            </div>
            {paymentMethod === "credit" && (
              <Select
                label="Parcelas"
                value={paymentForm.watch("installments") || "1"}
                onValueChange={(v) => paymentForm.setValue("installments", v)}
                options={installmentOptions}
              />
            )}
          </div>
        )}

        {paymentMethod === "cash" && (
          <Input
            label="Troco para quanto? (opcional)"
            placeholder="R$ 0,00"
            {...paymentForm.register("changeFor")}
          />
        )}

        <div className="flex gap-3 mt-4">
          <Button variant="secondary" size="lg" type="button" onClick={onBack} className="flex-1">
            Voltar
          </Button>
          <Button variant="gold" size="lg" type="submit" className="flex-1">
            Revisar pedido
          </Button>
        </div>
      </form>
    );
  }

  return null;
}
