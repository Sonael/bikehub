// Configuração do Supabase
// IMPORTANTE: Substitua estas variáveis pelas suas credenciais do Supabase
const SUPABASE_URL = 'https://owwfdjhckjfmruceacwu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93d2Zkamhja2pmbXJ1Y2VhY3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MDYyODksImV4cCI6MjA2ODk4MjI4OX0.pHcCysujrXu4OcbmAhwLv7jQp-pZ6D2YbH9KCPzKxDs';

// Inicializar cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Verificar se o usuário está logado
async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// Atualizar interface baseado no status de login
async function updateAuthUI() {
    const user = await checkUser();
    const userInfo = document.getElementById('user-info');
    const loginButton = document.getElementById('login-button');
    const mobileAuthSection = document.getElementById('mobile-auth-section');
    
    if (user) {
        // Usuário logado
        if (userInfo) {
            const userName = user.user_metadata?.display_name || user.email.split('@')[0];
            const userNameSpan = document.getElementById('user-name');
            if (userNameSpan) {
                userNameSpan.textContent = userName;
            }
            userInfo.style.display = 'flex';
        }
        
        if (loginButton) {
            loginButton.style.display = 'none';
        }
        
        // Atualizar menu mobile
        if (mobileAuthSection) {
            mobileAuthSection.innerHTML = `
                <a href="perfil.html"><i class="fa-solid fa-user-circle"></i> Ver Perfil</a>
                <a href="#"><i class="fa-solid fa-question-circle"></i> Ajuda</a>
                <a href="#" onclick="logout()"><i class="fa-solid fa-sign-out-alt"></i> Sair</a>
            `;
        }
    } else {
        // Usuário não logado
        if (userInfo) {
            userInfo.style.display = 'none';
        }
        
        if (loginButton) {
            loginButton.style.display = 'block';
        }
        
        // Atualizar menu mobile
        if (mobileAuthSection) {
            mobileAuthSection.innerHTML = `
                <a href="login.html"><i class="fa-solid fa-sign-in-alt"></i> Entrar</a>
            `;
        }
    }
}

// Função de logout (removida - agora está em auth.js)
// async function logout() {
//     const { error } = await supabase.auth.signOut();
//     if (error) {
//         console.error('Erro ao fazer logout:', error);
//         alert('Erro ao fazer logout: ' + error.message);
//     } else {
//         window.location.href = 'index.html';
//     }
// }

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', updateAuthUI);

// Escutar mudanças no estado de autenticação
supabase.auth.onAuthStateChange((event, session) => {
    updateAuthUI();
});


// Alternar dropdown do usuário
function toggleUserDropdown() {
    const dropdown = document.querySelector('.user-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// Fechar dropdown ao clicar fora
document.addEventListener('click', function(event) {
    const dropdown = document.querySelector('.user-dropdown');
    
    if (dropdown) {
        // Se o clique não foi no dropdown, fechar o dropdown
        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove('active');
        }
    }
});

// Fechar dropdown ao pressionar ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.querySelector('.user-dropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
    }
});

