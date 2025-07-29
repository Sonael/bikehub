// Sistema de notificações estilizadas

// Criar container de notificações se não existir
function createNotificationContainer() {
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    return container;
}

// Mostrar notificação
function showNotification(message, type = 'info', duration = 4000) {
    const container = createNotificationContainer();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Ícone baseado no tipo
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<i class="fa-solid fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fa-solid fa-exclamation-circle"></i>';
            break;
        case 'warning':
            icon = '<i class="fa-solid fa-exclamation-triangle"></i>';
            break;
        case 'info':
        default:
            icon = '<i class="fa-solid fa-info-circle"></i>';
            break;
    }
    
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">${icon}</div>
            <div class="notification-message">${message}</div>
            <button class="notification-close" onclick="closeNotification(this)">
                <i class="fa-solid fa-times"></i>
            </button>
        </div>
        <div class="notification-progress"></div>
    `;
    
    container.appendChild(notification);
    
    // Animação de entrada
    setTimeout(() => {
        notification.classList.add('notification-show');
    }, 10);
    
    // Barra de progresso
    const progressBar = notification.querySelector('.notification-progress');
    progressBar.style.animationDuration = `${duration}ms`;
    
    // Auto-remover após duração especificada
    setTimeout(() => {
        closeNotification(notification.querySelector('.notification-close'));
    }, duration);
}

// Fechar notificação
function closeNotification(closeButton) {
    const notification = closeButton.closest('.notification');
    notification.classList.add('notification-hide');
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Adicionar estilos CSS para notificações
function addNotificationStyles() {
    if (document.getElementById('notification-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
            width: 100%;
        }
        
        .notification {
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            margin-bottom: 10px;
            overflow: hidden;
            transform: translateX(100%);
            transition: all 0.3s ease;
            opacity: 0;
            position: relative;
        }
        
        .notification-show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .notification-hide {
            transform: translateX(100%);
            opacity: 0;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            padding: 16px;
            gap: 12px;
        }
        
        .notification-icon {
            font-size: 20px;
            flex-shrink: 0;
        }
        
        .notification-success .notification-icon {
            color: #4CAF50;
        }
        
        .notification-error .notification-icon {
            color: #f44336;
        }
        
        .notification-warning .notification-icon {
            color: #ff9800;
        }
        
        .notification-info .notification-icon {
            color: #2196F3;
        }
        
        .notification-message {
            flex: 1;
            color: #333;
            font-size: 14px;
            line-height: 1.4;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: #999;
            cursor: pointer;
            font-size: 16px;
            padding: 4px;
            border-radius: 4px;
            transition: background-color 0.2s ease;
        }
        
        .notification-close:hover {
            background-color: #f5f5f5;
            color: #666;
        }
        
        .notification-progress {
            height: 3px;
            background: linear-gradient(90deg, transparent, rgba(0,0,0,0.1));
            animation: notification-progress linear;
        }
        
        .notification-success .notification-progress {
            background: linear-gradient(90deg, #4CAF50, transparent);
        }
        
        .notification-error .notification-progress {
            background: linear-gradient(90deg, #f44336, transparent);
        }
        
        .notification-warning .notification-progress {
            background: linear-gradient(90deg, #ff9800, transparent);
        }
        
        .notification-info .notification-progress {
            background: linear-gradient(90deg, #2196F3, transparent);
        }
        
        @keyframes notification-progress {
            from { width: 100%; }
            to { width: 0%; }
        }
        
        @media (max-width: 480px) {
            .notification-container {
                left: 20px;
                right: 20px;
                max-width: none;
            }
            
            .notification {
                transform: translateY(-100%);
            }
            
            .notification-show {
                transform: translateY(0);
            }
            
            .notification-hide {
                transform: translateY(-100%);
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Inicializar sistema de notificações
document.addEventListener('DOMContentLoaded', () => {
    addNotificationStyles();
});

// Funções de conveniência
function showSuccess(message, duration = 4000) {
    showNotification(message, 'success', duration);
}

function showError(message, duration = 5000) {
    showNotification(message, 'error', duration);
}

function showWarning(message, duration = 4000) {
    showNotification(message, 'warning', duration);
}

function showInfo(message, duration = 4000) {
    showNotification(message, 'info', duration);
}

