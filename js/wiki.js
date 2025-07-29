// Script para navegação da Wiki

// Mostrar seção específica da wiki
function showWikiSection(sectionId) {
    // Remover classe active de todas as seções e itens de navegação
    document.querySelectorAll('.wiki-section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.querySelectorAll('.wiki-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Adicionar classe active à seção selecionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Adicionar classe active ao item de navegação correspondente
    const navItems = document.querySelectorAll('.wiki-nav-item');
    navItems.forEach(item => {
        if (item.getAttribute('onclick').includes(sectionId)) {
            item.classList.add('active');
        }
    });
    
    // Scroll suave para o topo da seção
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Inicializar wiki
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se estamos na página da wiki
    if (window.location.pathname.includes('wiki.html')) {
        // Mostrar primeira seção por padrão
        showWikiSection('plano-diretor');
    }
});

