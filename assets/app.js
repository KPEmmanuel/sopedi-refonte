(function(){
var C=window.SOPEDI_CONFIG||{};var root=document.querySelector('.sp');if(!root)return;
var imgBase=C.imgBase||'images/';var pages=C.pages||{};
function pg(k){return pages[k]||(k+'.html')}
/* Résolution des images et des liens (config en tête de page) */
root.querySelectorAll('[data-img]').forEach(function(el){el.setAttribute('src',imgBase+el.getAttribute('data-img'))});
root.querySelectorAll('[data-lb]').forEach(function(el){el.setAttribute('href',imgBase+el.getAttribute('data-lb'))});
root.querySelectorAll('[data-page]').forEach(function(a){var h=a.getAttribute('data-hash');a.setAttribute('href',pg(a.getAttribute('data-page'))+(h?'#'+h:''))});
/* Thème clair / sombre */
var KEY='sopedi-theme';var t=null;
try{t=localStorage.getItem(KEY)}catch(e){}
if(!t){t=(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'}
function setTheme(v){root.setAttribute('data-theme',v);root.querySelectorAll('.theme').forEach(function(b){b.setAttribute('aria-pressed',v==='dark');b.setAttribute('aria-label',v==='dark'?'Passer en mode clair':'Passer en mode sombre')})}
setTheme(t);
root.querySelectorAll('.theme').forEach(function(b){b.addEventListener('click',function(){var n=root.getAttribute('data-theme')==='dark'?'light':'dark';setTheme(n);try{localStorage.setItem(KEY,n)}catch(e){}})});
/* Menu mobile + sous-menus */
var nav=root.querySelector('.nav');var bg=root.querySelector('.burger');
if(bg)bg.addEventListener('click',function(){var o=nav.classList.toggle('open');bg.setAttribute('aria-expanded',o)});
root.querySelectorAll('.menu>li.has>button').forEach(function(b){b.addEventListener('click',function(e){var li=b.parentNode;var o=li.classList.toggle('open');b.setAttribute('aria-expanded',o)})});
document.addEventListener('click',function(e){if(!e.target.closest('.menu'))root.querySelectorAll('.menu>li.open').forEach(function(l){l.classList.remove('open')})});
root.querySelectorAll('.drop a,.menu>li>a').forEach(function(a){a.addEventListener('click',function(){if(nav)nav.classList.remove('open')})});
/* Onglets de page (sous-menus) avec hash */
var tabs=root.querySelectorAll('[role=tab]');
function showTab(id,scroll){var found=false;tabs.forEach(function(b){var on=b.getAttribute('data-tab')===id;if(on)found=true});if(!found)return false;
 tabs.forEach(function(b){b.setAttribute('aria-selected',b.getAttribute('data-tab')===id)});
 root.querySelectorAll('.panel').forEach(function(p){p.classList.toggle('on',p.id==='p-'+id)});
 if(scroll){var s=root.querySelector('.subnav');if(s){window.scrollTo({top:s.getBoundingClientRect().top+window.pageYOffset-84,behavior:'smooth'})}}return true}
if(tabs.length){tabs.forEach(function(b){b.addEventListener('click',function(){var id=b.getAttribute('data-tab');showTab(id,true);try{history.replaceState(null,'','#'+id)}catch(e){}})});
 function fromHash(sc){var h=(location.hash||'').slice(1);if(!showTab(h,sc))showTab(tabs[0].getAttribute('data-tab'),false)}
 window.addEventListener('hashchange',function(){fromHash(true)});fromHash(false)}
/* Retour en haut */
var up=root.querySelector('.totop');if(up){up.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});window.addEventListener('scroll',function(){up.classList.toggle('on',window.pageYOffset>700)},{passive:true})}
/* Galerie : filtres + visionneuse */
var fb=root.querySelectorAll('.filters button');
fb.forEach(function(b){b.addEventListener('click',function(){var f=b.getAttribute('data-f');fb.forEach(function(x){x.setAttribute('aria-pressed',x===b)});root.querySelectorAll('.album').forEach(function(a){a.hidden=!(f==='all'||a.getAttribute('data-a')===f)});if(f!=='all'){try{history.replaceState(null,'','#'+f)}catch(e){}}})});
if(fb.length){var h=(location.hash||'').slice(1);var m=root.querySelector('.filters button[data-f="'+h+'"]');if(m)m.click()}
var lb=root.querySelector('.lb');
if(lb){var list=[],idx=0,im=lb.querySelector('img'),cap=lb.querySelector('.cap');
 function open(i){idx=(i+list.length)%list.length;var a=list[idx];im.src=a.getAttribute('href');im.alt=a.getAttribute('data-cap')||'';cap.textContent=(a.getAttribute('data-cap')||'')+'  ·  '+(idx+1)+' / '+list.length;lb.classList.add('on');document.body.style.overflow='hidden'}
 function close(){lb.classList.remove('on');document.body.style.overflow=''}
 root.querySelectorAll('[data-lb]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();var al=a.closest('.album');list=Array.prototype.slice.call((al||root).querySelectorAll('[data-lb]'));open(list.indexOf(a))})});
 lb.querySelector('.x').addEventListener('click',close);lb.querySelector('.pv').addEventListener('click',function(){open(idx-1)});lb.querySelector('.nx').addEventListener('click',function(){open(idx+1)});
 lb.addEventListener('click',function(e){if(e.target===lb)close()});
 document.addEventListener('keydown',function(e){if(!lb.classList.contains('on'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')open(idx-1);if(e.key==='ArrowRight')open(idx+1)})}
/* Formulaires : envoi par e-mail (aucun serveur nécessaire) */
root.querySelectorAll('form[data-mailto]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var d=new FormData(f);var lines=[];d.forEach(function(v,k){if(k!=='_subject'&&v)lines.push(k+' : '+v)});
 var to=f.getAttribute('data-mailto');var subj=d.get('_subject')||'Message depuis le site SOPEDI-ONG';
 window.location.href='mailto:'+to+'?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(lines.join('\n'));
 var ok=f.querySelector('.sent');if(ok)ok.hidden=false})});
})();
