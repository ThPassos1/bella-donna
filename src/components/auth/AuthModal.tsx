import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { useAdminAuthStore, isAdminCredentials } from "../../hooks/useAdminAuth";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(4, "Senha obrigatória"),
});

const registerSchema = z
  .object({
    fullName: z.string().min(3, "Nome completo obrigatório"),
    email: z.string().email("E-mail inválido"),
    phone: z.string().min(10, "Telefone obrigatório"),
    cpf: z.string().optional(),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

const forgotSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;
type ForgotData = z.infer<typeof forgotSchema>;

export function AuthModal() {
  const {
    isLoginOpen,
    authView,
    closeAuth,
    openLogin,
    openRegister,
    openForgot,
    login,
    register,
    forgotPassword,
    seedDemoIfNeeded,
    logout,
  } = useAuth();

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const forgotForm = useForm<ForgotData>({
    resolver: zodResolver(forgotSchema),
  });

  const handleLogin = (data: LoginData) => {
    setError("");

    if (isAdminCredentials(data.email, data.password)) {
      const adminResult = useAdminAuthStore.getState().login(data.email, data.password);
      if (adminResult.success) {
        logout();
        closeAuth();
        loginForm.reset();
        navigate("/admin");
        return;
      }
    }

    seedDemoIfNeeded();
    const result = login(data.email, data.password);
    if (!result.success) {
      setError(result.error ?? "Erro ao entrar.");
    } else {
      useAdminAuthStore.getState().logout();
      loginForm.reset();
    }
  };

  const handleRegister = (data: RegisterData) => {
    setError("");
    const result = register({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      cpf: data.cpf,
      password: data.password,
    });
    if (!result.success) {
      setError(result.error ?? "Erro ao cadastrar.");
    } else {
      registerForm.reset();
    }
  };

  const handleForgot = (data: ForgotData) => {
    setError("");
    setSuccess("");
    const result = forgotPassword(data.email);
    if (!result.success) {
      setError(result.error ?? "Erro ao recuperar senha.");
    } else {
      setSuccess("Enviamos instruções para o seu e-mail.");
      forgotForm.reset();
    }
  };

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  return (
    <Modal
      open={isLoginOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeAuth();
          resetMessages();
        }
      }}
      size="md"
      className="!p-0 overflow-hidden"
    >
      <div className="bg-gradient-to-br from-champagne via-cream to-rose-nude/30 p-6 sm:p-8">
        <div className="text-center mb-6">
          <p className="text-xs font-semibold text-gold uppercase tracking-[0.2em] mb-2">
            Bella Donna
          </p>
          <h2 className="font-serif text-2xl font-semibold text-elegant-black">
            {authView === "login" && "Bem-vinda de volta"}
            {authView === "register" && "Criar sua conta"}
            {authView === "forgot" && "Recuperar senha"}
          </h2>
          <p className="text-sm text-graphite mt-2">
            {authView === "login" &&
              "Entre com sua conta de cliente ou de administradora da loja."}
            {authView === "register" &&
              "Cadastre-se e tenha uma experiência completa."}
            {authView === "forgot" &&
              "Informe seu e-mail para receber instruções."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {authView === "login" && (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={loginForm.handleSubmit(handleLogin)}
              className="space-y-4"
            >
              <Input
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                {...loginForm.register("email")}
                error={loginForm.formState.errors.email?.message}
              />
              <Input
                label="Senha"
                type="password"
                placeholder="••••••••"
                {...loginForm.register("password")}
                error={loginForm.formState.errors.password?.message}
              />
              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2">
                  {error}
                </p>
              )}
              <Button variant="gold" size="lg" type="submit" className="w-full">
                <Lock className="h-5 w-5" />
                Entrar
              </Button>
              <div className="rounded-xl bg-white/60 p-3 text-xs text-graphite text-center space-y-1">
                <p>
                  <strong>Cliente:</strong> maria@belladonna.com.br / senha123
                </p>
                <p>
                  <strong>Administradora:</strong> admin@belladonna.com / 123456
                </p>
              </div>
              <div className="flex flex-col gap-2 text-center text-sm">
                <button
                  type="button"
                  onClick={() => {
                    resetMessages();
                    openForgot();
                  }}
                  className="text-gold hover:underline"
                >
                  Esqueci minha senha
                </button>
                <p className="text-graphite">
                  Não tem conta?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      resetMessages();
                      openRegister();
                    }}
                    className="text-gold font-medium hover:underline"
                  >
                    Criar conta
                  </button>
                </p>
              </div>
            </motion.form>
          )}

          {authView === "register" && (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={registerForm.handleSubmit(handleRegister)}
              className="space-y-3 max-h-[60vh] overflow-y-auto pr-1"
            >
              <Input
                label="Nome completo"
                {...registerForm.register("fullName")}
                error={registerForm.formState.errors.fullName?.message}
              />
              <Input
                label="E-mail"
                type="email"
                {...registerForm.register("email")}
                error={registerForm.formState.errors.email?.message}
              />
              <Input
                label="Telefone"
                type="tel"
                placeholder="(11) 99999-9999"
                {...registerForm.register("phone")}
                error={registerForm.formState.errors.phone?.message}
              />
              <Input
                label="CPF (opcional)"
                {...registerForm.register("cpf")}
              />
              <Input
                label="Senha"
                type="password"
                {...registerForm.register("password")}
                error={registerForm.formState.errors.password?.message}
              />
              <Input
                label="Confirmar senha"
                type="password"
                {...registerForm.register("confirmPassword")}
                error={registerForm.formState.errors.confirmPassword?.message}
              />
              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2">
                  {error}
                </p>
              )}
              <Button variant="gold" size="lg" type="submit" className="w-full">
                <User className="h-5 w-5" />
                Criar conta
              </Button>
              <p className="text-center text-sm text-graphite">
                Já tem conta?{" "}
                <button
                  type="button"
                  onClick={() => {
                    resetMessages();
                    openLogin();
                  }}
                  className="text-gold font-medium hover:underline"
                >
                  Entrar
                </button>
              </p>
            </motion.form>
          )}

          {authView === "forgot" && (
            <motion.form
              key="forgot"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={forgotForm.handleSubmit(handleForgot)}
              className="space-y-4"
            >
              <Input
                label="E-mail"
                type="email"
                {...forgotForm.register("email")}
                error={forgotForm.formState.errors.email?.message}
              />
              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-sm text-green-600 bg-green-50 rounded-lg px-4 py-2">
                  {success}
                </p>
              )}
              <Button variant="gold" size="lg" type="submit" className="w-full">
                <Mail className="h-5 w-5" />
                Enviar instruções
              </Button>
              <p className="text-center text-sm text-graphite">
                <button
                  type="button"
                  onClick={() => {
                    resetMessages();
                    openLogin();
                  }}
                  className="text-gold font-medium hover:underline"
                >
                  Voltar para entrar
                </button>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}
