# El río que enloqueció

Sitio web documental y archivo interactivo del libro ***El río que enloqueció: La tragedia y resurrección de Piedras Negras en 1954***, de **Manuel Faz Nandín**.

🔗 **Sitio en vivo:** [matonfaz.github.io/el-rio-que-enloquecio](https://matonfaz.github.io/el-rio-que-enloquecio/)  
📰 **Entregas en Substack:** [manuelfaznandin.substack.com](https://manuelfaznandin.substack.com/s/el-rio-que-enloquecio)

---

## Estructura del sitio

Sitio estático en HTML, CSS y JavaScript puro (sin *build* ni servidor; se publica directamente en GitHub Pages):

* `index.html` — Cronología interactiva minuto a minuto (alimentada por `timeline_rio_1954.csv`).
* `inundacion-piedras-negras-1954.html` — Contexto general de la inundación de junio de 1954.
* `libro.html` — Sinopsis, semblanza del autor y enlaces a Substack (en espera de publicación).
* `canciones.html` — Prensa, corridos y cobertura en medios.
* `substack.html` — Índice de crónicas y entregas adicionales.
* `numeralia.html` — Cifras y datos duros del desastre.
* `antes.html` — Registro de inundaciones previas en la región.
* `fuentes.html` — Fuentes hemerográficas, archivos y créditos.
* `css/style.css` — Diseño y estilos del sitio.
* `js/` — Lógica de la línea del tiempo (`timeline.js`), ajuste de tipografía (`letra.js`) y funciones para compartir (`compartir.js`).

---

## Guía rápida de mantenimiento

### 1. Agregar eventos a la cronología
Añade una fila al final de `timeline_rio_1954.csv` respetando el orden de las 10 columnas:

```csv
id,fecha,hora,hora_aproximada,lugar,titulo,texto,fuente,archivo_corpus,nota
