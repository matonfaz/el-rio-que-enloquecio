(function(){
  var sitio="https://matonfaz.github.io/el-rio-que-enloquecio/";
  function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
  function url(){return location.href.split("#")[0]}
  var titulo=document.title,texto="El río que enloqueció: la tragedia y resurrección de Piedras Negras en 1954";
  var caja=el("section","compartir");caja.setAttribute("aria-label","Compartir");
  caja.appendChild(el("span","compartir-t","Compartir"));
  var fila=el("div","compartir-b");
  var fb=el("a","boton","Facebook");fb.target="_blank";fb.rel="noopener";
  var x=el("a","boton","X");x.target="_blank";x.rel="noopener";
  var wa=el("a","boton","WhatsApp");wa.target="_blank";wa.rel="noopener";
  var ig=el("button","boton","Instagram");ig.type="button";
  var aviso=el("p","compartir-aviso");aviso.setAttribute("aria-live","polite");
  function enlaces(){
    fb.href="https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(url());
    x.href="https://twitter.com/intent/tweet?url="+encodeURIComponent(url())+"&text="+encodeURIComponent(texto);
    wa.href="https://wa.me/?text="+encodeURIComponent(texto+" "+url());
  }
  enlaces();
  fb.addEventListener("click",enlaces);x.addEventListener("click",enlaces);wa.addEventListener("click",enlaces);
  function copiar(){
    var u=url();
    function listo(){aviso.textContent="Enlace copiado. Pégalo en tu historia, publicación o biografía de Instagram."}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(u).then(listo,function(){aviso.textContent="Copia este enlace: "+u})}
    else{aviso.textContent="Copia este enlace: "+u}
  }
  ig.addEventListener("click",function(){
    // Instagram no tiene botón web de compartir: en celular se abre el menú de compartir del sistema; en escritorio se copia el enlace.
    if(navigator.share){navigator.share({title:titulo,text:texto,url:url()}).catch(function(e){if(e&&e.name!=="AbortError")copiar()})}
    else copiar();
  });
  [fb,x,wa,ig].forEach(function(b){fila.appendChild(b)});
  caja.appendChild(fila);caja.appendChild(aviso);
  var main=document.querySelector("main");
  if(main)main.appendChild(caja);else document.body.appendChild(caja);
})();
