# Documentación del Proyecto: MS-TEMPLATE

---

## Tabla de Contenidos

1. [Resumen del Proyecto](#1-resumen-del-proyecto)
2. [Estructura del Proyecto](#2-estructura-del-proyecto)
3. [Guía de Uso](#3-guía-de-uso)
4. [Detalles de los Módulos/Componentes](#4-detalles-de-los-móduloscomponentes)
5. [Documentación de la API](#5-api-documentation-si-aplica)
6. [Ejemplos de Código](#6-ejemplos-de-código)
7. [Notas de Desarrollo](#7-notas-de-desarrollo)
8. [Licencia](#8-licencia)

---

## 1. Resumen del Proyecto

### Descripción general

Es un microservicio basado en una arquitectura modular y basada en contextos que provee una plantilla para el desarrollo de microservicios escalables y mantenibles. Ofrece una estructura limpia para trabajar con distintos tipos de bases de datos (SQLServer y MySQL), y facilita la creación, consulta, actualización y eliminación de entidades de negocio a través de una API RESTful.

Entre sus funcionalidades principales están:

- Gestión CRUD de diversas entidades (ej. SQLServer, MySQL, etc.).
- Configuración para múltiples ambientes (DEV, QA, PROD, FEATURE).
- Soporte para paginación, ordenamiento y filtros avanzados en consultas.
- Uso de patrones de diseño para una arquitectura ordenada: controladores, casos de uso, repositorios, modelos de dominio y servicios compartidos.
- Manejo y estandarización de errores con respuestas uniformes.

### Tecnologías y lenguajes utilizados

- **Lenguaje:** TypeScript (transpilado a JavaScript para ejecución en Node.js)
- **Framework HTTP:** Express.js
- **Bases de datos:**
  - MySQL para modelos relacionales.
  - SQLServer para modelos relacionales.
- **Gestión de errores:** Clases personalizadas y manejo centralizado.
- **Internacionalización:** Sistema de traducción de mensajes con archivos JSON por idioma.
- **Testing:** Jest con TS-Jest.
- **Contenedores:** Preparado para ejecución en entornos Docker.
- **Varios:** Nodemon, ESLint, Typedoc, herramientas de linteo y documentación.

### Instrucciones básicas de instalación y configuración

**Instalar dependencias**

```bash
npm install
```

**Configurar variables de entorno**

Variables configurables en archivos `.env` por ambiente (`.env-dev`, `.env-qa`, `.env-prod`, etc.). Ejemplo:

```env
STAGE=DEV
APP_NAME=SERVICE_BACK
APP_PORT=3000
APP_DEFAULT_LANG=es
APP_API_KEY=tu_api_key_aqui
```

**Ejecutar la aplicación**

- Para desarrollo con recarga automática:

  ```bash
  npm run start:local
  ```

- Para producción:

  ```bash
  npm run build
  npm run start:prod
  ```

---

## 2. Estructura del Proyecto

```
src/
├── api/
│   ├── controllers/              # Controladores de la API REST
│   └── routes/                   # Definición de rutas para cada recurso
├── contexts/
│   ├── shared/                  # Componentes compartidos, dominio, infraestructura
│   ├── entity-test/             # Contexto de ejemplo con entidad Test
├── server.ts                   # Configuración de servidor Express
├── api.ts                      # Configuración básica de Express API
├── cli-tools/                  # Herramientas para generación automática de código
test/                           # Tests automatizados y configuración de Jest
.deployment/                    # Archivos de configuración para despliegues por ambiente
.env*                           # Archivos de variables de entorno

```

### Descripción de carpetas y archivos clave

- **src/api/controllers:** Clases controladoras responsables de manejar las solicitudes HTTP y enviar respuestas.
- **src/api/routes:** Definición de rutas, agrupando endpoints por entidad.
- **src/contexts/shared:** Contiene componentes compartidos como DTOs, interfaces, servicios, manejo de errores e internacionalización.
- **src/contexts/**[nombre entidad]: Contextos específicos para cada entidad de negocio que contienen dominio (modelo, repositorio, interfaces), casos de uso (lógica de negocio) e infraestructura (repositorios concretos).
- **src/server.ts:** Inicializa servidor Express y carga las rutas junto con middleware y gestión global de errores.
- **src/api.ts:** Construye la aplicación Express, registra rutas y middlewares comunes.
- **cli-tools/generator:** Herramientas para generar código nuevo para entidades automáticamente con plantillas.
- **test/**: Contiene configuraciones y archivos para pruebas unitarias e integración con Jest.
- **.deployment/**: Variables de entorno específicas para cada ambiente (DEV, PROD, QA).

---

## 3. Guía de Uso

### Uso general

Una vez que la aplicación esté corriendo en el puerto configurado (por defecto 3000), la API REST estará accesible bajo el path `/v1`.

Por ejemplo, para la entidad `entity-test`, los recursos estarán disponibles en:

```
GET /v1/entityTest/
GET /v1/entityTest/:entityTestId
POST /v1/entityTest/
PATCH /v1/entityTest/:entityTestId
DELETE /v1/entityTest/:entityTestId
```

### Ejecución de comandos principales

- **Ejecutar servidor en desarrollo**

  ```bash
  npm run dev
  ```
