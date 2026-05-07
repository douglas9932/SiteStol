# AeroTech Brasil — Landing Page

Projeto completo em **React + TypeScript + Vite** com painel de administração.

---

## 📁 Estrutura do Projeto

```
src/
├── assets/                  ← imagens estáticas (se necessário)
├── components/
│   ├── Navbar.tsx / .css    ← navbar fixa e responsiva
│   ├── Footer.tsx / .css    ← rodapé com contatos
│   └── Carousel.tsx / .css  ← carrossel automático
├── context/
│   └── ContentContext.tsx   ← estado global (draft vs publicado)
├── hooks/
│   └── useContent.ts        ← hook para acessar o contexto
├── pages/
│   ├── Home.tsx / .css
│   ├── Sobre.tsx / .css
│   ├── Produtos.tsx / .css
│   ├── Noticias.tsx / .css
│   ├── TabelaCalibracao.tsx / .css
│   ├── TestesStol.tsx / .css
│   ├── Contatos.tsx / .css
│   └── admin/
│       ├── AdminHome.tsx / .css  ← painel de administração
│       └── PreviewPage.tsx       ← preview do rascunho
├── router/
│   └── AppRouter.tsx        ← todas as rotas
├── styles/
│   └── index.css            ← design tokens globais
└── main.tsx                 ← entrada da aplicação
```

---

## 🚀 Como Rodar

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Abrir no navegador
http://localhost:5173
```

---

## 🛠 Build para Produção

```bash
npm run build
# Arquivos gerados em /dist
```

---

## 📋 Páginas Disponíveis

| Rota           | Página               |
|----------------|----------------------|
| `/`            | Home                 |
| `/sobre`       | Sobre                |
| `/produtos`    | Produtos             |
| `/noticias`    | Notícias             |
| `/calibracao`  | Tabela de Calibração |
| `/stol`        | Testes STOL          |
| `/contatos`    | Contatos             |
| `/admin`       | Administração        |
| `/preview`     | Preview do rascunho  |

---

## ⚙️ Painel de Administração (`/admin`)

### Aba Home
- **Carrossel**: adicionar imagens via URL, remover, editar texto alternativo
- **Descrição**: editar o texto exibido na seção "Sobre" da Home

### Aba Produtos
- Editar título e subtítulo da página Produtos
- Adicionar, editar e remover cards de produtos/serviços

### Botões
- **Preview** → navega para `/preview` mostrando o rascunho sem publicar
- **Publicar** → promove o rascunho para o conteúdo publicado
- **Descartar** → descarta o rascunho e volta ao último publicado

---

## 🎨 Design System

Todas as variáveis de design estão em `src/styles/index.css`:

```css
--navy, --gold, --gold-light   /* cores da marca */
--nav-h: 72px                  /* altura do navbar */
--shadow-sm/md/lg              /* sombras */
--radius-sm/md/lg/xl           /* bordas */
```

---

## 📱 Responsividade

Totalmente responsivo com breakpoints em:
- `< 1024px` — links do navbar comprimidos
- `< 860px`  — menu hambúrguer ativado
- `< 768px`  — layouts em coluna única
- `< 480px`  — ajustes finos para telas pequenas
