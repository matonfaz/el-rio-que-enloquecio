# El río que enloqueció

Sitio estático del libro *El río que enloqueció: La tragedia y resurrección de Piedras Negras en 1954*.

- `index.html` — timeline interactivo (lee **solo** `timeline_rio_1954.csv`).
- `libro.html` — página del libro (rellena `[SINOPSIS]`, `[ENLACE AMAZON]`, `[ENLACE SUBSTACK]`).
- `css/style.css`, `js/timeline.js` — diseño y lógica.

Sin build ni servidor: se publica tal cual en GitHub Pages.

## Agregar eventos
Añade una fila al final de `timeline_rio_1954.csv` con las columnas
`id,fecha,hora,hora_aproximada,lugar,titulo,texto,fuente,archivo_corpus,nota`.
Fecha `AAAA-MM-DD`; hora `HH:MM` o vacía; `hora_aproximada` = `aprox.` o vacía.
Los textos con comas van entre comillas dobles. Se ordena por fecha; dentro de un día, por orden en el CSV.
