// Funcionalidade do menu hambúrguer mobile
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    
    if (hamburgerMenu && mobileNavMenu) {
        hamburgerMenu.addEventListener('click', function() {
            // Toggle das classes ativas
            hamburgerMenu.classList.toggle('active');
            mobileNavMenu.classList.toggle('active');
        });
        
        // Fechar menu ao clicar em um link
        const mobileNavLinks = mobileNavMenu.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburgerMenu.classList.remove('active');
                mobileNavMenu.classList.remove('active');
            });
        });
        
        // Fechar menu ao clicar fora
        document.addEventListener('click', function(event) {
            if (!hamburgerMenu.contains(event.target) && !mobileNavMenu.contains(event.target)) {
                hamburgerMenu.classList.remove('active');
                mobileNavMenu.classList.remove('active');
            }
        });
    }
});

