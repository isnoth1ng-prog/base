/* BASE Dynamic Island — compact contextual UI */
(function(){
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn):fn();
  ready(()=>{
    const header=document.getElementById('island');
    const inner=header?.querySelector('.header-inner');
    if(!header||!inner)return;
    const themeBtn=document.getElementById('theme-toggle');

    const ui=document.createElement('div');
    ui.className='base-island-ui';
    ui.innerHTML=`
      <button class="base-island-main" type="button" aria-expanded="false" aria-label="Открыть меню BASE">
        <span class="base-island-mark">BASE.</span>
        <span class="base-island-context">CATALOG</span>
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
    const vibrate=()=>{try{navigator.vibrate?.(7)}catch(e){}};
    let statusTimer=null;
    let baseLabel='CATALOG';
    let statusLabel='';
    function showStatus(label,duration=1200){
      clearTimeout(statusTimer);
      statusLabel=label||'';
      context.textContent=statusLabel||baseLabel;
      ui.classList.toggle('has-status',!!statusLabel);
      if(statusLabel&&duration>0)statusTimer=setTimeout(()=>showStatus('',0),duration);
    }
    window.BASEIsland={
      status:(label,duration)=>{showStatus(label,duration);vibrate()},
      setBaseLabel:(label)=>{baseLabel=label||'CATALOG';if(!statusLabel)context.textContent=baseLabel}
    };
    function render(){
      if(!statusLabel)context.textContent=baseLabel;
      content.innerHTML='';
    }

    window.BASEIsland.refresh=render;

    let closeTimer=null;
    function setOpen(on=true,auto=true){
      clearTimeout(closeTimer);
      ui.classList.toggle('is-expanded',on);
      main.setAttribute('aria-expanded',String(on));
      expanded.setAttribute('aria-hidden',String(!on));
      if(on){
        render();vibrate();
        if(auto)closeTimer=setTimeout(()=>setOpen(false,false),5200);
      }
    }

    main.addEventListener('pointerdown',()=>ui.classList.add('is-touching'));
    main.addEventListener('pointerup',()=>ui.classList.remove('is-touching'));
    main.addEventListener('pointercancel',()=>ui.classList.remove('is-touching'));

    main.addEventListener('click',()=>{
      main.classList.remove('is-pressed');
      void main.offsetWidth;
      main.classList.add('is-pressed');
      setOpen(!ui.classList.contains('is-expanded'));
    });

    ui.addEventListener('click',e=>{
      const action=e.target.closest('[data-island-action]')?.dataset.islandAction;
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

    let scrollTimer=null;
    window.addEventListener('scroll',()=>{
      if(scrollTimer)return;
      scrollTimer=setTimeout(()=>{
        ui.classList.toggle('is-scrolled',window.scrollY>24);
        if(!statusLabel){
          const y=window.scrollY+window.innerHeight*.22;
          const how=document.getElementById('how');
          const catalog=document.getElementById('catalog');
          const label=how&&y>=how.offsetTop?'HOW':catalog&&y>=catalog.offsetTop?'CATALOG':'BASE';
          if(label!==baseLabel){
            baseLabel=label;
            context.classList.remove('is-context-shifting');
            void context.offsetWidth;
            context.classList.add('is-context-shifting');
            context.textContent=label;
          }
        }
        scrollTimer=null;
      },80);
    },{passive:true});
    render();
  });
})();