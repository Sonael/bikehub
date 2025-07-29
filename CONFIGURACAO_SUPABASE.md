# 🔧 Guia de Configuração do Supabase - BikeHub Recife

Este guia fornece instruções detalhadas para configurar o Supabase para o projeto BikeHub Recife.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- Acesso aos arquivos do projeto BikeHub Recife
- Navegador web moderno

## 🚀 Passo 1: Criar Projeto no Supabase

### 1.1 Acessar o Supabase
1. Vá para [supabase.com](https://supabase.com)
2. Clique em **"Start your project"** ou **"Sign In"**
3. Faça login com GitHub, Google ou email

### 1.2 Criar Novo Projeto
1. No dashboard, clique em **"New Project"**
2. Selecione sua organização (ou crie uma nova)
3. Preencha os dados do projeto:
   - **Name**: `BikeHub Recife`
   - **Database Password**: Crie uma senha forte (anote!)
   - **Region**: Escolha a região mais próxima (ex: South America)
4. Clique em **"Create new project"**
5. Aguarde alguns minutos para o projeto ser criado

### 1.3 Obter Credenciais
1. No dashboard do projeto, vá para **Settings > API**
2. Anote as seguintes informações:
   - **Project URL**: `https://seu-projeto-id.supabase.co`
   - **anon public key**: Chave que começa com `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🗄️ Passo 2: Configurar Banco de Dados

### 2.1 Acessar SQL Editor
1. No painel lateral, clique em **"SQL Editor"**
2. Clique em **"New query"**

### 2.2 Executar Script de Configuração
1. Copie todo o conteúdo do arquivo `database-setup.sql`
2. Cole no editor SQL
3. Clique em **"Run"** (ou pressione Ctrl+Enter)
4. Verifique se todas as queries foram executadas com sucesso

### 2.3 Verificar Tabelas Criadas
1. Vá para **"Table Editor"** no painel lateral
2. Você deve ver as seguintes tabelas:
   - `profiles`
   - `forum_topics`
   - `comments`

## 🔐 Passo 3: Configurar Autenticação

### 3.1 Configurações Básicas
1. Vá para **Authentication > Settings**
2. Em **"General"**, configure:
   - **Site URL**: `http://localhost:8000` (para desenvolvimento)
   - **Redirect URLs**: Adicione URLs onde sua aplicação estará hospedada

### 3.2 Configurar Email
1. Na seção **"Email"**:
   - **Enable email confirmations**: ✅ Habilitado
   - **Enable email change confirmations**: ✅ Habilitado
   - **Enable secure email change**: ✅ Habilitado

### 3.3 Configurar SMTP (Opcional)
Para emails personalizados:
1. Em **"SMTP Settings"**:
   - **Enable custom SMTP**: ✅ Habilitado
   - Configure com seu provedor de email (Gmail, SendGrid, etc.)

### 3.4 Templates de Email (Opcional)
1. Vá para **Authentication > Email Templates**
2. Personalize os templates de:
   - Confirmação de email
   - Recuperação de senha
   - Mudança de email

## ⚙️ Passo 4: Configurar Row Level Security

### 4.1 Verificar RLS
1. Vá para **Authentication > Policies**
2. Verifique se as políticas foram criadas para:
   - `public.profiles`
   - `public.forum_topics`
   - `public.comments`

### 4.2 Testar Políticas
1. Vá para **Table Editor**
2. Tente visualizar dados das tabelas
3. Se houver erro, verifique se o script SQL foi executado corretamente

## 💻 Passo 5: Configurar Frontend

### 5.1 Atualizar Credenciais
1. Abra o arquivo `js/supabase-config.js`
2. Substitua as variáveis:
```javascript
const SUPABASE_URL = 'https://seu-projeto-id.supabase.co';
const SUPABASE_ANON_KEY = 'sua-chave-anonima-aqui';
```

### 5.2 Exemplo de Configuração
```javascript
// Exemplo (substitua pelos seus valores reais)
const SUPABASE_URL = 'https://abcdefghijklmnop.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MjQ4MzI4NCwiZXhwIjoxOTU4MDU5Mjg0fQ.example-key-here';
```

## 🧪 Passo 6: Testar Configuração

### 6.1 Testar Localmente
1. Navegue até o diretório do projeto
2. Execute: `python3 -m http.server 8000`
3. Acesse: `http://localhost:8000`

### 6.2 Testar Funcionalidades
1. **Cadastro**: Tente criar uma nova conta
2. **Login**: Faça login com a conta criada
3. **Fórum**: Tente criar um tópico
4. **Comentários**: Adicione um comentário

### 6.3 Verificar no Supabase
1. Vá para **Authentication > Users**
2. Verifique se o usuário foi criado
3. Vá para **Table Editor**
4. Verifique se os dados foram inseridos nas tabelas

## 🔍 Solução de Problemas

### Erro: "Invalid API key"
- Verifique se a chave anônima está correta
- Certifique-se de que não há espaços extras

### Erro: "Failed to fetch"
- Verifique se a URL do projeto está correta
- Certifique-se de que está servindo via HTTP (não file://)

### Erro: "Row Level Security"
- Verifique se as políticas RLS foram criadas
- Execute novamente o script `database-setup.sql`

### Usuário não consegue se cadastrar
- Verifique as configurações de email
- Veja se há erros no console do navegador

### Dados não aparecem
- Verifique se as tabelas foram criadas
- Confirme se as políticas RLS estão corretas

## 📊 Monitoramento

### 6.1 Logs de Autenticação
1. Vá para **Authentication > Logs**
2. Monitore tentativas de login/cadastro

### 6.2 Logs de API
1. Vá para **Logs**
2. Monitore requisições à API

### 6.3 Métricas
1. Vá para **Reports**
2. Acompanhe uso de API e autenticação

## 🚀 Próximos Passos

Após a configuração básica:

1. **Personalizar**: Ajuste templates de email
2. **Segurança**: Configure políticas RLS mais específicas
3. **Backup**: Configure backups automáticos
4. **Produção**: Configure domínio personalizado
5. **Monitoramento**: Configure alertas

## 📞 Suporte

### Recursos Úteis
- [Documentação Supabase](https://supabase.com/docs)
- [Guia de Autenticação](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Comunidade Discord](https://discord.supabase.com)

### Verificação Final
✅ Projeto criado no Supabase  
✅ Credenciais anotadas  
✅ Script SQL executado  
✅ Tabelas criadas  
✅ RLS configurado  
✅ Autenticação configurada  
✅ Frontend configurado  
✅ Testes realizados  

Parabéns! Seu BikeHub Recife está integrado com o Supabase! 🎉

