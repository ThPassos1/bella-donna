import {
  Share2,
  Globe,
  MessageCircle,
  MapPin,
  Clock,
  Mail,
} from "lucide-react";

import { useSettingsStore } from "../../stores/settingsStore";

const quickLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Coleções", href: "#colecoes" },
  { label: "Produtos", href: "#produtos" },
  { label: "Sobre", href: "#sobre" },
];

const categoryLinks = [
  { label: "Vestidos", href: "#produtos" },
  { label: "Blusas", href: "#produtos" },
  { label: "Conjuntos", href: "#produtos" },
  { label: "Acessórios", href: "#produtos" },
];

const paymentMethods = ["Pix", "Visa", "Mastercard", "Elo", "Dinheiro"];

export function Footer() {
  const settings = useSettingsStore((s) => s.settings);

  return (
    <footer id="atendimento" className="bg-elegant-black text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="font-serif text-2xl font-semibold mb-2">
              {settings.storeName}
            </h3>
            <p className="text-sm text-white/70 leading-relaxed mb-6">
              {settings.footerText}
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="rounded-full bg-white/10 p-2.5 hover:bg-gold transition-colors"
                aria-label="Instagram"
              >
                <Share2 className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-full bg-white/10 p-2.5 hover:bg-gold transition-colors"
                aria-label="Facebook"
              >
                <Globe className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-full bg-white/10 p-2.5 hover:bg-gold transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gold mb-4">Categorias</h4>
            <ul className="space-y-2">
              {categoryLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gold mb-4">Atendimento</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                <span>
                  Rua das Flores, 123 — Centro
                  <br />
                  São Paulo, SP — CEP 01310-100
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                <span className="break-words">
                  Seg a Sáb: 9h às 19h | Dom: 10h às 14h
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold shrink-0" />
                <span className="break-all">contato@belladonna.com.br</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-gold shrink-0" />
                <span>WhatsApp: (11) 99999-8888</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs uppercase tracking-wide text-slate-400 text-center sm:text-left">
              © 2026 Techt. Desenvolvido por{" "}
              <span className="text-cyan-400">Thiago Passos</span>.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
              <span className="text-xs text-white/50 shrink-0">
                Formas de pagamento:
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {paymentMethods.map((method) => (
                  <span
                    key={method}
                    className="rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-medium text-white/80"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
