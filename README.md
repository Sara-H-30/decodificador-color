# Decodificador de Color — Angular 20

Aplicación que recibe un código de 6 dígitos hexadecimales, lo separa en los tres
pares R, G y B, y muestra el color resultante junto con su equivalente en escala
de grises.

## Cómo ejecutarla

```bash
npm install
npm start
```

Luego abrir <http://localhost:4200>.

Para compilar: `npm run build`.

> Requiere Node 20.19+ o 22.12+ (la versión que pide Angular 20).

## Estructura

```
src/app/
├── app.ts / app.html / app.css              Componente raíz: arma la pantalla
├── components/
│   ├── codigo/       (app-codigo)           A. Campo del código + botón Show
│   ├── canal/        (app-canal)            B. Fila de un canal — se usa 3 veces
│   └── muestras/     (app-muestras)         C. Recuadros de color y de grises
└── services/
    └── color.ts      (ColorService)         Estado compartido
```

**Tres componentes distintos**, uno de ellos (`app-canal`) instanciado tres veces
desde `app.html`:

```html
<app-canal [letra]="'R'" />
<app-canal [letra]="'G'" />
<app-canal [letra]="'B'" />
```

## Estado compartido en el servicio

`ColorService` (`providedIn: 'root'`, una sola instancia para toda la app) es el
único dueño del estado. Guarda tres Signals privadas —un valor 0..255 por canal—
y expone el resto como Signals derivadas con `computed()`:

| Miembro | Tipo | Qué es |
|---|---|---|
| `r()`, `g()`, `b()` | `Signal<number>` | valor de cada canal |
| `hex()` | `computed` | los 6 dígitos, p. ej. `479405` |
| `color()` | `computed` | `#479405` |
| `luma()` | `computed` | luminancia Rec. 709 |
| `gris()` | `computed` | el gris equivalente |

Ningún componente le pasa datos a otro por `@Input`/`@Output`: todos inyectan el
servicio con `inject(ColorService)`. Como las Signals derivadas se recalculan
solas, cualquier cambio llega de inmediato a toda la pantalla.

### Flujo del botón Show

`Codigo` guarda lo que se escribe en un borrador local y, al hacer click en
**Show**, llama a `servicio.aplicarCodigo(...)`. Eso reescribe los tres canales,
así que se actualizan las tres filas RGB **y** los dos recuadros. Si el código no
tiene 6 dígitos válidos se muestra un aviso y no se cambia nada.

### Flujo al editar un canal

Cada `Canal` se edita en su caja de dos dígitos, que llama a
`servicio.actualizarPar(...)`. Como el campo de arriba es un `linkedSignal` sobre
`servicio.hex()`, el código superior se reescribe solo, y los recuadros se
repintan con los `computed` del servicio.

## Notas técnicas

- Componentes standalone (sin `NgModule`), con `input.required<Letra>()` para
  recibir la letra del canal.
- `linkedSignal` mantiene el campo de texto sincronizado con el estado sin perder
  lo que el usuario está escribiendo.
- `optimization.fonts` está en `false` en `angular.json` para que la compilación
  no dependa de descargar las fuentes de Google en tiempo de build; el `<link>`
  sigue en `src/index.html` y las fuentes se cargan al abrir la página.
