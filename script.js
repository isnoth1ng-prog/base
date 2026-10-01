const products = [
    {
        id: '1',
        title: 'BASE WIDE JEANS',
        subtitle: 'Белый · Wide fit',
        price: 3490,
        image: 'images_cards/card_pants-white.jpg',
        category: 'pants',
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
        category: 'pants',
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
        category: 'pants',
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

const TG_USERNAME = 'basewear_shop';
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

btnOrder.addEventListener('click', () => {
    if (btnOrder.classList.contains('disabled')) return;
    haptic();
    const message = `Здравствуйте! Хочу заказать:%0A%0AТовар: ${currentProduct.title}%0AЦвет: ${selectedColor}%0AРазмер: ${selectedSize}%0AЦена: ${currentProduct.price.toLocaleString('ru-RU')} ₽`;
    window.open(`https://t.me/${TG_USERNAME}?text=${message}`, '_blank');
});

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

/* Dynamic Island compact on scroll */
(function () {
    const header = document.querySelector('.glass-header');
    if (!header) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            header.classList.toggle('island-compact', window.scrollY > 40);
            ticking = false;
        });
    }, { passive: true });
})();

