/* BASE Dynamic Island — contextual system UI */
(function(){
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn):fn();
  ready(()=>{
    const header=document.getElementById('island'), inner=header?.querySelector('.header-inner');
    if(!header||!inner)return;

    const cartBtn=document.getElementById('cart-btn');
    const themeBtn=document.getElementById('theme-toggle');
    const cartSheet=document.getElementById('cart-sheet-overlay');

    const ui=document.createElement('div');
    ui.className='base-island-ui';
    ui.innerHTML=`
      <button class="base-island-main" type="button" aria-expanded="false" aria-label="Открыть меню BASE">
        <span class="base-island-mark">BASE.</span>
        <span class="base-island-context">CATALOG</span>
        <span class="base-island-cart-mini" id="base-island-mini-cart"></span>
      </button>
      <div class="base-island-expanded" aria-hidden="true">
        <div class="base-island-content" id="base-island-content"></div>
        <div class="base-island-actions">
          <a href="index.html#catalog" data-island-action="close">Каталог</a>
          <a href="index.html#how" data-island-action="close">Как заказать</a>
          <a href="https://t.me/nthngv" target="_blank" rel="noopener noreferrer" data-island-action="close">Telegram</a>
          <button type="button" data-island-action="theme">Тема</button>
        </div>
      </div>`;
    inner.appendChild(ui);

    const main=ui.querySelector('.base-island-main');
    const expanded=ui.querySelector('.base-island-expanded');
    const content=ui.querySelector('#base-island-content');
    const context=ui.querySelector('.base-island-context');
    const miniCart=ui.querySelector('#base-island-mini-cart');

    const vibrate=()=>{try{navigator.vibrate?.(7)}catch(e){}};
    const getCart=()=>{try{return JSON.parse(localStorage.getItem('base_cart')||'[]')||[]}catch(e){return[]}};
    const info=()=>{
      const cart=getCart();
      return {
        cart,
        count:cart.reduce((n,x)=>n+Number(x.qty||0),0),
        total:cart.reduce((n,x)=>n+(Number(x.price)||0)*Number(x.qty||0),0)
      };
    };
    const money=n=>Number(n).toLocaleString('ru-RU')+' ₽';
    const productTitle=()=>document.getElementById('product-title')?.textContent?.trim()||'';
    const productImage=()=>document.getElementById('product-image')?.getAttribute('src')||'';

    function render(){
      const i=info(), p=productTitle();
      miniCart.textContent=i.count>0?i.count:'';
      miniCart.classList.toggle('visible',i.count>0);

      if(p){
        context.textContent='PRODUCT';
        content.innerHTML=`
          <div class="base-island-product">
            <div class="base-island-product-thumb">${productImage()?'<img src="'+productImage()+'" alt="">':''}</div>
            <div class="base-island-product-copy">
              <span class="base-island-eyebrow">Сейчас открыто</span>
              <strong>${p}</strong>
              <span>${document.getElementById('product-price')?.textContent||''} · 7–14 дней</span>
            </div>
            <button type="button" class="base-island-mini-action" data-focus="product">Товар</button>
          </div>`;
      } else if(i.count){
        context.textContent='CART';
        content.innerHTML=`
          <div class="base-island-cart">
            <div class="base-island-cart-copy">
              <span class="base-island-eyebrow">Корзина</span>
              <strong>${i.count} ${i.count===1?'вещь':'вещей'} · ${money(i.total)}</strong>
            </div>
            <button type="button" class="base-island-mini-action" data-island-action="cart">Открыть</button>
          </div>`;
      } else {
        context.textContent='CATALOG';
        content.innerHTML=`
          <div class="base-island-welcome">
            <span class="base-island-welcome-mark">BASE.</span>
            <div>
              <strong>ФОРМА БЕЗ ЛИШНЕГО</strong>
              <span>Каталог · под заказ · 7–14 дней</span>
            </div>
          </div>`;
      }
    }

    let closeTimer=null;
    function setOpen(on=true,auto=true){
      clearTimeout(closeTimer);
      ui.classList.toggle('is-expanded',on);
      main.setAttribute('aria-expanded',String(on));
      expanded.setAttribute('aria-hidden',String(!on));
      if(on){
        render();
        vibrate();
        if(auto)closeTimer=setTimeout(()=>setOpen(false,false),5200);
      }
    }

    function openCart(){
      setOpen(false,false);
      if(!cartSheet)return;
      // Open the real cart directly as a fallback. This keeps the island independent
      // from the header/cart button event chain.
      try{cartSheet.classList.add('open','active')}catch(e){}
      document.body.style.overflow='hidden';
      window.dispatchEvent(new Event('base:open-cart'));
    }

    function flashAdded(){
      ui.classList.add('is-added');
      context.textContent='ADDED';
      content.innerHTML=`
        <div class="base-island-added">
          <span class="base-island-check">✓</span>
          <div>
            <strong>Добавлено в корзину</strong>
            <span>${productTitle()||'Вещь'} · ${document.getElementById('product-price')?.textContent||''}</span>
          </div>
          <button type="button" class="base-island-mini-action" data-island-action="cart">Корзина</button>
        </div>`;
      setOpen(true,false);
      setTimeout(()=>{ui.classList.remove('is-added');setOpen(false,false);render()},1800);
    }

    main.addEventListener('click',()=>{
      main.classList.remove('is-pressed');
      void main.offsetWidth;
      main.classList.add('is-pressed');
      setOpen(!ui.classList.contains('is-expanded'));
    });

    ui.addEventListener('click',e=>{
      const action=e.target.closest('[data-island-action]')?.dataset.islandAction;
      if(action==='cart'){openCart();return}
      if(action==='theme'){themeBtn?.click();render();return}
      if(action==='close'){setOpen(false,false);return}
      if(e.target.closest('[data-focus="product"]')){
        setOpen(false,false);
        document.getElementById('product-title')?.scrollIntoView({behavior:'smooth',block:'start'});
      }
    });

    document.addEventListener('click',e=>{
      if(ui.classList.contains('is-expanded')&&!ui.contains(e.target))setOpen(false,false);
    });
    document.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false,false)});

    const add=document.getElementById('product-add');
    if(add)add.addEventListener('click',()=>{
      if(!add.classList.contains('disabled'))setTimeout(flashAdded,60);
    });

    window.addEventListener('storage',render);
    window.addEventListener('hashchange',render);
    window.addEventListener('base:cart-changed',render);
    window.addEventListener('base:open-cart',()=>setTimeout(render,80));
    window.addEventListener('base:close-cart',()=>setOpen(false,false));
    if(cartBtn)cartBtn.addEventListener('click',()=>setTimeout(render,80));

    // Subtle scroll state only — no transforms, no layout movement.
    let scrollTimer=null;
    window.addEventListener('scroll',()=>{
      if(scrollTimer)return;
      scrollTimer=setTimeout(()=>{
        ui.classList.toggle('is-scrolled',window.scrollY>24);
        scrollTimer=null;
      },80);
    },{passive:true});

    render();
  });
})();