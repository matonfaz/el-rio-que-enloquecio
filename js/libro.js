(function(){
  var libro=document.getElementById("libro"),escena=document.getElementById("escena");
  var estado=document.getElementById("visor-estado"),ctrl=document.getElementById("visor-controles");
  var bPrev=document.getElementById("v-prev"),bNext=document.getElementById("v-next"),bCerrar=document.getElementById("v-cerrar");
  if(!libro)return;
  var PAGINAS=15,HOJAS=Math.ceil(PAGINAS/2); // hoja 1 = páginas 1 y 2, etc.
  var total=HOJAS+1; // + la tapa
  var n=0,hojas=[];
  function img(src,alt,eager){var i=new Image();i.src=src;i.alt=alt;i.draggable=false;i.width=700;i.height=1082;i.loading=eager?"eager":"lazy";i.decoding="async";return i}
  function cara(cls,contenido){var d=document.createElement("div");d.className="cara "+cls;if(contenido)d.appendChild(contenido);return d}
  function pag(k,eager){return k>=1&&k<=PAGINAS?img("img/paginas/p"+(k<10?"0":"")+k+".jpg","Página "+k+" del libro",eager):null}
  function hoja(i,frente,dorso){
    var h=document.createElement("div");h.className="hoja";
    h.style.setProperty("--zr",total-i+1);h.style.setProperty("--zl",i+2);
    h.appendChild(frente);h.appendChild(dorso);libro.appendChild(h);hojas.push(h);
  }
  function construir(){
    var fondo=document.createElement("div");fondo.className="fondo";
    fondo.appendChild(cara("",img("img/libro/contraportada.jpg","Contraportada del libro")));libro.appendChild(fondo);
    var tapa=img("img/libro/portada.jpg","Portada de El río que enloqueció, de Manuel Faz",true);
    hoja(0,cara("tapa frente",tapa),cara("dorso"));
    function listo(){libro.classList.add("listo")}
    if(tapa.complete&&tapa.naturalWidth)listo();else{tapa.addEventListener("load",listo);tapa.addEventListener("error",function(){})}
    for(var j=1;j<=HOJAS;j++){
      hoja(j,cara("frente",pag(2*j-1,j<4)),cara("dorso",pag(2*j,j<4)));
    }
  }
  function etiqueta(){
    if(n===0)return "Toca el libro para abrirlo";
    if(n===1)return "Página 1 · Vista previa";
    if(n===total)return "Contraportada";
    return "Páginas "+(2*(n-1))+"–"+(2*n-1)+" · Vista previa";
  }
  function actualizar(){
    libro.classList.toggle("abierto",n>0);
    hojas.forEach(function(h,i){h.classList.toggle("volteada",i<n)});
    estado.textContent=etiqueta();
    ctrl.hidden=n===0;
    bPrev.disabled=n===0;bNext.disabled=n===total;
  }
  function ir(d){var m=Math.max(0,Math.min(total,n+d));if(m!==n){n=m;actualizar()}}
  construir();actualizar();
  libro.addEventListener("click",function(e){
    if(n===0){ir(1);return}
    var r=escena.getBoundingClientRect(),mitad=r.left+r.width/2;
    ir(e.clientX>=mitad?1:-1);
  });
  bPrev.addEventListener("click",function(){ir(-1)});
  bNext.addEventListener("click",function(){ir(1)});
  bCerrar.addEventListener("click",function(){n=0;actualizar()});
  document.addEventListener("keydown",function(e){
    if(e.target&&/input|select|textarea/i.test(e.target.tagName))return;
    if(e.key==="ArrowRight")ir(1);else if(e.key==="ArrowLeft")ir(-1);else if(e.key==="Escape"&&n>0){n=0;actualizar()}
  });
  var x0=null;
  escena.addEventListener("touchstart",function(e){x0=e.touches[0].clientX},{passive:true});
  escena.addEventListener("touchend",function(e){
    if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;x0=null;
    if(Math.abs(dx)>40){ir(dx<0?1:-1);e.preventDefault()}
  });
})();
