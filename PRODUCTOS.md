# Guía de Gestión de Productos

Este documento explica cómo agregar, editar o eliminar productos del sitio web de **Somos Fruit**.

## Estructura del archivo productos.json

Los productos se almacenan en el archivo `productos.json` con la siguiente estructura:

```json
{
  "productos": [
    {
      "id": 1,
      "nombre": "Aguacate importado supremo",
      "unidad": "kilogramo",
      "categoria": "frutas",
      "linea": "premium",
      "image": "https://images.unsplash.com/photo-..."
    }
  ]
}
```

## Campos de cada producto

| Campo | Tipo | Descripción | Valores permitidos |
|-------|------|-------------|-------------------|
| `id` | Número | Identificador único del producto | Número entero positivo |
| `nombre` | Texto | Nombre del producto | Cualquier texto |
| `unidad` | Texto | Unidad de venta | kilogramo, unidad, bandeja, rollo, caja, manojo, pieza |
| `categoria` | Texto | Categoría del producto | despensa, especiales, frutas, hierbas, hojas, hongos, hongos-gourmet, microgreens, congelados, legumbres, tuberculos, verduras |
| `linea` | Texto | Línea del producto | regular, premium |
| `image` | URL | URL de la imagen del producto | URL completa de Unsplash |

## Categorías disponibles

El sitio tiene **12 categorías** predefinidas:

1. **despensa** - Despensa y básicos
2. **especiales** - Especiales y gourmet
3. **frutas** - Frutas
4. **hierbas** - Hierbas y aromáticas
5. **hojas** - Hojas y lechugas
6. **hongos** - Hongos
7. **hongos-gourmet** - Hongos gourmet frescos
8. **microgreens** - Microgreens
9. **congelados** - Congelados
10. **legumbres** - Legumbres y granos
11. **tuberculos** - Tubérculos y raíces
12. **verduras** - Verduras

## Cómo agregar un nuevo producto

1. Abre el archivo `productos.json`
2. Localiza el último producto en el array (antes del `]`)
3. Añade una coma (`,`) después del último producto
4. Copia y pega esta plantilla:

```json
{
  "id": 200,
  "nombre": "Nombre del producto",
  "unidad": "kilogramo",
  "categoria": "frutas",
  "linea": "regular",
  "image": "https://images.unsplash.com/photo-..."
}
```

5. Modifica los valores:
   - **id**: Usa el siguiente número disponible (último id + 1)
   - **nombre**: El nombre del producto
   - **unidad**: Escoge una de las unidades válidas
   - **categoria**: Escoge una de las 9 categorías disponibles
   - **linea**: `regular` o `premium`
   - **image**: URL de Unsplash (ver sección de imágenes)

### Ejemplo completo:

```json
{
  "productos": [
    {
      "id": 199,
      "nombre": "Zucchini",
      "unidad": "unidad",
      "categoria": "verduras",
      "linea": "regular",
      "image": "https://images.unsplash.com/photo-..."
    },
    {
      "id": 200,
      "nombre": "Durazno",
      "unidad": "kilogramo",
      "categoria": "frutas",
      "linea": "premium",
      "image": "https://images.unsplash.com/photo-1629828874514-90a6d6daa5e4?w=400&h=400&fit=crop&q=80"
    }
  ]
}
```

## Cómo editar un producto existente

1. Abre `productos.json`
2. Busca el producto por su `id` o `nombre`
3. Modifica los campos que necesites
4. Guarda el archivo

**Importante:** NO cambies el `id` de productos existentes, esto puede romper los carritos de cotización de los clientes.

## Cómo eliminar un producto

1. Abre `productos.json`
2. Busca el producto que deseas eliminar
3. Elimina todo el objeto del producto (desde `{` hasta `}`)
4. Elimina la coma extra si quedó alguna al final
5. Guarda el archivo

## Imágenes de productos

### Buscar imágenes en Unsplash

1. Ve a [https://unsplash.com](https://unsplash.com)
2. Busca el producto (en inglés funciona mejor: "avocado", "tomato", "lettuce")
3. Selecciona una imagen
4. Copia la URL y agrégale estos parámetros al final:
   ```
   ?w=400&h=400&fit=crop&q=80
   ```

### Formato de URL completo:

```
https://images.unsplash.com/photo-[ID]?w=400&h=400&fit=crop&q=80
```

### Ejemplos de URLs válidas:

- Aguacate: `https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop&q=80`
- Tomate: `https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=400&fit=crop&q=80`
- Lechuga: `https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=400&fit=crop&q=80`

## Validación del archivo JSON

Después de hacer cambios, verifica que el archivo sea válido:

1. **Opción 1:** Usa un validador online como [JSONLint](https://jsonlint.com)
   - Copia todo el contenido de `productos.json`
   - Pégalo en JSONLint
   - Haz clic en "Validate JSON"

2. **Opción 2:** Abre el sitio web en tu navegador
   - Si hay errores, abre la consola del navegador (F12)
   - Busca mensajes de error en rojo

## Errores comunes

### ❌ Error: Falta una coma

```json
{
  "id": 1,
  "nombre": "Producto 1"
}
{  // ❌ FALTA COMA ANTES
  "id": 2,
  "nombre": "Producto 2"
}
```

✅ **Correcto:**

```json
{
  "id": 1,
  "nombre": "Producto 1"
},
{
  "id": 2,
  "nombre": "Producto 2"
}
```

### ❌ Error: Coma extra al final

```json
{
  "productos": [
    {
      "id": 1,
      "nombre": "Producto 1"
    },  // ❌ COMA EXTRA
  ]
}
```

✅ **Correcto:**

```json
{
  "productos": [
    {
      "id": 1,
      "nombre": "Producto 1"
    }
  ]
}
```

### ❌ Error: Categoría incorrecta

```json
{
  "categoria": "vegetales"  // ❌ NO EXISTE
}
```

✅ **Correcto:**

```json
{
  "categoria": "verduras"  // ✅ CATEGORÍA VÁLIDA
}
```

## Consejos útiles

1. **Haz copias de seguridad:** Antes de editar, haz una copia del archivo `productos.json`
2. **Usa un editor con resaltado de sintaxis:** VS Code, Sublime Text, o Notepad++
3. **Prueba los cambios:** Abre el sitio web después de hacer cambios para verificar
4. **Mantén el orden:** Ordena los productos por ID para facilitar la búsqueda
5. **Línea premium:** Usa `"linea": "premium"` para productos especiales o gourmet

## Soporte

Si tienes problemas editando el archivo, verifica:

1. ✅ El archivo está en formato JSON válido
2. ✅ Todas las comas están en su lugar
3. ✅ Las categorías son una de las 9 disponibles
4. ✅ Los IDs son únicos
5. ✅ Las URLs de imágenes son válidas

---

**Última actualización:** Mayo 2026
