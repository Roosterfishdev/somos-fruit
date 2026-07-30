# Configuración de hCaptcha - Somos Fruit

## ¿Qué es hCaptcha?

hCaptcha es un servicio gratuito de verificación anti-bot que protege tus formularios de spam y abusos. Es similar a reCAPTCHA pero con mejor privacidad y compensación.

## Configuración (5 minutos)

### 1. Crear cuenta en hCaptcha

1. Ve a https://www.hcaptcha.com/
2. Haz clic en "Sign Up" (arriba a la derecha)
3. Crea tu cuenta gratuita

### 2. Obtener tu Site Key

1. Una vez dentro, ve a "Sites" en el menú
2. Haz clic en "New Site"
3. Agrega tu dominio (o usa `localhost` para pruebas)
4. Copia el **Site Key** que te proporcionen

### 3. Configurar en tu sitio

Reemplaza `YOUR_HCAPTCHA_SITE_KEY` con tu Site Key real en estos archivos:

#### En `contacto.html` (línea 177):
```html
<div class="h-captcha" data-sitekey="b0ec8d66-702e-4d8e-b1b2-dafee884635a"></div>
```

#### En `index.html` (línea 235):
```html
<div class="h-captcha field--full" data-sitekey="Tb0ec8d66-702e-4d8e-b1b2-dafee884635a"></div>
```

### 4. ¡Listo!

El captcha aparecerá automáticamente en ambos formularios de contacto.

## Ejemplo de Site Key

```html
<!-- ANTES -->
<div class="h-captcha" data-sitekey="YOUR_HCAPTCHA_SITE_KEY"></div>

<!-- DESPUÉS -->
<div class="h-captcha" data-sitekey="10000000-ffff-ffff-ffff-000000000001"></div>
```

## Formularios con hCaptcha

✅ **Contacto en index.html** - Formulario en la sección de contacto  
✅ **Página de contacto** - contacto.html con canales de comunicación

## Verificación del backend

Si usas Formspree u otro servicio, hCaptcha envía automáticamente el token de verificación. 

Si usas tu propio backend, recibirás el campo `h-captcha-response` que debes verificar en el servidor.

## Plan gratuito

El plan gratuito de hCaptcha incluye:
- ✅ 1 millón de solicitudes/mes
- ✅ Sitios ilimitados
- ✅ Sin marca de agua
- ✅ Soporte por email

Más que suficiente para un sitio como Somos Fruit.

## Notas

- El captcha se escala automáticamente en mobile
- Los formularios funcionan sin captcha (solo abrirán el cliente de correo)
- Para producción, configura también el Secret Key en tu backend
