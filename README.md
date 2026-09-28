# 📱 LuckyPhone - Comercio Electrónico de Celulares & iPhones (Interfaz Web)

Bienvenido al repositorio oficial del cliente web **LuckyPhone**, una plataforma de comercio electrónico moderna, rápida y altamente estilizada diseñada para la venta y gestión de celulares y equipos **Apple iPhone**.

![Banner de LuckyPhone](https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80)

---

## 🚀 Características Principales

* **🛡️ Panel de Administración Exclusivo (`ROLE_ADMIN`)**:
  * Gestión centralizada de inventario y catálogo de celulares.
  * Formulario completo con selectores estandarizados para Marca, Almacenamiento, Memoria RAM y Estado del equipo.
  * Selector interactivo de imágenes con **Arrastrar y Soltar (Drag & Drop)**, vista previa instantánea local y opción de URL web directa.
  * Edición rápida y modal de vista detallada para cada producto.
* **🔐 Autenticación JWT & Rutas Protegidas**:
  * Control de acceso por roles (`ROLE_ADMIN` para administradores y `ROLE_USER` para clientes).
  * Inicios de sesión persistentes en el almacenamiento local y cierre de sesión seguro en la barra de navegación.
* **🔍 Búsqueda & Filtros Especializados de iPhone**:
  * Lupa funcional en la barra de navegación con ventana modal de búsqueda en tiempo real.
  * Filtro lateral dinámico por modelo de iPhone (iPhone 15 Pro Max, 15 Pro, 14, 13, etc.), capacidad de almacenamiento (`128GB`, `256GB`, `512GB`, `1TB`) y selector deslizable de presupuesto en soles.
* **⚡ Paginación Servidor-Cliente (Conectado a Spring Boot)**:
  * Integración directa con el servidor backend en Spring Boot utilizando objetos de transferencia de datos paginados (`PageResponse<ProductoResponseDTO>`).
* **🎨 Experiencia Visual & Rendimiento**:
  * Fondo WebGL interactivo en 3D (`ColorBends.tsx`) optimizado a 60 fotogramas por segundo (FPS).
  * Diseño limpio, moderno y elegante con una paleta de colores neón azul y púrpura sobre un fondo claro.

---

## 🛠️ Tecnologías Utilizadas

* **Marco de trabajo (Framework)**: React 18 (Vite)
* **Lenguaje de programación**: TypeScript
* **Estilos y Maquetación**: Tailwind CSS & Lucide Icons
* **Gráficos y Animaciones 3D**: Three.js & `@react-three/fiber`
* **Cliente de Peticiones HTTP**: Axios
* **Enrutamiento**: React Router DOM v6

---

## 💻 Instalación y Configuración Local

### 1. Requisitos Previos
* **Node.js**: Versión 18.0 o superior
* **npm**: Versión 9.0 o superior
* Backend **Backend-LuckyPhone** ejecutándose en `http://localhost:8080`

### 2. Pasos para Ejecutar

```bash
# Entrar al directorio del proyecto
cd Frontend-LuckyPhone-1

# Instalar las dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

La aplicación web estará disponible en la dirección: `http://localhost:3000`.

---

## 📂 Estructura del Proyecto

```text
src/
├── api/                  # Configuración del cliente Axios e interceptores JWT
├── components/           # Componentes reutilizables
│   ├── cart/             # Carrito lateral de compras
│   ├── home/             # Banners y tarjetas informativas
│   ├── products/         # Tarjetas de productos y filtros de iPhone
│   ├── shared/           # Barra de navegación (Navbar), pie de página y separadores
│   └── ui/               # Fondo animado 3D (ColorBends) y ventanas modales
├── interfaces/           # Contratos y tipos de TypeScript / DTOs
├── layouts/              # Estructura visual para administración (AdminLayout)
├── pages/                # Páginas (Inicio, Celulares, Panel Admin, Iniciar Sesión, Registro, Perfil)
├── router/               # Rutas de la aplicación y componente de rutas protegidas
├── services/             # Servicios para consumir la API de Spring Boot
└── main.tsx              # Punto de entrada principal de la aplicación
```

---

## 🌿 Convención de Ramas para Trabajo

* `main`: Código probado listo para producción.
* `develop`: Rama activa para pruebas, desarrollo y verificación de nuevas funcionalidades.

---

*Desarrollado con ❤️ para LuckyPhone.*
