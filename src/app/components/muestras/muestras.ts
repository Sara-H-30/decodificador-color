import { Component, inject } from '@angular/core';
import { ColorService } from '../../services/color';

/**
 * Componente C: los dos recuadros, el color y su versión en escala de grises.
 *
 * Solo lee del servicio: al cambiar cualquier canal o aplicar un código nuevo,
 * las Signals derivadas repintan los recuadros.
 */
@Component({
  selector: 'app-muestras',
  imports: [],
  templateUrl: './muestras.html',
  styleUrl: './muestras.css',
})
export class Muestras {
  protected readonly servicio = inject(ColorService);
}
