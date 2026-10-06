(function(){
  var lista=document.getElementById("entregas");
  function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
  fetch("entregas.json").then(function(r){return r.json()}).then(function(datos){
    lista.textContent="";
    datos=datos.map(function(d,i){d.n=d.n||i+1;return d});
    if(datos.every(function(d){return d.fecha}))datos.sort(function(a,b){return a.fecha<b.fecha?1:-1});
    datos.forEach(function(d){
      var li=el("li","entrega");
      li.appendChild(el("span","entrega-num","Entrega "+d.n));
      if(d.fecha){var t=el("time",null,d.fechaTexto||d.fecha);t.dateTime=d.fecha;li.appendChild(t)}
      li.appendChild(el("h2",null,d.titulo));
      if(d.subtitulo)li.appendChild(el("p","entrega-sub",d.subtitulo));
      var a=el("a","boton","Leer en Substack");a.href=d.url;a.target="_blank";a.rel="noopener";
      li.appendChild(a);lista.appendChild(li);
    });
    var p=el("li","entrega proximamente");
    p.appendChild(el("span","entrega-num","Próximamente"));
    p.appendChild(el("h2",null,"Más entregas en camino"));
    lista.appendChild(p);
  }).catch(function(){});
})();
