# 🧸 Juguetería Alegre - Frontend React + Tailwind

Aplicación web de e-commerce de juguetes construida con **React**, **Vite** y **Tailwind CSS**. Cuenta con carrito de compras funcional, búsqueda de productos, detalle de producto y formulario de contacto. Preparada para integrar **Supabase** como backend.

---

## 📋 Características

✅ **Header mejorado** con navegación, buscador funcional y contador de carrito  
✅ **Galería de productos** con grid responsivo  
✅ **Carrito lateral (drawer)** con controles +/− de cantidad  
✅ **Modal de detalle de producto** con cantidad seleccionable  
✅ **Búsqueda en tiempo real** de productos  
✅ **Formulario de contacto** con validación  
✅ **Estilos modernos** con gradientes y animaciones  
✅ **Almacenamiento local** con localStorage  
✅ **Totales calculados automáticamente** en carrito  

---

## 🚀 Instalación y Ejecución

### Requisitos
- **Node.js** 16+ (descargar de https://nodejs.org/)
- **npm** (viene con Node.js)

### Pasos

1. **Abre PowerShell** y navega a la carpeta del proyecto:
```powershell
cd 'C:\Diseño_Web\Diseño_Web\ProyectoSemana14\toy-store'
```

2. **Instala las dependencias** (solo la primera vez):
```powershell
npm install
```

3. **Inicia el servidor de desarrollo**:
```powershell
npm run dev
```

4. **Abre en el navegador**:
   - Copia la URL que aparece en la terminal (ej: `http://localhost:5173`)
   - Pégala en tu navegador favorito

5. **Para detener el servidor**: Presiona `Ctrl + C` en PowerShell

---

## 📂 Estructura del Proyecto

```
toy-store/
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Navegación, búsqueda, carrito
│   │   ├── Body.jsx             # Listado de productos (filtrable)
│   │   ├── ProductCard.jsx       # Tarjeta de producto individual
│   │   ├── ProductDetail.jsx     # Modal de detalle con cantidad
│   │   ├── CartDrawer.jsx        # Drawer lateral del carrito
│   │   ├── Contact.jsx           # Formulario de contacto
│   │   └── Footer.jsx            # Pie de página
│   ├── lib/
│   │   ├── cart.js              # Utilidades del carrito (localStorage)
│   │   └── supabaseClient.js    # Cliente Supabase (stub)
│   ├── App.jsx                  # Componente raíz
│   ├── main.jsx                 # Punto de entrada
│   └── index.css                # Estilos globales
├── index.html                   # HTML raíz
├── vite.config.js               # Configuración de Vite
├── tailwind.config.cjs          # Configuración de Tailwind
├── postcss.config.cjs           # Configuración de PostCSS
├── package.json                 # Dependencias y scripts
└── README.md                    # Este archivo
```

---

## 🛠️ Comandos Disponibles

```powershell
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm build

# Previsualizar build
npm run preview

# Ver lista de scripts disponibles
npm run
```

---

## 🛒 Uso de la Aplicación

### 1. **Explorar Productos**
- Desplázate por la galería de productos
- Cada tarjeta muestra nombre, precio y dos botones

### 2. **Ver Detalle de Producto**
- Haz clic en **"Ver detalle"** → se abre un modal
- Usa botones **−** y **+** para cambiar cantidad
- Haz clic en **"Añadir X al carrito"** para confirmar

### 3. **Añadir al Carrito**
- Opción rápida: botón **"+ Añadir"** en tarjeta (cantidad 1)
- O desde el modal: selecciona cantidad y confirma
- El contador en el header se actualiza automáticamente

### 4. **Abrir Carrito Lateral**
- Haz clic en **🛒 Carrito** en el header
- Ve todos los items con cantidad, precio unitario y subtotal

### 5. **Controlar Cantidad en Carrito**
- Usa botones **−** (rojo) y **+** (verde) para cada item
- El total se recalcula en tiempo real
- Haz clic en **✕** para eliminar item completo

### 6. **Buscar Productos**
- Escribe en la barra de búsqueda en el header
- Los productos se filtran en tiempo real por nombre
- Limpia la búsqueda para ver todos nuevamente

### 7. **Enviar Contacto**
- Desplázate al apartado **"Contacto"**
- Completa nombre, email y mensaje
- Haz clic en **"Enviar mensaje"**
- Los mensajes se guardan localmente (localStorage)

### 8. **Limpiar Carrito**
- Haz clic en **"Vaciar carrito"** desde el drawer lateral

---

## 💾 Almacenamiento Local

Los datos se guardan en el navegador (no en servidor):

- **Carrito**: `toy_store_cart` (JSON en localStorage)
- **Contactos**: `toy_store_contacts` (JSON en localStorage)

Para borrar todos los datos: abre DevTools (F12) → Consola → `localStorage.clear()`

---

## 🔗 Próxima Integración: Supabase

### Preparación

1. **Crea una cuenta** en https://supabase.com (gratis)
2. **Crea un proyecto** nuevo
3. **Obtén las credenciales**:
   - `VITE_SUPABASE_URL` (API URL)
   - `VITE_SUPABASE_ANON_KEY` (anon key)

### Instalación

```powershell
npm install @supabase/supabase-js
```

### Configuración

1. **Crea archivo `.env`** en la raíz del proyecto (`toy-store/.env`):
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

2. **Descomenta en `src/lib/supabaseClient.js`**:
```javascript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

3. **Reemplaza mock data en `src/components/Body.jsx`**:
```javascript
useEffect(() => {
  async function loadProducts() {
    const { data, error } = await supabase.from('products').select('*')
    if (!error) setAllProducts(data)
  }
  loadProducts()
}, [])
```

4. **Guarda contactos en Supabase** (en `src/components/Contact.jsx`):
```javascript
await supabase.from('contacts').insert([
  { name, email, message, created_at: new Date() }
])
```

---

## 📱 Responsive Design

- ✅ **Móvil** (320px+): Stack vertical
- ✅ **Tablet** (768px+): Grid 2 columnas
- ✅ **Desktop** (1024px+): Grid 3 columnas
- ✅ Header adaptativo, carrito siempre accesible

---

## 🎨 Tecnologías Utilizadas

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| React | 18.x | Framework UI |
| Vite | 5.x | Bundler y dev server |
| Tailwind CSS | 3.x | Estilos |
| PostCSS | 8.x | Procesador CSS |
| Supabase (próximo) | - | Backend BaaS |

---

## 🐛 Solución de Problemas

### Puerto 5173 en uso
```powershell
# Vite usa otro puerto automáticamente, o mata el proceso:
Get-Process node | Stop-Process -Force
```

### Módulos no encontrados
```powershell
# Reinstala dependencias:
rm node_modules -r
rm package-lock.json
npm install
```

### Página en blanco
- Abre DevTools (F12) → **Consola**
- Busca errores de JavaScript
- Verifica que la URL sea `http://` (no `file://`)

### Carrito no guarda datos
- Abre DevTools → **Storage** → **Local Storage**
- Verifica que `toy_store_cart` exista
- Borra datos y refresca: `F5`

---

## 📝 Notas de Desarrollo

- **Estado global**: Usa `localStorage + eventos` (sin Redux/Context para simplicidad)
- **Componentes funcionales**: Todos usan hooks (useState, useEffect)
- **Estilos**: Tailwind utility-first, sin CSS custom
- **Sin dependencias pesadas**: Enfoque minimalista y performante

---

## 🚢 Desplegar a Producción

### Build
```powershell
npm run build
```

Genera carpeta `dist/` lista para producción.

### Opciones de hosting
- **Vercel**: https://vercel.com (recomendado para Vite/React)
- **Netlify**: https://netlify.com
- **GitHub Pages**: Requiere configuración adicional
- **Azure Static Web Apps**: Integración con Supabase

---

## 📧 Contacto / Soporte

Para preguntas o issues:
1. Revisa la consola del navegador (F12)
2. Verifica que Node.js esté instalado: `node -v`
3. Reinstala dependencias: `npm install`

---

## 📄 Licencia

Proyecto educativo. Libre para usar y modificar.

---

**Última actualización**: Noviembre 2025  
**Estado**: ✅ Funcional, listo para Supabase

