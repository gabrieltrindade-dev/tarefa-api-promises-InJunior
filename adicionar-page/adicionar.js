const API_URL = 'http://localhost:3000/products';

const formAdicionar = document.querySelector('form');
const nomeInput = document.getElementById('nome');
const imagemInput = document.getElementById('image');
const descricaoInput = document.getElementById('descricao');
const precoInput = document.getElementById('preco');
const categoriasInput = document.getElementById('categorias');
const avaliacaoInput = document.getElementById('avaliacao');

formAdicionar.addEventListener('submit', async (e) => {
    e.preventDefault();

    const novoProduto = {
        name: nomeInput.value,
        image: imagemInput.value,
        description: descricaoInput.value,
        price: parseFloat(precoInput.value),
        category: categoriasInput.value,
        inStock: true, 
        rating: parseFloat(avaliacaoInput.value),
    };

    if (!novoProduto.name || !novoProduto.image || !novoProduto.description || isNaN(novoProduto.price) || !novoProduto.category || isNaN(novoProduto.rating)) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novoProduto),
        });

        if (!response.ok) { 
            return;
        }

        
        const totalProductsResponse = await fetch(API_URL);
        const totalCount = totalProductsResponse.headers.get('X-Total-Count');
        const limitePorPagina = 5; 
        const ultimaPagina = Math.ceil(totalCount / limitePorPagina);
        window.location.href = `../homepage/index.html?page=${ultimaPagina}`;;
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
});