'use strict';

(()=>{
  const deck=document.getElementById('neiroskazka-slides');
  if(!deck)return;

  const slides=[...deck.querySelectorAll('.tale-image-slide')];
  const prev=document.getElementById('tale-image-prev');
  const next=document.getElementById('tale-image-next');
  const count=document.getElementById('tale-image-count');
  const select=document.getElementById('tale-image-select');
  const read=document.getElementById('tale-image-read');
  const screen=document.getElementById('tale-image-screen');
  const params=new URLSearchParams(location.search);
  let current=0;
  let reading=false;
  const requested=Number(params.get('slide'));
  if(Number.isInteger(requested)&&requested>=1&&requested<=slides.length)current=requested-1;

  if(params.get('deck')==='slides')document.body.classList.add('neiroskazka-image-deck-only');

  slides.forEach((slide,index)=>{
    const option=document.createElement('option');
    option.value=String(index);
    option.textContent=(index+1)+'. '+slide.dataset.title;
    select.append(option);
    slide.setAttribute('role','group');
    slide.setAttribute('aria-roledescription','слайд');
    slide.setAttribute('aria-label',(index+1)+' из '+slides.length+'. '+slide.dataset.title);
  });

  function render(){
    slides.forEach((slide,index)=>{slide.hidden=!reading&&index!==current;});
    prev.disabled=current===0;
    next.disabled=current===slides.length-1;
    select.value=String(current);
    count.textContent=(current+1)+' / '+slides.length;
    deck.classList.toggle('tale-image-reading',reading);
    read.setAttribute('aria-pressed',String(reading));
    read.textContent=reading?'По одному слайду':'Все слайды';
  }

  function go(index,focus=false){
    current=Math.max(0,Math.min(slides.length-1,index));
    render();
    if(reading){slides[current].scrollIntoView({block:'start',behavior:'auto'});}
    else if(document.fullscreenElement===deck){deck.scrollTo({top:0,behavior:'auto'});}
    else{deck.scrollIntoView({block:'start',behavior:'auto'});}
    if(focus)slides[current].focus({preventScroll:true});
  }

  function fromHash(){
    const match=location.hash.match(/^#neiroskazka-slide-(\d+)$/);
    if(!match)return;
    const index=Number(match[1])-1;
    if(index>=0&&index<slides.length)go(index);
  }

  prev.addEventListener('click',()=>go(current-1));
  next.addEventListener('click',()=>go(current+1));
  select.addEventListener('change',()=>go(Number(select.value)));
  read.addEventListener('click',()=>{reading=!reading;go(current);});
  screen.addEventListener('click',async()=>{
    try{
      if(document.fullscreenElement===deck)await document.exitFullscreen();
      else if(deck.requestFullscreen){reading=false;render();await deck.requestFullscreen();deck.scrollTo({top:0,behavior:'auto'});}
    }catch{document.getElementById('toast').textContent='Браузер не открыл полный экран. Слайды доступны в обычном режиме.';}
  });
  document.addEventListener('fullscreenchange',()=>{
    const active=document.fullscreenElement===deck;
    screen.textContent=active?'Выйти из полного экрана':'На весь экран ↗';
    screen.setAttribute('aria-pressed',String(active));
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&document.fullscreenElement===deck)document.exitFullscreen().catch(()=>{});
  });
  deck.addEventListener('keydown',event=>{
    if(event.altKey||event.ctrlKey||event.metaKey)return;
    if(event.key==='ArrowRight'){event.preventDefault();go(current+1,true);}
    if(event.key==='ArrowLeft'){event.preventDefault();go(current-1,true);}
    if(event.key==='Home'){event.preventDefault();go(0,true);}
    if(event.key==='End'){event.preventDefault();go(slides.length-1,true);}
  });
  window.addEventListener('hashchange',fromHash);
  deck.classList.add('intro-ready','tale-image-ready');
  render();
  if(params.has('slide')){
    if(params.get('deck')!=='slides')deck.scrollIntoView({block:'start',behavior:'auto'});
  }else{
    fromHash();
  }
})();