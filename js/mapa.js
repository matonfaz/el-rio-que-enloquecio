(function(){
"use strict";
var svg=document.getElementById("mapa-svg"); if(!svg)return;
// El mapa va en un contenedor con desplazamiento lateral para que su texto no baje de 16 px en pantallas angostas.
if(svg.parentNode&&!svg.parentNode.classList.contains("fig-scroll")){var env=document.createElement("div");env.className="fig-scroll";svg.parentNode.insertBefore(env,svg);env.appendChild(svg)}
var NS="http://www.w3.org/2000/svg", panel=document.getElementById("mapa-panel");
var rango=document.getElementById("creciente-r"), textoEtapa=document.getElementById("creciente-t"), btnPlay=document.getElementById("creciente-play");
var reducir=window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches;
// Proyección sencilla (esquema): lat 26.3–31.0, lon -102.0 a -98.8
var K=620/4.7;
function px(lat,lon){return [10+(lon+102)*K*0.877, 10+(31.0-lat)*K]}
// Ciudades (posiciones aproximadas). Cada ciudad lleva datos del timeline.
var ciudades=[
 {id:"ozona",nombre:"Ozona",lat:30.71,lon:-101.20,lado:"der",
  hechos:["Fuera del río Bravo, a 112 millas (180 km) al norte de Del Río.","El Johnson Draw se desbordó hacia las 4 a.m. del 28 de junio; la AP contó 16 muertos y 2 desaparecidos."],fichas:[61,29]},
 {id:"langtry",nombre:"Langtry",lat:29.81,lon:-101.56,lado:"derarr",
  hechos:["El 27 de junio quedó varado el Sunset Limited; helicópteros de la Fuerza Aérea evacuaron a los pasajeros."],fichas:[54,55,11]},
 {id:"delrio",nombre:"Del Río / Ciudad Acuña",corto:"Del Río · Acuña",lat:29.34,lon:-100.95,lado:"izq",
  hechos:["Récord de unos 40 pies (12.2 m) el 28 de junio; Ciudad Acuña quedó bajo el agua.","Se cayó el puente internacional entre las dos ciudades.","De 10,000 a 15,000 personas, según la fuente, huyeron a los cerros de Acuña."],fichas:[67,8,70,64]},
 {id:"eagle",nombre:"Eagle Pass / Piedras Negras",corto:"Eagle Pass · Piedras Negras",lat:28.705,lon:-100.505,lado:"izq",
  hechos:["Cresta de 53.6 pies (16.3 m) el 29 de junio a las 4:30 a.m.","Piedras Negras: dos terceras partes de la ciudad parecían bajo el agua; se recuperaron 38 cuerpos el 30 de junio y la cifra real nunca se fijó (de 20 a 200, según las fuentes)."],fichas:[79,84,38,18]},
 {id:"laredo",nombre:"Laredo / Nuevo Laredo",corto:"Laredo · Nuevo Laredo",lat:27.495,lon:-99.51,lado:"izq",
  hechos:["Cresta de 62.21 pies (19.0 m) el 30 de junio a las 9:30 a.m., la más alta registrada.","Tres tramos del puente internacional se perdieron; Nuevo Laredo contó sus primeros muertos el 1 de julio."],fichas:[91,110,106,86]},
 {id:"falcon",nombre:"Presa Falcón",lat:26.56,lon:-99.17,lado:"izq",
  hechos:["Casi vacía, recibió 2,100,000 acres-pie (2,590 millones de m³) sin derramar."],fichas:[73,41]}
];
// Trazo simplificado del río (lat, lon); los puntos de ciudad están marcados.
var ruta=[[29.81,-101.56,"langtry"],[29.70,-101.37],[29.58,-101.18],[29.45,-101.05],[29.34,-100.95,"delrio"],[29.10,-100.75],[28.92,-100.64],[28.705,-100.505,"eagle"],[28.50,-100.35],[28.25,-100.05],[27.95,-99.80],[27.70,-99.62],[27.495,-99.51,"laredo"],[27.20,-99.45],[26.93,-99.30],[26.56,-99.17,"falcon"]];
var etapas=[
 {c:"langtry",t:"27 de junio · Langtry: las lluvias sacan de cauce al Pecos y al Devils, y el Sunset Limited queda varado."},
 {c:"delrio",t:"28 de junio · Del Río y Ciudad Acuña: el río llega a unos 40 pies (12.2 m), récord."},
 {c:"eagle",t:"29 de junio, 4:30 a.m. · Eagle Pass y Piedras Negras: cresta de 53.6 pies (16.3 m)."},
 {c:"laredo",t:"30 de junio, 9:30 a.m. · Laredo y Nuevo Laredo: cresta de 62.21 pies (19.0 m)."},
 {c:"falcon",t:"Principios de julio · Presa Falcón: absorbe la crecida, 2,100,000 acres-pie (2,590 millones de m³)."}
];
function el(n,a,t){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);if(t!==undefined)e.textContent=t;return e}
function h(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e}
// Dibujo
var pts=ruta.map(function(p){return px(p[0],p[1])});
var d="M"+pts.map(function(p){return p[0].toFixed(1)+" "+p[1].toFixed(1)}).join(" L");
var largo=[0],i;for(i=1;i<pts.length;i++)largo.push(largo[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));
var total=largo[largo.length-1];
function largoCiudad(id){for(var j=0;j<ruta.length;j++)if(ruta[j][2]===id)return largo[j];return 0}
svg.appendChild(el("text",{x:14,y:30,"font-size":18,fill:"currentColor","letter-spacing":"2"},"ESTADOS UNIDOS"));
svg.appendChild(el("text",{x:14,y:622,"font-size":18,fill:"currentColor","letter-spacing":"2"},"MÉXICO"));
svg.appendChild(el("path",{d:d,fill:"none",stroke:"var(--rojo)","stroke-width":9,"stroke-opacity":.3,"stroke-linecap":"round","stroke-linejoin":"round"}));
var vivo=el("path",{d:d,fill:"none",stroke:"var(--rojo)","stroke-width":9,"stroke-linecap":"round","stroke-linejoin":"round","stroke-dasharray":"0 "+total});
svg.appendChild(vivo);
var grupos={};
ciudades.forEach(function(c){
  var p=px(c.lat,c.lon), g=el("g",{tabindex:0,role:"button","aria-label":c.nombre,"data-id":c.id,class:"mp"});
  g.appendChild(el("circle",{cx:p[0],cy:p[1],r:16,fill:"transparent"}));
  g.appendChild(el("circle",{cx:p[0],cy:p[1],r:9,fill:"var(--negro)",stroke:"var(--crema)","stroke-width":3,class:"mp-c"}));
  var der=c.lado==="der"||c.lado==="derarr", dx=der?16:-16, anc=der?"start":"end", dy=c.lado==="derarr"?-9:5;
  var tx=el("text",{x:p[0]+dx,y:p[1]+dy,"text-anchor":anc,"font-size":18,"font-weight":700,fill:"currentColor",class:"ciudad"});
  var partes=(c.corto||c.nombre).split(" · ");
  if(partes.length>1){tx.appendChild(el("tspan",{x:p[0]+dx,dy:"-0.4em"},partes[0]));tx.appendChild(el("tspan",{x:p[0]+dx,dy:"1.2em"},partes[1]))}else tx.textContent=partes[0];
  g.appendChild(tx);
  g.addEventListener("click",function(){elegir(c.id,true)});
  g.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();elegir(c.id,true)}});
  svg.appendChild(g);grupos[c.id]=g;
});
// Fichas del timeline (títulos desde el CSV)
var fichas={};
fetch("timeline_rio_1954.csv").then(function(r){return r.text()}).then(function(t){
  (window.parseCSVRio?window.parseCSVRio(t):[]).forEach(function(r){fichas[r.id]=r});
  if(actual)pintarPanel(actual);
}).catch(function(){});
var actual=null;
function elegir(id,porClic){
  actual=id;
  if(porClic&&window.innerWidth<760)setTimeout(function(){panel.scrollIntoView({block:"nearest",behavior:reducir?"auto":"smooth"})},50);
  Object.keys(grupos).forEach(function(k){grupos[k].classList.toggle("sel",k===id)});
  pintarPanel(id);
}
function pintarPanel(id){
  var c=ciudades.filter(function(x){return x.id===id})[0]; if(!c)return;
  panel.textContent="";
  panel.appendChild(h("h3",null,c.nombre));
  var ul=h("ul","mapa-hechos");c.hechos.forEach(function(x){ul.appendChild(h("li",null,x))});panel.appendChild(ul);
  var fs=c.fichas.filter(function(n){return fichas[n]});
  if(fs.length){
    panel.appendChild(h("h4",null,"Ver en la cronología"));
    var l=h("ul","mapa-fichas");
    fs.forEach(function(n){var f=fichas[n],li=h("li"),a=h("a",null,f.titulo);a.href="#ev-"+n;li.appendChild(a);li.appendChild(document.createTextNode(" — "+(f.hora?f.hora+" h, ":"")+f.lugar));l.appendChild(li)});
    panel.appendChild(l);
  }
}
// Barra de la crecida
var temporizador=null;
function etapa(n){
  rango.value=n;var e=etapas[n];
  textoEtapa.textContent=e.t;
  var L=n===0?0:largoCiudad(e.c);
  vivo.setAttribute("stroke-dasharray",L+" "+total);
  elegir(e.c,false);
}
rango.addEventListener("input",function(){parar();etapa(+rango.value)});
function parar(){if(temporizador){clearInterval(temporizador);temporizador=null;btnPlay.textContent="▶ Reproducir"}}
if(reducir)btnPlay.hidden=true;
btnPlay.addEventListener("click",function(){
  if(temporizador){parar();return}
  if(+rango.value>=4)etapa(0);
  btnPlay.textContent="❚❚ Pausa";
  temporizador=setInterval(function(){var n=+rango.value+1;if(n>4){parar();return}etapa(n)},2200);
});
etapa(0);
})();
