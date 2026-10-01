/* BASE Dynamic Island — shared UI for home + product pages */
(function(){
  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); }
  ready(function(){
    const header=document.getElementById('island');
    if(!header) return;
    const inner=header.querySelector('.header-inner');
    if(!inner) return;

    const cartBtn=document.getElementById('cart-btn');
    const themeBtn=document.getElementById('theme-toggle');

    const ui=document.createElement('div');
    ui.className='base-island-ui';
    ui.innerHTML=`
      <button class="base-island-main" type="button" aria-expanded="false" aria-label="Открыть BASE">
        <span class="base-island-mark">BASE.</span>
        <span class="base-island-context" id="base-island-context">CATALOG</span>
        <span class="base-island-ping" aria-hidden="true"></span>
      </button>
      <div class="base-island-expanded" aria-hidden="true">
        <div class="base-island-top">
          <div class="base-island-status">
            <span class="base-island-dot"></span>
            <span id="base-island-status">BASE / READY</span>
          </div>
          <button class="base-island-close" type="button" aria-label="Закрыть">×</button>
        </div>
        <div class="base-island-content" id="base-island-content"></div>
        <div class="base-island-actions">
          <a href="index.html#catalog" data-island-action="catalog">Каталог</a>
          <button type="button" data-island-action="cart">Корзина <span id="base-island-count"></span></button>
          <a href="index.html#how" data-island-action="how">Как заказать</a>
          <a href="https://t.me/nthngv" target="_blank" rel="noopener noreferrer">Telegram</a>
          <button type="button" data-island-action="theme">Тема</button>
        </div>
      </div>
    `;
    inner.appendChild(ui);

    const main=ui.querySelector('.base-island-main');
    const expanded=ui.querySelector('.base-island-expanded');
    const close=ui.querySelector('.base-island-close');
    const content=ui.querySelector('#base-island-content');
    const context=ui.querySelector('#base-island-context');
    const status=ui.querySelector('#base-island-status');
    const countEl=ui.querySelector('#base-island-count');

    function vibrate(){try{if(navigator.vibrate)navigator.vibrate(7)}catch(e){}}
    function getCart(){
      try{return JSON.parse(localStorage.getItem('base_cart')||'[]')||[]}catch(e){return []}
    }
    function cartInfo(){
      const cart=getCart();
      const count=cart.reduce((n,x)=>n+Number(x.qty||0),0);
      const total=cart.reduce((n,x)=>n+(Number(x.price)||0)*Number(x.qty||0),0);
      return {cart,count,total};
    }
    function money(n){return Number(n).toLocaleString('ru-RU')+' ₽'}
    function pageProduct(){
      return document.getElementById('product-title')?.textContent?.trim() || '';
    }
    function setContext(){
      const p=pageProduct();
      context.textContent=p ? 'PRODUCT' : (location.hash==='#how' ? 'ORDER' : 'CATALOG');
    }
    function render(){
      const info=cartInfo();
      countEl.textContent=info.count ? '· '+info.count : '';
      const p=pageProduct();
      if(p){
        status.textContent='BASE / PRODUCT';
        content.innerHTML=`
          <div class="base-island-product">
            <div class="base-island-product-copy">
              <span class="base-island-eyebrow">Сейчас открыто</span>
              <strong>${p}</strong>
              <span>${document.getElementById('product-price')?.textContent||''} · 7–14 дней</span>
            </div>
            <button type="button" class="base-island-mini-action" data-focus="product">Товар</button>
          </div>`;
      }else if(info.count){
        status.textContent='BASE / CART';
        content.innerHTML=`
          <div class="base-island-cart">
            <div>
              <span class="base-island-eyebrow">Корзина</span>
              <strong>${info.count} ${info.count===1?'вещь':'вещей'} · ${money(info.total)}</strong>
            </div>
            <button type="button" class="base-island-mini-action" data-island-action="cart">Открыть</button>
          </div>`;
      }else{
        status.textContent='BASE / READY';
        content.innerHTML=`
          <div class="base-island-welcome">
            <strong>Форма, в которой удобно быть собой.</strong>
            <span>Каталог · под заказ · 7–14 дней</span>
          </div>`;
      }
    }
    function setOpen(on){
      ui.classList.toggle('is-expanded',on);
      main.setAttribute('aria-expanded',String(on));
      expanded.setAttribute('aria-hidden',String(!on));
      if(on){render();vibrate()}
    }
    function flashAdded(){
      ui.classList.add('is-added');
      status.textContent='BASE / ADDED';
      content.innerHTML=`
        <div class="base-island-added">
          <span class="base-island-check">✓</span>
          <div><strong>Добавлено в корзину</strong><span>${pageProduct()||'Вещь'} · ${document.getElementById('product-price')?.textContent||''}</span></div>
          <button type="button" class="base-island-mini-action" data-island-action="cart">Корзина</button>
        </div>`;
      setOpen(true);
      setTimeout(()=>{ui.classList.remove('is-added');render()},2200);
    }

    main.addEventListener('click',()=>setOpen(!ui.classList.contains('is-expanded')));
    close.addEventListener('click',()=>setOpen(false));
    ui.addEventListener('click',e=>{
      const action=e.target.closest('[data-island-action]')?.dataset.islandAction;
      if(!action) return;
      if(action==='cart'){ cartBtn?.click(); setOpen(false); }
      if(action==='theme'){ themeBtn?.click(); render(); }
      if(action==='catalog'){ setOpen(false); }
      if(action==='how'){ setOpen(false); }
    });
    ui.addEventListener('click',e=>{
      const focus=e.target.closest('[data-focus="product"]');
      if(focus){ setOpen(false); document.getElementById('product-title')?.scrollIntoView({behavior:'smooth',block:'start'}); }
    });
    document.addEventListener('click',e=>{
      if(ui.classList.contains('is-expanded') && !ui.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false)});
    window.addEventListener('storage',render);
    window.addEventListener('hashchange',setContext);
    window.addEventListener('scroll',()=>{ if(window.scrollY>40) ui.classList.add('is-scrolled'); else ui.classList.remove('is-scrolled') },{passive:true});

    const add=document.getElementById('product-add');
    if(add) add.addEventListener('click',()=>{ if(!add.classList.contains('disabled')) setTimeout(flashAdded,40) });
    if(cartBtn) cartBtn.addEventListener('click',()=>{setTimeout(render,50)});

    setContext(); render();
  });
})();