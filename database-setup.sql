-- Script SQL para configurar as tabelas necessárias no Supabase
-- Execute este script no SQL Editor do seu projeto Supabase

-- 1. Criar tabela de perfis de usuários (estende auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar tabela de tópicos do fórum
CREATE TABLE IF NOT EXISTS public.forum_topics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar tabela de comentários
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    topic_id UUID REFERENCES public.forum_topics(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Configurar Row Level Security (RLS)

-- Habilitar RLS nas tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Políticas para a tabela profiles
CREATE POLICY "Perfis são visíveis para todos" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para a tabela forum_topics
CREATE POLICY "Tópicos são visíveis para todos" ON public.forum_topics
    FOR SELECT USING (true);

CREATE POLICY "Usuários autenticados podem criar tópicos" ON public.forum_topics
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários podem editar seus próprios tópicos" ON public.forum_topics
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios tópicos" ON public.forum_topics
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para a tabela comments
CREATE POLICY "Comentários são visíveis para todos" ON public.comments
    FOR SELECT USING (true);

CREATE POLICY "Usuários autenticados podem criar comentários" ON public.comments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários podem editar seus próprios comentários" ON public.comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios comentários" ON public.comments
    FOR DELETE USING (auth.uid() = user_id);

-- 5. Criar função para automaticamente criar perfil quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Criar trigger para executar a função quando novo usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Inserir alguns dados de exemplo (opcional)
-- Você pode remover esta seção se não quiser dados de exemplo

-- Inserir tópicos de exemplo (substitua os UUIDs pelos IDs reais dos usuários)
-- INSERT INTO public.forum_topics (title, content, category, user_id) VALUES
-- ('Ciclofaixa da Av. Agamenon precisa de reparos', 'Pessoal, passei hoje pela ciclofaixa da Agamenon Magalhães e notei vários buracos e problemas na sinalização. Alguém mais notou isso?', 'Infraestrutura', 'UUID_DO_USUARIO'),
-- ('Ideia: bicicletário na estação de metrô Joana Bezerra', 'Que tal uma campanha para instalar bicicletários nas estações de metrô? Começando pela Joana Bezerra que tem muito movimento.', 'Sugestões', 'UUID_DO_USUARIO'),
-- ('Segurança à noite na Zona Norte: relatos', 'Gostaria de saber a experiência de vocês pedalando à noite na Zona Norte. É seguro? Que cuidados vocês tomam?', 'Segurança', 'UUID_DO_USUARIO');

-- 8. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_forum_topics_user_id ON public.forum_topics(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_topics_created_at ON public.forum_topics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_topic_id ON public.comments(topic_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at);

-- Comentários sobre as tabelas
COMMENT ON TABLE public.profiles IS 'Perfis de usuários estendendo auth.users';
COMMENT ON TABLE public.forum_topics IS 'Tópicos do fórum de discussão';
COMMENT ON TABLE public.comments IS 'Comentários nos tópicos do fórum';

COMMENT ON COLUMN public.profiles.display_name IS 'Nome de exibição do usuário';
COMMENT ON COLUMN public.forum_topics.category IS 'Categoria do tópico (Infraestrutura, Segurança, Sugestões, etc.)';
COMMENT ON COLUMN public.comments.topic_id IS 'ID do tópico ao qual o comentário pertence';

