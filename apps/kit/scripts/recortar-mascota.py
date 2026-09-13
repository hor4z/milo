"""Saca el fondo de un video de mascota y lo devuelve como WebP animado con alfa.

    python3 apps/kit/scripts/recortar-mascota.py entrada.mp4 apps/kit/public/mascotas/otto-anima.webp

Por qué no es un `colorkey` de ffmpeg: el fondo de estos videos es gris neutro y
la mascota tiene partes casi tan claras como él, así que un umbral plano le abre
agujeros — a Otto le comía la panza y los ojos. Acá el fondo se decide por
conectividad, no por color: se saca solo lo que está pegado al borde del cuadro.

Y por qué no es un WebM con alfa, que pesaría un tercio: el ffmpeg de esta
máquina acepta `-pix_fmt yuva420p` sin quejarse y escribe el archivo sin el
alfa. Verificado decodificando: vuelve opaco.
"""
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

FPS = 12
ANCHO, ALTO = 162, 288

# El fondo es gris neutro y casi plano (221-226), y la sombra que la mascota
# apoya en el piso es apenas más oscura pero igual de neutra. Otto es cálido: su
# panza, que es lo más claro que tiene, está en saturación 34.
CLARO, NEUTRO = 165, 20

# Queda un caso que la conectividad sola no resuelve: el brillo del piso entre
# las patas, que las patas mismas dejan encerrado. Se separa por altura, que es
# la única señal que no falla — el piso está abajo del 75% del cuadro y los ojos
# nunca bajan del 35%.
PISO = 0.75

# La rampa del borde vale solo en el anillo que toca al fondo. Aplicada a todo el
# cuadro le comía los ojos y le lavaba el pecho: adentro, claro no quiere decir fondo.
ANILLO = 2


def recortar(rgb: np.ndarray) -> Image.Image:
    alto = rgb.shape[0]
    mn, sat = rgb.min(2), rgb.max(2) - rgb.min(2)
    etiquetas, n = ndimage.label((mn >= CLARO) & (sat <= NEUTRO))

    fondo = np.zeros(mn.shape, bool)
    if n:
        bordes = np.concatenate([etiquetas[0], etiquetas[-1], etiquetas[:, 0], etiquetas[:, -1]])
        pegadas = set(np.unique(bordes).tolist()) - {0}
        for i, caja in enumerate(ndimage.find_objects(etiquetas), start=1):
            if caja and (i in pegadas or caja[0].start > PISO * alto):
                fondo |= etiquetas == i

    alfa = np.full(mn.shape, 255, np.float32)
    anillo = ndimage.binary_dilation(fondo, iterations=ANILLO) & ~fondo
    alfa[anillo] = np.clip(255 * (226 - mn[anillo]) / 40, 0, 255)
    alfa[fondo] = 0
    return Image.fromarray(np.dstack([rgb.astype(np.uint8), alfa.astype(np.uint8)]), 'RGBA')


def medidas(fuente: str) -> tuple[int, int]:
    salida = subprocess.run(
        ['ffprobe', '-v', 'error', '-select_streams', 'v:0',
         '-show_entries', 'stream=width,height', '-of', 'csv=p=0', fuente],
        capture_output=True, text=True).stdout.strip()
    w, h = (int(v) for v in salida.split(','))
    return w, h


def main(fuente: str, destino: str) -> None:
    ancho, alto = medidas(fuente)
    ffmpeg = subprocess.Popen(
        ['ffmpeg', '-v', 'error', '-i', fuente, '-vf', f'fps={FPS}',
         '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)

    carpeta = Path(destino).with_suffix('')
    carpeta.mkdir(parents=True, exist_ok=True)
    cuadros, cajas = [], []
    while True:
        crudo = ffmpeg.stdout.read(ancho * alto * 3)
        if len(crudo) < ancho * alto * 3:
            break
        rgb = np.frombuffer(crudo, np.uint8).reshape(alto, ancho, 3).astype(int)
        # Se recorta a resolución completa y recién después se achica: así el
        # borde del alfa lo suaviza el remuestreo y no queda escalonado.
        im = recortar(rgb).resize((ANCHO, ALTO), Image.LANCZOS)
        cajas.append(im.getbbox())
        cuadros.append(im)
    ffmpeg.wait()

    llenas = [c for c in cajas if c]
    arriba = min(c[1] for c in llenas) // 2 * 2
    archivos = []
    for i, im in enumerate(cuadros):
        ruta = carpeta / f'{i:04d}.png'
        im.crop((0, arriba, ANCHO, ALTO)).save(ruta)
        archivos.append(str(ruta))

    subprocess.run(['img2webp', '-loop', '0', '-d', str(round(1000 / FPS)),
                    '-q', '70', '-m', '6', '-lossy', *archivos, '-o', destino], check=True)
    for f in archivos:
        Path(f).unlink()
    carpeta.rmdir()
    print(f'{destino}  {len(cuadros)} cuadros  {Path(destino).stat().st_size} bytes')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
