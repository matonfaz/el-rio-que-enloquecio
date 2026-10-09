/* Tamaño de letra: botones A−, A y A+ fijos arriba de cada página. La elección se recuerda en localStorage. */
(function(){
"use strict";
var CLAVE="escala-letra",PASOS=[0.95,1,1.15,1.3],NORMAL=1;
function leer(){try{var v=parseFloat(localStorage.getItem(CLAVE));if(PASOS.indexOf(v)>-1)return v}catch(e){}return NORMAL}
function guardar(v){try{localStorage.setItem(CLAVE,String(v))}catch(e){}}
var escala=leer();
function aplicar(v,avisar){
  escala=v;
  document.documentElement.style.setProperty("--escala",String(v));
  if(avisar){guardar(v);try{window.dispatchEvent(new Event("escala-letra"))}catch(e){}}
}
aplicar(escala,false);
function mover(d){var i=PASOS.indexOf(escala)+d;if(i<0)i=0;if(i>=PASOS.length)i=PASOS.length-1;aplicar(PASOS[i],true)}
function boton(texto,etiqueta,accion){
  var b=document.createElement("button");b.type="button";b.textContent=texto;
  b.setAttribute("aria-label",etiqueta);b.title=etiqueta;b.addEventListener("click",accion);return b;
}
function barra(){
  if(document.querySelector(".letra-bar"))return;
  var d=document.createElement("div");d.className="letra-bar";d.setAttribute("role","group");d.setAttribute("aria-label","Tamaño de letra");
  d.appendChild(boton("A−","Reducir el tamaño de la letra",function(){mover(-1)}));
  d.appendChild(boton("A","Tamaño de letra normal",function(){aplicar(NORMAL,true)}));
  d.appendChild(boton("A+","Aumentar el tamaño de la letra",function(){mover(1)}));
  document.body.insertBefore(d,document.body.firstChild);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",barra);else barra();
})();
