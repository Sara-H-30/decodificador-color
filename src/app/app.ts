import { Component } from '@angular/core';
import { Canal } from './components/canal/canal';
import { Codigo } from './components/codigo/codigo';
import { Muestras } from './components/muestras/muestras';

@Component({
  selector: 'app-root',
  imports: [Codigo, Canal, Muestras],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
