const API_URL = 'http://localhost:3000/products';

const formEditar = document.querySelector('form');
const nomeInput = document.getElementById('nome');
const imagemInput = document.getElementById('image');
const descricaoInput = document.getElementById('descricao');
const precoInput = document.getElementById('preco');
const categoriasInput = document.getElementById('categorias');
const avaliacaoInput = document.getElementById('avaliacao');

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

if (!productId) {
    alert('ID do produto não encontrado.');
    window.location.href = '../homepage/index.html';
}

async function carregarProdutoParaEdicao() {
    try {
        const response = await fetch(`${API_URL}/${productId}`);
        const produto = await response.json();
        nomeInput.value = produto.name;
        imagemInput.value = produto.image;
        descricaoInput.value = produto.description;
        precoInput.value = produto.price;
        categoriasInput.value = produto.category;
        avaliacaoInput.value = produto.rating;

    } catch (error) {
        console.error('Erro ao carregar o produto:', error);
        alert('Erro ao carregar os dados do produto');
    }
}

formEditar.addEventListener('submit', async (e) => {
    e.preventDefault();
    const produtoAtualizado = {
        name: nomeInput.value,
        image: imagemInput.value,
        description: descricaoInput.value,
        price: parseFloat(precoInput.value),
        category: categoriasInput.value,
        rating: parseFloat(avaliacaoInput.value),
    };

    try {
        const response = await fetch(`${API_URL}/${productId}`, {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(produtoAtualizado),
        });

        if (response.ok) {
            window.location.href = '../homepage/index.html';
        } else {
            alert('Erro ao atualizar o produto. Status: ' + response.status);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro de conexão');
    }
});

carregarProdutoParaEdicao();