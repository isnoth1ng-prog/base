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

let product=null,color=null,size=null;
const $=id=>document.getElementById(id);
const money=n=>Number(n).toLocaleString('ru-RU')+' ₽';
const TG='nthngv';

function vibrate(){try{navigator.vibrate?.(8)}catch(e){}}
function islandStatus(label,duration=1200){window.BASEIsland?.status(label,duration)}
function telegramUrl(message){return 'https://t.me/'+TG+'?text='+encodeURIComponent(message)}

function openCheckout(item){
  if(!item)return;
  islandStatus('ORDER',1600);
  const overlay=$('checkout-overlay'),form=$('checkout-form');
  if(!overlay||!form)return;
  form.dataset.item=JSON.stringify(item);
  const error=$('checkout-error');
  if(error){error.hidden=true;error.textContent=''}
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  setTimeout(()=>$('checkout-name')?.focus(),140);
}

function closeCheckout(){
  const overlay=$('checkout-overlay');
  if(!overlay)return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}

function buyNow(){
  if(!product)return;
  const target=!color ? $('product-colors') : (!size ? $('product-sizes') : null);
  if(target){
    islandStatus('SIZE',1000);
    target.closest('.product-option')?.scrollIntoView({behavior:'smooth',block:'center'});
    target.classList.add('selection-attention');
    setTimeout(()=>target.classList.remove('selection-attention'),1200);
    return;
  }
  openCheckout({id:product.id,title:product.title,color,size,price:product.price,qty:1});
}

function chips(box,values,setter,autoSelectFirst=false){
  box.innerHTML='';
  (values||[]).forEach((v,i)=>{
    const b=document.createElement('button');
    b.type='button';
    b.className='chip'+(autoSelectFirst&&i===0?' active':'');
    b.textContent=v;
    b.addEventListener('click',()=>{
      box.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      setter(v);
      islandStatus('SIZE '+v,900);
      vibrate();
    });
    box.appendChild(b);
  });
  setter(autoSelectFirst&&values?.[0]||null);
}

function syncBuyState(){
  const buy=$('product-buy');
  if(buy)buy.setAttribute('aria-disabled',color&&size?'false':'true');
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
  chips($('product-sizes'),product.sizes,v=>{size=v;syncBuyState()});

  $('product-buy').addEventListener('click',e=>{e.preventDefault();buyNow()});
  $('checkout-close')?.addEventListener('click',closeCheckout);
  $('checkout-overlay')?.addEventListener('click',e=>{if(e.target.id==='checkout-overlay')closeCheckout()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCheckout()});

  $('checkout-form')?.addEventListener('submit',e=>{
    e.preventDefault();
    const name=$('checkout-name')?.value.trim();
    const phone=$('checkout-phone')?.value.trim();
    const address=$('checkout-address')?.value.trim();
    const postcode=$('checkout-postcode')?.value.trim();
    const error=$('checkout-error');
    if(!name||!phone||!address||!postcode){
      islandStatus('CHECK',900);
      if(error){error.textContent='Заполни все поля, чтобы продолжить.';error.hidden=false}
      return;
    }
    let item=null;
    try{item=JSON.parse($('checkout-form').dataset.item||'null')}catch(_){}
    if(!item){
      if(error){error.textContent='Не удалось собрать заказ. Вернись к товару и попробуй ещё раз.';error.hidden=false}
      return;
    }
    const lines=[
      'Здравствуйте! Хочу оформить заказ.','',
      '1. '+item.title,
      '   Цвет: '+item.color+' · Размер: '+item.size+' · 1 шт',
      '   '+money(item.price),'',
      'Итого: '+money(item.price),'',
      'Данные для доставки:',
      'ФИО: '+name,
      'Контактный номер: '+phone,
      'Адрес: '+address,
      'Почтовый индекс: '+postcode,'',
      'Готов подтвердить заказ.'
    ];
    const url=telegramUrl(lines.join('\n'));
    islandStatus('READY ✓',1500);
    const submit=$('checkout-form')?.querySelector('.checkout-submit');
    if(submit){submit.disabled=true;submit.textContent='Открываем Telegram…';submit.style.opacity='.72'}
    setTimeout(()=>{
      const tg=window.open(url,'_blank','noopener,noreferrer');
      if(!tg)location.href=url;
      closeCheckout();
      if(submit){submit.disabled=false;submit.textContent='Продолжить в Telegram';submit.style.opacity=''}
    },280);
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