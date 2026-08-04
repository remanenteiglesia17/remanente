# Guía de configuración — Eventos dinámicos Remanente

Este sitio ahora carga los eventos automáticamente desde **Google Drive** (fotos)
y **jsonbin.io** (textos: título, fecha, descripción, costo, lugar).

Sigue estos pasos UNA sola vez. Después, para agregar un evento nuevo solo tienes
que crear una carpeta en Drive y (opcionalmente) un registro en jsonbin.

---

## PARTE 1 — Crear la API Key de Google Drive

1. Entra a **https://console.cloud.google.com/**
2. Arriba a la izquierda, haz clic en el selector de proyectos → **"Nuevo Proyecto"**.
   - Nombre: `remanente-web` (o el que quieras) → **Crear**.
3. Con el proyecto ya seleccionado, ve al menú ☰ → **APIs y servicios** → **Biblioteca**.
4. Busca **"Google Drive API"** → ábrela → clic en **Habilitar**.
5. Ve a ☰ → **APIs y servicios** → **Credenciales**.
6. Clic en **"+ Crear credenciales"** → **Clave de API**.
   - Se genera una clave larga tipo `AIzaSy...`. Cópiala, la vas a necesitar.
7. **Muy importante — restringe la clave** (clic en "Editar" sobre la clave recién creada):
   - En **"Restricciones de la aplicación"**: elige **"Sitios web"** y agrega la URL
     donde vas a publicar el sitio (ej: `https://www.remanente.org/*` o el dominio que uses).
     Mientras pruebas localmente puedes agregar también `http://localhost/*`.
   - En **"Restricciones de API"**: elige **"Restringir clave"** y selecciona solo
     **Google Drive API**.
   - Guarda.

   Esto evita que alguien más use tu clave desde otro sitio.

### Compartir las carpetas de Drive

Para cada carpeta de evento (y la carpeta padre que las contiene):

1. Clic derecho sobre la carpeta → **Compartir** → **Compartir**.
2. Cambia el acceso general a **"Cualquier persona con el enlace"** → rol **Lector**.

Si una carpeta no está compartida así, la Drive API no podrá leer sus imágenes
desde el sitio público (aunque la API Key sea válida).

### Obtener el ID de la carpeta padre

Abre en Drive la carpeta que contiene TODAS las subcarpetas de eventos (la que
aparece en tu captura: predicas 2023, JOVENES, RETIRO, RECUERDO REMANENTE...).
En la barra de direcciones verás algo así:

```
https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz123456
```

El ID es la parte final: `1AbCdEfGhIjKlMnOpQrStUvWxYz123456`

---

## PARTE 2 — Crear el bin en jsonbin.io

1. Entra a **https://jsonbin.io/** e inicia sesión con tu cuenta.
2. Clic en **"Create Bin"**.
3. Pega este contenido de ejemplo (puedes editarlo luego cuantas veces quieras):

```json
{
  "events": [
    {
      "folder": "RETIRO",
      "title": "Retiro Espiritual 2025",
      "description": "Un tiempo de renovación, oración y comunión para todo el cuerpo de la iglesia.",
      "date": "2025-11-15",
      "time": "8:00 AM - 5:00 PM",
      "location": "Finca La Esperanza, Cali",
      "cost": "Gratis"
    },
    {
      "folder": "JOVENES",
      "title": "Encuentro de Jóvenes",
      "description": "Una noche de adoración, palabra y comunión para la juventud de Remanente.",
      "date": "2024-06-20",
      "time": "6:00 PM - 9:00 PM",
      "location": "Templo Remanente, Cali",
      "cost": "Gratis"
    }
  ]
}
```

**Reglas del campo `folder`:** debe coincidir exactamente (sin importar
mayúsculas/minúsculas) con el nombre de la carpeta en Drive. Así el sitio sabe
qué fotos van con qué texto.

**Si una carpeta de Drive NO tiene registro aquí**, el sitio la muestra igual,
usando el nombre de la carpeta como título y sin fecha (aparecerá en la sección
de eventos pasados). Así, aunque olvides actualizar jsonbin, la carpeta nueva
"aparece en eventos" automáticamente.

4. Guarda el bin.
5. En el panel del bin, busca:
   - **Bin ID** (aparece en la URL o en los detalles del bin, algo como `65f1a2b3c8e4f10012345678`)
6. Tienes dos opciones para que el sitio pueda leer el bin sin exponer tu Master Key
   (el Master Key nunca debe ir en un sitio público):

   **Opción A — Access Key de solo lectura (recomendada, más segura):**
   En el bin ve a **Settings → Access Keys** y crea una **Access Key** con permiso
   solo de lectura (Read). Cópiala — la vas a pegar en `js/config.js` como
   `JSONBIN_ACCESS_KEY`. El bin puede quedar privado.

   **Opción B — Bin público:**
   Marca el bin como **Public** en Settings. No necesitas ninguna clave adicional,
   pero cualquiera con el Bin ID puede leerlo (no pueden editarlo sin el Master Key).

---

## PARTE 3 — Configurar el sitio

Abre el archivo `js/config.js` y reemplaza los valores:

```js
const CONFIG = {
  GOOGLE_API_KEY: "PEGA_AQUI_TU_API_KEY",
  DRIVE_PARENT_FOLDER_ID: "PEGA_AQUI_EL_ID_DE_LA_CARPETA_PADRE",
  JSONBIN_BIN_ID: "PEGA_AQUI_EL_BIN_ID",
  JSONBIN_ACCESS_KEY: "PEGA_AQUI_TU_ACCESS_KEY", // solo si usaste la Opción A
};
```

Guarda el archivo y sube todo el sitio a tu hosting. Listo — la página de
**Eventos** cargará las carpetas de Drive, cruzará la info con jsonbin, y
mostrará el próximo evento destacado (el de fecha más cercana a hoy) junto con
las tarjetas de eventos pasados.

### Para agregar un evento nuevo en el futuro

1. Crea una carpeta nueva dentro de la carpeta padre en Drive, súbele fotos,
   y compártela como "Cualquiera con el enlace - Lector".
2. (Opcional pero recomendado) Agrega un objeto nuevo en el arreglo `events`
   del bin de jsonbin con el mismo nombre de carpeta, título, fecha, etc.
3. Recarga la página — el evento aparece solo.
