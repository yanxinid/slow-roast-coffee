/* ============================================================
   慢焙咖啡 — 全站共享交互
   1) 导航明暗反色（依据当前视口顶部区块的 data-theme）
   2) 滚动状态 3) 移动端菜单 4) 当前页高亮 5) 入场动画
   ============================================================ */
(function(){
  'use strict';

  /* ---- 1. 导航：明暗反色 + 滚动状态 ---- */
  var nav = document.querySelector('.nav');
  // 首页自带按渐变进度反色的精确逻辑，跳过区块反色以免冲突（但仍启用菜单）
  var customTheme = nav && nav.hasAttribute('data-custom-theme');
  if(nav && !customTheme){
    var probeY = 40; // 探针：视口顶部下方 40px 处所落的区块决定导航配色
    var ticking = false;
    function updateNav(){
      var y = window.scrollY || window.pageYOffset;
      nav.classList.toggle('scrolled', y > 24);

      // 找出覆盖探针的区块，读取其 data-theme（light / dark）
      var probe = y + probeY;
      var theme = 'light';
      var sections = document.querySelectorAll('[data-theme]');
      var hero = document.querySelector('.hero');
      // Hero 视为 dark（若其自身未声明 data-theme）
      for(var i=0;i<sections.length;i++){
        var s = sections[i];
        var top = s.offsetTop;
        var bottom = top + s.offsetHeight;
        if(probe >= top && probe < bottom){ theme = s.getAttribute('data-theme') || theme; break; }
      }
      // 若探针仍在 hero 内且 hero 无 data-theme，强制 dark
      if(hero && !hero.hasAttribute('data-theme')){
        var hb = hero.offsetTop + hero.offsetHeight;
        if(probe >= hero.offsetTop && probe < hb) theme = 'dark';
      }
      nav.classList.toggle('on-dark', theme === 'dark');
      ticking = false;
    }
    window.addEventListener('scroll', function(){
      if(!ticking){ requestAnimationFrame(updateNav); ticking = true; }
    }, {passive:true});
    window.addEventListener('resize', updateNav);
    updateNav();
  }

  /* ---- 3. 移动端菜单（所有页面都启用） ---- */
  if(nav){
    var toggle = nav.querySelector('.nav-toggle');
    if(toggle){
      toggle.setAttribute('aria-label','打开菜单');
      toggle.addEventListener('click', function(){
        nav.classList.toggle('open');
        var open = nav.classList.contains('open');
        toggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
      });
      var links = nav.querySelectorAll('.nav-links a');
      for(var j=0;j<links.length;j++){
        links[j].addEventListener('click', function(){ nav.classList.remove('open'); });
      }
      document.addEventListener('click', function(e){
        if(nav.classList.contains('open') && !nav.contains(e.target)) nav.classList.remove('open');
      });
    }
  }

  /* ---- 2 & 4. 当前页高亮 ---- */
  (function markActive(){
    var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if(path === '' ) path = 'index.html';
    var links = document.querySelectorAll('.nav-links a[data-page], .footer a[data-page]');
    for(var i=0;i<links.length;i++){
      var page = (links[i].getAttribute('data-page')||'').toLowerCase();
      if(page === path) links[i].classList.add('active');
    }
  })();

  /* ---- 5. 入场动画 ---- */
  var reveals = document.querySelectorAll('.reveal');
  if(reveals.length){
    if('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, {threshold:0.12, rootMargin:'0px 0px -6% 0px'});
      reveals.forEach(function(r){ io.observe(r); });
    }else{
      reveals.forEach(function(r){ r.classList.add('in'); });
    }
  }
})();
