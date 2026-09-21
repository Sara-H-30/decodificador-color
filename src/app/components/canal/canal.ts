import { Component, computed, inject, input } from '@angular/core';
import { ColorService, Letra, limpiar } from '../../services/color';

/**
 * Componente B: una fila de canal (R, G o B). Se usa tres veces.
 *
 * Recibe por input la letra del canal y lee su valor del servicio. La caja de dos
 * dígitos escribe en el servicio, así que al cambiar un canal se actualizan los
 * recuadros de color y el código de arriba.
 */
@Component({
  selector: 'app-canal',
  imports: [],
  templateUrl: './canal.html',
  styleUrl: './canal.css',
})
export class Canal {
  private readonly servicio = inject(ColorService);

  /** Canal que representa esta fila. */
  readonly letra = input.required<Letra>();

  protected readonly par = computed(() => this.servicio.par(this.letra()));
  protected readonly clase = computed(() => 'canal canal-' + this.letra().toLowerCase());
  protected readonly nombre = computed(
    () => ({ R: 'Rojo', G: 'Verde', B: 'Azul' })[this.letra()],
  );

  protected alEscribirPar(evento: Event): void {
    const campo = evento.target as HTMLInputElement;
    const limpio = limpiar(campo.value, 2);
    campo.value = limpio;
    this.servicio.actualizarPar(this.letra(), limpio);
  }

  /** Al salir del campo se vuelve a mostrar el par normalizado a dos dígitos. */
  protected alSalir(evento: Event): void {
    (evento.target as HTMLInputElement).value = this.par();
  }
}
