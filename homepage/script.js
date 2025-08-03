const API_URL = 'http://localhost:3000/products';
const gridCamisas = document.getElementById('grid-camisas');
const paginacao = document.querySelector('.paginacao');
const anteriorBtn = paginacao.querySelector('button:first-child');
const proximoBtn = paginacao.querySelector('button:last-child');
let bolinhasContainer = paginacao.querySelector('.bolinhas');

const urlParams = new URLSearchParams(window.location.search);
let paginaAtual = parseInt(urlParams.get('page')) || 1;
const limitePorPagina = 9;
let totalPaginas = 1;

async function carregarProdutos(pagina) {
    try {
        const response = await fetch(`${API_URL}?_limit=${limitePorPagina}&_page=${pagina}`);
        const produtos = await response.json();
        
        const totalCount = response.headers.get('X-Total-Count');
        totalPaginas = Math.ceil(totalCount / limitePorPagina);

        renderizarProdutos(produtos);
        atualizarPaginacao(pagina);
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        gridCamisas.innerHTML = '<p>Erro ao carregar os produtos. Verifique a conexão com a API.</p>';
    }
}

function renderizarProdutos(produtos) {
    gridCamisas.innerHTML = '';
    produtos.forEach(produto => {
        const produtoHTML = `
            <div class="produto">
                <div class="produto-header">
                    <span class="avaliacao">${produto.rating} <img src="../assets/estrela.png" alt="Estrela"></span>
                    <div class="acoes">
                        <a href="../editar-page/editar.html?id=${produto.id}" target="_blank">
                            <img src="../assets/desenhoeditar.png" alt="Editar">
                        </a>
                        <img src="../assets/desenhodeletar.png" alt="Excluir" class="deletar-btn" data-id="${produto.id}">
                    </div>
                </div>
                <img src="../assets/camisa.png" alt="${produto.name}" class="imagem-produto">
                <div class="descricao">
                    <h4>${produto.name}</h4>
                    <p>${produto.category}</p>
                    <p>${produto.description}</p>
                    <p class="preco">R$ ${produto.price.toFixed(2)}</p>
                </div>
            </div>
        `;
        gridCamisas.insertAdjacentHTML('beforeend', produtoHTML);
    });

    adicionarListenersDeletar();
}

function atualizarPaginacao(pagina) {
    bolinhasContainer.innerHTML = '';
    for (let i = 1; i <= totalPaginas; i++) {
        const bolinha = document.createElement('span');
        bolinha.textContent = i;
        bolinha.classList.add('bolinha');
        if (i === pagina) {
            bolinha.classList.add('ativo');
        }
        bolinhasContainer.appendChild(bolinha);

        bolinha.addEventListener('click', () => {
            paginaAtual = i;
            carregarProdutos(paginaAtual);
        });
    }

    anteriorBtn.disabled = pagina === 1;
    proximoBtn.disabled = pagina === totalPaginas;
}

function adicionarListenersDeletar() {
    const deletarBtns = document.querySelectorAll('.deletar-btn');

    deletarBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            if (confirm('Tem certeza que deseja deletar este produto?')) {
                await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                carregarProdutos(paginaAtual);
            }
        });
    });
}

anteriorBtn.addEventListener('click', () => {
    if (paginaAtual > 1) {
        paginaAtual--;
        carregarProdutos(paginaAtual);
    }
});

proximoBtn.addEventListener('click', () => {
    if (paginaAtual < totalPaginas) {
        paginaAtual++;
        carregarProdutos(paginaAtual);
    }
});

carregarProdutos(paginaAtual);