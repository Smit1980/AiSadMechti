'use strict';
(()=>{
 const maxUrl='https://max.ru/join/WWR_dfNXSUyW-a0xuiRjyf4OByF07DYHxrFYOJDwZ8M';
 const q=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)];
 const params=new URLSearchParams(location.search);
 if(params.get('deck')==='1')document.body.classList.add('neurosad-deck-only');
 if(/^#slide-(1[0-2]|[1-9])$/.test(location.hash))location.replace(location.pathname+location.search+'#intro-'+location.hash.slice(7));
 const choices=all('[data-cold-choice]');
 choices.forEach((button,index)=>button.addEventListener('click',()=>{
  choices.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  q('#cold-feedback').textContent=index===0?'Проверим: красивое оформление скрывает несколько рисков.':index===1?'Верно: сначала нужно разобрать возраст, материалы и ход игры.':'Да, применять как есть нельзя. Позже покажем, как исправить черновик.';
 }));
 q('#tale-clarify')?.addEventListener('change',e=>{
  q('#tale-training-result').textContent=e.target.checked?'Текущий заказ теперь содержит возраст и материал. Черновик должен учитывать детей 3–4 лет и крупные кубики. Педагог проверяет результат.':'Без условий черновик получается слишком общим.';
 });
 const flow=[
  ['Ваше задание','Вы задаёте цель, возраст, материалы и желаемый формат.'],
  ['Части текста','Текст делится на токены. Деление зависит от конкретной модели.'],
  ['Доступный контекст','В ограниченном окне находятся запрос, доступная часть беседы и переданные материалы.'],
  ['Языковая модель','Модель строит продолжение по выученным закономерностям и доступному контексту.'],
  ['Черновик','Ответ может звучать уверенно и содержать ошибки.'],
  ['Проверка педагога','Сверьте возраст, безопасность, программу и реальные условия.']
 ];
 let current=0,timer=null,visible=true;
 const buttons=all('[data-flow-step]'),play=q('#flow-play');
 const stop=()=>{if(timer)clearInterval(timer);timer=null;if(play)play.textContent='Воспроизвести';};
 function show(n){
  current=Math.max(0,Math.min(flow.length-1,n));
  buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===current)));
  q('#flow-explanation').textContent=flow[current][1];
  const visual=q('#flow-visual');
  visual.replaceChildren();
  const heading=document.createElement('b');heading.textContent=flow[current][0];visual.append(heading);
  q('#flow-prev').disabled=current===0;q('#flow-next').disabled=current===flow.length-1;
  if(current===flow.length-1)stop();
 }
 buttons.forEach((b,i)=>b.addEventListener('click',()=>{stop();show(i);}));
 q('#flow-prev')?.addEventListener('click',()=>{stop();show(current-1);});
 q('#flow-next')?.addEventListener('click',()=>{stop();show(current+1);});
 q('#flow-reset')?.addEventListener('click',()=>{stop();show(0);});
 play?.addEventListener('click',()=>{
  if(timer){stop();return;}
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  if(current===flow.length-1)show(0);
  play.textContent='Пауза';
  timer=setInterval(()=>{if(document.hidden||!visible||q('#intro-4').hidden){stop();return;}show(current+1)},1800);
 });
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)stop()});
 if(q('#intro-4'))observer.observe(q('#intro-4'));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
 show(0);
 async function copy(text,source){
  try{await navigator.clipboard.writeText(text);return true}catch{
   const field=document.createElement('textarea');field.value=text;field.style.position='fixed';field.style.opacity='0';document.body.append(field);field.select();
   let ok=false;try{ok=document.execCommand('copy')}catch{}field.remove();
   if(!ok&&source){source.focus();source.select?.()}return ok;
  }
 }
 q('#copy-tale-correction')?.addEventListener('click',async e=>{
  const ok=await copy(q('#tale-correction-text').textContent);
  e.currentTarget.textContent=ok?'Скопировано':'Выделите текст вручную';
 });
 q('#copy-max-link')?.addEventListener('click',async e=>{
  const ok=await copy(maxUrl);
  e.currentTarget.textContent=ok?'Ссылка скопирована':'Скопируйте ссылку из кнопки группы';
 });
 if(params.get('print')==='1')window.addEventListener('load',()=>setTimeout(()=>window.print(),300));
})();
