import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { CheckoutForm } from "./CheckoutForm";
import type {
  CustomerFormData,
  AddressFormData,
  PaymentFormData,
} from "./CheckoutForm";
import { useUIStore } from "../../hooks/useUIStore";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { useCustomer } from "../../hooks/useCustomer";
import { useOrders } from "../../hooks/useOrders";
import { formatCurrency } from "../../utils/formatCurrency";
import { Button } from "../ui/Button";
import type { DeliveryMethod, Order } from "../../types/checkout";
import { generateOrderNumber, saveOrder } from "../../utils/generateOrderNumber";

const stepLabels = ["Dados", "Entrega", "Pagamento", "Revisão"];

export function CheckoutModal() {
  const { isCheckoutOpen, closeCheckout, openOrderSuccess } = useUIStore();
  const { items, getSubtotal, getDiscount, getShipping, getTotal, clearCart } =
    useCart();
  const { user, isLoggedIn, openRegister } = useAuth();
  const { primaryAddress } = useCustomer();
  const { addCustomerOrder, convertCheckoutOrder } = useOrders();

  const [step, setStep] = useState(1);
  const [customerData, setCustomerData] = useState<CustomerFormData>({
    fullName: "",
    email: "",
    phone: "",
    cpf: "",
  });
  const [addressData, setAddressData] = useState<AddressFormData>({
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });
  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    method: "pix",
    installments: "1",
  });
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("delivery");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isCheckoutOpen && user) {
      setCustomerData({
        fullName: user.customer.fullName,
        email: user.customer.email,
        phone: user.customer.phone,
        cpf: user.customer.cpf ?? "",
      });
      if (primaryAddress) {
        setAddressData({
          cep: primaryAddress.cep,
          street: primaryAddress.street,
          number: primaryAddress.number,
          complement: primaryAddress.complement ?? "",
          neighborhood: primaryAddress.neighborhood,
          city: primaryAddress.city,
          state: primaryAddress.state,
        });
      }
    }
  }, [isCheckoutOpen, user, primaryAddress]);

  const handleClose = () => {
    closeCheckout();
    setStep(1);
  };

  const handleConfirmOrder = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const order: Order = {
        id: crypto.randomUUID(),
        orderNumber: generateOrderNumber(),
        customer: customerData,
        address: addressData,
        deliveryMethod,
        payment: paymentData,
        items: [...items],
        subtotal: getSubtotal(),
        discount: getDiscount(),
        shipping: getShipping(deliveryMethod),
        total: getTotal(deliveryMethod),
        status: "received",
        createdAt: new Date().toISOString(),
      };

      saveOrder(order);

      addCustomerOrder(convertCheckoutOrder(order, user?.id));

      clearCart();
      handleClose();
      openOrderSuccess(order);
      setIsSubmitting(false);
      setStep(1);
    }, 1500);
  };

  const paymentLabels: Record<string, string> = {
    pix: "Pix",
    credit: "Cartão de crédito",
    debit: "Cartão de débito",
    cash: "Dinheiro na entrega",
  };

  return (
    <Modal
      open={isCheckoutOpen}
      onOpenChange={(open) => !open && handleClose()}
      title="Finalizar compra"
      size="lg"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {stepLabels.map((label, index) => (
            <div key={label} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                    step > index + 1
                      ? "bg-gold text-white"
                      : step === index + 1
                        ? "bg-elegant-black text-white"
                        : "bg-cream-dark text-graphite"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-xs text-graphite mt-1 hidden sm:block">
                  {label}
                </span>
              </div>
              {index < stepLabels.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-1 ${
                    step > index + 1 ? "bg-gold" : "bg-cream-dark"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {!isLoggedIn && step === 1 && (
        <div className="mb-6 rounded-xl bg-champagne/80 border border-gold/20 p-4 text-sm text-graphite">
          <p>
            Crie sua conta para acompanhar seus pedidos e comprar mais rápido na
            próxima vez.{" "}
            <button
              type="button"
              onClick={() => {
                handleClose();
                openRegister();
              }}
              className="text-gold font-semibold hover:underline"
            >
              Criar conta gratuita
            </button>
          </p>
        </div>
      )}

      {step < 4 ? (
        <CheckoutForm
          step={step}
          customerData={customerData}
          addressData={addressData}
          paymentData={paymentData}
          deliveryMethod={deliveryMethod}
          onCustomerSubmit={(data) => {
            setCustomerData(data);
            setStep(2);
          }}
          onAddressSubmit={(data) => {
            setAddressData(data);
            setStep(3);
          }}
          onPaymentSubmit={(data) => {
            setPaymentData(data);
            setStep(4);
          }}
          onDeliveryMethodChange={setDeliveryMethod}
          onBack={() => setStep((s) => Math.max(1, s - 1))}
        />
      ) : (
        <div className="space-y-6">
          <h3 className="font-serif text-xl font-semibold text-elegant-black">
            Revisão do pedido
          </h3>

          <div className="rounded-xl bg-cream-dark/50 p-4 space-y-3 text-sm">
            <div>
              <p className="font-medium text-elegant-black">Cliente</p>
              <p className="text-graphite">{customerData.fullName}</p>
              <p className="text-graphite">{customerData.email}</p>
              <p className="text-graphite">{customerData.phone}</p>
            </div>

            <div className="border-t border-elegant-black/10 pt-3">
              <p className="font-medium text-elegant-black">Entrega</p>
              <p className="text-graphite">
                {deliveryMethod === "pickup"
                  ? "Retirada na loja — disponível em até 24h"
                  : `${addressData.street}, ${addressData.number} — ${addressData.neighborhood}, ${addressData.city}/${addressData.state}`}
              </p>
            </div>

            <div className="border-t border-elegant-black/10 pt-3">
              <p className="font-medium text-elegant-black">Pagamento</p>
              <p className="text-graphite">
                {paymentLabels[paymentData.method]}
                {paymentData.method === "credit" &&
                  paymentData.installments &&
                  ` — ${paymentData.installments}x`}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-graphite">
                  {item.product.name} ({item.size}, {item.color}) x{item.quantity}
                </span>
                <span className="font-medium">
                  {formatCurrency(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-elegant-black/10 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-graphite">Subtotal</span>
              <span>{formatCurrency(getSubtotal())}</span>
            </div>
            {getDiscount() > 0 && (
              <div className="flex justify-between">
                <span className="text-graphite">Desconto</span>
                <span className="text-green-600">
                  -{formatCurrency(getDiscount())}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-graphite">Frete</span>
              <span>
                {getShipping(deliveryMethod) === 0
                  ? "Grátis"
                  : formatCurrency(getShipping(deliveryMethod))}
              </span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2">
              <span>Total</span>
              <span className="font-serif">
                {formatCurrency(getTotal(deliveryMethod))}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={() => setStep(3)}
            >
              Voltar
            </Button>
            <Button
              variant="gold"
              size="lg"
              className="flex-1"
              onClick={handleConfirmOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processando..." : "Confirmar pedido"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
