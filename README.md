# 📱 LuckyPhone - E-Commerce de Celulares & iPhones (Frontend)

Bienvenido al repositorio oficial del cliente web **LuckyPhone**, una plataforma de e-commerce moderna, rápida y altamente estilizada diseñada para la venta y gestión de celulares y equipos **Apple iPhone**.

![LuckyPhone Banner](https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80)

---

## 🚀 Características Principales

* **🛡️ Panel de Administración Exclusivo (`ROLE_ADMIN`)**:
  * Gestión centralizada de inventario y catálogo de celulares.
  * Formulario completo con selectores estandarizados para Marca, Almacenamiento, RAM y Estado.
  * Selector interactivo de imágenes con **Drag & Drop**, vista previa instantánea local y opción de URL web directa.
  * Edición rápida y modal de detalle para cada producto.
* **🔐 Autenticación JWT & Rutas Protegidas**:
  * Control de acceso por roles (`ROLE_ADMIN` y `ROLE_USER`).
  * Inicios de sesión persistentes en `localStorage` y logout seguro en la barra de navegación.
* **🔍 Búsqueda & Filtros Especializados de iPhone**:
  * Lupa en la barra de navegación con modal interactivo de búsqueda instantánea.
  * Filtro lateral dinámico por línea de iPhone (iPhone 15 Pro Max, 15 Pro, 14, 13, etc.), capacidades de almacenamiento (`128GB`, `256GB`, `512GB`, `1TB`) y slider de presupuesto.
* **⚡ Paginación Servidor-Cliente (Spring Boot)**:
  * Integración fluida con el backend Spring Boot utilizando DTOs paginados (`PageResponse<ProductoResponseDTO>`).
* **🎨 Experiencia Visual & Rendimiento**:
  * Fondo WebGL interactivo en 3D (`ColorBends.tsx`) optimizado a 60 FPS.
  * Diseño limpio y profesional con paleta neón azul/púrpura sobria.

---

## 🛠️ Tecnologías Utilizadas

* **Framework**: React 18 (Vite)
* **Lenguaje**: TypeScript
* **Estilos**: Tailwind CSS & Lucide Icons
* **Gráficos 3D**: Three.js & `@react-three/fiber`
* **Peticiones HTTP**: Axios
* **Enrutado**: React Router DOM v6

---

## 💻 Instalación y Configuración Local

### 1. Requisitos Previos
* **Node.js**: v18.0 o superior
* **npm**: v9.0 o superior
* Backend **Backend-LuckyPhone** corriendo en `http://localhost:8080`

### 2. Pasos para Ejecutar

```bash
# Clonar repositorio (o situarse en el directorio)
cd Frontend-LuckyPhone-1

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

---

## 📂 Estructura del Proyecto

```text
src/
├── api/                  # Configuración de cliente Axios e Interceptores JWT
├── components/           # Componentes modulares
│   ├── cart/             # Carrito lateral de compras
│   ├── home/             # Banners y grilla de características
│   ├── products/         # Tarjetas de productos y filtros especializados
│   ├── shared/           # Navbar, Footer y Separadores
│   └── ui/               # Fondo WebGL (ColorBends) y modales
├── interfaces/           # Contratos TypeScript / DTOs
├── layouts/              # Layout de administración (AdminLayout)
├── pages/                # Páginas principales (Home, Celulares, Admin, Login, Registro, Perfil)
├── router/               # Rutas de React Router y HOC ProtectedRoute
├── services/             # Servicios de integración con Backend Spring Boot
└── main.tsx              # Punto de entrada principal
```

---

## 🌿 Convención de Ramas

* `main`: Producción y versiones estables.
* `develop`: Rama activa de pruebas e integración de nuevas características.

---

*Desarrollado con ❤️ para LuckyPhone.*
