'use strict';
(()=>{
 const form=document.getElementById('template-form');if(!form)return;
 const output=document.getElementById('template-result');
 const select=document.getElementById('template-choice');
 const fields=['group_age','group_features','learning_goal','materials','source_fragment','duration','output_format'];
 const fallback={duration:'[время в проверенном режиме; для взрослого документа — не применимо]',output_format:'[структура результата]',group_age:'[укажите возраст группы]',group_features:'[только обобщённые условия группы, без персональных данных]',learning_goal:'[одна образовательная задача]',materials:'[доступные безопасные материалы]',source_fragment:'[разрешённый проверенный фрагмент программы и его реквизиты; если нет, не заявлять соответствие]'};
 function compose(){
  const f=new FormData(form),values={};fields.forEach(k=>values[k]=String(f.get(k)||'').trim()||fallback[k]);
  const el=document.getElementById(select.value);if(!el)return;
  let body=el.textContent;
  const card=el.closest('.prompt-card');const allowed=card?.dataset.age;const chosen=values.group_age.slice(0,3);if(allowed&&((allowed==='Оба возраста'&&!['2–3','3–4'].includes(chosen))||(allowed!=='Оба возраста'&&allowed!==chosen))){document.getElementById('template-status').textContent='Возраст этой карточки: '+allowed+'. Выберите подходящий возраст или другую карточку. Старший сценарий нельзя переносить на младший простым изменением числа лет.';output.value='';document.getElementById('template-print').textContent='';return;}
fields.forEach(k=>{body=body.split('['+k+']').join(values[k]);});
  output.value=`УСЛОВИЯ ДЛЯ АДАПТАЦИИ ШАБЛОНА\nВозраст группы: ${values.group_age}.\nОбобщённые особенности и условия: ${values.group_features}.\nОбразовательная задача: ${values.learning_goal}.\nМатериалы: ${values.materials}.\nВремя: ${values.duration}.\nФормат результата: ${values.output_format}.\nПроверенная опора: ${values.source_fragment}.\n\nИСХОДНЫЙ ШАБЛОН\n${body}\n\nПРОВЕРКА ПЕРЕД ИСПОЛЬЗОВАНИЕМ\nАдаптируй черновик к условиям выше. Если они противоречат возрасту или задаче исходного шаблона, сначала назови противоречие и предложи подходящую замену. Не выдавай ответ за нормативно утверждённый материал. Не придумывай цитаты, пункты документов и результаты наблюдений. Без проверенного фрагмента не заявляй соответствие ФГОС ДО, ФОП ДО или программе ДОО. Дети работают с педагогом, предметами и движением, без экранных заданий. Не запрашивай имена, фото, голоса, сведения о здоровье или индивидуальные характеристики детей. В конце перечисли, что педагог должен проверить и изменить.`;
  document.getElementById('template-print').textContent=output.value;
  document.getElementById('template-status').textContent='Заполненный черновик готов. Прочитайте его целиком перед копированием; в сервис ничего не отправлено.';
 }
 form.addEventListener('submit',e=>{e.preventDefault();compose();});
 document.querySelectorAll('[data-fill-template]').forEach(b=>b.addEventListener('click',()=>{select.value=b.dataset.fillTemplate;if(b.dataset.templateAge){document.querySelector('#template-form [name="group_age"]').value=b.dataset.templateAge;}compose();document.getElementById('template-workbench').scrollIntoView({behavior:'smooth',block:'start'});select.focus({preventScroll:true});}));
 document.getElementById('template-clear').addEventListener('click',()=>{form.reset();output.value='';document.getElementById('template-print').textContent='';document.getElementById('template-status').textContent='Поля очищены. Данные нигде не сохранялись.';});
 window.addEventListener('beforeprint',()=>document.getElementById('template-print').textContent=output.value);
})();
