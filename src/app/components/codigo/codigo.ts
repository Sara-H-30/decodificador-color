import { Component, inject, linkedSignal, signal } from '@angular/core';
import { ColorService, limpiar } from '../../services/color';

/**
 * Componente A: campo con el código de 6 dígitos y el botón Show.
 *
 * Mientras el usuario escribe, el texto vive en un borrador local; solo al hacer
 * click en Show se envía al servicio. El borrador es un linkedSignal sobre
 * servicio.hex(), así que cuando otro componente cambia un canal el campo
 * superior se actualiza solo.
 */
@Component({
  selector: 'app-codigo',
  imports: [],
  templateUrl: './codigo.html',
  styleUrl: './codigo.css',
})
export class Codigo {
  protected readonly servicio = inject(ColorService);

  /** Texto que se está editando; se resincroniza con el estado compartido. */
  protected readonly borrador = linkedSignal(() => this.servicio.hex());

  /** Mensaje de error del campo, vacío cuando no hay problema. */
  protected readonly aviso = signal('');

  protected alEscribir(evento: Event): void {
    const campo = evento.target as HTMLInputElement;
    const limpio = limpiar(campo.value, 6);
    campo.value = limpio;
    this.borrador.set(limpio);
    if (limpio.length === 6) this.aviso.set('');
  }

  protected show(): void {
    if (this.servicio.aplicarCodigo(this.borrador())) {
      this.aviso.set('');
    } else {
      this.aviso.set(
        `Faltan dígitos: el código debe tener 6 caracteres entre 0–9 y A–F. Llevas ${this.borrador().length}.`,
      );
    }
  }
}
