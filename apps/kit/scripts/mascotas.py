"""Prepara los archivos de una mascota: le saca el fondo y los deja listos para el kit.

    npm run mascotas -- revisar  ~/Downloads/otto.mp4
    npm run mascotas -- animar   ~/Downloads/otto.mp4  otto
    npm run mascotas -- retrato  ~/Downloads/ame.png   amelia
    npm run mascotas -- lista

`revisar` es el que hay que correr primero y el que ahorra el tiempo: arma una
tira con seis cuadros recortados sobre naranja y sobre el fondo del sitio, y la
deja en un PNG para mirar. Si a la mascota le falta un pedazo se ve ahí, antes
de gastar un minuto codificando ciento veinte cuadros.
"""
import io
import shutil
import subprocess
import sys
from argparse import ArgumentParser
from pathlib import Path

try:
    import numpy as np
    from PIL import Image
    from scipy import ndimage
except ImportError as e:
    sys.exit(f'falta una dependencia de Python: {e.name}\n  pip install numpy scipy pillow')

DESTINO = Path(__file__).resolve().parent.parent / 'public' / 'mascotas'
FPS = 12
ALTO_ANIMA = 288
ALTO_RETRATO = 1200
NARANJA, CANVAS = (219, 59, 0), (241, 242, 244)

# Cuánto más oscuro que el fondo puede ser un píxel y seguir siendo fondo. Sale
# de la sombra que la mascota apoya en el piso, que es gris como el fondo pero
# más oscura. Con 56, el gris 221 de Otto da 165: ahí entra su sombra y su panza
# —lo más claro que tiene— todavía no.
CAIDA = 56
# Arriba de esta saturación el píxel es de la mascota y no del fondo: los fondos
# son grises neutros y las mascotas son cálidas. La panza de Otto está en 34.
NEUTRO = 20
# La rampa del borde vale solo en el anillo que toca al fondo. Aplicada a todo el
# cuadro le come los ojos y le lava el pecho: adentro, claro no quiere decir fondo.
ANILLO = 2
# El brillo del piso entre las patas queda encerrado por las patas mismas, así
# que la conectividad no lo alcanza. Se separa por altura, que es la única señal
# que no falla: el piso está abajo de esto y los ojos nunca bajan del 35%.
PISO = 0.75


def herramientas(*nombres: str) -> None:
    faltan = [n for n in nombres if not shutil.which(n)]
    if faltan:
        sys.exit(f'falta instalar: {", ".join(faltan)}')


def umbral(rgb: np.ndarray) -> int:
    """El fondo se mide en el borde del cuadro, que es fondo por definición."""
    mn = rgb.min(2)
    borde = np.concatenate([mn[0], mn[-1], mn[:, 0], mn[:, -1]])
    return int(np.percentile(borde, 5)) - CAIDA


def recortar(rgb: np.ndarray, claro: int) -> Image.Image:
    """El fondo no se decide por color sino por conectividad: se saca solo lo que
    está pegado al borde del cuadro. Un umbral plano le abre agujeros a lo que
    está encerrado adentro del cuerpo y es casi tan claro como el fondo."""
    alto = rgb.shape[0]
    mn, sat = rgb.min(2), rgb.max(2) - rgb.min(2)
    etiquetas, n = ndimage.label((mn >= claro) & (sat <= NEUTRO))

    fondo = np.zeros(mn.shape, bool)
    if n:
        bordes = np.concatenate([etiquetas[0], etiquetas[-1], etiquetas[:, 0], etiquetas[:, -1]])
        pegadas = set(np.unique(bordes).tolist()) - {0}
        for i, caja in enumerate(ndimage.find_objects(etiquetas), start=1):
            if caja and (i in pegadas or caja[0].start > PISO * alto):
                fondo |= etiquetas == i

    alfa = np.full(mn.shape, 255, np.float32)
    anillo = ndimage.binary_dilation(fondo, iterations=ANILLO) & ~fondo
    alfa[anillo] = np.clip(255 * (claro + CAIDA - mn[anillo]) / CAIDA, 0, 255)
    alfa[fondo] = 0
    return Image.fromarray(np.dstack([rgb.astype(np.uint8), alfa.astype(np.uint8)]), 'RGBA')


def medidas(fuente: Path) -> tuple[int, int]:
    salida = subprocess.run(
        ['ffprobe', '-v', 'error', '-select_streams', 'v:0',
         '-show_entries', 'stream=width,height', '-of', 'csv=p=0', str(fuente)],
        capture_output=True, text=True).stdout.strip().splitlines()[0]
    w, h = (int(v) for v in salida.split(','))
    return w, h


def es_video(fuente: Path) -> bool:
    return fuente.suffix.lower() in {'.mp4', '.mov', '.webm', '.mkv'}


def cuadros(fuente: Path, fps: int):
    """Los cuadros del video, en crudo y a resolución completa."""
    ancho, alto = medidas(fuente)
    ffmpeg = subprocess.Popen(
        ['ffmpeg', '-v', 'error', '-i', str(fuente), '-vf', f'fps={fps}',
         '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    while True:
        crudo = ffmpeg.stdout.read(ancho * alto * 3)
        if len(crudo) < ancho * alto * 3:
            break
        yield np.frombuffer(crudo, np.uint8).reshape(alto, ancho, 3).astype(int)
    ffmpeg.wait()


def leer(fuente: Path) -> np.ndarray:
    return np.asarray(Image.open(fuente).convert('RGB')).astype(int)


def cuadro_de(fuente: Path, segundo: float) -> np.ndarray:
    crudo = subprocess.run(
        ['ffmpeg', '-v', 'error', '-ss', str(segundo), '-i', str(fuente), '-vframes', '1',
         '-f', 'image2', '-vcodec', 'png', '-'], capture_output=True).stdout
    return np.asarray(Image.open(io.BytesIO(crudo)).convert('RGB')).astype(int)


def alto_de(im: Image.Image, alto: int) -> Image.Image:
    """Se recorta a resolución completa y recién después se achica: así el borde
    del alfa lo suaviza el remuestreo y no queda escalonado."""
    return im.resize((max(round(im.width * alto / im.height), 1), alto), Image.LANCZOS)


def revisar(fuente: Path, salida: Path | None, claro: int | None) -> None:
    if es_video(fuente):
        herramientas('ffprobe', 'ffmpeg')
        todos = list(cuadros(fuente, 2))
        muestras = [todos[round(i * (len(todos) - 1) / 5)] for i in range(6)]
    else:
        muestras = [leer(fuente)]

    claro = claro or umbral(muestras[len(muestras) // 2])
    piezas = [alto_de(recortar(m, claro), 320) for m in muestras]
    ancho = sum(p.width for p in piezas)

    tira = Image.new('RGB', (ancho, 640))
    for y, color in ((0, NARANJA), (320, CANVAS)):
        tira.paste(Image.new('RGB', (ancho, 320), color), (0, y))
        x = 0
        for p in piezas:
            tira.paste(p, (x, y), p)
            x += p.width

    destino = salida or Path(f'/tmp/{fuente.stem}-revision.png')
    tira.save(destino)
    print(f'umbral de fondo: {claro}   (el borde del cuadro mide {claro + CAIDA})')
    print(f'mirá {destino} — arriba sobre naranja, abajo sobre el fondo del sitio.')
    print('Si le falta un pedazo subí el umbral con --claro; si queda fondo, bajalo.')


def animar(fuente: Path, nombre: str, claro: int | None, desde: int) -> None:
    herramientas('ffprobe', 'ffmpeg', 'img2webp')
    piezas = [alto_de(recortar(c, claro or umbral(c)), ALTO_ANIMA) for c in cuadros(fuente, FPS)]
    if not piezas:
        sys.exit(f'{fuente} no tiene cuadros')

    # Estos renders a veces traen una toma suelta pegada al principio, que no es
    # parte de la animación. No se puede detectar sola —no está vacía, es otra
    # pose— así que se dice cuántos cuadros tirar.
    piezas = piezas[desde:]

    # Los cuadros del principio y del final en los que todavía no entró o ya se
    # fue son bytes que nadie mira, y en un bucle son una pausa muerta.
    cajas = [p.getbbox() for p in piezas]
    llenos = [i for i, c in enumerate(cajas) if c]
    if not llenos:
        sys.exit('el recorte se llevó todo: probá bajando --claro')
    vacios = len(piezas) - len(range(llenos[0], llenos[-1] + 1))
    piezas, cajas = piezas[llenos[0]:llenos[-1] + 1], cajas[llenos[0]:llenos[-1] + 1]

    # Y el aire que le sobra alrededor tampoco. El recorte deja el borde del alfa
    # pegado a la mascota, que es lo que la deja apoyar contra el canto de una
    # tarjeta sin adivinar cuánto margen trae adentro.
    caja = (min(c[0] for c in cajas) // 2 * 2, min(c[1] for c in cajas) // 2 * 2,
            max(c[2] for c in cajas), max(c[3] for c in cajas))

    taller = DESTINO / f'.{nombre}'
    taller.mkdir(parents=True, exist_ok=True)
    archivos = []
    for i, p in enumerate(piezas):
        ruta = taller / f'{i:04d}.png'
        p.crop(caja).save(ruta)
        archivos.append(str(ruta))

    destino = DESTINO / f'{nombre}-anima.webp'
    subprocess.run(['img2webp', '-loop', '0', '-d', str(round(1000 / FPS)),
                    '-q', '70', '-m', '6', '-lossy', *archivos, '-o', str(destino)],
                   check=True, capture_output=True)
    shutil.rmtree(taller)
    im = Image.open(destino)
    sobras = f'  ({desde} tirado{"s" if desde != 1 else ""} adelante, {vacios} vacío{"s" if vacios != 1 else ""} recortado{"s" if vacios != 1 else ""})' if desde or vacios else ''
    print(f'{destino.name}  {im.width} × {im.height}  {len(piezas)} cuadros a {FPS}/s  '
          f'{destino.stat().st_size:,} bytes{sobras}')


def retrato(fuente: Path, nombre: str, claro: int | None, segundo: float) -> None:
    herramientas('cwebp')
    if es_video(fuente):
        herramientas('ffprobe', 'ffmpeg')
        rgb = cuadro_de(fuente, segundo)
    else:
        rgb = leer(fuente)

    im = recortar(rgb, claro or umbral(rgb))
    caja = im.getbbox()
    if not caja:
        sys.exit('el recorte se llevó todo: probá bajando --claro')
    im = alto_de(im.crop(caja), ALTO_RETRATO)

    taller = DESTINO / f'.{nombre}.png'
    im.save(taller)
    destino = DESTINO / f'{nombre}.webp'
    subprocess.run(['cwebp', '-q', '84', '-alpha_q', '92', str(taller), '-o', str(destino)],
                   check=True, capture_output=True)
    taller.unlink()
    print(f'{destino.name}  {im.width} × {im.height}  {destino.stat().st_size:,} bytes')


def lista() -> None:
    archivos = sorted(f for f in DESTINO.iterdir() if not f.name.startswith('.'))
    if not archivos:
        print('no hay nada en public/mascotas')
        return
    for f in archivos:
        try:
            im = Image.open(f)
            medida, cuadros_ = f'{im.width} × {im.height}', getattr(im, 'n_frames', 1)
        except Exception:
            medida, cuadros_ = '—', 1
        print(f'  {f.name:<26} {medida:>12}  '
              f'{"1 cuadro " if cuadros_ == 1 else f"{cuadros_} cuadros"}  '
              f'{f.stat().st_size:>9,} bytes')
    print(f'  {"total":<26} {"":>12}  {"":<10}  {sum(f.stat().st_size for f in archivos):>9,} bytes')


def main() -> None:
    p = ArgumentParser(prog='mascotas', description=__doc__)
    sub = p.add_subparsers(dest='orden', required=True)

    r = sub.add_parser('revisar', help='mira el recorte antes de codificar nada')
    r.add_argument('fuente', type=Path)
    r.add_argument('--salida', type=Path)
    r.add_argument('--claro', type=int)

    a = sub.add_parser('animar', help='video → webp animado con alfa')
    a.add_argument('fuente', type=Path)
    a.add_argument('nombre')
    a.add_argument('--claro', type=int)
    a.add_argument('--desde', type=int, default=0, help='cuántos cuadros del principio tirar')

    t = sub.add_parser('retrato', help='imagen o video → retrato con alfa')
    t.add_argument('fuente', type=Path)
    t.add_argument('nombre')
    t.add_argument('--claro', type=int)
    t.add_argument('--segundo', type=float, default=0.0, help='de qué segundo sacar el cuadro')

    sub.add_parser('lista', help='qué hay hoy y cuánto pesa')

    args = p.parse_args()
    if args.orden != 'lista' and not args.fuente.exists():
        sys.exit(f'no existe {args.fuente}')

    if args.orden == 'revisar':
        revisar(args.fuente, args.salida, args.claro)
    elif args.orden == 'animar':
        animar(args.fuente, args.nombre, args.claro, args.desde)
    elif args.orden == 'retrato':
        retrato(args.fuente, args.nombre, args.claro, args.segundo)
    else:
        lista()


if __name__ == '__main__':
    main()
