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
const overlay = document.getElementById('product-sheet-overlay');
const closeBtn = document.getElementById('sheet-close');
const btnOrder = document.getElementById('btn-order');
const tabs = document.getElementById('catalog-tabs');

let currentProduct = null;
let selectedColor = null;
let selectedSize = null;
let activeFilter = 'all';

function haptic() {
    try {
        if (navigator.vibrate) navigator.vibrate(8);
    } catch (e) {}
}

function renderCatalog(filter) {
    activeFilter = filter || 'all';
    grid.innerHTML = '';

    const list = activeFilter === 'all'
        ? products
        : products.filter(p => p.category === activeFilter);

    list.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img-box">
                <div class="img-skeleton"></div>
                <img src="${p.image}" alt="${p.title}" loading="lazy">
                <span class="card-badge">Под заказ</span>
            </div>
            <div class="product-meta">
                <div class="product-name">${p.title}</div>
                <div class="product-price">${p.price.toLocaleString('ru-RU')} ₽</div>
            </div>
        `;
        const img = card.querySelector('img');
        const sk = card.querySelector('.img-skeleton');
        img.addEventListener('load', () => {
            img.classList.add('loaded');
            if (sk) sk.remove();
        });
        if (img.complete) {
            img.classList.add('loaded');
            if (sk) sk.remove();
        }
        card.addEventListener('click', () => {
            haptic();
            card.classList.add('tapped');
            setTimeout(() => card.classList.remove('tapped'), 180);
            openSheet(p);
        });
        grid.appendChild(card);
    });
}

function openSheet(product) {
    currentProduct = product;
    selectedColor = null;
    selectedSize = null;

    document.getElementById('sheet-img').src = product.image;
    document.getElementById('sheet-title').textContent = product.title;
    document.getElementById('sheet-subtitle').textContent = product.subtitle;
    document.getElementById('sheet-price').textContent = `${product.price.toLocaleString('ru-RU')} ₽`;

    const matRow = document.getElementById('detail-material');
    if (product.material) {
        matRow.style.display = 'flex';
        document.getElementById('val-material').textContent = product.material;
    } else {
        matRow.style.display = 'none';
    }

    const fitRow = document.getElementById('detail-fit');
    if (product.fit) {
        fitRow.style.display = 'flex';
        document.getElementById('val-fit').textContent = product.fit;
    } else {
        fitRow.style.display = 'none';
    }

    const colorsBox = document.getElementById('sheet-colors');
    colorsBox.innerHTML = '';
    if (product.colors && product.colors.length > 0) {
        document.getElementById('color-section').style.display = 'block';
        product.colors.forEach(color => {
            const btn = document.createElement('button');
            btn.className = 'chip';
            btn.textContent = color;
            if (product.colors.length === 1) {
                btn.classList.add('active');
                selectedColor = color;
            }
            btn.onclick = () => {
                haptic();
                document.querySelectorAll('#sheet-colors .chip').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                selectedColor = color;
                updateCtaState();
            };
            colorsBox.appendChild(btn);
        });
    } else {
        document.getElementById('color-section').style.display = 'none';
        selectedColor = 'Standard';
    }

    const sizesBox = document.getElementById('sheet-sizes');
    sizesBox.innerHTML = '';
    if (product.sizes && product.sizes.length > 0) {
        document.getElementById('size-section').style.display = 'block';
        product.sizes.forEach(size => {
            const btn = document.createElement('button');
            btn.className = 'chip';
            btn.textContent = size;
            btn.onclick = () => {
                haptic();
                document.querySelectorAll('#sheet-sizes .chip').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                selectedSize = size;
                updateCtaState();
            };
            sizesBox.appendChild(btn);
        });
    } else {
        document.getElementById('size-section').style.display = 'none';
        selectedSize = 'Standard';
    }

    updateCtaState();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSheet() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function updateCtaState() {
    const btnText = btnOrder.querySelector('.btn-text');
    if (currentProduct.sizes && currentProduct.sizes.length > 0 && !selectedSize) {
        btnOrder.classList.add('disabled');
        btnText.textContent = 'Выберите размер';
        return;
    }
    if (currentProduct.colors && currentProduct.colors.length > 0 && !selectedColor) {
        btnOrder.classList.add('disabled');
        btnText.textContent = 'Выберите цвет';
        return;
    }
    btnOrder.classList.remove('disabled');
    btnText.textContent = 'Заказать в Telegram';
}

closeBtn.addEventListener('click', closeSheet);
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeSheet();
});

/* btnOrder wired in initCartUI */

if (tabs) {
    tabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab');
        if (!btn) return;
        haptic();
        tabs.querySelectorAll('.tab').forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });
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

/* Dynamic Island */
(function () {
    const island = document.getElementById('island');
    if (!island) return;

    const nav = document.getElementById('island-nav');
    const links = nav ? Array.from(nav.querySelectorAll('a[data-section]')) : [];
    const sections = links
        .map(a => document.getElementById(a.dataset.section))
        .filter(Boolean);

    let compact = false;
    let open = false;
    let ticking = false;

    function setCompact(on) {
        if (compact === on) return;
        compact = on;
        island.classList.toggle('island-compact', on);
        if (!on) {
            open = false;
            island.classList.remove('island-open');
        }
    }

    function setOpen(on) {
        open = on;
        island.classList.toggle('island-open', on);
    }

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            setCompact(window.scrollY > 48);
            // scroll-spy
            const y = window.scrollY + 120;
            let current = null;
            sections.forEach((sec, i) => {
                if (sec.offsetTop <= y) current = links[i];
            });
            links.forEach(a => a.classList.toggle('active', a === current));
            ticking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Tap island in compact mode to expand nav
    island.addEventListener('click', (e) => {
        if (!compact) return;
        // don't hijack real link/button clicks when already open
        if (e.target.closest('a') || e.target.closest('button')) {
            // if clicking a nav link while open, allow navigation then collapse
            if (e.target.closest('a') && open) {
                setTimeout(() => setOpen(false), 200);
            }
            return;
        }
        setOpen(!open);
        try { if (navigator.vibrate) navigator.vibrate(6); } catch (err) {}
    });

    // Click outside closes expanded compact menu
    document.addEventListener('click', (e) => {
        if (open && !island.contains(e.target)) setOpen(false);
    });

    // Escape closes
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && open) setOpen(false);
    });
})();

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
            if (cartOrder) cartOrder.classList.add('disabled');
            return;
        }
        if (cartEmpty) cartEmpty.hidden = true;
        if (cartOrder) cartOrder.classList.remove('disabled');
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
        cartSheet.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeCart() {
        if (!cartSheet) return;
        cartSheet.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (cartSheet) cartSheet.addEventListener('click', (e) => {
        if (e.target === cartSheet) closeCart();
    });

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

    // Order all from cart → personal TG
    if (cartOrder) {
        cartOrder.addEventListener('click', () => {
            if (!cart.length) return;
            const lines = [
                'Здравствуйте. Хочу оформить заказ.',
                ''
            ];
            let total = 0;
            cart.forEach((item, i) => {
                total += item.price * item.qty;
                lines.push(`${i + 1}. ${item.title}`);
                lines.push(`   Цвет: ${item.color} · Размер: ${item.size} · ${item.qty} шт`);
                lines.push(`   ${(item.price * item.qty).toLocaleString('ru-RU')} ₽`);
                lines.push('');
            });
            lines.push(`Итого: ${total.toLocaleString('ru-RU')} ₽`);
            lines.push('');
            lines.push('ФИО:');
            lines.push('Телефон:');
            lines.push('Город / ПВЗ или адрес:');
            lines.push('');
            lines.push('Готов подтвердить заказ.');
            const message = lines.join('%0A');
            window.open(`https://t.me/${TG_USERNAME}?text=${message}`, '_blank');
        });
    }

    // Expose for debugging
    window.__baseCart = () => cart;
})();

