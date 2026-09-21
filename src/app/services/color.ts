import { Injectable, computed, signal } from '@angular/core';

/** Letra que identifica cada canal del color. */
export type Letra = 'R' | 'G' | 'B';

/** Convierte un número 0..255 a dos dígitos hexadecimales en mayúscula. */
export function aPar(valor: number): string {
  return valor.toString(16).toUpperCase().padStart(2, '0');
}

/** Deja solo dígitos hexadecimales, en mayúscula y con el largo máximo indicado. */
export function limpiar(texto: string, largo: number): string {
  return texto.replace(/[^0-9a-fA-F]/g, '').toUpperCase().slice(0, largo);
}

/**
 * Estado compartido de la aplicación.
 *
 * Guarda los tres canales del color y expone, como Signals derivadas, el código
 * hexadecimal completo, el color y su equivalente en escala de grises. Todos los
 * componentes leen y escriben aquí, así que cualquier cambio (el botón Show o uno
 * de los canales) se refleja de inmediato en el resto de la pantalla.
 */
@Injectable({ providedIn: 'root' })
export class ColorService {
  private readonly _r = signal(0x47);
  private readonly _g = signal(0x94);
  private readonly _b = signal(0x05);

  /** Valor 0..255 de cada canal. */
  readonly r = this._r.asReadonly();
  readonly g = this._g.asReadonly();
  readonly b = this._b.asReadonly();

  /** Código de 6 dígitos, sin el símbolo #. */
  readonly hex = computed(() => aPar(this._r()) + aPar(this._g()) + aPar(this._b()));

  /** Color listo para usar en CSS. */
  readonly color = computed(() => '#' + this.hex());

  /** Luminancia perceptual (Rec. 709). */
  readonly luma = computed(() =>
    Math.round(0.2126 * this._r() + 0.7152 * this._g() + 0.0722 * this._b()),
  );

  /** Gris equivalente al color actual. */
  readonly gris = computed(() => {
    const p = aPar(this.luma());
    return '#' + p + p + p;
  });

  /** Valor numérico de un canal. */
  valor(letra: Letra): number {
    return letra === 'R' ? this._r() : letra === 'G' ? this._g() : this._b();
  }

  /** Par de dígitos hexadecimales de un canal. */
  par(letra: Letra): string {
    return aPar(this.valor(letra));
  }

  /** Cambia un solo canal; el resto del estado se recalcula solo. */
  actualizarCanal(letra: Letra, valor: number): void {
    const v = Math.max(0, Math.min(255, Math.round(valor)));
    if (letra === 'R') this._r.set(v);
    else if (letra === 'G') this._g.set(v);
    else this._b.set(v);
  }

  /** Cambia un canal a partir de su par de dígitos ("A3"). */
  actualizarPar(letra: Letra, par: string): void {
    const limpio = limpiar(par, 2);
    if (limpio.length === 0) return;
    this.actualizarCanal(letra, parseInt(limpio, 16));
  }

  /** Aplica un código completo de 6 dígitos. Devuelve false si no es válido. */
  aplicarCodigo(codigo: string): boolean {
    const hex = limpiar(codigo, 6);
    if (hex.length !== 6) return false;
    this._r.set(parseInt(hex.slice(0, 2), 16));
    this._g.set(parseInt(hex.slice(2, 4), 16));
    this._b.set(parseInt(hex.slice(4, 6), 16));
    return true;
  }
}
