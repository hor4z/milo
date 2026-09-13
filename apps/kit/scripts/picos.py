"""Saca los picos de un audio, para dibujar la onda del `AudioPlayer`.

    python3 apps/kit/scripts/picos.py consigna.mp3
    python3 apps/kit/scripts/picos.py consigna.mp3 --barras 96

Imprime el array para pegar en el `peaks` del componente. Se calcula acá y no en
el navegador a propósito: hacerlo en vivo obliga a bajar el archivo entero y
decodificarlo antes de poder dibujar nada, y el reproductor tiene que verse
apenas aparece.
"""
import subprocess
import sys
from argparse import ArgumentParser
from pathlib import Path

import numpy as np


def picos(fuente: Path, barras: int) -> list[float]:
    crudo = subprocess.run(
        ['ffmpeg', '-v', 'error', '-i', str(fuente), '-f', 's16le', '-ac', '1', '-ar', '8000', '-'],
        capture_output=True, check=True).stdout
    señal = np.frombuffer(crudo, np.int16).astype(np.float32) / 32768
    if not señal.size:
        sys.exit(f'{fuente} no tiene audio')

    # Un pico por barra, en RMS y no en máximo: el máximo lo decide una sola
    # muestra, así que un chasquido deja una barra sola contra el techo y el
    # resto de la onda aplastada.
    trozos = np.array_split(señal, barras)
    v = np.array([float(np.sqrt((t ** 2).mean())) if t.size else 0.0 for t in trozos])
    # Normaliza contra el percentil 95 y no contra el máximo, por lo mismo.
    techo = float(np.percentile(v, 95)) or float(v.max()) or 1.0
    return [round(float(x), 3) for x in np.clip(v / techo, 0, 1)]


def main() -> None:
    p = ArgumentParser(prog='picos', description=__doc__)
    p.add_argument('fuente', type=Path)
    p.add_argument('--barras', type=int, default=64)
    args = p.parse_args()
    if not args.fuente.exists():
        sys.exit(f'no existe {args.fuente}')

    v = picos(args.fuente, args.barras)
    filas = [', '.join(f'{x:.3f}' for x in v[i:i + 12]) for i in range(0, len(v), 12)]
    print('const picos = [\n  ' + ',\n  '.join(filas) + ',\n] as const')


if __name__ == '__main__':
    main()
