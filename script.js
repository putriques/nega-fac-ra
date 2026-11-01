(function(){
  // ===== CONFIGURAÇÃO =====
  var WHATS = "5541999861075"; // 55 + DDD + número
  var MSG = "Oi! Gostaria do catálogo de preços.";
  var PRODUTOS = [
    {i:"👗", t:"Roupas femininas e conjuntos", d:"Vestidos, conjuntos e looks para todas as ocasiões.", q:"roupas femininas e conjuntos"},
    {i:"👖", t:"Jeans e moda casual", d:"Peças jeans e casuais confortáveis para o dia a dia.", q:"peças jeans e moda casual"},
    {i:"💄", t:"Cosméticos e perfumaria", d:"Maquiagens e fragrâncias para completar seu visual.", q:"cosméticos e perfumaria"},
    {i:"🌸", t:"Produtos Natura", d:"Linha Natura para cuidar de você com qualidade.", q:"produtos Natura"},
    {i:"🧴", t:"Hidratantes e cuidados capilares", d:"Hidratação e tratamento para pele e cabelos.", q:"hidratantes e cuidados capilares"}
  ];

  function wa(text){ return "https://wa.me/" + WHATS + "?text=" + encodeURIComponent(text || MSG); }

  // Links de WhatsApp
  ["waHero","waText","waPanel","waBanner","waFloat"].forEach(function(id){
    document.getElementById(id).href = wa();
  });

  // Cards de produtos
  var grid = document.getElementById("productGrid");
  PRODUTOS.forEach(function(p){
    var a = document.createElement("article");
    a.className = "card reveal";
    a.innerHTML = '<div class="icon">'+p.i+'</div><h3>'+p.t+'</h3><p>'+p.d+'</p>' +
      '<a class="more" target="_blank" rel="noopener" href="'+wa("Oi! Tenho interesse em "+p.q+". Poderia me informar os preços?")+'">Perguntar no WhatsApp →</a>';
    grid.appendChild(a);
  });

  // Aberto / fechado
  function horario(dia){
    if(dia>=1 && dia<=5) return [11*60, 18*60+30];
    if(dia===6) return [11*60, 18*60];
    return null;
  }
  function atualizaStatus(){
    var agora = new Date(), dia = agora.getDay(), min = agora.getHours()*60 + agora.getMinutes();
    var h = horario(dia), el = document.getElementById("status"), tx = document.getElementById("statusText");
    var aberto = h && min >= h[0] && min < h[1];
    el.className = "status " + (aberto ? "open" : "closed");
    tx.textContent = aberto ? "Aberto agora" : "Fechado agora";
    document.querySelectorAll("#hours li").forEach(function(li){
      li.classList.toggle("today", li.dataset.days.split(",").indexOf(String(dia)) > -1);
    });
  }
  atualizaStatus();
  setInterval(atualizaStatus, 60000);

  // Menu mobile
  var menu = document.getElementById("menu"), btn = document.getElementById("menuBtn");
  btn.addEventListener("click", function(){
    var open = menu.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
  });
  menu.addEventListener("click", function(e){
    if(e.target.tagName === "A"){ menu.classList.remove("open"); btn.setAttribute("aria-expanded", false); }
  });

  // Tema
  document.getElementById("themeBtn").addEventListener("click", function(){
    var root = document.documentElement;
    var dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
  });

  // Animação ao rolar
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("show"); io.unobserve(e.target); } });
  }, {threshold:.15}) : null;
  document.querySelectorAll(".reveal").forEach(function(el){ io ? io.observe(el) : el.classList.add("show"); });

  // Galeria / lightbox
  var figs = Array.prototype.slice.call(document.querySelectorAll(".gallery figure"));
  var lb = document.getElementById("lightbox"), lbImg = lb.querySelector("img"), cur = 0;
  function show(i){
    cur = (i + figs.length) % figs.length;
    var img = figs[cur].querySelector("img");
    lbImg.src = img.src; lbImg.alt = img.alt;
    lb.hidden = false; document.body.style.overflow = "hidden";
  }
  function hide(){ lb.hidden = true; document.body.style.overflow = ""; }
  figs.forEach(function(f,i){
    f.addEventListener("click", function(){ show(i); });
    f.addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); show(i); } });
  });
  lb.querySelector(".lb-close").addEventListener("click", hide);
  lb.querySelector(".lb-prev").addEventListener("click", function(e){ e.stopPropagation(); show(cur - 1); });
  lb.querySelector(".lb-next").addEventListener("click", function(e){ e.stopPropagation(); show(cur + 1); });
  lb.addEventListener("click", function(e){ if(e.target === lb) hide(); });
  document.addEventListener("keydown", function(e){
    if(lb.hidden) return;
    if(e.key === "Escape") hide();
    if(e.key === "ArrowLeft") show(cur - 1);
    if(e.key === "ArrowRight") show(cur + 1);
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();