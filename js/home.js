// Script para página inicial - carregamento de tópicos recentes

// Carregar tópicos recentes para exibir na página inicial
async function loadRecentTopics() {
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
            .order('created_at', { ascending: false })
            .limit(3); // Apenas os 3 mais recentes

        if (error) {
            throw error;
        }

        return topics || [];
    } catch (error) {
        console.error('Erro ao carregar tópicos recentes:', error);
        return [];
    }
}

// Renderizar tópicos na página inicial
function renderHomeTopics(topics) {
    const homeForumTopics = document.getElementById('home-forum-topics');
    if (!homeForumTopics) return;

    homeForumTopics.innerHTML = '';

    if (topics.length === 0) {
        homeForumTopics.innerHTML = `
            <div class="no-topics-home">
                <p><i class="fa-solid fa-comments"></i> Nenhuma discussão ainda. Seja o primeiro!</p>
            </div>
        `;
        return;
    }

    topics.forEach(topic => {
        const topicElement = document.createElement('div');
        topicElement.className = 'topic';
        
        const authorName = topic.profiles?.display_name || topic.profiles?.email?.split('@')[0] || 'Usuário Anônimo';
        
        topicElement.innerHTML = `
            <p><i class="fa-solid fa-user" style="margin-right: 6px;"></i> ${topic.title}</p>
            <span>Iniciado por: <strong>${authorName}</strong></span>
        `;
        
        homeForumTopics.appendChild(topicElement);
    });
}

// Inicializar página inicial
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar se estamos na página inicial
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        // Carregar e renderizar tópicos recentes
        const topics = await loadRecentTopics();
        renderHomeTopics(topics);
    }
});

