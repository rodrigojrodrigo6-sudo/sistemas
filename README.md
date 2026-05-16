# Gestor de Sitios Web Pendientes

Una aplicación web fullstack moderna para guardar, organizar y hacer seguimiento a sitios web por visitar. Creada con Next.js (App Router), Supabase y TailwindCSS.

## Características

- 🔐 Autenticación completa (Registro, Login)
- 📊 Dashboard intuitivo y minimalista
- 🏷️ Categorización y descripción de enlaces
- ✅ Marcado rápido como "Visitado"
- 🔍 Búsqueda en tiempo real por nombre y URL
- 🗂️ Filtros por estado (Todos, Pendientes, Visitados)
- ↕️ Ordenamiento (Recientes, Alfabético, Visitados primero)
- 🌙 Diseño optimizado para Dark Mode y Móviles

## Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Base de datos & Auth**: Supabase
- **Estilos**: TailwindCSS
- **Iconos**: Lucide React
- **Lenguaje**: TypeScript

## Instalación Local

1. Clona el repositorio e instala las dependencias:
   ```bash
   npm install
   ```

2. Crea tu proyecto en [Supabase](https://supabase.com/).

3. Ejecuta el script SQL en el editor SQL de Supabase (encuentra el código en `supabase_schema.sql` en la raíz del proyecto).

4. Configura las variables de entorno. Renombra `.env.example` a `.env.local` y agrega tus credenciales de Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
   ```

5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

6. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Deploy en Vercel

La aplicación está lista para ser desplegada en Vercel:

1. Empuja tu código a GitHub/GitLab.
2. Crea un nuevo proyecto en Vercel e importa el repositorio.
3. En la sección de **Environment Variables**, añade:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Haz clic en **Deploy**.

## Notas sobre Supabase

Por defecto, Supabase requiere confirmación de correo electrónico. Para simplificar el desarrollo o el acceso, puedes deshabilitar "Confirm Email" en Supabase > Authentication > Providers > Email.
