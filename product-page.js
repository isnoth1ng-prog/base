const PRODUCTS=[
{id:'1',title:'BASE WIDE JEANS',subtitle:'Белый · Wide fit',price:3490,image:'images_cards/card_pants-white.jpg',material:'100% Хлопок (Деним)',fit:'Wide / Relaxed',colors:['White'],sizes:['S','M','L','XL']},
{id:'2',title:'WIDE CARGO PANTS',subtitle:'Бежевый · Relaxed fit',price:3290,image:'images_cards/card_pants-beige.jpg',material:'Хлопок / Полиэстер',fit:'Relaxed',colors:['Beige'],sizes:['S','M','L','XL']},
{id:'3',title:'ESSENTIAL ZIP HOODIE',subtitle:'Черный · Regular fit',price:2990,image:'images_cards/card_hoodie-black.jpg',material:'80% Хлопок, 20% Полиэстер',fit:'Regular',colors:['Black'],sizes:['M','L','XL','XXL']},
{id:'4',title:'OVERSIZE SWEATPANTS',subtitle:'Серый меланж · Oversize',price:2490,image:'images_cards/card_sweatpants-grey.jpg',material:'Хлопок (Футер 3-х нитка)',fit:'Oversize',colors:['Grey'],sizes:['S','M','L']},
{id:'5',title:'REVERSIBLE ZIP HOODIE',subtitle:'Черно-бордовый · Regular',price:3190,image:'images_cards/card_hoodie-redblack.jpg',material:'Хлопок, Флис',fit:'Regular',colors:['Black/Red'],sizes:['M','L','XL']},
{id:'6',title:'VINTAGE WIDE JEANS',subtitle:'Голубой · Wide fit',price:3490,image:'images_cards/card_jeans-blue.jpg',material:'100% Хлопок (Деним)',fit:'Wide',colors:['Vintage Blue'],sizes:['S','M','L','XL']},
{id:'7',title:'BASE WIDE JEANS',subtitle:'Черный · Wide fit',price:3490,image:'images_cards/card_jeans-black.jpg',material:'100% Хлопок (Деним)',fit:'Wide',colors:['Black'],sizes:['S','M','L','XL']},
{id:'8',title:'LSD GRAPHIC HOODIE',subtitle:'Черный · Oversize',price:3190,image:'images_cards/card_hoodie-lsd.jpg',material:'80% Хлопок, 20% Полиэстер',fit:'Oversize',colors:['Black'],sizes:['M','L','XL']},
{id:'9',title:'WIDE SWEATPANTS',subtitle:'Черный · Wide fit',price:2490,image:'images_cards/card_sweatpants-black.jpg',material:'Хлопок (Футер 3-х нитка)',fit:'Wide / Oversize',colors:['Black'],sizes:['S','M','L','XL']}
];
let product,color,size,cart=[];
const $=id=>document.getElementById(id),money=n=>n.toLocaleString('ru-RU')+' ₽';
function vibrate(){try{navigator.vibrate&&navigator.vibrate(8)}catch(e){}}
function load(){try{cart=JSON.parse(localStorage.getItem('base_cart')||'[]')||[]}catch(e){cart=[]}}
function save(){try{localStorage.setItem('base_cart',JSON.stringify(cart))}catch(e){}}
function key(x){return x.id+'|'+x.color+'|'+x.size}
function renderCart(){const items=$('cart-items'),empty=$('cart-empty'),order=$('cart-order'),count=$('cart-count');const qty=cart.reduce((n,x)=>n+x.qty,0);if(count){count.textContent=qty;count.hidden=!qty}if(!items)return;empty.hidden=!!cart.length;order.classList.toggle('disabled',!cart.length);items.innerHTML=cart.map((x,i)=>'<div class="cart-row"><img src="'+x.image+'" alt=""><div class="cart-row-info"><div class="cart-row-title">'+x.title+'</div><div class="cart-row-meta">'+x.color+' · '+x.size+' · '+x.qty+' шт</div><div class="cart-row-price">'+money(x.price*x.qty)+'</div></div><button class="cart-remove" data-i="'+i+'" type="button">×</button></div>').join('')}
function openCart(){$('cart-sheet-overlay').classList.add('active');document.body.style.overflow='hidden';renderCart()}
function closeCart(){$('cart-sheet-overlay').classList.remove('active');document.body.style.overflow=''}
function add(){const x={id:product.id,title:product.title,color,size,price:product.price,image:product.image,qty:1};const old=cart.find(y=>key(y)===key(x));old?old.qty++:cart.push(x);save();renderCart();vibrate();$('product-add').textContent='Добавлено в корзину';setTimeout(()=>$('product-add').textContent='В корзину',1000)}
function chips(box,values,set){box.innerHTML=values.map((v,i)=>'<button type="button" class="chip '+(i?'':'active')+'" data-v="'+v+'">'+v+'</button>').join('');set(values[0]||null);box.querySelectorAll('.chip').forEach(b=>b.addEventListener('click',()=>{box.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));b.classList.add('active');set(b.dataset.v);vibrate()}))}
document.addEventListener('DOMContentLoaded',()=>{
const id=new URLSearchParams(location.search).get('id');product=PRODUCTS.find(x=>x.id===id)||PRODUCTS[0];
$('product-image').src=product.image;$('product-image').alt=product.title;$('product-title').textContent=product.title;$('product-subtitle').textContent=product.subtitle;$('product-price').textContent=money(product.price);$('product-material').textContent=product.material;$('product-fit').textContent=product.fit;
chips($('product-colors'),product.colors,v=>color=v);chips($('product-sizes'),product.sizes,v=>size=v);
$('product-add').addEventListener('click',add);load();renderCart();
$('cart-btn').addEventListener('click',openCart);$('cart-close').addEventListener('click',closeCart);$('cart-sheet-overlay').addEventListener('click',e=>{if(e.target.id==='cart-sheet-overlay')closeCart()});
$('cart-items').addEventListener('click',e=>{const b=e.target.closest('.cart-remove');if(!b)return;cart.splice(+b.dataset.i,1);save();renderCart();vibrate()});
});
