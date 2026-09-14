# Las caras

Ocho caras **sintéticas**, generadas con StyleGAN (thispersondoesnotexist.com) el
2026-09-11. No son fotos de nadie: no hay una persona detrás de ninguna de estas
imágenes.

Eso no es un detalle. La columna que las usa se llama "estudiantes", así que un
ejemplo con caras reales es un ejemplo que alguien copia y pega en una pantalla
de verdad, y ahí pasa a ser la foto de un menor sin cesión de derechos. Las
fuentes gratis de caras reales no resuelven eso: la licencia de Unsplash cubre la
foto pero dice explícitamente que no cede derechos sobre la imagen de la persona,
y pravatar y randomuser no declaran licencia en ninguna parte.

thispersondoesnotexist tampoco declara una licencia formal. La diferencia es que
no hay imagen de nadie que ceder.

## Por qué están acá y no se piden a un host

Un kit que le pide las imágenes a un tercero se rompe sin internet y filtra un
request por avatar cada vez que alguien abre la galería.

## Cómo se procesaron

Recorte central al 88% corrido 4% hacia arriba (FFHQ encuadra la cara al centro
con aire de sobra arriba, y en un círculo de 28 eso deja la cara chica), 128px y
WebP a calidad 82. 128 es el 3× de los 40 del avatar más grande. Pesan entre 2.8
y 4.4 KB; las ocho, 40 KB.

Se descartaron dos del set original: una demasiado estilizada y otra con
artefactos en el nacimiento del pelo y las orejas.
