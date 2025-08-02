const API_URL = 'http://localhost:3000/products';
const gridCamisas = document.getElementById('grid-camisas');
const paginacao = document.querySelector('.paginacao');
const anteriorBtn = paginacao.querySelector('button:first-child');
const proximoBtn = paginacao.querySelector('button:last-child');
const bolinhas = paginacao.querySelectorAll('.bolinhas span');

let paginaAtual = 1;
const limitePorPagina = 5;
const totalPaginas = 10; 

async function carregarProdutos(pagina) {
    const response = await fetch(`${API_URL}?_limit=${limitePorPagina}&_page=${pagina}`);
    const produtos = await response.json();
    renderizarProdutos(produtos);
    atualizarPaginacao(pagina);
}

function renderizarProdutos(produtos) {
    gridCamisas.innerHTML = '';
    produtos.forEach(produto => {
        const produtoHTML = `
            <div class="produto">
                <div class="produto-header">
                    <span class="avaliacao">${produto.rating} <img src="../assets/estrela.png" alt="Estrela"></span>
                    <div class="acoes">
                        <a href="../editar-page/editar.html" target="_blank">
                            <img src="../assets/desenhoeditar.png" alt="Editar">
                        </a>
                        <img src="../assets/desenhodeletar.png" alt="Excluir" class="deletar-btn" data-id="${produto.id}">
                    </div>
                </div>
                <img src="../assets/camisa.png" alt="${produto.name}" class="imagem-produto">
                <div class="descricao">
                    <h4>${produto.name}</h4>
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
    bolinhas.forEach((bolinha, index) => {
        bolinha.classList.toggle('ativo', index + 1 === pagina);
    });
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

bolinhas.forEach((bolinha, index) => {
    bolinha.addEventListener('click', () => {
        paginaAtual = index + 1;
        carregarProdutos(paginaAtual);
    });
});

carregarProdutos(paginaAtual);
