const products = [
  {id:1,name:'Velvet Lips',category:'labios',categoryName:'Lábios',description:'Batom cremoso com acabamento aveludado.',price:39.90,badge:'Mais amado',rating:'★★★★★',image:'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=85'},
  {id:2,name:'Skin Perfect',category:'rosto',categoryName:'Rosto',description:'Base leve para uma pele com viço natural.',price:68.90,badge:'Novidade',rating:'★★★★★',image:'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=700&q=85'},
  {id:3,name:'Rose Blush',category:'rosto',categoryName:'Rosto',description:'Blush suave para aquele ar coradinho.',price:42.50,badge:'Favorito',rating:'★★★★★',image:'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=700&q=85'},
  {id:4,name:'Glow Palette',category:'olhos',categoryName:'Olhos',description:'Tons versáteis para looks delicados ou intensos.',price:79.90,badge:'Edição especial',rating:'★★★★★',image:'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=85'},
  {id:5,name:'Gloss Rosé',category:'labios',categoryName:'Lábios',description:'Brilho confortável com um toque de cor.',price:34.90,badge:'Queridinho',rating:'★★★★★',image:'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=85'},
  {id:6,name:'Lash Drama',category:'olhos',categoryName:'Olhos',description:'Máscara para cílios com efeito de destaque.',price:45.90,badge:'Essencial',rating:'★★★★★',image:'https://images.unsplash.com/photo-1631214540242-9e3a1b7a3b68?auto=format&fit=crop&w=700&q=85'},
  {id:7,name:'Soft Powder',category:'rosto',categoryName:'Rosto',description:'Pó facial para finalizar a maquiagem.',price:49.90,badge:'Uso diário',rating:'★★★★★',image:'https://images.unsplash.com/photo-1599733589046-833c3b4b4a80?auto=format&fit=crop&w=700&q=85'},
  {id:8,name:'Brow Define',category:'olhos',categoryName:'Olhos',description:'Definição prática para sobrancelhas marcantes.',price:29.90,badge:'Praticidade',rating:'★★★★★',image:'https://images.unsplash.com/photo-1583241800698-e8ab01830a80?auto=format&fit=crop&w=700&q=85'}
];

const productGrid = document.querySelector('#productGrid');
const emptyMessage = document.querySelector('#emptyMessage');
const searchInput = document.querySelector('#productSearch');
const filterButtons = [...document.querySelectorAll('.filter-chip')];
const showAllButton = document.querySelector('#showAllProducts');
const cartDrawer = document.querySelector('#cartDrawer');
const cartOverlay = document.querySelector('#cartOverlay');
const cartItemsElement = document.querySelector('#cartItems');
const cartCountElement = document.querySelector('#cartCount');
const cartTotalElement = document.querySelector('#cartTotal');
const toast = document.querySelector('#toast');
let activeFilter = 'todos';
let cart = [];
let toastTimeout;

const currency = value => value.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});

function renderProducts() {
  const searchTerm = searchInput.value.trim().toLocaleLowerCase('pt-BR');
  const filtered = products.filter(product => {
    const matchesCategory = activeFilter === 'todos' || product.category === activeFilter;
    const matchesSearch = `${product.name} ${product.categoryName} ${product.description}`.toLocaleLowerCase('pt-BR').includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  productGrid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img class="product-image" src="${product.image}" alt="Produto de maquiagem ${product.name}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/700x800/f2e5e3/85334f?text=Bella+Glow'">
        <span class="product-badge">${product.badge}</span>
        <button class="quick-add" data-add="${product.id}" aria-label="Adicionar ${product.name} à sacola">+ Adicionar à sacola</button>
      </div>
      <div class="product-info">
        <p class="product-category">${product.categoryName}</p>
        <h3>${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <span class="product-price">${currency(product.price)}</span><span class="product-rating" aria-label="Avaliação demonstrativa de cinco estrelas">${product.rating}</span>
      </div>
    </article>
  `).join('');
  emptyMessage.hidden = filtered.length > 0;
  productGrid.hidden = filtered.length === 0;
  showAllButton.hidden = activeFilter === 'todos' && searchTerm === '';
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2500);
}

function addToCart(productId) {
  const product = products.find(item => item.id === productId);
  if (!product) return;
  const existing = cart.find(item => item.id === productId);
  if (existing) existing.quantity += 1;
  else cart.push({...product, quantity:1});
  renderCart();
  showToast(`${product.name} foi adicionado à sacola!`);
}

function updateQuantity(productId, change) {
  const item = cart.find(product => product.id === productId);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) cart = cart.filter(product => product.id !== productId);
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(product => product.id !== productId);
  renderCart();
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCountElement.textContent = count;
  cartTotalElement.textContent = currency(total);
  if (cart.length === 0) {
    cartItemsElement.innerHTML = '<p class="cart-empty">Sua sacola está vazia. Que tal escolher um favorito? ✨</p>';
    return;
  }
  cartItemsElement.innerHTML = cart.map(item => `
    <article class="cart-item">
      <img src="${item.image}" alt="" onerror="this.onerror=null;this.src='https://placehold.co/150x170/f2e5e3/85334f?text=BG'">
      <div><h3>${item.name}</h3><p>${currency(item.price)}</p>
        <div class="quantity-controls" aria-label="Quantidade de ${item.name}">
          <button data-quantity="${item.id}" data-change="-1" aria-label="Diminuir quantidade">−</button><span>${item.quantity}</span><button data-quantity="${item.id}" data-change="1" aria-label="Aumentar quantidade">+</button>
        </div>
      </div>
      <button class="remove-item" data-remove="${item.id}">Remover</button>
    </article>
  `).join('');
}

function openCart() {
  cartOverlay.hidden = false;
  requestAnimationFrame(() => cartDrawer.classList.add('open'));
  cartDrawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  document.querySelector('#closeCart').focus();
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  cartOverlay.hidden = true;
  document.body.classList.remove('no-scroll');
}

filterButtons.forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  filterButtons.forEach(item => item.classList.toggle('active', item === button));
  renderProducts();
}));
searchInput.addEventListener('input', renderProducts);
showAllButton.addEventListener('click', () => {
  activeFilter = 'todos';
  searchInput.value = '';
  filterButtons.forEach(button => button.classList.toggle('active', button.dataset.filter === 'todos'));
  renderProducts();
});
productGrid.addEventListener('click', event => {
  const button = event.target.closest('[data-add]');
  if (button) addToCart(Number(button.dataset.add));
});
document.querySelector('#openCart').addEventListener('click', openCart);
document.querySelector('#closeCart').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
cartItemsElement.addEventListener('click', event => {
  const quantityButton = event.target.closest('[data-quantity]');
  const removeButton = event.target.closest('[data-remove]');
  if (quantityButton) updateQuantity(Number(quantityButton.dataset.quantity), Number(quantityButton.dataset.change));
  if (removeButton) removeFromCart(Number(removeButton.dataset.remove));
});
document.querySelector('#checkoutButton').addEventListener('click', () => {
  if (cart.length === 0) {
    showToast('Sua sacola está vazia. Adicione um produto primeiro.');
    return;
  }
  showToast('Este é um portfólio demonstrativo: o pedido não foi enviado.');
});

document.querySelector('#newsletterForm').addEventListener('submit', event => {
  event.preventDefault();
  const emailInput = document.querySelector('#emailInput');
  const message = document.querySelector('#newsletterMessage');
  if (!emailInput.checkValidity()) {
    emailInput.reportValidity();
    return;
  }
  message.textContent = 'Obrigada! Seu cadastro demonstrativo foi registrado nesta página. ♡';
  emailInput.value = '';
});

const menuToggle = document.querySelector('#menuToggle');
const mainNav = document.querySelector('#mainNav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && cartDrawer.classList.contains('open')) closeCart();
});
document.querySelector('#year').textContent = new Date().getFullYear();
renderProducts();
renderCart();
