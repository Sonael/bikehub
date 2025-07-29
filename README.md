# BikeHub Recife - Integração com Supabase

Este projeto integra o BikeHub Recife com o Supabase para fornecer autenticação de usuários e sistema de comentários no fórum.

## 🚀 Funcionalidades Implementadas

### ✅ Autenticação de Usuários
- **Cadastro de novos usuários** com email e senha
- **Login/logout** com validação
- **Recuperação de senha** via email
- **Gerenciamento de sessão** automático
- **Interface responsiva** para login e cadastro

### ✅ Sistema de Comentários no Fórum
- **Criação de tópicos** por usuários autenticados
- **Comentários em tópicos** com identificação do autor
- **Visualização de tópicos e comentários** em tempo real
- **Categorização de tópicos** (Infraestrutura, Segurança, Sugestões, etc.)
- **Interface modal** para visualização detalhada

### ✅ Segurança e Permissões
- **Row Level Security (RLS)** configurado
- **Políticas de acesso** granulares
- **Proteção de dados** do usuário
- **Validação de formulários** no frontend

## 📁 Estrutura do Projeto

```
bikehub-recife/
├── index.html              # Página inicial
├── login.html              # Página de login/cadastro
├── forum.html              # Página do fórum
├── dados.html              # Página de dados
├── mapa.html               # Página do mapa
├── wiki.html               # Página da wiki
├── js/
│   ├── supabase-config.js  # Configuração do Supabase
│   ├── auth.js             # Funções de autenticação
│   ├── login.js            # Script da página de login
│   ├── forum.js            # Funções do fórum
│   └── forum-ui.js         # Interface do fórum
├── database-setup.sql      # Script de configuração do banco
└── README.md              # Esta documentação
```

## 🛠️ Configuração do Supabase

### 1. Criar Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Escolha sua organização e configure o projeto
5. Anote a **URL do projeto** e a **chave anônima**

### 2. Configurar Banco de Dados
1. No painel do Supabase, vá para **SQL Editor**
2. Execute o script `database-setup.sql` fornecido
3. Isso criará as tabelas necessárias:
   - `profiles` - Perfis de usuários
   - `forum_topics` - Tópicos do fórum
   - `comments` - Comentários dos tópicos

### 3. Configurar Autenticação
1. Vá para **Authentication > Settings**
2. Configure as opções de email:
   - Habilite "Enable email confirmations"
   - Configure SMTP (opcional, para emails personalizados)
3. Configure URLs de redirecionamento se necessário

### 4. Configurar o Frontend
1. Abra o arquivo `js/supabase-config.js`
2. Substitua as variáveis pelas suas credenciais:
```javascript
const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_ANON_KEY = 'sua-chave-anonima-aqui';
```

## 🚀 Como Executar

### Desenvolvimento Local
```bash
# Navegue até o diretório do projeto
cd bikehub-recife

# Inicie um servidor HTTP local
python3 -m http.server 8000

# Acesse no navegador
http://localhost:8000
```

### Produção
Para produção, você pode hospedar os arquivos em qualquer servidor web estático como:
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting

## 📊 Estrutura do Banco de Dados

### Tabela `profiles`
```sql
- id (UUID) - Referência para auth.users
- display_name (TEXT) - Nome de exibição
- avatar_url (TEXT) - URL do avatar
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Tabela `forum_topics`
```sql
- id (UUID) - Chave primária
- title (TEXT) - Título do tópico
- content (TEXT) - Conteúdo do tópico
- category (TEXT) - Categoria
- user_id (UUID) - Referência para auth.users
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Tabela `comments`
```sql
- id (UUID) - Chave primária
- topic_id (UUID) - Referência para forum_topics
- user_id (UUID) - Referência para auth.users
- content (TEXT) - Conteúdo do comentário
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🔐 Políticas de Segurança (RLS)

### Profiles
- ✅ Todos podem visualizar perfis
- ✅ Usuários podem editar apenas seu próprio perfil
- ✅ Criação automática de perfil no registro

### Forum Topics
- ✅ Todos podem visualizar tópicos
- ✅ Usuários autenticados podem criar tópicos
- ✅ Usuários podem editar/deletar apenas seus próprios tópicos

### Comments
- ✅ Todos podem visualizar comentários
- ✅ Usuários autenticados podem comentar
- ✅ Usuários podem editar/deletar apenas seus próprios comentários

## 🎯 Funcionalidades da Interface

### Página de Login (`login.html`)
- **Formulário de Login**: Email e senha
- **Formulário de Cadastro**: Nome, email, senha e confirmação
- **Recuperação de Senha**: Envio de email para reset
- **Alternância entre formulários**: JavaScript dinâmico
- **Validação**: Campos obrigatórios e confirmação de senha

### Página do Fórum (`forum.html`)
- **Lista de Tópicos**: Carregamento dinâmico do Supabase
- **Criação de Tópicos**: Modal para usuários logados
- **Visualização de Tópicos**: Modal com comentários
- **Sistema de Comentários**: Formulário para usuários autenticados
- **Categorização**: Filtros por categoria

### Autenticação Global
- **Estado de Login**: Verificação automática em todas as páginas
- **Interface Dinâmica**: Botões mudam baseado no status de login
- **Redirecionamento**: Proteção de páginas que requerem login
- **Logout**: Funcionalidade disponível em todas as páginas

## 🔧 Personalização

### Adicionando Novas Categorias
Edite o arquivo `js/forum-ui.js` e adicione novas opções no select:
```javascript
<option value="Nova Categoria">Nova Categoria</option>
```

### Modificando Validações
Edite os arquivos `js/auth.js` e `js/login.js` para ajustar validações.

### Estilização
Os estilos dos modais estão em `js/forum-ui.js`. Para personalizar, modifique a seção de CSS.

## 🐛 Solução de Problemas

### Erro de CORS
Certifique-se de que está servindo os arquivos através de um servidor HTTP, não abrindo diretamente no navegador.

### Credenciais do Supabase
Verifique se as credenciais em `js/supabase-config.js` estão corretas.

### Políticas RLS
Se houver problemas de permissão, verifique se as políticas RLS foram criadas corretamente.

### Console do Navegador
Sempre verifique o console do navegador para erros JavaScript.

## 📝 Próximos Passos

### Melhorias Sugeridas
1. **Upload de Avatar**: Permitir usuários fazerem upload de fotos de perfil
2. **Notificações**: Sistema de notificações para novos comentários
3. **Moderação**: Sistema de moderação para tópicos e comentários
4. **Busca**: Funcionalidade de busca em tópicos e comentários
5. **Tags**: Sistema de tags para melhor organização
6. **Reações**: Sistema de likes/dislikes para comentários
7. **Paginação**: Implementar paginação para muitos tópicos/comentários

### Integrações Futuras
1. **Mapa Interativo**: Conectar comentários com localizações no mapa
2. **Dados e Analytics**: Dashboard com estatísticas do fórum
3. **Wiki Colaborativa**: Sistema de edição colaborativa
4. **Notificações Push**: Notificações em tempo real

## 📞 Suporte

Para dúvidas sobre a implementação:
1. Consulte a [documentação do Supabase](https://supabase.com/docs)
2. Verifique os logs no console do navegador
3. Teste as consultas SQL no SQL Editor do Supabase

## 📄 Licença

Este projeto é uma iniciativa de código aberto para a comunidade ciclística do Recife.

