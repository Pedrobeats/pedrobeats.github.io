# Pedro Moreno • Portfólio & Blog

Repositório do site pessoal e blog de **Pedro Moreno** — Analista e Cientista de Dados.

Desenvolvido com foco em alta performance, minimalismo e facilidade de manutenção utilizando **[11ty (Eleventy)](https://www.11ty.dev/)**.

---

## 🛠️ Tecnologias Utilizadas

- **Gerador Estático:** [Eleventy v3](https://www.11ty.dev/)
- **Templates:** Nunjucks (`.njk`) e Markdown (`.md`)
- **Estilos:** CSS3 Moderno (Custom Properties, Flexbox, CSS Grid, Glassmorphism)
- **Hospedagem:** GitHub Pages

---

## 📁 Estrutura do Projeto

```text
├── src/                  # Código-fonte do site
│   ├── _data/            # Dados globais (site.js)
│   ├── _includes/        # Layouts e parciais (base, post, page, header, footer)
│   ├── assets/           # CSS, JavaScript e imagens
│   ├── blog/             # Artigos em Markdown e template de listagem
│   ├── portfolio/        # Projetos em Markdown e template de listagem
│   ├── index.njk         # Página inicial
│   ├── sobre.md          # Página Sobre Mim
│   └── contato.md        # Página de Contato
├── .eleventy.js          # Configuração do Eleventy
├── .eleventyignore        # Arquivos ignorados pelo compilador do 11ty
├── .nojekyll             # Instrução para GitHub Pages ignorar o Jekyll
├── package.json          # Dependências e scripts
└── (arquivos HTML na raiz gerados para o GitHub Pages)
```

---

## 🚀 Como Executar Localmente

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento com hot-reload:**
   ```bash
   npm start
   # ou: npx @11ty/eleventy --serve
   ```
   Acesse: `http://localhost:8080`

3. **Compilar para produção:**
   ```bash
   npm run build
   ```

---

## 📝 Como Publicar Novos Conteúdos

- **Novo Artigo:** crie um arquivo `.md` em `src/blog/`.
- **Novo Projeto:** crie um arquivo `.md` em `src/portfolio/`.
- Compile com `npm run build` e envie para o GitHub com `git add . && git commit -m "novo post" && git push`.
