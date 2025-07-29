// Script para interface do fórum (modais e interações)

let currentTopicId = null;

// Mostrar modal de novo tópico
function showNewTopicModal() {
    const modal = document.getElementById('new-topic-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Esconder modal de novo tópico
function hideNewTopicModal() {
    const modal = document.getElementById('new-topic-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Mostrar modal de tópico
function showTopicModal() {
    const modal = document.getElementById('topic-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Esconder modal de tópico
function hideTopicModal() {
    const modal = document.getElementById('topic-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    currentTopicId = null;
}

// Abrir tópico específico (versão melhorada)
async function openTopic(topicId) {
    currentTopicId = topicId;
    
    try {
        // Carregar detalhes do tópico
        const { data: topic, error: topicError } = await supabase
            .from('forum_topics')
            .select(`
                *,
                profiles:user_id (
                    display_name,
                    email
                )
            `)
            .eq('id', topicId)
            .single();

        if (topicError) {
            throw topicError;
        }

        // Carregar comentários
        const comments = await loadComments(topicId);
        
        // Renderizar detalhes do tópico
        const topicDetails = document.getElementById('topic-details');
        if (topicDetails && topic) {
            const authorName = topic.profiles?.display_name || topic.profiles?.email?.split('@')[0] || 'Usuário Anônimo';
            const createdDate = new Date(topic.created_at).toLocaleString('pt-BR');
            
            topicDetails.innerHTML = `
                <h2>${topic.title}</h2>
                <div class="topic-meta">
                    <span><i class="fa-solid fa-user"></i> ${authorName}</span>
                    <span><i class="fa-solid fa-tag"></i> ${topic.category}</span>
                    <span><i class="fa-solid fa-clock"></i> ${createdDate}</span>
                </div>
                <div class="topic-content">
                    <p>${topic.content}</p>
                </div>
            `;
        }
        
        // Renderizar comentários
        renderComments(comments, 'comments-container');
        
        // Verificar se usuário está logado para mostrar formulário de comentário
        const user = await getCurrentUser();
        const commentForm = document.getElementById('comment-form-container');
        const loginPrompt = document.getElementById('login-prompt');
        
        if (user) {
            if (commentForm) commentForm.style.display = 'block';
            if (loginPrompt) loginPrompt.style.display = 'none';
        } else {
            if (commentForm) commentForm.style.display = 'none';
            if (loginPrompt) loginPrompt.style.display = 'block';
        }
        
        // Mostrar modal
        showTopicModal();
        
    } catch (error) {
        console.error('Erro ao carregar tópico:', error);
        showError('Erro ao carregar tópico: ' + error.message);
    }
}

window.openTopic = openTopic;

// Fechar modais ao clicar fora deles
window.onclick = function(event) {
    const newTopicModal = document.getElementById('new-topic-modal');
    const topicModal = document.getElementById('topic-modal');
    
    if (event.target === newTopicModal) {
        hideNewTopicModal();
    }
    
    if (event.target === topicModal) {
        hideTopicModal();
    }
}

// Adicionar estilos CSS para os modais
document.addEventListener('DOMContentLoaded', () => {
    // Adicionar estilos CSS dinamicamente se não existirem
    if (!document.getElementById('forum-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'forum-modal-styles';
        style.textContent = `
            .modal {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0,0,0,0.4);
            }
            
            .modal-content {
                background-color: #fefefe;
                margin: 5% auto;
                padding: 30px;
                border: none;
                border-radius: 12px;
                width: 90%;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }
            
            .close {
                color: #aaa;
                float: right;
                font-size: 28px;
                font-weight: bold;
                cursor: pointer;
                line-height: 1;
                margin-top: -10px;
            }
            
            .close:hover,
            .close:focus {
                color: #333;
                text-decoration: none;
            }
            
            .modal-content h2 {
                color: #2c5530;
                margin-bottom: 25px;
                text-align: center;
                font-size: 24px;
            }
            
            .modal-content .form-group {
                margin-bottom: 20px;
            }
            
            .modal-content label {
                display: block;
                margin-bottom: 8px;
                color: #333;
                font-weight: 600;
                font-size: 14px;
            }
            
            .modal-content input,
            .modal-content select,
            .modal-content textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: border-color 0.3s ease;
                box-sizing: border-box;
            }
            
            .modal-content input:focus,
            .modal-content select:focus,
            .modal-content textarea:focus {
                outline: none;
                border-color: #4CAF50;
            }
            
            .modal-content textarea {
                resize: vertical;
                min-height: 100px;
            }
            
            .modal-content .btn {
                width: 100%;
                padding: 12px;
                margin-top: 10px;
                font-size: 16px;
                font-weight: 600;
            }
            
            .forum-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .topic-meta {
                margin: 10px 0;
                color: #666;
            }
            
            .topic-meta span {
                margin-right: 15px;
            }
            
            .topic-content {
                margin: 20px 0;
                padding: 15px;
                background-color: #f9f9f9;
                border-radius: 5px;
            }
            
            .comments-section {
                margin-top: 30px;
                border-top: 1px solid #eee;
                padding-top: 20px;
            }
            
            .comment-item {
                margin-bottom: 15px;
                padding: 10px;
                background-color: #f5f5f5;
                border-radius: 5px;
            }
            
            .comment-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
                font-size: 0.9em;
            }
            
            .comment-date {
                color: #666;
            }
            
            .comment-content {
                line-height: 1.5;
            }
            
            #comment-form-container {
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid #ddd;
            }
            
            #login-prompt {
                text-align: center;
                padding: 20px;
                background-color: #f0f0f0;
                border-radius: 5px;
                margin-top: 15px;
            }
        `;
        document.head.appendChild(style);
    }
});



