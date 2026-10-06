(function(){
  var lista=document.getElementById("entregas");
  function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
  fetch("entregas.json").then(function(r){return r.json()}).then(function(datos){
    lista.textContent="";
    datos.forEach(function(d,i){
      var li=el("li","entrega");
      li.appendChild(el("span","entrega-num","Entrega "+(i+1)));
      li.appendChild(el("h2",null,d.titulo));
      var a=el("a","boton","Leer en Substack");a.href=d.url;a.target="_blank";a.rel="noopener";
      li.appendChild(a);lista.appendChild(li);
    });
    var p=el("li","entrega proximamente");
    p.appendChild(el("span","entrega-num","Próximamente"));
    p.appendChild(el("h2",null,"Más entregas en camino"));
    lista.appendChild(p);
  }).catch(function(){});
})();
