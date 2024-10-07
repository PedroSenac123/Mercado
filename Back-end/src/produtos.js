document.addEventListener('DOMContentLoaded', async () => {
    const productList = document.getElementById('product-list');
    const userId = localStorage.getItem('userId'); // Pega o ID do usuário armazenado

    try {
        const response = await fetch('http://localhost:3333/produtos');
        const result = await response.json();

        if (result.success) {
            const products = result.data;
            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product';
                productDiv.dataset.productId = product.id_products;

                productDiv.innerHTML = `
                    <img class="product${product.id_products}" src="${product.image_link}" alt="${product.product_name}">
                    <div class="product-name product${product.id_products}">${product.product_name}</div>
                    <p>${product.id_products}</p>
                    <div class="product-price product${product.id_products}">R$ ${product.price}</div>
                    <button class="edit-btn" data-product-id="${product.id_products}" onclick="openEditProductModal(${product.id_products})" style="margin-top:10px;">Editar</button>

                    <button class="add-to-cart-button" onclick="addToCart(${product.id_products}, ${userId})">Adicionar ao Carrinho</button>
                `;

                productDiv.addEventListener('click', () => {
                    window.location.href = `product-details.html?id=${product.id_products}`;
                });

                productList.appendChild(productDiv);
            });

            // Adiciona eventos de clique para os botões de edição
            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    event.stopPropagation(); 
                    const productId = button.dataset.productId;
                    openEditProductModal(productId);
                });
            });
        } else {
            productList.innerHTML = '<p>Erro ao carregar produtos.</p>';
        }
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        productList.innerHTML = '<p>Erro ao carregar produtos.</p>';
    }
});
function openEditProductModal(productId) {
    // Obtenha o modal de edição de produto
    const modal = document.getElementById('editProductModal');

    // Mostre o modal
    modal.style.display = 'block';

    // Faça uma requisição para obter os detalhes do produto com base no ID
    fetch(`http://localhost:3333/produtos/${productId}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Preencha os campos do modal com as informações do produto
            document.getElementById('editProductName').value = data.product_name;
            document.getElementById('editProductPrice').value = data.price;
            document.getElementById('editProductAmount').value = data.amount;
            document.getElementById('editProductImageLink').value = data.image_link;

            // Guarde o ID do produto para atualização posterior
            document.getElementById('editProductId').value = productId;
        })
        .catch(error => {
            console.error('Erro ao carregar os dados do produto:', error);
        });
}

// Fechar o modal
function closeEditProductModal() {
    const modal = document.getElementById('editProductModal');
    modal.style.display = 'none';
}


// Função para adicionar produtos ao carrinho
function addToCart(productId, userId, quantity = 1) {
    const requestBody = {
        productId: productId,
        userId: userId,
        quantity: quantity
    };

    fetch('http://localhost:3333/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Produto adicionado ao carrinho:', data);
        } else {
            console.error('Erro ao adicionar ao carrinho:', data.message);
        }
    })
    .catch(error => console.error('Erro ao fazer a requisição:', error));
}
function submitEditForm(productId) {
    const productName = document.getElementById('editProductName').value;
    const productPrice = document.getElementById('editProductPrice').value;
    const productAmount = document.getElementById('editProductAmount').value;
    const productImageLink = document.getElementById('editProductImageLink').value;
    const productDescription = document.getElementById('editProductDescription').value;

    const productData = {
        product_name: productName,
        price: productPrice,
        amount: productAmount,
        image_link: productImageLink,
        description: productDescription
    };

    fetch(`http://localhost:3333/product/update/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Produto atualizado com sucesso!');
            closeEditProductModal(); // Fecha o modal após a edição
            window.location.reload(); // Atualiza a página para refletir as mudanças
        } else {
            alert('Erro ao atualizar produto: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Erro ao atualizar o produto:', error);
    });
}
function deletarProduto(event, productId) {
    event.preventDefault(); // Previne o comportamento padrão do botão

    if (confirm('Tem certeza de que deseja deletar este produto?')) {
        fetch(`http://localhost:3333/product/delete/${productId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Produto deletado com sucesso!');
                closeEditProductModal(); // Fecha o modal após a exclusão
                window.location.reload(); // Atualiza a página para refletir as mudanças
            } else {
                alert('Erro ao deletar produto: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erro ao deletar o produto:', error);
        });
    }
}
document.getElementById('closeEditModal').addEventListener('click', () => {
    closeEditProductModal();
});

function closeEditProductModal() {
    const modal = document.getElementById('editProductModal');
    modal.style.display = 'none';
}

// // Função para verificar se o usuário é admin
// function checkIfAdmin() {
//     fetch('http://localhost:3333/usuario/info', {
//         credentials: 'include' // Inclui cookies na requisição
//     })
//     .then(response => {
//         if (response.ok) {
//             return response.json();
//         } else {
//             throw new Error('Erro na requisição');
//         }
//     })
//     .then(data => {
//         if (data.isAdmin) {
//             console.log('Usuário é admin.');
//             // Adicione o botão para adicionar produtos aqui se o usuário for admin
//         } else {
//             console.log('Usuário não é admin.');
//             // Ocultar ou desabilitar botão de adicionar produtos se não for admin
//         }
//     })
//     .catch(error => {
//         console.error('Erro ao verificar se o usuário é admin:', error);
//     });
// }

// // Verifica se o usuário é admin quando a página carrega
// document.addEventListener('DOMContentLoaded', checkIfAdmin);

/*
function checkIfAdmin() {
    fetch('http://localhost:3333/usuario/info', {
        credentials: 'include' // Inclui cookies na requisição
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Erro na requisição');
        }
    })
    .then(data => {
        if (data.isAdmin) {
            console.log('Usuário é admin. Redirecionando...');
            window.location.href = '/Front-End/html/add-product.html'; // Redireciona para a página de adicionar produto
        } else {
            console.log('Usuário não é admin.');
            window.location.href = '/'; // Redireciona para a página inicial ou de erro
        }
    })
    .catch(error => {
        console.error('Erro ao verificar se o usuário é admin:', error);
    });
}

// Verifica se o usuário é admin quando a página carrega
document.addEventListener('DOMContentLoaded', checkIfAdmin);

*/