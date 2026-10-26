
"use strict";

// ANTES DE PUBLICAR:
// Troque pelo número real da sua lanchonete.
// Formato: código do país + DDD + número, somente números.
const WHATSAPP_NUMBER = "5511999999999";

const products = [
  {
    id: 1,
    name: "Classic Gold",
    category: "hamburgueres",
    categoryLabel: "Hambúrguer",
    description: "Pão brioche, carne artesanal, queijo cheddar e molho especial.",
    price: 29.90,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    name: "Double Premium",
    category: "hamburgueres",
    categoryLabel: "Hambúrguer",
    description: "Dois hambúrgueres, cheddar cremoso, cebola caramelizada e brioche.",
    price: 36.90,
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    name: "Bacon Supreme",
    category: "hamburgueres",
    categoryLabel: "Hambúrguer",
    description: "Carne artesanal, bacon crocante, queijo e molho defumado.",
    price: 34.90,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    name: "Chicken Crispy",
    category: "hamburgueres",
    categoryLabel: "Hambúrguer",
    description: "Frango crocante, alface fresca, queijo e maionese temperada.",
    price: 27.90,
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5,
    name: "Batata Clássica",
    category: "batatas",
    categoryLabel: "Batata frita",
    description: "Batatas douradas e crocantes, com uma pitada de sal.",
    price: 14.90,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    name: "Batata Cheddar & Bacon",
    category: "batatas",
    categoryLabel: "Batata frita",
    description: "Batatas crocantes com cheddar cremoso e bacon.",
    price: 22.90,
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 7,
    name: "Refrigerante Lata",
    category: "bebidas",
    categoryLabel: "Bebida",
    description: "Refrigerante gelado em lata de 350 ml. Escolha o sabor no pedido.",
    price: 6.00,
    image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 8,
    name: "Suco Natural",
    category: "bebidas",
    categoryLabel: "Bebida",
    description: "Suco refrescante de frutas, servido gelado.",
    price: 9.90,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 9,
    name: "Água Mineral",
    category: "bebidas",
    categoryLabel: "Bebida",
    description: "Água mineral sem gás, 500 ml.",
    price: 4.00,
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=700&q=80"
  }
];

const cart = new Map();

const grid = document.getElementById("products-grid");
const cartPanel = document.getElementById("cart-panel");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

const money = value =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

function renderProducts(category = "todos") {
  const filtered = category === "todos"
    ? products
    : products.filter(product => product.category === category);

  grid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <img
        class="product-image"
        src="${product.image}"
        alt="${product.name}"
        loading="lazy"
        onerror="this.style.display='none'"
      >
      <div class="product-info">
        <span class="product-category">${product.categoryLabel}</span>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-bottom">
          <span class="product-price">${money(product.price)}</span>
          <button
            class="add-button"
            data-add="${product.id}"
            aria-label="Adicionar ${product.name} ao carrinho"
          >+ ADICIONAR</button>
        </div>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  const current = cart.get(id) || 0;
  cart.set(id, current + 1);
  renderCart();
}

function changeQuantity(id, amount) {
  const current = cart.get(id) || 0;
  const next = current + amount;

  if (next <= 0) {
    cart.delete(id);
  } else {
    cart.set(id, next);
  }

  renderCart();
}

function getCartCount() {
  return [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
}

function getCartTotal() {
  return [...cart.entries()].reduce((sum, [id, quantity]) => {
    const product = products.find(item => item.id === id);
    return sum + product.price * quantity;
  }, 0);
}

function renderCart() {
  const entries = [...cart.entries()];

  cartCount.textContent = getCartCount();
  cartTotal.textContent = money(getCartTotal());

  if (entries.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio.</p>';
    return;
  }

  cartItems.innerHTML = entries.map(([id, quantity]) => {
    const product = products.find(item => item.id === id);

    return `
      <div class="cart-item">
        <div>
          <h3>${product.name}</h3>
          <p>${money(product.price * quantity)}</p>
          <div class="quantity-controls">
            <button data-change="${id}" data-amount="-1"
              aria-label="Diminuir ${product.name}">−</button>
            <span>${quantity}</span>
            <button data-change="${id}" data-amount="1"
              aria-label="Aumentar ${product.name}">+</button>
          </div>
        </div>
        <button class="remove-button" data-remove="${id}">Remover</button>
      </div>
    `;
  }).join("");
}

function openCart() {
  cartPanel.classList.add("open");
  overlay.classList.add("visible");
  document.body.classList.add("cart-open");
  cartPanel.setAttribute("aria-hidden", "false");
  document.getElementById("close-cart").focus();
}

function closeCart() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("visible");
  document.body.classList.remove("cart-open");
  cartPanel.setAttribute("aria-hidden", "true");
  document.getElementById("open-cart").focus();
}

function checkoutWhatsApp() {
  if (cart.size === 0) {
    alert("Adicione pelo menos um produto ao carrinho.");
    return;
  }

  if (!/^\d{12,13}$/.test(WHATSAPP_NUMBER) ||
      WHATSAPP_NUMBER === "5511999999999") {
    alert(
      "Configure o número verdadeiro do WhatsApp no arquivo script.js, " +
      "na variável WHATSAPP_NUMBER."
    );
    return;
  }

  const lines = [...cart.entries()].map(([id, quantity]) => {
    const product = products.find(item => item.id === id);
    return `• ${product.name} x${quantity} — ${money(product.price * quantity)}`;
  });

  const message = [
    "Olá! Gostaria de fazer um pedido:",
    "",
    ...lines,
    "",
    `*Total: ${money(getCartTotal())}*`,
    "",
    "Por favor, confirme a disponibilidade e as informações de entrega."
  ].join("\n");

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

// Filtros de categorias
document.querySelector(".categories").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  document.querySelectorAll(".category").forEach(item => {
    item.classList.toggle("active", item === button);
  });

  renderProducts(button.dataset.category);
});

// Adicionar produto ao carrinho
grid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

// Alterar quantidades ou remover produtos
cartItems.addEventListener("click", event => {
  const change = event.target.closest("[data-change]");
  const remove = event.target.closest("[data-remove]");

  if (change) {
    changeQuantity(
      Number(change.dataset.change),
      Number(change.dataset.amount)
    );
  }

  if (remove) {
    cart.delete(Number(remove.dataset.remove));
    renderCart();
  }
});

// Controles do carrinho
document.getElementById("open-cart").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && cartPanel.classList.contains("open")) {
    closeCart();
  }
});

document.getElementById("checkout-button")
  .addEventListener("click", checkoutWhatsApp);

document.getElementById("year").textContent = new Date().getFullYear();

// Inicialização
renderProducts();
renderCart();
