(function(){
"use strict";
var CSV="crecidas_anteriores.csv", cont=document.getElementById("antes-lista");
function parseCSV(t){
  t=t.replace(/^\uFEFF/,"");
  var filas=[],fila=[],c="",q=false,i,ch;
  for(i=0;i<t.length;i++){
    ch=t[i];
    if(q){ if(ch==='"'){ if(t[i+1]==='"'){c+='"';i++} else q=false } else c+=ch; }
    else if(ch==='"') q=true;
    else if(ch===","){fila.push(c);c=""}
    else if(ch==="\n"||ch==="\r"){ if(ch==="\r"&&t[i+1]==="\n")i++; fila.push(c);c=""; if(fila.length>1||fila[0]!=="")filas.push(fila); fila=[]; }
    else c+=ch;
  }
  if(c!==""||fila.length){fila.push(c);filas.push(fila)}
  var cab=filas.shift();
  return filas.map(function(f){var o={};cab.forEach(function(k,j){o[k]=(f[j]||"").trim()});return o});
}
function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e}
function fecha(f){var p=f.split("-").map(Number);return new Date(Date.UTC(p[0],p[1]-1,p[2])).toLocaleDateString("es-MX",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"})}
fetch(CSV).then(function(r){return r.text()}).then(function(t){
  var filas=parseCSV(t).filter(function(r){return r.fecha&&r.titulo});
  var anio=null,ol=null;
  filas.forEach(function(e){
    var y=e.fecha.slice(0,4);
    if(y!==anio){anio=y;cont.appendChild(el("h3","dia",y));ol=el("ol","lista");cont.appendChild(ol)}
    var a=el("li","ev");a.id="ev-"+e.id;
    var meta=el("div","meta");meta.appendChild(el("span",null,fecha(e.fecha)));meta.appendChild(el("span","lugar","📍 "+e.lugar));a.appendChild(meta);
    a.appendChild(el("h4",null,e.titulo));a.appendChild(el("p",null,e.texto));
    var f=el("div","fuente");f.appendChild(el("b",null,"Fuente: "));f.appendChild(document.createTextNode(e.fuente));a.appendChild(f);
    ol.appendChild(a);
  });
}).catch(function(){cont.appendChild(el("div","error","No se pudo leer "+CSV+"."))});
})();
