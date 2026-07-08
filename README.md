# Bella Donna

E-commerce de moda feminina com vitrine, carrinho, checkout, área do cliente e painel administrativo. Projeto de demonstração para portfólio — dados persistidos no navegador (localStorage), sem backend.

**Demo:** [https://ThPassos1.github.io/bella-donna/](https://ThPassos1.github.io/bella-donna/)

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand
- Framer Motion
- React Hook Form + Zod
- Lucide React

## Como rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173).

```bash
npm run build    # build de produção
npm run preview  # preview do build
```

## Contas de demonstração

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Cliente | `maria@belladonna.com.br` | `senha123` |
| Admin | `admin@belladonna.com` | `123456` |

O login é o mesmo ícone de usuário no header: o sistema identifica se a conta é de cliente ou administradora.

## O que o projeto cobre

- Vitrine com filtros, favoritos e recomendações
- Carrinho e checkout em etapas
- Área do cliente (pedidos, endereços, pagamentos, etc.)
- Painel admin (produtos, pedidos, clientes, faturamento, configurações)

## Estrutura

```
src/
  components/   # UI por domínio (home, cart, checkout, account, admin…)
  pages/        # Rotas principais
  hooks/        # Hooks e stores Zustand
  stores/       # Stores compartilhados
  data/         # Catálogo e seeds de demonstração
  types/        # Tipos TypeScript
  utils/        # Helpers
public/         # Imagens e assets estáticos
```

## Observação

Este é um protótipo front-end completo. Em produção, autenticação, pedidos e catálogo passariam por uma API.
