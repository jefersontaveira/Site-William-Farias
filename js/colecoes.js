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
    
    // Limpamos a grid antes de inserir
    grid.innerHTML = '';
    
    if (countText) {
        countText.innerText = `${imoveis.length} Ativos Encontrados`;
    }

    // Usamos .map para uma renderização mais limpa e rápida
    grid.innerHTML = imoveis.map(imovel => {
        // Fallback para a foto (tenta foto_principal, depois foto_1)
        const fotoUrl = imovel.acf.foto_principal || imovel.acf.foto_1 || 'assets/hero.jpeg';
        
        return `
            <a href="template.html?id=${imovel.id}" class="portfolio-item">
                <div class="portfolio-bg" style="background-image: url('${fotoUrl}');"></div>
                
                <div class="item-info">
                    <h3>${imovel.title.rendered}</h3>
                    <div class="item-details-home">
                        <span>${imovel.acf.suites} Suítes</span>
                        <span class="separator">|</span>
                        <span>${imovel.acf.vagas} Vagas</span>
                        <span class="separator">|</span>
                        <span>${imovel.acf.area} m²</span>
                    </div>
                </div>
            </a>
        `;
    }).join('');

    // 1. REATIVAR O PARALLAX: Necessário sempre que novos cards são criados
    iniciarParallaxColecao();
    ScrollTrigger.refresh();

    // 2. ANIMAÇÃO DE ENTRADA GSAP
    gsap.fromTo(".portfolio-item", 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power2.out" }
    );
}

function limparFiltros() {
    // 1. Captura todos os selects dentro da barra de filtros
    const filtros = document.querySelectorAll('.filter-group select');

    // 2. Reseta cada um para o valor vazio (primeira option)
    filtros.forEach(select => {
        select.value = "";
    });

    // 3. Chama a sua função de filtragem existente para atualizar a grid
    // e o texto "X Ativos Encontrados"
    if (typeof filtrarImoveis === "function") {
        filtrarImoveis();
    }
}

// 3. Lógica de Filtro
function filtrarImoveis() {
    // Captura dos elementos de filtro
    const suiteMin = document.getElementById('filter-suites').value;
    const vagaMin = document.getElementById('filter-vagas').value;
    const quartoMin = document.getElementById('filter-quartos').value;
    const areaMin = document.getElementById('filter-area').value;
    const piscina = document.getElementById('filter-piscina').value;

    const filtrados = bancoDeDados.filter(imovel => {
        // Dados do ACF (convertendo para número onde necessário)
        const suites = parseInt(imovel.acf.suites) || 0;
        const vagas = parseInt(imovel.acf.vagas) || 0;
        const quartos = parseInt(imovel.acf.dormitorios) || 0;
        const area = parseFloat(imovel.acf.area) || 0;
        const temPiscina = imovel.acf.piscina; // Assume 'sim' ou 'nao'

        // Lógica de Comparação
        const matchSuites = suiteMin === "" || suites >= parseInt(suiteMin);
        const matchVagas = vagaMin === "" || vagas >= parseInt(vagaMin);
        const matchQuartos = quartoMin === "" || quartos >= parseInt(quartoMin);
        const matchArea = areaMin === "" || area >= parseFloat(areaMin);
        const matchPiscina = piscina === "" || temPiscina === piscina;

        // O imóvel só aparece se passar em TODOS os critérios ativos
        return matchSuites && matchVagas && matchQuartos && matchArea && matchPiscina;
    });

    renderizarCards(filtrados);
}

// Inicializa os dados com segurança
document.addEventListener('DOMContentLoaded', inicializarColecao);

