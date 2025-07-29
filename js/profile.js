// Script para página de perfil

let isEditMode = false;

// Carregar dados do perfil
async function loadProfileData() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            showError('Você precisa estar logado para ver o perfil.');
            window.location.href = 'login.html';
            return;
        }

        // Preencher informações básicas
        document.getElementById('display-name').textContent = user.user_metadata?.display_name || user.email.split('@')[0];
        document.getElementById('user-email').textContent = user.email;
        
        const memberSince = new Date(user.created_at).toLocaleDateString('pt-BR');
        document.getElementById('member-since').textContent = memberSince;

        // Carregar estatísticas
        await loadUserStats(user.id);
        
        // Carregar atividade recente
        await loadRecentActivity(user.id);

    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        showError('Erro ao carregar dados do perfil.');
    }
}

// Carregar estatísticas do usuário
async function loadUserStats(userId) {
    try {
        // Contar tópicos criados
        const { count: topicsCount } = await supabase
            .from('forum_topics')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        // Contar comentários
        const { count: commentsCount } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        // Calcular dias ativo (desde o primeiro tópico ou comentário)
        const { data: firstActivity } = await supabase
            .from('forum_topics')
            .select('created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: true })
            .limit(1);

        let daysActive = 0;
        if (firstActivity && firstActivity.length > 0) {
            const firstDate = new Date(firstActivity[0].created_at);
            const today = new Date();
            daysActive = Math.floor((today - firstDate) / (1000 * 60 * 60 * 24));
        }

        // Atualizar interface
        document.getElementById('topics-count').textContent = topicsCount || 0;
        document.getElementById('comments-count').textContent = commentsCount || 0;
        document.getElementById('days-active').textContent = daysActive;

    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

// Carregar atividade recente
async function loadRecentActivity(userId) {
    try {
        const activityList = document.getElementById('activity-list');
        
        // Buscar tópicos recentes
        const { data: recentTopics } = await supabase
            .from('forum_topics')
            .select('id, title, created_at, category')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(5);

        // Buscar comentários recentes
        const { data: recentComments } = await supabase
            .from('comments')
            .select(`
                id, content, created_at,
                forum_topics:topic_id (title)
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(5);

        // Combinar e ordenar atividades
        const activities = [];
        
        if (recentTopics) {
            recentTopics.forEach(topic => {
                activities.push({
                    type: 'topic',
                    date: new Date(topic.created_at),
                    title: topic.title,
                    category: topic.category,
                    id: topic.id
                });
            });
        }

        if (recentComments) {
            recentComments.forEach(comment => {
                activities.push({
                    type: 'comment',
                    date: new Date(comment.created_at),
                    content: comment.content.substring(0, 100) + '...',
                    topicTitle: comment.forum_topics?.title || 'Tópico removido'
                });
            });
        }

        // Ordenar por data
        activities.sort((a, b) => b.date - a.date);

        // Renderizar atividades
        if (activities.length === 0) {
            activityList.innerHTML = `
                <div class="no-activity">
                    <i class="fa-solid fa-clock"></i>
                    <p>Nenhuma atividade recente encontrada.</p>
                </div>
            `;
        } else {
            activityList.innerHTML = activities.slice(0, 10).map(activity => {
                const timeAgo = getTimeAgo(activity.date);
                
                if (activity.type === 'topic') {
                    return `
                        <div class="activity-item">
                            <div class="activity-icon topic">
                                <i class="fa-solid fa-comments"></i>
                            </div>
                            <div class="activity-content">
                                <p><strong>Criou o tópico:</strong> ${activity.title}</p>
                                <span class="activity-meta">
                                    <i class="fa-solid fa-tag"></i> ${activity.category} • 
                                    <i class="fa-solid fa-clock"></i> ${timeAgo}
                                </span>
                            </div>
                        </div>
                    `;
                } else {
                    return `
                        <div class="activity-item">
                            <div class="activity-icon comment">
                                <i class="fa-solid fa-comment"></i>
                            </div>
                            <div class="activity-content">
                                <p><strong>Comentou em:</strong> ${activity.topicTitle}</p>
                                <p class="activity-preview">${activity.content}</p>
                                <span class="activity-meta">
                                    <i class="fa-solid fa-clock"></i> ${timeAgo}
                                </span>
                            </div>
                        </div>
                    `;
                }
            }).join('');
        }

    } catch (error) {
        console.error('Erro ao carregar atividade:', error);
        document.getElementById('activity-list').innerHTML = `
            <div class="error-message">
                <i class="fa-solid fa-exclamation-triangle"></i>
                <p>Erro ao carregar atividades.</p>
            </div>
        `;
    }
}

// Função auxiliar para calcular tempo decorrido
function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Agora mesmo';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min atrás`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} dias atrás`;
    
    return date.toLocaleDateString('pt-BR');
}

// Alternar modo de edição
function toggleEditMode() {
    isEditMode = !isEditMode;
    const profileInfo = document.getElementById('profile-info');
    const profileEdit = document.getElementById('profile-edit');
    
    if (isEditMode) {
        // Preencher formulário com dados atuais
        const currentName = document.getElementById('display-name').textContent;
        const currentEmail = document.getElementById('user-email').textContent;
        
        document.getElementById('edit-display-name').value = currentName;
        document.getElementById('edit-email').value = currentEmail;
        
        profileInfo.style.display = 'none';
        profileEdit.style.display = 'block';
    } else {
        profileInfo.style.display = 'block';
        profileEdit.style.display = 'none';
    }
}

// Cancelar edição
function cancelEdit() {
    isEditMode = false;
    document.getElementById('profile-info').style.display = 'block';
    document.getElementById('profile-edit').style.display = 'none';
}

// Atualizar perfil
async function handleProfileUpdate(event) {
    event.preventDefault();
    
    const form = event.target;
    const displayName = form.displayName.value.trim();
    
    if (!displayName) {
        showError('Nome de usuário é obrigatório.');
        return;
    }
    
    try {
        const { error } = await supabase.auth.updateUser({
            data: { display_name: displayName }
        });
        
        if (error) throw error;
        
        // Atualizar interface
        document.getElementById('display-name').textContent = displayName;
        document.getElementById('user-name').textContent = displayName;
        
        showSuccess('Perfil atualizado com sucesso!');
        cancelEdit();
        
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        showError('Erro ao atualizar perfil: ' + error.message);
    }
}

// Mostrar modal de alteração de senha
function showChangePassword() {
    document.getElementById('change-password-modal').style.display = 'block';
}

// Ocultar modal de alteração de senha
function hideChangePassword() {
    document.getElementById('change-password-modal').style.display = 'none';
    document.getElementById('change-password-modal').querySelector('form').reset();
}

// Alterar senha
async function handlePasswordChange(event) {
    event.preventDefault();
    
    const form = event.target;
    const newPassword = form.newPassword.value;
    const confirmPassword = form.confirmPassword.value;
    
    if (newPassword !== confirmPassword) {
        showError('As senhas não coincidem.');
        return;
    }
    
    if (newPassword.length < 6) {
        showError('A nova senha deve ter pelo menos 6 caracteres.');
        return;
    }
    
    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });
        
        if (error) throw error;
        
        showSuccess('Senha alterada com sucesso!');
        hideChangePassword();
        
    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        showError('Erro ao alterar senha: ' + error.message);
    }
}

// Mostrar confirmação de exclusão de conta
function showDeleteAccount() {
    const confirmed = confirm(
        'ATENÇÃO: Esta ação é irreversível!\n\n' +
        'Ao excluir sua conta, todos os seus dados serão permanentemente removidos, incluindo:\n' +
        '• Tópicos criados no fórum\n' +
        '• Comentários realizados\n' +
        '• Informações do perfil\n\n' +
        'Tem certeza que deseja continuar?'
    );
    
    if (confirmed) {
        deleteAccount();
    }
}

// Excluir conta
async function deleteAccount() {
    try {
        // Aqui você implementaria a lógica de exclusão
        // Por segurança, isso geralmente requer confirmação adicional
        showWarning('Funcionalidade de exclusão de conta será implementada em breve.');
        
    } catch (error) {
        console.error('Erro ao excluir conta:', error);
        showError('Erro ao excluir conta: ' + error.message);
    }
}

// Inicializar página de perfil
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar se estamos na página de perfil
    if (window.location.pathname.includes('perfil.html')) {
        await loadProfileData();
    }
    
    // Fechar modal ao clicar fora
    window.onclick = function(event) {
        const modal = document.getElementById('change-password-modal');
        if (event.target === modal) {
            hideChangePassword();
        }
    };
});

