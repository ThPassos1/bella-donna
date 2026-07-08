import { useState } from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { useCustomer } from "../../hooks/useCustomer";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";

export function AccountSettings() {
  const { settings, updateSettings, changePassword } = useCustomer();
  const [pwForm, setPwForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handlePassword = () => {
    setPwError("");
    if (pwForm.newPass !== pwForm.confirm) {
      setPwError("As senhas não coincidem.");
      return;
    }
    const result = changePassword(pwForm.current, pwForm.newPass);
    if (!result.success) {
      setPwError(result.error ?? "Erro ao alterar senha.");
      return;
    }
    setPwSuccess(true);
    setPwForm({ current: "", newPass: "", confirm: "" });
    setTimeout(() => setPwSuccess(false), 3000);
  };

  if (!settings) return null;

  return (
    <div className="space-y-8">
      <h2 className="font-serif text-2xl font-semibold text-elegant-black">
        Configurações
      </h2>

      <div className="rounded-2xl bg-white p-6 premium-shadow space-y-4">
        <h3 className="font-medium text-elegant-black">Notificações por e-mail</h3>
        {[
          {
            key: "emailNews" as const,
            label: "Receber novidades por e-mail",
          },
          {
            key: "emailPromos" as const,
            label: "Receber promoções",
          },
          {
            key: "emailNewProducts" as const,
            label: "Receber aviso de novos produtos",
          },
        ].map((item) => (
          <label
            key={item.key}
            className="flex items-center justify-between rounded-xl border border-elegant-black/5 p-4 cursor-pointer hover:bg-cream-dark/30 transition-colors"
          >
            <span className="text-graphite">{item.label}</span>
            <input
              type="checkbox"
              checked={settings[item.key]}
              onChange={(e) => updateSettings({ [item.key]: e.target.checked })}
              className="h-5 w-5 rounded accent-gold"
            />
          </label>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-6 premium-shadow space-y-4">
        <h3 className="font-medium text-elegant-black">Alterar senha</h3>
        {pwSuccess && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="h-4 w-4" />
            Senha alterada com sucesso.
          </div>
        )}
        {pwError && (
          <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2">
            {pwError}
          </p>
        )}
        <Input
          label="Senha atual"
          type="password"
          value={pwForm.current}
          onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
        />
        <Input
          label="Nova senha"
          type="password"
          value={pwForm.newPass}
          onChange={(e) => setPwForm({ ...pwForm, newPass: e.target.value })}
        />
        <Input
          label="Confirmar nova senha"
          type="password"
          value={pwForm.confirm}
          onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
        />
        <Button variant="gold" size="md" onClick={handlePassword}>
          Alterar senha
        </Button>
      </div>

      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6">
        <h3 className="font-medium text-red-700 mb-2">Zona de perigo</h3>
        <p className="text-sm text-red-600 mb-4">
          Excluir conta remove seus dados desta demonstração.
        </p>
        <Button
          variant="ghost"
          size="md"
          className="text-red-600 hover:bg-red-100"
          onClick={() => setDeleteOpen(true)}
        >
          Excluir conta
        </Button>
      </div>

      <Modal open={deleteOpen} onOpenChange={setDeleteOpen} title="Excluir conta" size="sm">
        <div className="text-center py-4">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-graphite mb-6">
            Em um sistema real, sua conta seria excluída permanentemente.
            Nesta demonstração, os dados permanecem no navegador.
          </p>
          <Button variant="secondary" size="lg" className="w-full" onClick={() => setDeleteOpen(false)}>
            Entendi
          </Button>
        </div>
      </Modal>
    </div>
  );
}
