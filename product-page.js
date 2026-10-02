const PRODUCTS=[
{id:'1',title:'C-01',subtitle:'Белый · Wide fit',price:2990,image:'images_cards/IMG_1853.jpeg',material:'100% Хлопок (Деним)',fit:'Wide / Relaxed',colors:['White','Black','Blue'],colorImages:{White:'images_cards/IMG_1853.jpeg',Black:'images_cards/IMG_1852.jpeg',Blue:'images_cards/IMG_1851.jpeg'},sizes:['S','M','L','XL','2XL','3XL']},
{id:'2',title:'P-01',subtitle:'Хаки · Relaxed fit',price:2990,image:'images_cards/card_pants-beige.jpg',material:'Хлопок / Полиэстер',fit:'Relaxed',colors:['Khaki'],sizes:['30','32','34','36','38','40']},
{id:'3',title:'Z-01',subtitle:'Черный · Regular fit',price:2990,image:'images_cards/card_hoodie-black.jpg',material:'80% Хлопок, 20% Полиэстер',fit:'Regular',colors:['Black','Grey'],colorImages:{Black:'images_cards/card_hoodie-black.jpg',Grey:'images_cards/IMG_1859.jpeg'},sizes:['M','L','XL','XXL','XXXL']},
{id:'4',title:'S-01',subtitle:'Серый меланж · Oversize',price:2190,image:'images_cards/card_sweatpants-grey.jpg',material:'Хлопок (Футер 3-х нитка)',fit:'Oversize',colors:['Black','Grey'],colorImages:{Black:'images_cards/IMG_1857.jpeg',Grey:'images_cards/card_sweatpants-grey.jpg'},sizes:['M','L','XL','2XL','3XL','4XL']},
{id:'5',title:'Z-02',subtitle:'Серый · Regular',price:2990,image:'images_cards/IMG_1854.jpeg',material:'Хлопок, Флис',fit:'Regular',colors:['White','Grey'],colorImages:{White:'images_cards/IMG_1855.jpeg',Grey:'images_cards/IMG_1854.jpeg'},sizes:['S','M','L','XL','2XL','3XL']},
{id:'6',title:'C-02',subtitle:'Голубой · Wide fit',price:2990,image:'images_cards/IMG_1863.jpeg',material:'60% Хлопок',fit:'Wide',colors:['Vintage Blue'],colorImages:{'Vintage Blue':'images_cards/IMG_1863.jpeg'},sizes:['S','M','L','XL','XXL','XXXL']},
{id:'7',title:'C-03',subtitle:'Черный · Wide fit',price:2990,image:'images_cards/IMG_1862.jpeg',material:'100% Хлопок (Деним)',fit:'Wide',colors:['Black'],colorImages:{Black:'images_cards/IMG_1862.jpeg'},sizes:['S','M','L','XL']},
{id:'8',title:'H-02',subtitle:'Черный · Oversize',price:2990,image:'images_cards/card_hoodie-lsd.jpg',material:'80% Хлопок, 20% Полиэстер',fit:'Oversize',colors:['Black'],sizes:['S','M','L','XL','XXL','XXXL']},
{id:'9',title:'S-02',subtitle:'Черный · Wide fit',price:2190,image:'images_cards/card_sweatpants-black.jpg',material:'Хлопок (Футер 3-х нитка)',fit:'Wide / Oversize',colors:['Black'],sizes:['S','M','L','XL']}
];

let product=null,color=null,size=null;
const $=id=>document.getElementById(id);
const money=n=>Number(n).toLocaleString('ru-RU')+' ₽';
const TG='nthngv';

function vibrate(){try{navigator.vibrate?.(8)}catch(e){}}
function islandStatus(label,duration=1200){window.BASEIsland?.status(label,duration)}
function telegramUrl(message){return 'https://t.me/'+TG+'?text='+encodeURIComponent(message)}

function openCheckout(item){if(!item)return;islandStatus('ORDER',1600);const overlay=$('checkout-overlay'),form=$('checkout-form');if(!overlay||!form)return;form.dataset.item=JSON.stringify(item);const error=$('checkout-error');if(error){error.hidden=true;error.textContent=''}overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';setTimeout(()=>$('checkout-name')?.focus(),140)}
function closeCheckout(){const overlay=$('checkout-overlay');if(!overlay)return;overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');document.body.style.overflow=''}
function buyNow(){if(!product)return;const target=!color?$('product-colors'):(!size?$('product-sizes'):null);if(target){islandStatus('SIZE',1000);target.closest('.product-option')?.scrollIntoView({behavior:'smooth',block:'center'});target.classList.add('selection-attention');setTimeout(()=>target.classList.remove('selection-attention'),1200);return}openCheckout({id:product.id,title:product.title,color,size,price:product.price,qty:1})}
function chips(box,values,setter,autoSelectFirst=false,isSize=false){box.innerHTML='';(values||[]).forEach((v,i)=>{const b=document.createElement('button');b.type='button';b.className='chip'+(autoSelectFirst&&i===0?' active':'');b.textContent=v;b.addEventListener('click',()=>{box.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));b.classList.add('active');setter(v);window.BASEIsland?.refresh?.();islandStatus((isSize?'РАЗМЕР ':'SIZE ')+v,900);vibrate()});box.appendChild(b)});setter(autoSelectFirst&&values?.[0]||null)}
function setProductImage(src){const img=$('product-image');if(!img||!src)return;if(img.dataset.src===src)return;img.style.opacity='.2';const next=new Image();next.onload=()=>{img.src=src;img.dataset.src=src;img.style.opacity='1'};next.onerror=()=>{img.style.opacity='1'};next.src=src}
function syncBuyState(){const buy=$('product-buy');if(buy)buy.setAttribute('aria-disabled',color&&size?'false':'true')}

document.addEventListener('DOMContentLoaded',()=>{
const id=new URLSearchParams(location.search).get('id');product=PRODUCTS.find(x=>x.id===id)||PRODUCTS[0];
$('product-image').src=product.image;$('product-image').dataset.src=product.image;$('product-image').alt=product.title;$('product-title').textContent=product.title;$('product-subtitle').textContent=product.subtitle;$('product-price').textContent=money(product.price);$('product-material').textContent=product.material;$('product-fit').textContent=product.fit;
chips($('product-colors'),product.colors,v=>{color=v;setProductImage(product.colorImages?.[v]||product.image);syncBuyState()},true);chips($('product-sizes'),product.sizes,v=>{size=v;syncBuyState()},false,true);Object.values(product.colorImages||{}).forEach(src=>{const preload=new Image();preload.src=src});
$('product-buy').addEventListener('click',e=>{e.preventDefault();buyNow()});$('checkout-close')?.addEventListener('click',closeCheckout);$('checkout-overlay')?.addEventListener('click',e=>{if(e.target.id==='checkout-overlay')closeCheckout()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCheckout()});
$('checkout-form')?.addEventListener('submit',e=>{
e.preventDefault();const name=$('checkout-name')?.value.trim(),phone=$('checkout-phone')?.value.trim(),address=$('checkout-address')?.value.trim(),postcode=$('checkout-postcode')?.value.trim(),error=$('checkout-error');
if(!name||!phone||!address||!postcode){islandStatus('CHECK',900);if(error){error.textContent='Заполни все поля, чтобы продолжить.';error.hidden=false}return}
let item=null;try{item=JSON.parse($('checkout-form').dataset.item||'null')}catch(_){}
if(!item){if(error){error.textContent='Не удалось собрать заказ. Вернись к товару и попробуй ещё раз.';error.hidden=false}return}
const lines=['Здравствуйте! Хочу оформить заказ.','', '1. '+item.title,'   Цвет: '+item.color+' · Размер: '+item.size+' · 1 шт','   '+money(item.price),'','Итого: '+money(item.price),'','Данные для доставки:','ФИО: '+name,'Контактный номер: '+phone,'Адрес: '+address,'Почтовый индекс: '+postcode,'','Готов подтвердить заказ.'];
const url=telegramUrl(lines.join('\n'));islandStatus('READY ✓',1500);const submit=$('checkout-form')?.querySelector('.checkout-submit');if(submit){submit.disabled=true;submit.textContent='Открываем Telegram…';submit.style.opacity='.72'}
setTimeout(()=>{const tg=window.open(url,'_blank','noopener,noreferrer');if(!tg)location.href=url;closeCheckout();if(submit){submit.disabled=false;submit.textContent='Продолжить в Telegram';submit.style.opacity=''}},280)
});
const themeBtn=$('theme-toggle');if(themeBtn)themeBtn.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=next;try{localStorage.setItem('base-theme',next)}catch(e){}vibrate()});
syncBuyState();window.BASEIsland?.refresh?.();
});