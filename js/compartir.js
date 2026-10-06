(function(){
  var sitio="https://matonfaz.github.io/el-rio-que-enloquecio/";
  function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
  function url(){return location.href.split("#")[0]}
  var texto="El río que enloqueció: la tragedia y resurrección de Piedras Negras en 1954";
  var caja=el("section","compartir");caja.setAttribute("aria-label","Compartir");
  caja.appendChild(el("span","compartir-t","Compartir"));
  var fila=el("div","compartir-b");
  var fb=el("a","boton","Facebook");fb.target="_blank";fb.rel="noopener";
  var x=el("a","boton","X");x.target="_blank";x.rel="noopener";
  var wa=el("a","boton","WhatsApp");wa.target="_blank";wa.rel="noopener";
  function enlaces(){
    fb.href="https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(url());
    x.href="https://twitter.com/intent/tweet?url="+encodeURIComponent(url())+"&text="+encodeURIComponent(texto);
    wa.href="https://wa.me/?text="+encodeURIComponent(texto+" "+url());
  }
  enlaces();
  fb.addEventListener("click",enlaces);x.addEventListener("click",enlaces);wa.addEventListener("click",enlaces);
  [fb,x,wa].forEach(function(b){fila.appendChild(b)});
  caja.appendChild(fila);
  var main=document.querySelector("main");
  if(main)main.appendChild(caja);else document.body.appendChild(caja);
})();
