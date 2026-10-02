const products = [
    {
        id: '1',
        title: 'BASE WIDE JEANS',
        subtitle: 'Белый · Wide fit',
        price: 3490,
        image: 'images_cards/card_pants-white.jpg',
        category: 'jeans',
        material: '100% Хлопок (Деним)',
        fit: 'Wide / Relaxed',
        colors: ['White'],
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: '2',
        title: 'WIDE CARGO PANTS',
        subtitle: 'Бежевый · Relaxed fit',
        price: 3290,
        image: 'images_cards/card_pants-beige.jpg',
        category: 'pants',
        material: 'Хлопок / Полиэстер',
        fit: 'Relaxed',
        colors: ['Beige'],
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: '3',
        title: 'ESSENTIAL ZIP HOODIE',
        subtitle: 'Черный · Regular fit',
        price: 2990,
        image: 'images_cards/card_hoodie-black.jpg',
        category: 'hoodie',
        material: '80% Хлопок, 20% Полиэстер',
        fit: 'Regular',
        colors: ['Black'],
        sizes: ['M', 'L', 'XL', 'XXL']
    },
    {
        id: '4',
        title: 'OVERSIZE SWEATPANTS',
        subtitle: 'Серый меланж · Oversize',
        price: 2490,
        image: 'images_cards/card_sweatpants-grey.jpg',
        category: 'pants',
        material: 'Хлопок (Футер 3-х нитка)',
        fit: 'Oversize',
        colors: ['Grey'],
        sizes: ['S', 'M', 'L']
    },
    {
        id: '5',
        title: 'REVERSIBLE ZIP HOODIE',
        subtitle: 'Черно-бордовый · Regular',
        price: 3190,
        image: 'images_cards/card_hoodie-redblack.jpg',
        category: 'hoodie',
        material: 'Хлопок, Флис',
        fit: 'Regular',
        colors: ['Black/Red'],
        sizes: ['M', 'L', 'XL']
    },
    {
        id: '6',
        title: 'VINTAGE WIDE JEANS',
        subtitle: 'Голубой · Wide fit',
        price: 3490,
        image: 'images_cards/card_jeans-blue.jpg',
        category: 'jeans',
        material: '100% Хлопок (Деним)',
        fit: 'Wide',
        colors: ['Vintage Blue'],
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: '7',
        title: 'BASE WIDE JEANS',
        subtitle: 'Черный · Wide fit',
        price: 3490,
        image: 'images_cards/card_jeans-black.jpg',
        category: 'jeans',
        material: '100% Хлопок (Деним)',
        fit: 'Wide',
        colors: ['Black'],
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: '8',
        title: 'LSD GRAPHIC HOODIE',
        subtitle: 'Черный · Oversize',
        price: 3190,
        image: 'images_cards/card_hoodie-lsd.jpg',
        category: 'hoodie',
        material: '80% Хлопок, 20% Полиэстер',
        fit: 'Oversize',
        colors: ['Black'],
        sizes: ['M', 'L', 'XL']
    },
    {
        id: '9',
        title: 'WIDE SWEATPANTS',
        subtitle: 'Черный · Wide fit',
        price: 2490,
        image: 'images_cards/card_sweatpants-black.jpg',
        category: 'pants',
        material: 'Хлопок (Футер 3-х нитка)',
        fit: 'Wide / Oversize',
        colors: ['Black'],
        sizes: ['S', 'M', 'L', 'XL']
    }
];

const TG_USERNAME = 'nthngv';
const CHANNEL_URL = 'https://t.me/basewear_shop';

let cart = [];

const grid = document.getElementById('products-grid');
const tabs = document.getElementById('catalog-tabs');
let activeFilter = 'all';

function haptic() {
    try { if (navigator.vibrate) navigator.vibrate(8); } catch (e) {}
}

function renderCatalog(filter) {
    activeFilter = filter || 'all';
    if (!grid) return;
    grid.innerHTML = '';
    const list = activeFilter === 'all' ? products : products.filter(p => p.category === activeFilter);

    list.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `<div class="product-img-box"><div class="img-skeleton"></div><img src="${p.image}" alt="${p.title}" loading="lazy"><span class="card-badge">Под заказ</span></div><div class="product-meta"><div class="product-name">${p.title}</div><div class="product-price">${p.price.toLocaleString('ru-RU')} ₽</div></div>`;
        const img = card.querySelector('img');
        const sk = card.querySelector('.img-skeleton');
        img.addEventListener('load', () => { img.classList.add('loaded'); if (sk) sk.remove(); });
        if (img.complete) { img.classList.add('loaded'); if (sk) sk.remove(); }
        card.addEventListener('click', () => {
            haptic();
            card.classList.add('tapped');
            setTimeout(() => card.classList.remove('tapped'), 180);
            location.href = 'product.html?id=' + encodeURIComponent(p.id);
        });
        grid.appendChild(card);
    });
}

if (tabs) {
    tabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab');
        if (!btn) return;
        haptic();
        tabs.querySelectorAll('.tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        renderCatalog(btn.dataset.filter);
    });
}

document.addEventListener('DOMContentLoaded', () => renderCatalog('all'));

const themeToggle = document.getElementById('theme-toggle');
function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('base-theme', theme); } catch (e) {}
    if (themeToggle) {
        const isLight = theme === 'light';
        themeToggle.setAttribute('aria-label', isLight ? 'Включить тёмную тему' : 'Включить светлую тему');
        themeToggle.setAttribute('title', isLight ? 'Тёмная тема' : 'Светлая тема');
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.content = isLight ? '#f4f4f2' : '#09090b';
    }
}
if (themeToggle) {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
    themeToggle.addEventListener('click', () => {
        haptic();
        setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
    });
}

/* Cart + order via @nthngv */
(function () {
    const cartBtn = document.getElementById('cart-btn');
    const cartCount = document.getElementById('cart-count');
    const cartSheet = document.getElementById('cart-sheet-overlay');
    const cartClose = document.getElementById('cart-close');
    const cartItems = document.getElementById('cart-items');
    const cartOrder = document.getElementById('cart-order');
    const cartEmpty = document.getElementById('cart-empty');

    function saveCart() {
        try { localStorage.setItem('base_cart', JSON.stringify(cart)); } catch (e) {}
    }
    function loadCart() {
        try {
            const raw = localStorage.getItem('base_cart');
            if (raw) cart = JSON.parse(raw) || [];
        } catch (e) { cart = []; }
    }
    function cartKey(item) {
        return item.id + '|' + item.color + '|' + item.size;
    }
    function updateCartUI() {
        const n = cart.reduce((s, i) => s + i.qty, 0);
        if (cartCount) {
            cartCount.textContent = n;
            cartCount.hidden = n === 0;
        }
        if (cartBtn) cartBtn.classList.toggle('has-items', n > 0);
        if (!cartItems) return;
        if (cart.length === 0) {
            cartItems.innerHTML = '';
            if (cartEmpty) cartEmpty.hidden = false;
            if (cartOrder) {
                cartOrder.classList.add('disabled');
                cartOrder.setAttribute('aria-disabled', 'true');
            }
            return;
        }
        if (cartEmpty) cartEmpty.hidden = true;
        if (cartOrder) {
            cartOrder.classList.remove('disabled');
            cartOrder.setAttribute('aria-disabled', 'false');
        }
        // A cart containing a product is always actionable. The checkout form
        // will handle any missing item data instead of silently disabling the button.
        if (cartOrder) {
            cartOrder.classList.remove('disabled');
            cartOrder.setAttribute('aria-disabled', 'false');
        }
        cartItems.innerHTML = cart.map((item, idx) => `
            <div class="cart-row" data-idx="${idx}">
                <img src="${item.image}" alt="">
                <div class="cart-row-info">
                    <div class="cart-row-title">${item.title}</div>
                    <div class="cart-row-meta">${item.color} · ${item.size}</div>
                    <div class="cart-row-price">${(item.price * item.qty).toLocaleString('ru-RU')} ₽</div>
                    <div class="cart-qty">
                        <button type="button" data-action="minus" data-idx="${idx}" aria-label="Уменьшить">−</button>
                        <span>${item.qty}</span>
                        <button type="button" data-action="plus" data-idx="${idx}" aria-label="Увеличить">+</button>
                    </div>
                </div>
                <button type="button" class="cart-remove" data-action="remove" data-idx="${idx}" aria-label="Удалить">×</button>
            </div>
        `).join('');
    }

    loadCart();
    updateCartUI();

    function addCurrentToCart() {
        if (!currentProduct || !selectedColor || !selectedSize) return;
        const entry = {
            id: currentProduct.id,
            title: currentProduct.title,
            color: selectedColor,
            size: selectedSize,
            price: currentProduct.price,
            image: currentProduct.image,
            qty: 1
        };
        const key = cartKey(entry);
        const existing = cart.find(i => cartKey(i) === key);
        if (existing) existing.qty += 1;
        else cart.push(entry);
        saveCart();
        updateCartUI();
        haptic();
        // brief feedback on button
        if (btnOrder) {
            const prev = btnOrder.textContent;
            btnOrder.textContent = 'Добавлено';
            setTimeout(() => { btnOrder.textContent = 'В корзину'; }, 900);
        }
    }

    function openCart() {
        if (!cartSheet) return;
        updateCartUI();
        cartSheet.classList.add('open','active');
        document.body.style.overflow = 'hidden';
    }
    function closeCart() {
        if (!cartSheet) return;
        cartSheet.classList.remove('open','active');
        document.body.style.overflow = '';
    }

    if (cartBtn) cartBtn.addEventListener('click', openCart);
    window.addEventListener('base:open-cart', openCart);
    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (cartSheet) cartSheet.addEventListener('click', (e) => {
        if (e.target === cartSheet) closeCart();
    });

    // Keep the island and the real cart sheet on the same open/close state.
    window.addEventListener('base:close-cart', closeCart);

    if (cartItems) cartItems.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        const idx = +btn.dataset.idx;
        const item = cart[idx];
        if (!item) return;
        if (btn.dataset.action === 'plus') item.qty += 1;
        if (btn.dataset.action === 'minus') { item.qty -= 1; if (item.qty <= 0) cart.splice(idx, 1); }
        if (btn.dataset.action === 'remove') cart.splice(idx, 1);
        saveCart();
        updateCartUI();
        haptic();
    });

    // Product sheet primary button = add to cart
    if (btnOrder) {
        btnOrder.addEventListener('click', () => {
            if (btnOrder.classList.contains('disabled')) return;
            addCurrentToCart();
        });
    }

    function openCheckout(items){if(!items||!items.length||items.some(item=>!item.size||!item.color))return;const overlay=document.getElementById('checkout-overlay'),form=document.getElementById('checkout-form');if(!overlay||!form)return;form.dataset.items=JSON.stringify(items);overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';setTimeout(()=>document.getElementById('checkout-name')?.focus(),120)}
    function closeCheckout(){const overlay=document.getElementById('checkout-overlay');if(!overlay)return;overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');document.body.style.overflow=''}
    document.getElementById('checkout-close')?.addEventListener('click',closeCheckout);
    document.getElementById('checkout-overlay')?.addEventListener('click',e=>{if(e.target.id==='checkout-overlay')closeCheckout()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCheckout()});
    document.getElementById('checkout-form')?.addEventListener('submit',e=>{e.preventDefault();const name=document.getElementById('checkout-name')?.value.trim(),phone=document.getElementById('checkout-phone')?.value.trim(),address=document.getElementById('checkout-address')?.value.trim(),postcode=document.getElementById('checkout-postcode')?.value.trim(),error=document.getElementById('checkout-error');if(!name||!phone||!address||!postcode){if(error){error.textContent='Заполни все поля, чтобы продолжить.';error.hidden=false}return}let items=[];try{items=JSON.parse(document.getElementById('checkout-form').dataset.items||'[]')}catch(_){}if(!items.length)return;let total=0;const lines=['Здравствуйте! Хочу оформить заказ.',''];items.forEach((item,i)=>{total+=Number(item.price)*Number(item.qty);lines.push((i+1)+'. '+item.title,'   Цвет: '+item.color+' · Размер: '+item.size+' · '+item.qty+' шт','   '+Number(item.price*item.qty).toLocaleString('ru-RU')+' ₽','')});lines.push('Итого: '+total.toLocaleString('ru-RU')+' ₽','','Данные для доставки:','ФИО: '+name,'Контактный номер: '+phone,'Адрес: '+address,'Почтовый индекс: '+postcode,'','Готов подтвердить заказ.');const url='https://t.me/nthngv?text='+encodeURIComponent(lines.join('\\n'));const tg=window.open(url,'_blank','noopener,noreferrer');if(!tg)location.href=url;closeCheckout()});
    if (cartOrder) {
        cartOrder.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!cart.length) return;
            openCheckout(cart);
        });
    }
    // Expose for debugging
    window.__baseCart = () => cart;
})();

