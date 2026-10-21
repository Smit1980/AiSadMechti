'use strict';

(()=>{
  const match=/^#(?:slide|intro)-(1[0-6]|[1-9])$/.exec(location.hash);
  const slide=(match?match[1]:'1');
  location.replace('neiroskazka.html?deck=slides&slide='+slide);
})();