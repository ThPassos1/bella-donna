import { useAuth } from "./useAuth";

export function useCustomer() {
  const auth = useAuth();
  const user = auth.user;

  const userTickets = auth.tickets.filter(
    (t) => !t.userId || t.userId === user?.id
  );

  const userReturns = auth.returnRequests.filter(
    (r) => !r.userId || r.userId === user?.id
  );

  return {
    customer: user?.customer ?? null,
    addresses: user?.addresses ?? [],
    settings: user?.settings ?? null,
    primaryAddress: user?.addresses.find((a) => a.isPrimary) ?? null,
    updateCustomer: auth.updateCustomer,
    updateSettings: auth.updateSettings,
    addAddress: auth.addAddress,
    updateAddress: auth.updateAddress,
    deleteAddress: auth.deleteAddress,
    setPrimaryAddress: auth.setPrimaryAddress,
    getPaymentMethods: auth.getPaymentMethods,
    addPaymentMethod: auth.addPaymentMethod,
    removePaymentMethod: auth.removePaymentMethod,
    setDefaultPayment: auth.setDefaultPayment,
    tickets: userTickets,
    returnRequests: userReturns,
    addTicket: auth.addTicket,
    addReturnRequest: auth.addReturnRequest,
    changePassword: auth.changePassword,
  };
}
