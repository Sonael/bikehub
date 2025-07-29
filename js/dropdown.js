// Script para funcionalidade do dropdown do usuário

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
    const dropdownToggle = document.querySelector('.user-dropdown-toggle');
    
    if (dropdown && dropdownToggle) {
        // Se o clique não foi no dropdown nem no botão, fechar o dropdown
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

// Atualizar função updateAuthUI para usar dropdown
async function updateAuthUIWithDropdown() {
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
            const userName = user.user_metadata?.display_name || user.email.split('@')[0];
            mobileAuthSection.innerHTML = `
                <div class="mobile-user-info">
                    <span><i class="fa-solid fa-user"></i> ${userName}</span>
                    <a href="perfil.html"><i class="fa-solid fa-user-circle"></i> Ver Perfil</a>
                    <a href="#"><i class="fa-solid fa-question-circle"></i> Ajuda</a>
                    <a href="#" onclick="logout()"><i class="fa-solid fa-sign-out-alt"></i> Sair</a>
                </div>
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

// Substituir a função updateAuthUI original
if (typeof updateAuthUI !== 'undefined') {
    updateAuthUI = updateAuthUIWithDropdown;
}

// Inicializar dropdown
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se a função updateAuthUI existe e substituí-la
    if (typeof window.updateAuthUI === 'function') {
        window.updateAuthUI = updateAuthUIWithDropdown;
    }
});

