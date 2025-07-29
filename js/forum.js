// Script para gerenciar comentários do fórum

// Carregar comentários de um tópico
async function loadComments(topicId) {
    try {
        const { data: comments, error } = await supabase
            .from("comments")
            .select(`
                *,
                profiles:user_id (
                    display_name,
                    email
                )
            `)
            .eq("topic_id", topicId)
            .order("created_at", { ascending: true });

        if (error) {
            throw error;
        }

        return comments || [];
    } catch (error) {
        console.error('Erro ao carregar comentários:', error);
        return [];
    }
}

// Adicionar novo comentário
async function addComment(topicId, content) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            showNotification("Você precisa estar logado para comentar.", "error");
            return false;
        }

        const { data, error } = await supabase
            .from("comments")
            .insert([
                {
                    topic_id: topicId,
                    user_id: user.id,
                    content: content,
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (error) {
            throw error;
        }

        return true;
    } catch (error) {
        console.error('Erro ao adicionar comentário:', error);
        showNotification("Erro ao adicionar comentário: " + error.message, "error");
        return false;
    }
}

// Carregar tópicos do fórum
async function loadTopics() {
    try {
        const { data: topics, error } = await supabase
            .from('forum_topics')
            .select(`
                *,
                profiles:user_id (
                    display_name,
                    email
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return topics || [];
    } catch (error) {
        console.error('Erro ao carregar tópicos:', error);
        return [];
    }
}

// Criar novo tópico
async function createTopic(title, content, category) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            showError('Você precisa estar logado para criar um tópico.');
            return null;
        }

        const { data, error } = await supabase
            .from('forum_topics')
            .insert([
                {
                    title: title,
                    content: content,
                    category: category,
                    user_id: user.id
                }
            ])
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Erro ao criar tópico:', error);
        showError('Erro ao criar tópico: ' + error.message);
        return null;
    }
}

// Renderizar lista de tópicos
function renderTopics(topics) {
    const forumList = document.getElementById('forum-list');
    if (!forumList) return;

    forumList.innerHTML = '';

    if (topics.length === 0) {
        forumList.innerHTML = `
            <div class="no-topics-message">
                <i class="fa-solid fa-comments"></i>
                <p>Nenhum tópico encontrado. Seja o primeiro a criar uma discussão!</p>
            </div>
        `;
        return;
    }

    topics.forEach(topic => {
        const topicElement = document.createElement('div');
        topicElement.className = 'forum-item';
        
        const authorName = topic.profiles?.display_name || topic.profiles?.email?.split('@')[0] || 'Usuário Anônimo';
        const createdDate = new Date(topic.created_at).toLocaleDateString('pt-BR');
        
        topicElement.innerHTML = `
            <h3><a href="#" onclick="openTopic('${topic.id}')">${topic.title}</a></h3>
            <span>
                <i class="fa-solid fa-user" style="margin-right: 6px;"></i> 
                Iniciado por <strong>${authorName}</strong> | 
                ${topic.category} | 
                ${createdDate}
            </span>
        `;
        
        forumList.appendChild(topicElement);
    });
}

// Renderizar comentários
function renderComments(comments, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    if (comments.length === 0) {
        container.innerHTML = `
            <div class="no-comments-message">
                <i class="fa-solid fa-comment"></i>
                <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
            </div>
        `;
        return;
    }

    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment-item';
        
        const authorName = comment.profiles?.display_name || comment.profiles?.email?.split('@')[0] || 'Usuário Anônimo';
        const createdDate = new Date(comment.created_at).toLocaleString('pt-BR');
        
        commentElement.innerHTML = `
            <div class="comment-header">
                <strong><i class="fa-solid fa-user"></i> ${authorName}</strong>
                <span class="comment-date">${createdDate}</span>
            </div>
            <div class="comment-content">${comment.content}</div>
        `;
        
        container.appendChild(commentElement);
    });
}

// Manipular envio de novo comentário
async function handleCommentSubmit(event, topicId) {
    event.preventDefault();
    
    const form = event.target;
    const content = form.querySelector('textarea[name="comment"]').value.trim();
    
    if (!content) {
        showError('Por favor, digite um comentário.');
        return;
    }
    
    const success = await addComment(topicId, content);
    if (success) {
        form.reset();
        showSuccess('Comentário adicionado com sucesso!');
        // Recarregar comentários
        const comments = await loadComments(topicId);
        renderComments(comments, 'comments-container');
    }
}

// Manipular criação de novo tópico
async function handleTopicSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const title = form.querySelector('input[name="title"]').value.trim();
    const content = form.querySelector('textarea[name="content"]').value.trim();
    const category = form.querySelector('select[name="category"]').value;
    
    if (!title || !content) {
        showNotification('Por favor, preencha título e conteúdo.', 'error');
        return;
    }
    
    const topic = await createTopic(title, content, category);
    if (topic) {
        form.reset();
        showNotification('Tópico criado com sucesso!', 'success');
        
        // Recarregar lista de tópicos
        const topics = await loadTopics();
        renderTopics(topics);
        
        // Fechar modal de criação se existir
        const modal = document.getElementById('new-topic-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
}

// Inicializar página do fórum
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar se estamos na página do fórum
    if (window.location.pathname.includes('forum.html')) {
        // Carregar e renderizar tópicos
        const topics = await loadTopics();
        renderTopics(topics);
        
        // Verificar se usuário está logado para mostrar botão de criar tópico
        const user = await getCurrentUser();
        const createTopicBtn = document.getElementById('create-topic-btn');
        if (createTopicBtn) {
            if (user) {
                createTopicBtn.style.display = 'block';
            } else {
                createTopicBtn.style.display = 'none';
            }
        }
    }
});

