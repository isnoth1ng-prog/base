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
