# Sistema de Cotización - Somos Fruit

## Páginas del sitio

### 1. `index.html` - Página principal
- Hero con imagen de fondo
- Barra de valores/confianza
- Preview de productos
- Preview sobre nosotros
- Formulario de contacto con hCaptcha
- Footer con links de redes sociales

### 2. `productos.html` - Catálogo de productos
- **199 productos reales** cargados desde `productos.json`
- Filtros funcionales:
  - Búsqueda por texto
  - 12 categorías de productos
  - 2 líneas (Premium/Regular)
- Sistema "Agregar a cotización"
- Badge flotante del carrito
- **Gestión fácil:** Ver `PRODUCTOS.md` para agregar/editar productos

### 3. `cart.html` - Carrito de cotización
- Lista de productos seleccionados
- Modificar cantidades (+/-)
- Eliminar productos
- Formulario de checkout completo
- Sistema de envío por email

### 4. `contacto.html` - Página de contacto
- Formulario de contacto con hCaptcha
- Canales de comunicación:
  - WhatsApp (clickeable)
  - Email (clickeable)
  - Instagram (clickeable)
- Diseño moderno con tarjetas
- Responsive completo

### 5. `sobre-nosotros.html` - Sobre nosotros ✨ NUEVO
- Página dedicada con historia y misión
- Valores y servicios destacados
- Estadísticas clave (+500 clientes, +50 productores)
- CTA para productos y contacto
- Diseño moderno con imágenes y tarjetas

---

## Configuración del envío de correos

Para que el sistema de cotización funcione correctamente, necesitas configurar el envío de correos electrónicos.

### Opción 1: Formspree (Recomendado - Gratis)

1. Ve a https://formspree.io/ y crea una cuenta gratuita
2. Crea un nuevo formulario
3. Copia el Form ID que te proporcionen
4. En el archivo `cart.js`, línea 105, reemplaza `'YOUR_FORM_ID'` con tu Form ID:

```javascript
const FORMSPREE_ENDPOINT = 'tu-form-id-aqui'; // Por ejemplo: 'mwkadpqr'
```

5. Guarda el archivo y listo

### Opción 2: Usar tu propio backend

Si tienes un servidor backend, puedes modificar el fetch en `cart.js` para apuntar a tu API:

```javascript
const response = await fetch('https://tu-api.com/cotizaciones', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});
```

### Opción 3: Cliente de correo (Fallback automático)

Si no configuras ningún servicio, el sistema automáticamente usará el cliente de correo predeterminado del usuario (Outlook, Gmail, etc.) con todos los datos pre-llenados.

## Email de destino

Para cambiar el correo donde se reciben las cotizaciones:

1. Abre `cart.js`
2. Busca la línea que contiene `vcorea@somosfruit.net`
3. Reemplázalo con tu correo electrónico real

## Datos que se envían

La cotización incluye:
- Nombre
- Email
- Teléfono
- Empresa
- Mensaje
- Lista de productos con cantidades

## Páginas del sistema

- `index.html` - Página principal con hero, productos, sobre nosotros y contacto
- `productos.html` - Catálogo de productos con filtros funcionales
- `cart.html` - Carrito de cotización y checkout
- `contacto.html` - Página dedicada de contacto con redes sociales
- `sobre-nosotros.html` - **NUEVA** Página completa sobre la empresa
- Badge flotante en todas las páginas muestra cantidad de items

## Configuración de hCaptcha

Los formularios de contacto incluyen hCaptcha para protección anti-spam.

**Instrucciones completas:** Ver archivo `HCAPTCHA.md`

**Resumen rápido:**
1. Crear cuenta en https://www.hcaptcha.com/
2. Obtener tu Site Key
3. Reemplazar `YOUR_HCAPTCHA_SITE_KEY` en `contacto.html` e `index.html`

---

## 📦 Gestión de Productos

### Sistema de productos en JSON

Los productos se gestionan a través del archivo `productos.json`, lo que permite agregar, editar o eliminar productos sin tocar el código.

**🔗 Guía completa:** Ver archivo `PRODUCTOS.md`

### Archivo de productos: `productos.json`

- **230 productos** ya configurados con el inventario real
- Categorías organizadas: frutas, verduras, hierbas, hojas, hongos, etc.
- Imágenes de stock de Unsplash
- Línea premium y regular

### Cómo editar productos (resumen rápido)

1. Abre `productos.json`
2. Busca el producto por nombre
3. Edita los campos:
   ```json
   {
     "id": 1,
     "nombre": "Aguacate importado supremo",
     "unidad": "kilogramo",
     "categoria": "frutas",
     "linea": "premium",
     "image": "https://images.unsplash.com/photo-..."
   }
   ```
4. Guarda el archivo

### Categorías disponibles

- `congelados` - Congelados
- `despensa` - Despensa y básicos
- `especiales` - Especiales y gourmet
- `frutas` - Frutas
- `hierbas` - Hierbas y aromáticas
- `hojas` - Hojas y lechugas
- `hongos` - Hongos
- `hongos-gourmet` - Hongos gourmet frescos
- `legumbres` - Legumbres y granos
- `microgreens` - Microgreens
- `tuberculos` - Tubérculos y raíces
- `verduras` - Verduras

**Importante:** Para instrucciones detalladas sobre cómo agregar productos, cambiar imágenes, o solucionar errores, consulta el archivo `PRODUCTOS.md`.

---

## Redes sociales

Para personalizar los links de redes sociales:

**WhatsApp:** Edita `contacto.html` línea 103
```html
<a href="https://wa.me/5215500000000" ...>
```
Reemplaza `5215500000000` con tu número (formato internacional sin + ni espacios)

**Instagram:** Edita `contacto.html` línea 129
```html
<a href="https://instagram.com/somosfruit" ...>
```

**Email:** Ya configurado con `vcorea@somosfruit.net` (cámbialo si es necesario)

## LocalStorage

El sistema usa localStorage para mantener el carrito entre páginas:
- Key: `quotes`
- Formato: Array de objetos con productos y cantidades
