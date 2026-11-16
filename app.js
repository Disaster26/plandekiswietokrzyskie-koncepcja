(function(){
  var top=document.getElementById('top'),bg=document.getElementById('burger');
  function sc(){top.classList.toggle('sc',window.scrollY>8)}
  window.addEventListener('scroll',sc,{passive:true});requestAnimationFrame(sc);
  if(bg){
    bg.addEventListener('click',function(){var o=top.classList.toggle('open');bg.setAttribute('aria-expanded',o);bg.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu')});
    document.querySelectorAll('.menu a').forEach(function(a){a.addEventListener('click',function(){top.classList.remove('open');bg.setAttribute('aria-expanded','false')})});
  }
  var links=[].slice.call(document.querySelectorAll('.menu a[href^="#"]'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(l){l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
    links.forEach(function(l){var t=document.querySelector(l.getAttribute('href'));if(t)io.observe(t)});
  }
  // pasy przewijane: palec natywnie, mysz przeciaganiem
  var moved=false;
  document.querySelectorAll('[data-tor]').forEach(function(tor){
    var down=false,sx=0,sl=0;
    tor.addEventListener('pointerdown',function(e){moved=false;if(e.pointerType!=='mouse'||tor.scrollWidth<=tor.clientWidth+2)return;down=true;sx=e.clientX;sl=tor.scrollLeft});
    window.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>5){moved=true;tor.classList.add('drag');tor.style.scrollSnapType='none'}tor.scrollLeft=sl-dx});
    window.addEventListener('pointerup',function(){if(!down)return;down=false;tor.classList.remove('drag');tor.style.scrollSnapType=''});
    tor.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
    tor.addEventListener('dragstart',function(e){e.preventDefault()});
  });
  // lightbox
  var lb=document.getElementById('lb'),li=document.getElementById('lb-img'),nr=document.getElementById('lb-nr');
  var items=[].slice.call(document.querySelectorAll('.gal button')),cur=0,last=null;
  function show(i){cur=(i+items.length)%items.length;var b=items[cur],im=b.querySelector('img');li.src=b.dataset.full;li.alt=im.alt;nr.textContent=(cur+1)+' / '+items.length}
  function open(i){last=document.activeElement;show(i);lb.hidden=false;document.body.style.overflow='hidden';lb.querySelector('.x').focus()}
  function close(){lb.hidden=true;document.body.style.overflow='';if(last)last.focus()}
  items.forEach(function(b,i){b.addEventListener('click',function(){open(i)})});
  lb.querySelector('.x').addEventListener('click',close);
  lb.querySelector('.pv').addEventListener('click',function(){show(cur-1)});
  lb.querySelector('.nx').addEventListener('click',function(){show(cur+1)});
  lb.addEventListener('click',function(e){if(e.target===lb)close()});
  document.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});
  var tx=0;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){var d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)show(cur+(d<0?1:-1))},{passive:true});
  // mapa przy przewinieciu
  var m=document.getElementById('mapa');
  function load(){if(m.dataset.ok)return;m.dataset.ok=1;var f=document.createElement('iframe');f.src=m.dataset.src;f.title=m.dataset.title;f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';m.appendChild(f)}
  if(m){if('IntersectionObserver' in window){var mo=new IntersectionObserver(function(es){if(es[0].isIntersecting){load();mo.disconnect()}},{rootMargin:'300px'});mo.observe(m)}else load()}
  // formularz pokazowy
  var f=document.getElementById('form'),msg=document.getElementById('msg');
  if(f)f.addEventListener('submit',function(e){e.preventDefault();if(!f.checkValidity()){f.reportValidity();return}msg.hidden=false;msg.scrollIntoView({block:'nearest',behavior:'smooth'})});
  var y=document.getElementById('rok');if(y)y.textContent=new Date().getFullYear();
})();
