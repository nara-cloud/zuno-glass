# Deploy — ZUNO GLASS

## Railway (recomendado — gratuito)

### Passo a passo

**1. Acesse o Railway**
Entre em [railway.app](https://railway.app) e faça login com sua conta GitHub.

**2. Novo projeto**
Clique em **New Project** → **Deploy from GitHub repo** → selecione `nara-cloud/zuno-glass`.

**3. Configure as variáveis de ambiente**
No painel do projeto, vá em **Variables** e adicione:

| Variável | Valor |
|---|---|
| `MERCADO_PAGO_ACCESS_TOKEN` | Seu token de produção do Mercado Pago |
| `MERCADO_PAGO_PUBLIC_KEY` | Sua chave pública de produção |
| `JWT_SECRET` | Qualquer string aleatória longa (ex: `zuno-secret-2025-xkj9`) |
| `NODE_ENV` | `production` |

**4. Deploy automático**
O Railway detecta o `railway.json` e executa automaticamente:
- Build: `pnpm install && pnpm run build`
- Start: `node dist/standalone.js`

**5. Domínio**
O Railway gera uma URL gratuita como `zuno-glass.up.railway.app`.
Para usar `zunoglass.com`, vá em **Settings → Domains** e adicione seu domínio.

---

## Variáveis de ambiente — onde obter

**Mercado Pago:**
1. Acesse [mercadopago.com.br/developers](https://www.mercadopago.com.br/developers)
2. Vá em **Suas integrações** → selecione sua aplicação
3. Em **Credenciais de produção**, copie o `Access Token` e a `Public Key`

---

## Comandos locais

```bash
# Desenvolvimento
pnpm dev

# Build de produção
pnpm build

# Iniciar em produção
pnpm start
```

---

## Estrutura de dados

Os dados são armazenados em arquivos JSON na pasta `data/`:
- `data/products.json` — catálogo de produtos (criado automaticamente)
- `data/stock.json` — estoque por variante (criado automaticamente)
- `data/orders.json` — pedidos recebidos (não versionado no git)

**Importante:** No Railway, os arquivos em `data/` são persistidos enquanto o serviço estiver ativo. Para persistência permanente entre deploys, considere usar um volume no Railway ou migrar para banco de dados.

---

## Admin

Acesse `/admin` com a senha `zuno2025`.

Para alterar a senha, edite a variável `ADMIN_PASSWORD` em `server/standalone.ts` antes do deploy.
