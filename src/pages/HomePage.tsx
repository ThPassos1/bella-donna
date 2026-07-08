import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/home/Hero";
import { Categories } from "../components/home/Categories";
import { FeaturedProducts } from "../components/home/FeaturedProducts";
import { BestSellers } from "../components/home/BestSellers";
import { CollectionBanner } from "../components/home/CollectionBanner";
import { AboutSection } from "../components/home/AboutSection";
import { Testimonials } from "../components/home/Testimonials";
import { Newsletter } from "../components/home/Newsletter";
import { PersonalizedHomeSection } from "../components/home/PersonalizedHomeSection";
import { CartDrawer } from "../components/cart/CartDrawer";
import { ProductModal } from "../components/product/ProductModal";
import { CheckoutModal } from "../components/checkout/CheckoutModal";
import { OrderSuccess } from "../components/checkout/OrderSuccess";
import { OrderStatus } from "../components/checkout/OrderStatus";
import { Modal } from "../components/ui/Modal";
import { AuthModal } from "../components/auth/AuthModal";
import { useUIStore } from "../hooks/useUIStore";

export function HomePage() {
  const {
    isOrderSuccessOpen,
    closeOrderSuccess,
    currentOrder,
    isOrderStatusOpen,
    closeOrderStatus,
  } = useUIStore();

  return (
    <>
      <main>
        <Hero />
        <Categories />
        <FeaturedProducts />
        <PersonalizedHomeSection />
        <BestSellers />
        <CollectionBanner />
        <AboutSection />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />

      <CartDrawer />
      <ProductModal />
      <CheckoutModal />
      <AuthModal />

      <Modal
        open={isOrderSuccessOpen}
        onOpenChange={(open) => !open && closeOrderSuccess()}
        size="md"
      >
        {currentOrder && <OrderSuccess order={currentOrder} />}
      </Modal>

      <Modal
        open={isOrderStatusOpen}
        onOpenChange={(open) => !open && closeOrderStatus()}
        title="Status do pedido"
        size="md"
      >
        <OrderStatus order={currentOrder} />
      </Modal>
    </>
  );
}
