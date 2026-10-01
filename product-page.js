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

let product=null,color=null,size=null,cart=[];
const $=id=>document.getElementById(id);
const money=n=>Number(n).toLocaleString('ru-RU')+' ₽';
const TG='nthngv';

function vibrate(){try{if(navigator.vibrate)navigator.vibrate(8)}catch(e){}}
function load(){try{cart=JSON.parse(localStorage.getItem('base_cart')||'[]')||[]}catch(e){cart=[]}}
function save(){try{localStorage.setItem('base_cart',JSON.stringify(cart))}catch(e){}}
function key(x){return x.id+'|'+x.color+'|'+x.size}

function telegramUrl(message){
  return 'https://t.me/'+TG+'?text='+encodeURIComponent(message);
}

function cartMessage(items=cart){
  const lines=['Здравствуйте! Хочу оформить заказ.',''];
  let total=0;
  items.forEach((x,i)=>{
    total+=x.price*x.qty;
    lines.push((i+1)+'. '+x.title);
    lines.push('   Цвет: '+x.color+' · Размер: '+x.size+' · '+x.qty+' шт');
    lines.push('   '+money(x.price*x.qty));
    lines.push('');
  });
  lines.push('Итого: '+money(total),'','ФИО:','Телефон:','Город / ПВЗ или адрес:','','Готов подтвердить заказ.');
  return lines.join('\n');
}

function renderCart(){
  const items=$('cart-items'),empty=$('cart-empty'),order=$('cart-order'),count=$('cart-count');
  const qty=cart.reduce((n,x)=>n+Number(x.qty||0),0);
  if(count){count.textContent=qty;count.hidden=qty===0}
  if(!items)return;
  empty.hidden=cart.length>0;
  order.classList.toggle('disabled',cart.length===0);
  order.setAttribute('aria-disabled',cart.length===0?'true':'false');
  items.innerHTML=cart.map((x,i)=>`
    <div class="cart-row">
      <img src="${x.image}" alt="${x.title}">
      <div class="cart-row-info">
        <div class="cart-row-title">${x.title}</div>
        <div class="cart-row-meta">${x.color} · ${x.size}</div>
        <div class="cart-row-price">${money(x.price*x.qty)}</div>
        <div class="cart-qty">
          <button type="button" data-action="minus" data-i="${i}" aria-label="Уменьшить">−</button>
          <span>${x.qty}</span>
          <button type="button" data-action="plus" data-i="${i}" aria-label="Увеличить">+</button>
        </div>
      </div>
      <button class="cart-remove" data-action="remove" data-i="${i}" type="button" aria-label="Удалить">×</button>
    </div>`).join('');
}

function openCart(){renderCart();$('cart-sheet-overlay').classList.add('active');document.body.style.overflow='hidden'}
function closeCart(){const s=$('cart-sheet-overlay');s.classList.remove('active','open');document.body.style.overflow=''}

function add(){
  if(!product||!color||!size)return;
  const x={id:product.id,title:product.title,color,size,price:product.price,image:product.image,qty:1};
  const old=cart.find(y=>key(y)===key(x));
  if(old)old.qty++;else cart.push(x);
  save();renderCart();window.dispatchEvent(new Event('base:cart-changed'));vibrate();
  const b=$('product-add');b.textContent='Добавлено';b.classList.add('added');
  setTimeout(()=>{b.textContent='В корзину';b.classList.remove('added')},1000);
}

function buyNow(){
  if(!product||!color||!size)return;
  const item={id:product.id,title:product.title,color,size,price:product.price,image:product.image,qty:1};
  window.open(telegramUrl(cartMessage([item])),'_blank','noopener,noreferrer');
}

function chips(box,values,setter){
  box.innerHTML='';
  (values||[]).forEach((v,i)=>{
    const b=document.createElement('button');
    b.type='button';b.className='chip'+(i===0?' active':'');b.textContent=v;
    b.addEventListener('click',()=>{box.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));b.classList.add('active');setter(v);vibrate()});
    box.appendChild(b);
  });
  setter(values&&values[0]||null);
}

function syncBuyState(){
  const buy=$('product-buy'),addBtn=$('product-add');
  const ready=!!color&&!!size;
  [buy,addBtn].forEach(b=>{if(!b)return;b.classList.toggle('disabled',!ready);b.setAttribute('aria-disabled',ready?'false':'true')});
}

document.addEventListener('DOMContentLoaded',()=>{
  const id=new URLSearchParams(location.search).get('id');
  product=PRODUCTS.find(x=>x.id===id)||PRODUCTS[0];

  $('product-image').src=product.image;
  $('product-image').alt=product.title;
  $('product-title').textContent=product.title;
  $('product-subtitle').textContent=product.subtitle;
  $('product-price').textContent=money(product.price);
  $('product-material').textContent=product.material;
  $('product-fit').textContent=product.fit;

  chips($('product-colors'),product.colors,v=>{color=v;syncBuyState()});
  chips($('product-sizes'),product.sizes,v=>{size=v;syncBuyState()});

  load();renderCart();

  $('product-add').addEventListener('click',()=>{if(color&&size)add()});
  $('product-buy').addEventListener('click',e=>{e.preventDefault();if(color&&size)buyNow()});

  $('cart-btn').addEventListener('click',openCart);
  $('cart-close').addEventListener('click',closeCart);
  $('cart-sheet-overlay').addEventListener('click',e=>{if(e.target.id==='cart-sheet-overlay')closeCart()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCart()});

  $('cart-items').addEventListener('click',e=>{
    const b=e.target.closest('[data-action]');
    if(!b)return;
    const i=Number(b.dataset.i),action=b.dataset.action,item=cart[i];
    if(!item)return;
    if(action==='plus')item.qty++;
    if(action==='minus'){item.qty--;if(item.qty<=0)cart.splice(i,1)}
    if(action==='remove')cart.splice(i,1);
    save();renderCart();window.dispatchEvent(new Event('base:cart-changed'));vibrate();
  });

  $('cart-order').addEventListener('click',e=>{
    if(!cart.length){e.preventDefault();return}
    e.preventDefault();
    window.open(telegramUrl(cartMessage()),'_blank','noopener,noreferrer');
  });

  const themeBtn=$('theme-toggle');
  if(themeBtn)themeBtn.addEventListener('click',()=>{
    const next=document.documentElement.dataset.theme==='light'?'dark':'light';
    document.documentElement.dataset.theme=next;
    try{localStorage.setItem('base-theme',next)}catch(e){}
    vibrate();
  });
  syncBuyState();
});

window.addEventListener('base:open-cart',()=>openCart());
