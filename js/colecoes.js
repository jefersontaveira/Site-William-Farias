// Configurações Base
const apiURL = 'https://moccasin-weasel-174149.hostingersite.com/wp-json/wp/v2/imovel?_embed';
let bancoDeDados = [];

// 1. Carregamento Inicial
async function inicializarColecao() {
    try {
        const response = await fetch(apiURL);
        bancoDeDados = await response.json();
        console.log("Dados carregados:", bancoDeDados); // Para você conferir no F12
        renderizarCards(bancoDeDados);
    } catch (error) {
        console.error("Erro ao carregar coleção:", error);
        document.getElementById('count-text').innerText = "Erro ao carregar ativos.";
    }
}

// 2. Função de Renderização
function renderizarCards(imoveis) {
    const grid = document.getElementById('colecao-grid');
    const countText = document.getElementById('count-text');
    
    if (!grid) return;
    
    grid.innerHTML = '';
    countText.innerText = `${imoveis.length} Ativos Encontrados`;

    imoveis.forEach(imovel => {
        // Captura a URL da foto principal que configuramos no ACF
        const img = imovel.acf.foto_principal || 'assets/hero.jpeg';
        
        // Estrutura idêntica ao seu card estático
        grid.innerHTML += `
            <a href="template.html?id=${imovel.id}" class="portfolio-item">
                <img src="${img}" alt="${imovel.title.rendered}">
                <div class="item-info">
                    <h3>${imovel.title.rendered}</h3>
                    <p>${imovel.acf.suites} Suítes | ${imovel.acf.vagas} Vagas</p>
                    <span class="price">${imovel.acf.area} m²</span>
                </div>
            </a>
        `;
    });

    // Animação de entrada
    gsap.fromTo(".portfolio-item", 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power2.out" }
    );
} 

// 3. Lógica de Filtro
function filtrarImoveis() {
    // Captura dos elementos de filtro
    const suiteMin = document.getElementById('filter-suites').value;
    const vagaMin = document.getElementById('filter-vagas').value;
    const quartoMin = document.getElementById('filter-quartos').value;
    const areaMin = document.getElementById('filter-area').value;
    const piscina = document.getElementById('filter-piscina').value;
    const bairro = document.getElementById('filter-bairro').value;

    const filtrados = bancoDeDados.filter(imovel => {
        // Dados do ACF (convertendo para número onde necessário)
        const suites = parseInt(imovel.acf.suites) || 0;
        const vagas = parseInt(imovel.acf.vagas) || 0;
        const quartos = parseInt(imovel.acf.dormitorios) || 0;
        const area = parseFloat(imovel.acf.area) || 0;
        const temPiscina = imovel.acf.piscina; // Assume 'sim' ou 'nao'
        const bairroImovel = imovel.acf.bairro;

        // Lógica de Comparação
        const matchSuites = suiteMin === "" || suites >= parseInt(suiteMin);
        const matchVagas = vagaMin === "" || vagas >= parseInt(vagaMin);
        const matchQuartos = quartoMin === "" || quartos >= parseInt(quartoMin);
        const matchArea = areaMin === "" || area >= parseFloat(areaMin);
        const matchPiscina = piscina === "" || temPiscina === piscina;
        const matchBairro = bairro === "" || bairroImovel === bairro;

        // O imóvel só aparece se passar em TODOS os critérios ativos
        return matchSuites && matchVagas && matchQuartos && matchArea && matchPiscina && matchBairro;
    });

    renderizarCards(filtrados);
}

// Inicializa os dados com segurança
document.addEventListener('DOMContentLoaded', inicializarColecao);