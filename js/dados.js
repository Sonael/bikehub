// Funcionalidade da página de dados

// Dados para diferentes bases
const databaseData = {
    cttu: {
        chart1: {
            title: "Distribuição por Tipo de Acidente (Top 10) - CTTU",
            image: "img/image1.png",
            alt: "Gráfico de barras de distribuição por Tipo de Acidente - CTTU"
        },
        chart2: {
            title: "Evolução Mensal de Acidentes - CTTU",
            image: "img/image2.png",
            alt: "Gráfico de linha da evolução mensal de acidentes - CTTU"
        }
    },
    prf: {
        chart1: {
            title: "Distribuição por Tipo de Acidente (Top 10) - PRF",
            image: "img/grafico1.png",
            alt: "Gráfico de barras de distribuição por Tipo de Acidente - PRF"
        },
        chart2: {
            title: "Evolução Mensal de Acidentes - PRF",
            image: "img/grafico2.png",
            alt: "Gráfico de linha da evolução mensal de acidentes - PRF"
        }
    }
};

// Função para alterar a base de dados
function changeDatabase() {
    const select = document.getElementById('database-select');
    const selectedDatabase = select.value;
    
    // Atualizar títulos e imagens dos gráficos
    const chart1Title = document.getElementById('chart1-title');
    const chart1Img = document.getElementById('chart1-img');
    const chart2Title = document.getElementById('chart2-title');
    const chart2Img = document.getElementById('chart2-img');
    
    if (chart1Title && chart1Img && chart2Title && chart2Img) {
        const data = databaseData[selectedDatabase];
        
        // Atualizar primeiro gráfico
        chart1Title.textContent = data.chart1.title;
        chart1Img.src = data.chart1.image;
        chart1Img.alt = data.chart1.alt;
        
        // Atualizar segundo gráfico
        chart2Title.textContent = data.chart2.title;
        chart2Img.src = data.chart2.image;
        chart2Img.alt = data.chart2.alt;
        
        // Adicionar efeito de transição
        const dashboard = document.getElementById('dashboard');
        if (dashboard) {
            dashboard.style.opacity = '0.7';
            setTimeout(() => {
                dashboard.style.opacity = '1';
            }, 300);
        }
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Configurar base de dados padrão
    changeDatabase();
});

