# Guía — Migración a Angular 18: Remanente del Dios Vivo y Eterno

## ¿Qué se migró y por qué?

El sitio original era HTML estático con jQuery + JS vanilla. Se migró a **Angular 18** con:

- **Standalone Components** (sin NgModule)
- **Signals** para estado reactivo
- **Lazy loading** por ruta
- **HttpClient** en lugar de `fetch` manual
- **Control Flow** moderno (`@if`, `@for`)

---

## Estructura del proyecto

```
remanente-angular/
├── src/
│   ├── app/
│   │   ├── app.component.ts       ← shell con header/footer/router-outlet
│   │   ├── app.config.ts          ← provideRouter + provideHttpClient
│   │   ├── app.routes.ts          ← rutas con lazy loading
│   │   ├── core/
│   │   │   ├── models/
│   │   │   │   └── event.model.ts ← interfaces DriveFile, EventItem, EventText
│   │   │   └── services/
│   │   │       └── events.service.ts ← toda la lógica de Drive + JSONbin
│   │   ├── shared/components/
│   │   │   ├── header/            ← navbar fijo, menú burger en móvil
│   │   │   ├── footer/            ← footer global
│   │   │   └── social-bar/        ← barra de redes sociales
│   │   └── pages/
│   │       ├── home/              ← hero + sección "Quiénes Somos"
│   │       ├── events/            ← PÁGINA PRINCIPAL DE MIGRACIÓN
│   │       ├── about/
│   │       ├── contact/
│   │       ├── connect-group/
│   │       └── volunteer/
│   ├── environments/
│   │   └── environment.ts         ← API keys (no commitear en producción)
│   └── styles.scss                ← estilos globales, replica el CSS original
├── angular.json
├── tsconfig.json
└── package.json
```

---

## Cómo instalar y correr

```bash
# 1. Instalar dependencias
npm install

# 2. Servidor de desarrollo (http://localhost:4200)
ng serve

# 3. Build de producción
ng build
```

---

## La parte clave: Carousel inline (no modal)

### ¿Cómo funciona?

Al hacer clic en una card de evento pasado:

1. El componente llama a `EventsService.fetchFolderImages(folderId)` vía Observable.
2. El `activeEventId` signal se actualiza con el `folderId` del evento seleccionado.
3. **La card se expande a 100% del ancho** usando la clase CSS `is-expanded`.
4. El carousel se renderiza **debajo de la card** dentro del mismo flujo del grid.
5. Flechas anterior/siguiente, thumbnails clickeables y contador de fotos.
6. Clic en la imagen principal → abre en nueva pestaña (Google Drive viewer).
7. Hacer clic de nuevo en la misma card, o en "Cerrar galería" → colapsa.

### Signals usados en EventsComponent

| Signal | Tipo | Propósito |
|--------|------|-----------|
| `loading` | `signal<boolean>` | Muestra spinner inicial |
| `error` | `signal<string\|null>` | Muestra mensaje de error |
| `nextEvent` | `signal<EventItem\|null>` | Próximo evento destacado |
| `pastEvents` | `signal<EventItem[]>` | Listado de eventos pasados |
| `activeEventId` | `signal<string\|null>` | ID del evento con carousel abierto |
| `carouselImages` | `signal<DriveFile[]>` | Imágenes del carousel activo |
| `carouselLoading` | `signal<boolean>` | Spinner del carousel |
| `carouselIndex` | `signal<number>` | Foto actual del carousel |

### Template flow (events.html)

```html
@for (ev of pastEvents(); track ev.folderId) {
  <div class="column event-card" [class.is-expanded]="isActive(ev)">
    <!-- botón trigger -->
    <button (click)="toggleCarousel(ev)">...</button>

    <!-- carousel condicional, dentro de la misma columna -->
    @if (isActive(ev)) {
      <div class="event-carousel">
        <!-- stage: flecha | imagen | flecha -->
        <!-- thumbnails -->
        <!-- footer con "Cerrar galería" -->
      </div>
    }
  </div>
}
```

---

## Configuración de APIs (environment.ts)

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  googleApiKey: 'TU_API_KEY',
  driveParentFolderId: 'ID_CARPETA_PADRE',
  jsonbinBinId: 'TU_BIN_ID',
  jsonbinAccessKey: 'TU_ACCESS_KEY',
};
```

> ⚠️ **Para producción**: crea `src/environments/environment.prod.ts` y usa las mismas variables. Angular CLI sustituye automáticamente el archivo al hacer `ng build`.

---

## EventsService: Observable vs Promise

El JS original usaba `async/await` con `fetch`. Angular usa `HttpClient` que devuelve Observables. La lógica es equivalente:

| Original (vanilla) | Angular 18 |
|--------------------|------------|
| `await Promise.all([...])` | `forkJoin([...])` |
| `await fetch(url).json()` | `this.http.get<T>(url)` |
| `try/catch` | `.pipe(catchError(...))` |
| Manual loops en `buildEvents` | `switchMap` + `forkJoin` |

---

## Assets

Copia las imágenes del sitio original en `src/assets/`:

```bash
# Desde la raíz del sitio estático:
cp -r images/ remanente-angular/src/assets/images/
cp favicon* remanente-angular/src/
```

El `angular.json` ya tiene configurado:
```json
"assets": [
  "src/favicon.ico",
  { "glob": "**/*", "input": "src/assets", "output": "assets" }
]
```

---

## Routing

Rutas configuradas con lazy loading:

| URL | Componente |
|-----|------------|
| `/` | HomeComponent |
| `/about` | AboutComponent |
| `/events` | EventsComponent |
| `/contact` | ContactComponent |
| `/connect-group` | ConnectGroupComponent |
| `/volunteer` | VolunteerComponent |

El `withInMemoryScrolling({ scrollPositionRestoration: 'top' })` hace que cada navegación vuelva al top, igual que el sitio estático.

---

## Próximos pasos opcionales

- [ ] **i18n Angular** (`@angular/localize`) para reemplazar el sistema `data-i18n` original
- [ ] **TransferState / SSR** con Angular Universal para mejor SEO
- [ ] Mover las API keys a variables de entorno del servidor / CI
- [ ] Animaciones de entrada con `@angular/animations` (reemplazar AOS)
- [ ] Filtros en la grilla de eventos pasados (por año)
