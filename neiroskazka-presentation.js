'use strict';
(()=>{
 const hash=location.hash;
 const slide=/^#slide-(1[0-2]|[1-9])$/.exec(hash);
 const target=slide?'#intro-'+slide[1]:/^#intro-(1[0-2]|[1-9])$/.test(hash)?hash:'#intro-1';
 location.replace('neiroskazka.html?deck=1'+target);
})();
