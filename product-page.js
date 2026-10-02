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

function cartMessage(items=cart,name='',phone='',address='',postcode=''){
  const lines=['Здравствуйте! Хочу оформить заказ.',''];
  let total=0;
  items.forEach((x,i)=>{
    total+=x.price*x.qty;
    lines.push((i+1)+'. '+x.title);
    lines.push('   Цвет: '+x.color+' · Размер: '+x.size+' · '+x.qty+' шт');
    lines.push('   '+money(x.price*x.qty));
    lines.push('');
  });
  lines.push('Итого: '+money(total),'','Данные для доставки:','ФИО: '+name,'Контактный номер: '+phone,'Адрес: '+address,'Почтовый индекс: '+postcode,'','Готов подтвердить заказ.');
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

function openCart(){load();renderCart();$('cart-sheet-overlay').classList.add('active','open');document.body.style.overflow='hidden'}
function closeCart(){const s=$('cart-sheet-overlay');s.classList.remove('active','open');document.body.style.overflow='';window.dispatchEvent(new Event('base:close-cart'))}

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
  if(!product)return;
  const target=!color ? $('product-colors') : (!size ? $('product-sizes') : null);
  if(target){
    const option=target.closest('.product-option');
    option?.scrollIntoView({behavior:'smooth',block:'center'});
    target.classList.add('selection-attention');
    setTimeout(()=>target.classList.remove('selection-attention'),1200);
    return;
  }
  const item={id:product.id,title:product.title,color,size,price:product.price,image:product.image,qty:1};
  openCheckout([item]);
}

function chips(box,values,setter,autoSelectFirst=false){
  box.innerHTML='';
  (values||[]).forEach((v,i)=>{
    const b=document.createElement('button');
    b.type='button';b.className='chip'+(autoSelectFirst&&i===0?' active':'');b.textContent=v;
    b.addEventListener('click',()=>{box.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));b.classList.add('active');setter(v);vibrate()});
    box.appendChild(b);
  });
  setter(autoSelectFirst&&values&&values[0]||null);
}

function syncBuyState(){
  const buy=$('product-buy'),addBtn=$('product-add');
  const ready=!!color&&!!size;
  if(buy)buy.setAttribute('aria-disabled',ready?'false':'true');
  if(addBtn){
    addBtn.classList.toggle('disabled',!ready);
    addBtn.setAttribute('aria-disabled',ready?'false':'true');
  }
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

  chips($('product-colors'),product.colors,v=>{color=v;syncBuyState()},true);
  chips($('product-sizes'),product.sizes,v=>{size=v;syncBuyState()},true);

  load();renderCart();

  $('product-add').addEventListener('click',()=>{if(color&&size)add()});
  $('product-buy').addEventListener('click',e=>{e.preventDefault();buyNow()});

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

  $('cart-order').addEventListener('click',e=>{e.preventDefault();if(!cart.length||cart.some(x=>!x.size||!x.color))return;openCheckout(cart)});
  function openCheckout(items){
    if(!Array.isArray(items)||!items.length)return;
    const overlay=$('checkout-overlay'),form=$('checkout-form');
    if(!overlay||!form)return;
    form.dataset.items=JSON.stringify(items);
    const error=$('checkout-error');
    if(error){error.hidden=true;error.textContent=''}
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    setTimeout(()=>$('checkout-name')?.focus(),140);
  }
  function closeCheckout(){const overlay=$('checkout-overlay');if(!overlay)return;overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');document.body.style.overflow=''}
  $('checkout-close')?.addEventListener('click',closeCheckout);$('checkout-overlay')?.addEventListener('click',e=>{if(e.target.id==='checkout-overlay')closeCheckout()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCheckout()});
  $('checkout-form')?.addEventListener('submit',e=>{
    e.preventDefault();
    const name=$('checkout-name')?.value.trim(),phone=$('checkout-phone')?.value.trim(),address=$('checkout-address')?.value.trim(),postcode=$('checkout-postcode')?.value.trim(),error=$('checkout-error');
    if(!name||!phone||!address||!postcode){if(error){error.textContent='Заполни все поля, чтобы продолжить.';error.hidden=false}return}
    let items=[];try{items=JSON.parse($('checkout-form').dataset.items||'[]')}catch(_){}
    if(!items.length){if(error){error.textContent='Не удалось собрать заказ. Вернись к товару и попробуй ещё раз.';error.hidden=false}return}
    const url=telegramUrl(cartMessage(items,name,phone,address,postcode));
    const tg=window.open(url,'_blank');
    if(!tg) location.href=url;
    closeCheckout();
  });
  const themeBtn=$('theme-toggle');
  if(themeBtn)themeBtn.addEventListener('click',()=>{
    const next=document.documentElement.dataset.theme==='light'?'dark':'light';
    document.documentElement.dataset.theme=next;
    try{localStorage.setItem('base-theme',next)}catch(e){}
    vibrate();
  });
  syncBuyState();
  window.addEventListener('base:open-cart',openCart);
  window.addEventListener('storage',()=>{load();renderCart()});
  window.addEventListener('base:cart-changed',()=>{load();renderCart()});
});

