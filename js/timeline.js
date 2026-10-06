(function(){
"use strict";
var CSV="timeline_rio_1954.csv";
var NOCHE_DIA="1954-06-28", NOCHE_SIG="1954-06-29", H_INI=17, H_FIN=6;
var eventos=[], estado={dia:"todos",lugar:"todos",modo:"clave"};
var $=function(id){return document.getElementById(id)};
window.parseCSVRio=function(t){return parseCSV(t)};

function parseCSV(t){
  t=t.replace(/^﻿/,"");
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
  var cab=filas.shift().map(function(s){return s.trim()});
  return filas.map(function(f){var o={};cab.forEach(function(k,j){o[k]=(f[j]||"").trim()});return o});
}
function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e}
function fechaLarga(f,corta){
  var p=f.split("-").map(Number), d=new Date(Date.UTC(p[0],p[1]-1,p[2]));
  if(corta&&p[0]!==1954)return d.toLocaleDateString("es-MX",{day:"numeric",month:"short",year:"numeric",timeZone:"UTC"});
  return d.toLocaleDateString("es-MX",{weekday:corta?"short":"long",day:"numeric",month:corta?"short":"long",year:corta?undefined:"numeric",timeZone:"UTC"});
}
function horaNum(e){var m=/^(\d{1,2}):(\d{2})$/.exec(e.hora);return m?+m[1]:null}

function tarjeta(e){
  var a=el("li","ev"); a.id="ev-"+e.id;
  var meta=el("div","meta");
  if(e.hora){ meta.appendChild(el("span","hora",e.hora+" h")); if(/aprox/i.test(e.hora_aproximada))meta.appendChild(el("span","aprox","hora aprox.")); }
  meta.appendChild(el("span","lugar","📍 "+e.lugar));
  a.appendChild(meta);
  a.appendChild(el("h4",null,e.titulo));
  a.appendChild(el("p",null,e.texto));
  var f=el("div","fuente"); f.appendChild(el("b",null,"Fuente: ")); f.appendChild(document.createTextNode(e.fuente));
  a.appendChild(f);
  var m=el("details","ficha-menu"); m.appendChild(el("summary",null,"Compartir o citar"));
  var cm=el("div","ficha-menu-c");
  var b=el("button","ficha-comp","Compartir esta ficha"); b.type="button";
  b.addEventListener("click",function(){compartirFicha(e,b)});
  var c=el("button","ficha-comp","Citar esta ficha"); c.type="button";
  c.addEventListener("click",function(){citarFicha(e,c)});
  cm.appendChild(b); cm.appendChild(c); m.appendChild(cm); a.appendChild(m);
  return a;
}
function fechaCita(f){var p=f.split("-").map(Number);return new Date(Date.UTC(p[0],p[1]-1,p[2])).toLocaleDateString("es-MX",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"})}
function citarFicha(e,b){
  var hoy=new Date().toLocaleDateString("es-MX",{day:"numeric",month:"long",year:"numeric"});
  var txt="Faz Nandín, M. «"+e.titulo+"». Ficha "+e.id+" ("+fechaCita(e.fecha)+"). En: El río que enloqueció, cronología documental. "+urlFicha(e)+" (consultado el "+hoy+"). Fuente original: "+e.fuente+".";
  function listo(){b.textContent="Cita copiada ✓";setTimeout(function(){b.textContent="Citar esta ficha"},2500)}
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(listo,function(){window.prompt("Copia esta cita:",txt)});
  else window.prompt("Copia esta cita:",txt);
}
function descargarDatos(){
  var cols=["id","fecha","hora","hora_aproximada","lugar","titulo","texto","fuente"];
  function esc(v){v=String(v||"");return /[",\n\r]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}
  var filas=[cols.join(",")].concat(eventos.map(function(e){return cols.map(function(k){return esc(e[k])}).join(",")}));
  var blob=new Blob(["\uFEFF"+filas.join("\r\n")+"\r\n"],{type:"text/csv;charset=utf-8"});
  var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="cronologia-rio-bravo-1954.csv";
  document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500);
}
function urlFicha(e){return location.href.split("#")[0]+"#ev-"+e.id}
function compartirFicha(e,b){
  var u=urlFicha(e),t=e.titulo+" · El río que enloqueció";
  function copiado(){b.textContent="Enlace copiado ✓";setTimeout(function(){b.textContent="Compartir esta ficha"},2500)}
  if(navigator.share){navigator.share({title:t,text:e.titulo,url:u}).catch(function(x){if(x&&x.name!=="AbortError")copiar()})}
  else copiar();
  function copiar(){
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(u).then(copiado,function(){window.prompt("Copia este enlace:",u)});
    else window.prompt("Copia este enlace:",u);
  }
}
function irAFicha(){
  var m=/^#ev-(\d+)$/.exec(location.hash);if(!m)return;
  estado.modo="todo";estado.dia="todos";estado.lugar="todos";
  $("filtro-lugar").value="todos";actualizarChips();render();
  var n=document.getElementById("ev-"+m[1]);if(!n)return;
  n.classList.add("resaltada");n.scrollIntoView({block:"center"});
}
function zona(e){return e.lugar.split(",")[0].trim()}
function filtrados(base){
  return base.filter(function(e){return estado.lugar==="todos"||zona(e)===estado.lugar});
}
function render(){
  var cont=$("timeline"); cont.textContent="";
  var noche=estado.modo==="noche", clave=estado.modo==="clave";
  $("filtro-dias-wrap").hidden=noche||clave; $("nav-horas").hidden=!noche; $("filtro-lugar-wrap").hidden=clave;
  $("btn-clave").setAttribute("aria-pressed",clave);
  $("btn-todo").setAttribute("aria-pressed",estado.modo==="todo");
  $("btn-noche").setAttribute("aria-pressed",noche);
  if(noche) renderNoche(cont); else if(clave) renderClave(cont); else renderTodo(cont);
}
function renderClave(cont){
  var lista=eventos.filter(function(e){return e.clave==="sí"});
  $("estado").textContent=lista.length+" momentos clave de "+eventos.length+" fichas";
  var ol=el("ol","lista");lista.forEach(function(e){ol.appendChild(tarjeta(e))});cont.appendChild(ol);
  var b=el("button","boton","Ver toda la cronología ("+eventos.length+" fichas)");b.type="button";
  b.onclick=function(){estado.modo="todo";render();window.scrollTo({top:$("controles").offsetTop,behavior:"smooth"})};
  var w=el("div","botones centrado");w.appendChild(b);cont.appendChild(w);
}
function renderTodo(cont){
  var lista=filtrados(eventos).filter(function(e){return estado.dia==="todos"||e.fecha===estado.dia});
  $("estado").textContent=lista.length+" de "+eventos.length+" eventos";
  if(!lista.length){cont.appendChild(el("div","vacio","No hay eventos con esa combinación de día y lugar."));return}
  var dia=null,ol=null;
  lista.forEach(function(e){
    if(e.fecha!==dia){dia=e.fecha;var h=el("h3","dia",fechaLarga(dia));cont.appendChild(h);ol=el("ol","lista");cont.appendChild(ol)}
    ol.appendChild(tarjeta(e));
  });
}
function renderNoche(cont){
  var base=filtrados(eventos), usados=0;
  cont.appendChild(el("div","intro","Recorre la noche hora por hora, de las 17:00 del lunes 28 a las 06:00 del martes 29 de junio. Las horas sin tarjeta no tienen eventos con hora registrada en el CSV."));
  var nav=$("horas-links"); nav.textContent="";
  var secuencia=[],h;
  for(h=H_INI;h<=23;h++)secuencia.push({f:NOCHE_DIA,h:h});
  for(h=0;h<=H_FIN;h++)secuencia.push({f:NOCHE_SIG,h:h});
  secuencia.forEach(function(s){
    var evs=base.filter(function(e){return e.fecha===s.f&&horaNum(e)===s.h});
    usados+=evs.length;
    var hh=("0"+s.h).slice(-2)+":00", id="h-"+s.f+"-"+s.h;
    var a=el("a",evs.length?"con":"",hh); a.href="#"+id; nav.appendChild(a);
    var slot=el("section","slot"); slot.id=id;
    var r=el("div","reloj",hh); r.appendChild(el("small",null,s.f===NOCHE_DIA?"lun 28":"mar 29")); slot.appendChild(r);
    var der=el("div");
    if(evs.length){var ol=el("ol","lista");ol.style.cssText="border:0;padding:0";evs.forEach(function(e){ol.appendChild(tarjeta(e))});der.appendChild(ol)}
    else der.appendChild(el("div","vacia","Sin eventos con hora registrada en esta hora."));
    slot.appendChild(der); cont.appendChild(slot);
    if(s.f===NOCHE_DIA&&s.h===23){cont.appendChild(el("div","corte","— Medianoche: comienza el martes 29 de junio —"))}
  });
  var sinHora=base.filter(function(e){return e.fecha===NOCHE_DIA&&!e.hora});
  if(sinHora.length){
    cont.appendChild(el("div","corte","Lunes 28 · eventos sin hora exacta"));
    var ol=el("ol","lista");sinHora.forEach(function(e){ol.appendChild(tarjeta(e))});cont.appendChild(ol);
  }
  $("estado").textContent=usados+" eventos con hora entre las 17:00 del 28 y las 06:59 del 29"+(sinHora.length?" · "+sinHora.length+" del 28 sin hora exacta":"");
}
function chip(txt,val,cuenta){
  var b=el("button","chip"); b.type="button"; b.textContent=txt+" ";
  b.appendChild(el("small",null,"("+cuenta+")")); b.dataset.dia=val;
  b.setAttribute("aria-pressed",estado.dia===val);
  b.addEventListener("click",function(){estado.dia=val;actualizarChips();render()});
  return b;
}
function actualizarChips(){
  Array.prototype.forEach.call($("filtro-dias").querySelectorAll(".chip"),function(b){b.setAttribute("aria-pressed",b.dataset.dia===estado.dia)});
}
function iniciar(rows){
  eventos=rows.filter(function(r){return r.fecha&&r.titulo}).map(function(r,i){r._i=i;return r});
  eventos.sort(function(a,b){return a.fecha<b.fecha?-1:a.fecha>b.fecha?1:a._i-b._i});
  var dias=[],lugares={};
  eventos.forEach(function(e){if(dias.indexOf(e.fecha)<0)dias.push(e.fecha);lugares[zona(e)]=(lugares[zona(e)]||0)+1});
  var fd=$("filtro-dias"); fd.textContent="";
  fd.appendChild(chip("Todos","todos",eventos.length));
  dias.forEach(function(d){fd.appendChild(chip(fechaLarga(d,true),d,eventos.filter(function(e){return e.fecha===d}).length))});
  var sel=$("filtro-lugar"); sel.textContent="";
  var o=el("option",null,"Todos los lugares ("+eventos.length+")");o.value="todos";sel.appendChild(o);
  Object.keys(lugares).sort(function(a,b){return a.localeCompare(b,"es")}).forEach(function(l){var o=el("option",null,l+" ("+lugares[l]+")");o.value=l;sel.appendChild(o)});
  sel.onchange=function(){estado.lugar=sel.value;render()};
  $("btn-clave").onclick=function(){estado.modo="clave";render()};
  $("btn-todo").onclick=function(){estado.modo="todo";render()};
  var bt=$("btn-toda");if(bt)bt.onclick=function(){estado.modo="todo";render();window.scrollTo({top:$("controles").offsetTop,behavior:"smooth"})};
  var be=$("btn-empieza");if(be)be.onclick=function(){estado.modo="noche";render();window.scrollTo({top:$("controles").offsetTop,behavior:"smooth"})};
  $("btn-noche").onclick=function(){estado.modo="noche";render();window.scrollTo({top:$("controles").offsetTop,behavior:"smooth"})};
  var bd=$("btn-datos");if(bd){bd.disabled=false;bd.onclick=descargarDatos}
  $("contenido").hidden=false; render();
  irAFicha();window.addEventListener("hashchange",irAFicha);
}
function errorCarga(){
  var c=$("timeline"); c.textContent="";
  var d=el("div","error");
  d.appendChild(el("p",null,"No se pudo leer "+CSV+" automáticamente (pasa al abrir el archivo directo desde el disco, sin servidor). Selecciona el archivo CSV manualmente:"));
  var inp=document.createElement("input");inp.type="file";inp.accept=".csv,text/csv";
  inp.onchange=function(){var fr=new FileReader();fr.onload=function(){d.remove();iniciar(parseCSV(fr.result))};fr.readAsText(inp.files[0],"utf-8")};
  d.appendChild(inp);c.appendChild(d);$("contenido").hidden=false;
  $("controles").hidden=true;
}
fetch(CSV).then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(t){iniciar(parseCSV(t))}).catch(errorCarga);
})();
