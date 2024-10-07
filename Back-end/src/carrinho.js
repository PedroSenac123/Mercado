function redirecionarParaPagina(pageUrl) {
    window.location.href = pageUrl;
}
console.log(localStorage.getItem('userId'))
function clearCart() {
    const userId = localStorage.getItem('userId'); // Obtém o ID do usuário do localStorage

    fetch(`http://localhost:3333/cart/clear/${userId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Resposta da API:', data);
        if (data.success) {
            // Aqui você pode atualizar a UI, como remover todos os produtos do carrinho
            const cartItemsContainer = document.getElementById('cart-items');
            cartItemsContainer.innerHTML = '<p>Seu carrinho foi limpo.</p>'; // Mensagem de carrinho limpo
            document.getElementById('totalAmount').innerHTML = '0,00'; // Zerar total
        }
    })
    .catch(error => {
        console.error('Erro ao limpar o carrinho:', error);
        alert('Não foi possível limpar o carrinho. Tente novamente.');
    });
}

function checkout() {
    alert('Compra finalizada! Total: R$ ' + document.getElementById('totalAmount').innerText);
    clearCart(); // Refatorado para usar a função clearCart
}

function updateTotalAmount() {
    const cartItems = document.querySelectorAll('.grid-container > div');
    let total = 0;

    cartItems.forEach(item => {
        const priceElement = item.querySelector('.productPrice');
        const quantityElement = item.querySelector('.product-qtde-input');

        if (priceElement && quantityElement) {
            const price = parseFloat(priceElement.textContent.replace('R$ ', '').replace(',', '.')); // Corrigido
            const quantity = parseInt(quantityElement.value);
            total += price * quantity;
        }
    });

    document.getElementById('totalAmount').innerText = total.toFixed(2).replace('.', ',');
}

// Adiciona um evento de mudança aos inputs de quantidade
document.addEventListener('change', (event) => {
    if (event.target.classList.contains('product-qtde-input')) {
        updateTotalAmount();
    }
});

// Função para carregar itens do carrinho quando a página é aberta
// document.addEventListener('DOMContentLoaded', function() {
//     const userId = localStorage.getItem('userId'); // Certifique-se de que o userId está armazenado

//     // Função para carregar os itens do carrinho
//     function loadCartItems() {
//         fetch(`http://localhost:3333/cart/list/${userId}`)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 console.log(data); // Adicione esta linha para verificar a estrutura da resposta
//                 const cartItemsContainer = document.getElementById('cart-items');
//                 cartItemsContainer.innerHTML = ''; // Limpa itens anteriores
//                 let totalAmount = 0;
    
//                 // Verifica se a propriedade 'cart' existe e é um array
//                 if (data.cart && Array.isArray(data.cart)) {
//                     data.cart.forEach(item => {
//                         const itemDiv = document.createElement('div');
//                         itemDiv.className = 'productCart';
//                         itemDiv.id = `div-product${item.id}`;
//                         itemDiv.innerHTML = `
//                             <img src="${item.image_link}" alt="${item.product_name}">
//                             <div class="productName">${item.product_name}</div>
//                             <div>
//                                 <p class="productPrice">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
//                                 <input type="number" class="product-qtde-input" id="product-qtde-input-${item.id}" value="${item.qtde}" min="1" max="20">
//                                 <span><i class="fas fa-trash-alt" id="lixeira" onclick="deleteFromCart(${userId}, ${item.id})"></i></span>
//                             </div>
//                         `;
//                         cartItemsContainer.appendChild(itemDiv);
//                         totalAmount += item.price * item.qtde;
//                     });
//                 } else {
//                     console.error('A propriedade "cart" não está definida ou não é um array');
//                 }
    
//                 const totalElement = document.getElementById('totalAmount');
//                 totalElement.innerHTML = totalAmount.toFixed(2).replace('.', ',');
//             })
//             .catch(error => {
//                 console.error('Erro ao carregar os itens do carrinho:', error);
//             });
//     }

//     // Carregar os itens ao abrir a página
//     loadCartItems();
// });

// Função para deletar item do carrinho


document.addEventListener('DOMContentLoaded', function() {
    const userId = localStorage.getItem('userId'); // Certifique-se de que o userId está armazenado

    // Função para carregar os itens do carrinho
    function loadCartItems() {
        console.log('Carregando o carrinho para o userId:', userId);
        fetch(`http://localhost:3333/cart/list/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Resposta da API:', data);
                const cartItemsContainer = document.getElementById('cart-items');
                let totalAmount = 0;

                // Verifica se a propriedade "data" está definida e é um array
                if (data.success && Array.isArray(data.data)) {
                    data.data.forEach(item => {
                        console.log('item:', item);
                        const itemDiv = document.createElement('div');
                        itemDiv.className = 'productCart';
                        itemDiv.id = `div-product${item.id}`; // Define um ID único para cada produto no carrinho

                        // Corrige a conversão do preço, garantindo que seja um número
                        const price = parseFloat(item.price.replace(',', '.'));

                        itemDiv.innerHTML = `
                        <img class="product-image" src="${item.image_link}" alt="${item.product_name}">
                        <div class="product-name">${item.product_name}</div>
                        <p>Quantidade: <input type="number" class="product-qtde-input" value="${item.qtde}" min="1" max="20" id="product-qtde-input-${item.id}"></p>
                        <div class="product-price">R$ ${price.toFixed(2).replace('.', ',')}</div>
                        <button class="remove-btn" onclick="deleteFromCart(${userId}, ${item.id})">Remover</button>
                    `;

                        // Adiciona o item ao container do carrinho
                        cartItemsContainer.appendChild(itemDiv);

                        // Atualiza o valor total
                        totalAmount += price * item.qtde; // Use o preço convertido aqui
                    });

                    const totalElement = document.getElementById('totalAmount');
                    totalElement.innerHTML = totalAmount.toFixed(2).replace('.', ',');
                } else {
                    cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio ou houve um erro ao carregar.</p>';
                }
            })
            .catch(error => {
                console.error('Erro ao carregar os itens do carrinho:', error);
                const cartItemsContainer = document.getElementById('cart-items');
                cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio ou houve um erro ao carregar.</p>';
            });
    }

    // Carregar os itens ao abrir a página
    loadCartItems();
});



function deleteFromCart(userId, productId) {
    console.log('Removendo produto. userId:', userId, 'productId:', productId);
    fetch(`http://localhost:3333/cart/remove/${userId}/${productId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(`Produto ${productId} removido do carrinho com sucesso.`);
            
            // Atualiza a UI removendo o produto da lista
            const productDiv = document.getElementById(`div-product${productId}`);
            if (productDiv) {
                productDiv.remove(); // Remove o elemento da DOM
            }

            // Atualiza o total do carrinho
            updateCartTotal();
        } else {
            console.error('Erro ao remover o produto do carrinho:', data.message);
            alert('Não foi possível remover o produto do carrinho. Tente novamente.');
        }
    })
    .catch(error => {
        console.error('Erro ao remover o produto do carrinho:', error);
        alert('Erro ao remover o produto do carrinho. Tente novamente.');
    });
}

// Função para atualizar o total do carrinho
function updateCartTotal() {
    const cartItems = document.querySelectorAll('.productCart');
    let total = 0;

    cartItems.forEach(item => {
        const priceText = item.querySelector('.product-price').innerText.replace('R$ ', '').replace(',', '.');
        const price = parseFloat(priceText);
        const quantity = parseInt(item.querySelector('.product-qtde-input').value) || 1; // Obtém a quantidade
        total += price * quantity;
    });

    const totalElement = document.getElementById('totalAmount');
    totalElement.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`; // Atualiza o total na UI
}
