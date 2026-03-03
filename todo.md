# Project TODO

- [x] Basic homepage layout with hero banner
- [x] Navigation menu (PULSE, LAB, SQUAD, PRO, TRY-ON VIRTUAL, SOBRE)
- [x] Virtual try-on functionality
- [x] Lead capture popup
- [x] Squad page (athletes)
- [x] Lab page (innovation/drops)
- [x] Pulse page (app/gamification)
- [x] About page
- [x] Remove sales features (no cart, prices, buy buttons)
- [x] Replace launch date with "EM BREVE"
- [x] White logo on dark backgrounds
- [x] Cyberpunk/futuristic aesthetic
- [x] FAQ section
- [x] Newsletter section
- [x] Entry animations
- [x] Atualizar foto do banner principal para nova imagem (IMG_1279.PNG) com foco no rosto/óculos
- [x] Substituir imagem do casal no elevador (Pulse) pela nova foto da atleta correndo na pista
- [x] Ajustar posicionamento da imagem hero para focar nos óculos (especialmente mobile)
- [x] Corrigir: conteúdo do hero (imagem e badge EM BREVE) não deve invadir o espaço do menu de navegação
- [x] Posicionar rosto da atleta na área direita do hero (sem texto), texto fica à esquerda
- [x] Reposicionar rosto da atleta para ficar à direita na mesma altura de "LIMITE DA LUZ"
- [x] Recortar imagem da atleta para focar no rosto/óculos e atualizar no hero banner
- [x] Configurar infraestrutura Stripe (webdev_add_feature + secrets)
- [x] Implementar schema de base de dados para pedidos e pagamentos (via Stripe API, sem DB local)
- [x] Implementar rotas Express para checkout e webhooks Stripe
- [x] Implementar UI de checkout (botão COMPRAR AGORA → Stripe Checkout)
- [x] Implementar página de sucesso de pagamento (/checkout/success)
- [ ] Escrever testes para a integração Stripe
- [x] Corrigir SEO: título da página (30-60 caracteres)
- [x] Corrigir SEO: adicionar meta description (50-160 caracteres)
- [x] Corrigir SEO: adicionar palavras-chave relevantes
- [x] Mover rosto da atleta mais para direita e mais para baixo (fora da barra de menu)
- [x] Mover badge "EM BREVE" para baixo da barra de menu
- [x] Upload dos 32 modelos de óculos do lançamento para CDN
- [x] Atualizar catálogo de produtos (products.ts) com modelos reais ZUNO GLASS
- [x] Atualizar páginas de produtos e home com novos modelos
- [x] Ajustar foto da atleta no hero: mais para direita e mais para baixo, focar no rosto/óculos
- [x] Corrigir SEO: reduzir palavras-chave de 9 para máximo 8
- [x] Aumentar imagem da atleta no hero 3x (zoom no rosto/óculos)
- [x] Mover foto da atleta 3x mais para a direita no hero banner (recortada focando nos óculos)
- [x] Mover foto da atleta mais 2x para a direita, especialmente no mobile
- [x] Trocar imagem de fundo da seção "DOMINE O CAOS" pela foto da caixa ZUNO
- [x] Corrigir: texto "LAB" no título "ZUNO LAB" invisível (preto sobre fundo escuro)
- [x] Corrigir texto "SQUAD" invisível na página Squad (mesmo problema do LAB)
- [x] Trocar imagem de fundo da página Squad pela foto dos corredores com óculos ZUNO
- [x] Atualizar links das redes sociais com URLs reais (Instagram, Facebook, TikTok; X e LinkedIn como placeholder)
- [x] 1. Remover claims inexistentes (Bluetooth, dados, ajuste eletrônico, áudio, túnel de vento, balístico, etc.)
- [x] 2. Reescrever página Lab (UV400, leveza, testes reais, tom honesto)
- [x] 3. Ajustar página Squad (Performance vs Clássico, manifesto, mini bios)
- [x] 4. Criar página Comunidade (desafios, integração Squad, lista de espera App)
- [x] 5. Criar página ZUNO App (em desenvolvimento, lista de espera)
- [x] 6. Página de Produto existente (ProductDetail) atualizada com benefícios, galeria, garantia
- [x] 7. Atualizar FAQ (pergunta sobre tecnologia eletrônica)
- [x] 8. Ajustar posicionamento geral (remover narrativa óculos inteligente, foco performance real)
- [x] Atualizar Navbar com links: COLEÇÃO, LAB, SQUAD, COMUNIDADE, APP, FAQ
- [x] Atualizar Footer com links corretos para novas páginas
- [x] Adicionar rotas /community e /app no App.tsx
- [x] Adicionar seção Comunidade na Home page
- [x] Atualizar LeadCapturePopup com linguagem honesta
- [x] Atualizar descrição da coleção na Products page
- [x] Corrigir layout da página Comunidade (texto cortado, badge sobrepondo navbar)
- [x] Verificar e corrigir layout de todas as outras páginas (Lab, Squad, App, Home)
- [x] Adicionar secção de Parceiros (marcas e profissionais) na página Comunidade
- [x] Atualizar preços dos produtos: casuais R$ 169,90 e esportivos R$ 189,90
- [x] Adicionar exibição de parcelamento nos preços (ProductCard e ProductDetail)
- [x] Criar countdown de lançamento 03/03 na Home page com destaque de preço
- [x] Integrar pagamento Stripe (checkout session, webhook, página de sucesso)
- [x] Endpoint /api/order/:sessionId para consultar pedidos via Stripe
- [x] E-commerce: Criar contexto de carrinho de compras (CartContext) com persistência localStorage
- [x] E-commerce: Criar componente CartDrawer (sidebar/drawer) com lista de itens, quantidades e total
- [x] E-commerce: Integrar ícone de carrinho na Navbar com badge de quantidade
- [x] E-commerce: Botão "Adicionar ao Carrinho" no ProductDetail e ProductCard
- [x] E-commerce: Checkout Stripe com múltiplos itens do carrinho
- [x] E-commerce: Página de sucesso de compra melhorada com detalhes do pedido
- [x] E-commerce: Página "Meus Pedidos" para consultar histórico de compras
- [x] E-commerce: Seletor de quantidade nos produtos e no carrinho
- [x] Criar página Envio e Devoluções (/shipping)
- [x] Criar página Garantia (/warranty)
- [x] Criar página Guia de Tamanhos (/size-guide)
- [x] Criar página Contato (/contact)
- [x] Registar rotas no App.tsx para as 4 páginas de suporte
- [x] Atualizar links no Footer para apontar para as novas páginas
- [x] Implementar cálculo de frete por CEP no carrinho
- [x] Criar endpoint de consulta de frete no servidor (client-side via shared/shipping.ts)
- [x] Integrar frete no CartDrawer (campo CEP + resultado)
- [x] Incluir frete no checkout Stripe (shipping_options)
- [x] Atualizar página Envio e Devoluções com informações de frete
- [x] Aumentar tamanho da logo na Navbar
- [x] Frete grátis para Petrolina (PE) e Juazeiro (BA)
- [x] Testar fluxo completo de compra com frete grátis (CEP Petrolina) no Stripe
- [x] Verificar integração do frete grátis no checkout Stripe (shipping_options)
- [x] Revisão final do site para publicação (links, imagens, textos, navegação)
- [x] Corrigir texto "Frete grátis para todo o Brasil" — frete grátis é apenas para Petrolina/Juazeiro e compras acima de R$ 299,90
- [x] Atualizar secção Parceiros na Comunidade com "Em Breve" — ainda sem marcas/profissionais cadastrados
- [x] Recortar margens da logo para aumentar tamanho visual na navbar
- [x] Atualizar Squad com 7 membros reais: Nara Ferrari, Luiza Ferrari, Eduardo Rodrigues, Natália Leite, Beatriz Cordeiro, Lucas Corlett, Luanda Passos
- [x] Renomear modelos: Linha Performance (5 modelos) com novos nomes
- [x] Renomear modelos: Linha Lifestyle (11 modelos) com novos nomes
- [x] Criar/Renomear: Linha Edição Limitada (5 modelos) com novos nomes
- [x] Atualizar referências de linhas em todo o site (filtros, páginas, etc.)
- [x] Substituir avatares gerados por fotos reais dos 7 membros do Squad
- [x] Mover Luiza Ferrari de Clássico para Performance (corredora)
- [x] Configurar logo ZUNO como favicon do site
- [x] Bug: popup Lead Capture mostrando dois botões X de fechar
- [x] Revisar lógica de frete grátis e envio
- [x] Remover frete grátis automático de SP Capital (cobrar normalmente)
- [x] Corrigir badge "Frete Grátis Brasil" no ProductDetail para informação precisa
- [x] Manter frete grátis apenas para Petrolina/Juazeiro e compras acima de R$ 299,90
- [x] Remover regra de frete grátis acima de R$ 299,90 (frete grátis só Petrolina/Juazeiro)
- [x] Remover barra de progresso de frete grátis do carrinho
- [x] Atualizar badge, páginas e textos que mencionam frete grátis acima de R$ 299,90
- [x] Corrigir perfil do Eduardo Rodrigues: Coach de Tênis e Beach Tênis (não corredor)
- [x] Integração com ZUNO Gestão: analisar API disponível e configurar secrets
- [x] Integração com ZUNO Gestão: criar serviço de integração no servidor
- [x] Integração com ZUNO Gestão: criar endpoint /api/stock para consultar estoque
- [x] Integração com ZUNO Gestão: notificar venda ao ZUNO Gestão após checkout Stripe
- [x] Integração com ZUNO Gestão: exibir disponibilidade de estoque no frontend (ProductCard e ProductDetail)
- [x] Integração com ZUNO Gestão: bloquear compra de produtos sem estoque
- [x] Integração com ZUNO Gestão: testes da integração
- [x] Bug: imagem hero não preenche toda a seção até o fim do cabeçalho
- [x] Ajustar posicionamento da imagem hero: pessoa no lado direito (sem texto)
- [x] Ajustar hero: pessoa completamente no lado direito, texto à esquerda
- [ ] Melhorar qualidade da imagem hero (upload em alta resolução)
- [x] Ajustar site para pós-lançamento: remover countdown timer
- [x] Ajustar site para pós-lançamento: remover badge "LANÇAMENTO 03/03"
- [x] Ajustar site para pós-lançamento: atualizar popup Lead Capture para newsletter
- [x] Ajustar site para pós-lançamento: remover badges "NOVO" dos produtos
- [x] Ajustar site para pós-lançamento: atualizar textos de "em breve" e "pré-lançamento"
- [x] Corrigir badge "PARA QUEM VIVE NO LIMITE" duplicado e mal posicionado na hero section
- [x] Substituir imagem hero pela nova foto da atleta correndo (IMG_9729) otimizada
- [x] Página de login/admin: criar componente de autenticação
- [x] Página de login/admin: implementar acesso restrito para admins
- [x] Dashboard de vendas: criar layout com gráficos
- [x] Dashboard de vendas: exibir relatórios em tempo real
- [ ] Integração Mercado Pago: configurar credenciais
- [ ] Integração Mercado Pago: criar endpoints de pagamento
- [ ] Integração Mercado Pago: testar fluxo de checkout
- [x] Corrigir favicon: adicionar marca ZUNO (círculo amarelo/neon)
- [x] Remover ícone de carrinho do canto superior direito da navbar
- [x] Página de confirmação de pedido: endpoint para buscar detalhes do pedido
- [x] Página de confirmação de pedido: layout com número do pedido e rastreamento
- [x] Página de confirmação de pedido: integrar com checkout Stripe
- [x] Corrigir favicon: ainda não está a aparecer no browser
- [x] Seção "Produtos Relacionados" na página de detalhes do produto
- [ ] Integração Mercado Pago: PIX e boleto
- [ ] Email transacional: confirmação automática de pedido
- [x] Botão login/admin no rodapé: login se não autenticado, redirecionar para /admin se autenticado
- [ ] Mercado Pago: configurar credenciais (Access Token + Public Key)
- [ ] Mercado Pago: endpoints de pagamento PIX, boleto e cartão
- [ ] Mercado Pago: página de checkout transparente no frontend
- [ ] Email transacional: confirmação de pedido com Resend

## Plataforma de Gestão do E-commerce (Admin)
- [x] Criar schema de pedidos no banco de dados (tabelas: orders, order_items)
- [x] Criar rotas de API para pedidos (listar, detalhar, atualizar status)
- [x] Criar rotas de API para admin (stats, produtos, estoque)
- [x] Criar layout do painel admin com sidebar de navegação
- [x] Página admin: Dashboard com KPIs reais (pedidos, receita, estoque)
- [x] Página admin: Gestão de Pedidos (listar, filtrar, atualizar status)
- [x] Página admin: Detalhe do Pedido (itens, cliente, endereço, pagamento)
- [x] Página admin: Gestão de Estoque (sincronizado com ZUNO Gestão)
- [x] Página admin: Relatório de Vendas com gráficos reais
- [x] Integrar checkout para salvar pedidos no banco de dados
- [x] Autenticação admin via senha fixa (sem dependência de OAuth)

## Sistema de Autenticação Própria (SSO)
- [x] Schema do banco: tabelas users, roles, user_roles, refresh_tokens
- [x] Backend de autenticação: registro, login, JWT, refresh token, logout
- [x] RBAC com 5 papéis: admin, ops, creator_partner, customer, community_member
- [x] Middleware de proteção de rotas (requireAuth, requireRole)
- [x] Página de Login (/entrar) com design ZUNO
- [x] Página de Cadastro (/cadastro) com design ZUNO
- [x] Área do Cliente (/minha-conta): dashboard, pedidos, perfil
- [x] Plataforma Admin: gestão de usuários (/admin/users) com RBAC
- [x] Rotas de admin/users no servidor (listar, editar papéis, toggle status)
- [x] Botão ENTRAR no cabeçalho (Navbar)
- [x] AuthProvider e AuthContext global
- [x] Membros Squad: Beatriz Possidio, Leonnardo Araújo, Bruno Oliuza, Renata Souza, Laryzza Leal, Beatriz Mendes
- [ ] Testes unitários para autenticação
- [ ] Login social (Google/Apple) — fase 2
- [ ] MFA para admin — fase 2

## Melhorias Fase 2
- [ ] Mercado Pago: endpoints de PIX, boleto e cartão no servidor
- [ ] Mercado Pago: página de checkout transparente no frontend
- [ ] Mercado Pago: webhook para salvar pedidos no banco
- [x] Admin: página /admin/products com os 30 SKUs (custo, margem, estoque)
- [x] Admin: filtros por categoria e busca por nome/SKU na página de produtos
- [ ] E-mail transacional: configurar Resend para confirmação de pedido
- [ ] E-mail transacional: template HTML de confirmação de pedido
- [ ] E-mail transacional: disparar após pagamento confirmado (MP + Stripe)
- [x] Try-On Virtual: atualizar página para exibir tela "Em Desenvolvimento"
- [x] Atualizar logo: remover fundo preto, gerar PNG transparente, atualizar site e favicon
- [x] Corrigir Navbar: botão ENTRAR usar login próprio (sem Manus OAuth)
- [ ] Hero da Home: atualizar tagline para "PARA QUEM VIVE NO LIMITE DA LUZ" com estilo outline neon
- [ ] Tela de loading: usar logo circular amarela (zzuno.png)

## Gestão de Utilizadores
- [x] Promover nara@triadeconstrutorabr.com a administrador

## Gestão de Permissões
- [ ] Criar página /admin/permissions com gestão de papéis (roles) e membros do Squad
- [ ] Listar todos os utilizadores com seus papéis actuais
- [ ] Permitir atribuir/revogar papéis (admin, ops, creator_partner, customer, community_member)
- [ ] Secção especial para membros do Squad (community_member + squad_member)
- [ ] Adicionar item "Permissões" ao menu do AdminLayout

## Correcção de Estoque
- [ ] Auditar API ZUNO Gestão e verificar produtos reais disponíveis
- [ ] Corrigir mapeamento stockMapping.ts com IDs e SKUs correctos
- [ ] Testar sincronização de estoque em tempo real

## Painel Admin Completo (substituir ZUNO Gestão)
- [ ] Expandir AdminLayout com todos os menus (Gestão, Financeiro, Marketing, Admin)
- [ ] Adicionar endpoints proxy no servidor para todas as APIs do ZUNO Gestão
- [ ] Página /admin/clients — gestão de clientes
- [ ] Página /admin/collections — gestão de coleções
- [ ] Página /admin/financial — financeiro (receita, custos, lucro)
- [ ] Página /admin/cashflow — fluxo de caixa
- [ ] Página /admin/investments — investimentos
- [ ] Página /admin/payments — pagamentos recebidos
- [ ] Página /admin/discounts — cupons e descontos
- [ ] Página /admin/affiliates — programa de afiliados
- [ ] Página /admin/scenarios — cenários de rentabilidade
- [ ] Página /admin/profitability — análise de rentabilidade por produto
- [ ] Página /admin/partners — sócios
- [ ] Página /admin/permissions — gestão de permissões e roles
- [ ] Corrigir mapeamento stockMapping.ts com nomes correctos (ZUNO STRIX = DEVON APEX)
- [x] Reactivar popup de inscrição para newsletter na homepage

## Painel Admin Completo (substituição do ZUNO Gestão)
- [x] Página admin: Financeiro (/admin/financial) — resumo financeiro e vendas
- [x] Página admin: Investimentos (/admin/investments) — controlo de despesas
- [x] Página admin: Sócios (/admin/partners) — participações e investimentos
- [x] Página admin: Descontos (/admin/discounts) — cupons e promoções
- [x] Página admin: Afiliados (/admin/affiliates) — programa de afiliados
- [x] Página admin: Clientes (/admin/clients) — utilizadores registados
- [x] Página admin: Coleções (/admin/collections) — gestão de coleções
- [x] Página admin: Fluxo de Caixa (/admin/cashflow) — entradas e saídas
- [x] AdminLayout expandido com todos os menus agrupados (Gestão, Financeiro, Marketing, Administração)
- [x] Popup de newsletter reactivado na homepage
- [x] Linha "Para quem vive" adicionada acima de "LIMITE" na hero
- [x] Promoção de nara@triadeconstrutorabr.com a administrador
- [ ] Corrigir estoque/coleções: puxar dados reais da aba Coleções da API ZUNO Gestão
- [x] Hero: afastar "PARA QUEM VIVE" do cabeçalho e corrigir proporções do título
- [x] Promover luiza@triadeconstrutorabr.com a administradora (pendente: ela precisa fazer login primeiro)
- [x] Criar sistema de gestão de produtos no painel admin (CRUD completo com nome, SKU, variantes, preço, custo, estoque)
- [x] Criar página /admin/catalog com CRUD completo de produtos e variantes

## Migração: Eliminar dependência da API ZUNO Gestão
- [x] Popular BD com os 32 produtos e variantes reais (esportivos + casuais)
- [x] Substituir /api/stock por consulta à BD local (catalog_variants.stock)
- [x] Substituir endpoints proxy do ZUNO Gestão por consultas à BD local
- [x] Actualizar AdminStock para usar BD local
- [ ] Actualizar AdminCollections para usar BD local
- [x] Remover zunoGestao.ts e endpoints proxy do servidor

## Migração ZUNO Gestão → BD Local (Fase Actual)
- [x] Reescrever AdminProducts.tsx para usar /api/admin/stock (BD local)
- [x] Reescrever AdminStock.tsx para usar /api/admin/stock (BD local)
- [x] Reescrever AdminFinancial.tsx para usar BD local
- [x] Reescrever AdminCashflow.tsx para usar BD local
- [x] Reescrever AdminInvestments.tsx para usar BD local
- [x] Reescrever AdminPartners.tsx para usar BD local
- [x] Reescrever AdminDiscounts.tsx para usar BD local (coupons table)
- [x] Reescrever AdminAffiliates.tsx para usar BD local
- [x] Remover todos os endpoints /api/admin/gestao/* do server/index.ts (migrados para BD local)
- [x] Remover server/zunoGestao.ts

## Plataforma E-commerce Completa
- [x] Endpoint público /api/catalog com 21 produtos e 32 variantes da BD local
- [x] Categorias mapeadas: esportivo→performance, casual→lifestyle
- [x] Página /products actualizada para usar /api/catalog (sem arquivo estático)
- [x] ProductCard compatível com dados da BD (slug como id, image_url, color/colorName)
- [x] AdminCatalog completo com editor de produtos (fotos, variantes, preços, estoque, SEO)
- [x] Tabelas BD: investments, partners, coupons, affiliates criadas
- [x] Estoque actualizado com CSV (32 SKUs correctos)

## 32 Produtos Individuais na Loja
- [x] Reestruturar BD: cada SKU do CSV vira um produto independente com nome próprio
- [x] Actualizar /api/catalog para retornar 32 produtos (um por SKU)
- [x] Actualizar loja para exibir os 32 cards de produtos
- [x] Corrigir categoria do ZUNO VORTEXA: mudar de performance para lifestyle (casual)
- [x] Corrigir slogan hero: PARA QUEM VIVE NO / LIMITE DA LUZ
- [ ] Formulário de parceria na página /partners com botão FALE CONOSCO rolando até o formulário

## Gestão de Utilizadores e Integrações (Mar 2026)
- [x] Criar página /admin/integrations (corrigir erro 404)
- [x] Adicionar funcionalidade de convidar/adicionar utilizadores no painel admin (/admin/users)
- [x] Endpoint POST /api/admin/users para criar utilizador directamente pelo admin
- [x] Endpoint DELETE /api/admin/users/:id para remover utilizador
- [ ] Publicar versão mais recente (checkpoint)

## Correções Urgentes (03/03/2026)
- [ ] Desabilitar botão TRY-ON na Navbar (mostrar "Em breve" em vez de link)
- [ ] Desabilitar botão TRY-ON VIRTUAL na ProductDetail.tsx (mostrar tooltip "Em breve")
- [ ] Desabilitar botão TRY-ON VIRTUAL na Home.tsx
- [ ] Corrigir garantia de "2 Anos" para "3 Meses" no ProductDetail.tsx
- [ ] Corrigir "Garantia Estendida" para "Garantia 3 Meses" nos features dos produtos
- [ ] Corrigir "30 Dias para Troca" para "30 Dias para Troca" (manter) no ProductDetail.tsx
- [ ] Trocar "Pagamento seguro via Stripe" por "Mercado Pago" no ProductDetail.tsx
- [ ] Trocar "Pagamento seguro via Stripe" por "Mercado Pago" no CartDrawer.tsx
- [ ] Trocar referências Stripe por Mercado Pago no Checkout.tsx
- [ ] Diagnosticar e corrigir checkout (Mercado Pago PIX/Boleto/Cartão)
- [ ] Adicionar mensagem de confirmação visual no Contact.tsx (substituir toast por tela de sucesso)
- [ ] Verificar e melhorar confirmação no WaitlistForm.tsx
- [ ] Verificar e melhorar confirmação no PartnerForm.tsx
- [ ] Adicionar confirmação no LeadCapturePopup.tsx

## Correcções 03/03/2026
- [x] Corrigir erro flatMap is not a function no AdminProducts (setProducts recebia objecto em vez de array)
- [x] Corrigir imagens quebradas na página de coleção (placeholder elegante para produtos sem imagem)
- [x] Corrigir imagens quebradas no ProductDetail (placeholder com fallback onError)
- [x] Usar imagem da variante como fallback quando produto não tem image_url
- [x] Corrigir garantia: 2 anos → 3 meses em ProductDetail
- [x] Desabilitar botão TRY-ON (ainda não disponível) em Navbar e Home
- [x] Trocar referências Stripe → Mercado Pago no Checkout e CartDrawer
- [x] Corrigir endpoint /api/checkout para usar Mercado Pago Checkout Pro
- [x] Criar página /admin/integrations (corrige 404)
- [x] Corrigir AdminCatalog: adicionar token de autenticação em todos os fetch (salvar, upload imagem, toggle activo/destaque, stock)
- [x] Placeholder elegante "Z" para produtos sem imagem na coleção e detalhe
- [x] Corrigir flatMap is not a function no AdminProducts
- [x] Upload das 32 fotos de produtos para CDN e actualização da base de dados

## Melhorias de Conversão (8 pontos)
- [x] Bloco de Garantia Forte na Home e ProductDetail
- [ ] Secção "Por que ZUNO?" com comparação implícita (4 colunas)
- [ ] Bloco de vídeo em movimento (placeholder para vídeo real)
- [ ] Lista VIP mais agressiva com incentivo real
- [ ] CTAs dominantes: "GARANTIR O MEU", "ENTRAR PARA O MOVIMENTO"
- [ ] Bloco institucional humano (fundadores, autoridade)
- [ ] FAQ estratégico com perguntas anti-objecção
- [ ] Secção de fotos em movimento (squad/bastidor)
