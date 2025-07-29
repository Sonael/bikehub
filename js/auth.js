// Funções de autenticação

// Cadastrar novo usuário
async function signUp(email, password, displayName) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    display_name: displayName
                }
            }
        });

        if (error) throw error;

        showSuccess('Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.');
        return true;
    } catch (error) {
        console.error('Erro no cadastro:', error);
        showError('Erro no cadastro: ' + error.message);
        return false;
    }
}

// Fazer login
async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        if (data.user) {
            showSuccess('Login realizado com sucesso!');
            window.location.href = 'index.html';
            return true;
        }
    } catch (error) {
        console.error('Erro no login:', error);
        showError('Erro no login: ' + error.message);
        return false;
    }
}

// Fazer logout
async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            throw error;
        }
        
        showSuccess('Logout realizado com sucesso!');
        window.location.href = 'index.html';
        return true;
    } catch (error) {
        console.error('Erro no logout:', error);
        showError('Erro no logout: ' + error.message);
        return false;
    }
}

// Resetar senha
async function resetPassword(email) {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password.html'
        });

        if (error) throw error;

        showSuccess('Email de recuperação enviado! Verifique sua caixa de entrada.');
        return true;
    } catch (error) {
        console.error('Erro ao resetar senha:', error);
        showError('Erro ao resetar senha: ' + error.message);
        return false;
    }
}

// Verificar se usuário está logado (para páginas protegidas)
async function requireAuth() {
    const user = await checkUser();
    if (!user) {
        showWarning('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Obter dados do usuário atual
async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

