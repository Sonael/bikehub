// Script específico para a página de login

// Alternar entre formulários
function showLoginForm() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('reset-form').style.display = 'none';
}

function showSignupForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('reset-form').style.display = 'none';
}

function showResetPassword() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('reset-form').style.display = 'block';
}

// Manipular login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    await signIn(email, password);
}

// Manipular cadastro
async function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    if (!name || !email || !password || !confirmPassword) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('As senhas não coincidem.');
        return;
    }
    
    if (password.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres.');
        return;
    }
    
    const success = await signUp(email, password, name);
    if (success) {
        showLoginForm();
    }
}

// Manipular reset de senha
async function handleResetPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('reset-email').value;
    
    if (!email) {
        alert('Por favor, digite seu email.');
        return;
    }
    
    const success = await resetPassword(email);
    if (success) {
        showLoginForm();
    }
}

// Verificar se usuário já está logado ao carregar a página
document.addEventListener('DOMContentLoaded', async () => {
    const user = await checkUser();
    if (user) {
        // Se já estiver logado, redirecionar para a página inicial
        window.location.href = 'index.html';
    }
});

