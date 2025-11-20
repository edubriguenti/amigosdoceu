# Amigos do Céu — Starter (corrigido)
Projeto Next.js + Tailwind + Framer Motion corrigido para ter configuração compatível de Tailwind/PostCSS.

## Como rodar localmente
1. `npm install`
2. `npm run dev`
O site roda em `http://localhost:3000`.

## Deploy na Vercel

### Opção 1: Deploy via Interface Web (Recomendado)

1. **Criar conta na Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Faça login com GitHub, GitLab ou Bitbucket

2. **Conectar o repositório**
   - Clique em "Add New Project"
   - Importe o repositório do GitHub/GitLab/Bitbucket
   - A Vercel detectará automaticamente que é um projeto Next.js

3. **Configurar o projeto**
   - **Framework Preset**: Next.js (detectado automaticamente)
   - **Root Directory**: `./` (raiz do projeto)
   - **Build Command**: `npm run build` (já configurado)
   - **Output Directory**: `.next` (gerenciado automaticamente pelo Next.js)
   - **Install Command**: `npm install`

4. **Variáveis de Ambiente** (se necessário)
   - Se você usar variáveis de ambiente, adicione-as na seção "Environment Variables"

5. **Deploy**
   - Clique em "Deploy"
   - Aguarde o build completar
   - Seu site estará disponível em uma URL como `seu-projeto.vercel.app`

### Opção 2: Deploy via CLI

1. **Instalar a CLI da Vercel**
   ```bash
   npm i -g vercel
   ```

2. **Fazer login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Na primeira vez, responda às perguntas:
     - Set up and deploy? **Yes**
     - Which scope? (escolha sua conta)
     - Link to existing project? **No**
     - Project name? (deixe o padrão ou escolha um nome)
     - Directory? **./**
     - Override settings? **No**

4. **Deploy de produção**
   ```bash
   vercel --prod
   ```

### Configurações Importantes

- ✅ O projeto já está configurado corretamente para a Vercel
- ✅ O `next.config.js` já tem a configuração de imagens do Wikimedia
- ✅ O `.gitignore` já inclui `.vercel/` para não commitar credenciais
- ✅ A Vercel detecta automaticamente Next.js e usa as configurações corretas

### Domínio Personalizado (Opcional)

1. Vá em **Settings** → **Domains**
2. Adicione seu domínio personalizado
3. Siga as instruções para configurar o DNS

### Atualizações Automáticas

- A Vercel faz deploy automático a cada push na branch `main` (ou `master`)
- Pull requests geram preview deployments automaticamente
