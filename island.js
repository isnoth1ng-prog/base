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
          <a href="index.html#how" aria-label="Как заказать" title="Как заказать" data-island-action="close"><span aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><circle cx="12" cy="12" r="8.5"></circle><path d="M9.8 9.4a2.3 2.3 0 1 1 3.9 1.6c-.9.8-1.7 1.2-1.7 2.5"></path><path d="M12 16.9h.01"></path></svg></span></a>
          <a href="https://t.me/nthngv" target="_blank" rel="noopener noreferrer" aria-label="Telegram" title="Telegram" data-island-action="close"><span aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M20.2 4.7 3.8 10.9c-.8.3-.8.9-.1 1.2l4.2 1.5 1.6 5c.2.6.5.7.9.2l2.4-2.4 4.3 3.2c.5.3.9.1 1-.5l2.9-13.4c.1-.7-.3-1-0.8-.8Z"></path><path d="m8 13.5 8.7-6.1-6.6 7.1"></path></svg></span></a>
          <button type="button" aria-label="Тема" title="Тема" data-island-action="theme"><span aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M20 14.2A8.5 8.5 0 1 1 9.8 4 6.8 6.8 0 0 0 20 14.2Z"></path></svg></span></button>
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