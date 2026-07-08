import { Routes, Route } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { AccountLayout } from "../components/account/AccountLayout";
import { AccountOverview } from "../components/account/AccountOverview";
import { AccountOrders } from "../components/account/AccountOrders";
import { AccountFavorites } from "../components/account/AccountFavorites";
import { AccountProfile } from "../components/account/AccountProfile";
import { AccountAddresses } from "../components/account/AccountAddresses";
import { AccountPayments } from "../components/account/AccountPayments";
import { AccountCoupons } from "../components/account/AccountCoupons";
import { AccountReturns } from "../components/account/AccountReturns";
import { AccountSupport } from "../components/account/AccountSupport";
import { AccountSettings } from "../components/account/AccountSettings";
import { AuthModal } from "../components/auth/AuthModal";
import { CartDrawer } from "../components/cart/CartDrawer";
import { CheckoutModal } from "../components/checkout/CheckoutModal";

export function AccountPage() {
  return (
    <>
      <Header />
      <Routes>
        <Route element={<AccountLayout />}>
          <Route index element={<AccountOverview />} />
          <Route path="pedidos" element={<AccountOrders />} />
          <Route path="favoritos" element={<AccountFavorites />} />
          <Route path="dados" element={<AccountProfile />} />
          <Route path="enderecos" element={<AccountAddresses />} />
          <Route path="pagamentos" element={<AccountPayments />} />
          <Route path="cupons" element={<AccountCoupons />} />
          <Route path="trocas" element={<AccountReturns />} />
          <Route path="atendimento" element={<AccountSupport />} />
          <Route path="configuracoes" element={<AccountSettings />} />
        </Route>
      </Routes>
      <CartDrawer />
      <CheckoutModal />
      <AuthModal />
    </>
  );
}
