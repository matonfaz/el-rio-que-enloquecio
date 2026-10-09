(function(){
  var cont=document.getElementById("canciones"),pie=document.getElementById("canciones-pie");
  function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
  var CAMPOS=[["productor","Productor"],["entrevistador","Entrevistador"],["fecha","Fecha"],["formato","Formato"],["duracion","Duración"],["idioma","Idioma"],["coleccion","Colección"],["interpretes","Intérpretes"],["genero","Género"],["compositor","Compositor"],["disco","Disco"],["matriz","Matriz"],["velocidad","Velocidad"],["album","Álbum"],["sello","Sello"],["publicado","Publicado"],["editora","Editora"]];
  function tarjeta(c){
    var li=el("li","cancion");
    li.appendChild(el("h3",null,c.titulo));
    var dl=el("dl","cancion-datos");
    CAMPOS.forEach(function(k){
      if(!c[k[0]])return;
      var f=el("div");f.appendChild(el("dt",null,k[1]));f.appendChild(el("dd",null,c[k[0]]));dl.appendChild(f);
    });
    li.appendChild(dl);
    if(c.nota_matriz)li.appendChild(el("p","cancion-nota-matriz","Nota de matriz: «"+c.nota_matriz+"»"));
    if(c.video){
      var v=el("div","video");
      var i=document.createElement("iframe");
      i.src="https://www.youtube-nocookie.com/embed/"+encodeURIComponent(c.video);
      i.title="Video: "+c.titulo;i.loading="lazy";i.allowFullscreen=true;
      i.referrerPolicy="strict-origin-when-cross-origin";
      i.setAttribute("allow","accelerometer; encrypted-media; gyroscope; picture-in-picture");
      v.appendChild(i);li.appendChild(v);
    }
    if(c.credito)li.appendChild(el("p","cancion-credito",c.credito));
    if(c.ficha_url){var a=el("a","boton",c.ficha_texto||"Ver ficha");a.href=c.ficha_url;a.target="_blank";a.rel="noopener";li.appendChild(a)}
    if(c.descripcion)li.appendChild(el("p","cancion-nota",c.descripcion));
    if(c.botones&&c.botones.length){
      var bs=el("div","botones");
      c.botones.forEach(function(b){var a=el("a","boton",b.texto);a.href=b.url;a.target="_blank";a.rel="noopener";bs.appendChild(a)});
      li.appendChild(bs);
    }
    if(c.nota)li.appendChild(el("p","cancion-nota",c.nota));
    return li;
  }
  fetch("canciones.json").then(function(r){return r.json()}).then(function(d){
    var intro=document.getElementById("canciones-intro");
    if(d.intro&&intro){
      intro.appendChild(el("h2",null,d.intro.titulo));
      d.intro.parrafos.forEach(function(p){intro.appendChild(el("p",null,p))});
    }
    (d.secciones||[]).forEach(function(s){
      var sec=el("section","canciones-sec");sec.id=s.id;
      sec.appendChild(el("h2",null,s.titulo));
      if(s.intro)sec.appendChild(el("p",null,s.intro));
      var ul=el("ul","canciones-lista");
      s.canciones.forEach(function(c){ul.appendChild(tarjeta(c))});
      sec.appendChild(ul);
      if(s.pie)sec.appendChild(el("p","canciones-pie",s.pie));
      cont.appendChild(sec);
    });
    if(d.pie)pie.textContent=d.pie;
  }).catch(function(){cont.appendChild(el("div","error","No se pudo cargar la lista de canciones."))});
})();
