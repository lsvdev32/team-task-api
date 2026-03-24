# Despliegue Fullstack en Elastic Beanstalk

Este flujo genera una version de despliegue separada para Elastic Beanstalk sin modificar la estructura actual frontend/backend.

## Objetivo

Generar una carpeta lista para zip con esta estructura:

- package.json
- package-lock.json
- src/
- public/

Donde:

- src/ viene del backend
- public/ viene del build del frontend Vite

## Pasos

1. Instala dependencias si aun no estan instaladas:
   - backend: `npm install` dentro de `backend`
   - frontend: `npm install` dentro de `frontend`
2. Desde la raiz del repo, ejecuta:
   - `npm run eb:prepare`
3. Se genera la carpeta:
   - `deploy/team-task-api-eb`
4. Comprime el contenido de `deploy/team-task-api-eb` en un `.zip`.
5. Sube ese `.zip` a un entorno Node.js de Elastic Beanstalk.
6. Configura variables de entorno en Beanstalk (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, etc.).

## Importante

- El backend sigue sirviendo API en `/api/*`.
- Si existe `public/index.html`, el backend sirve frontend estatico y fallback SPA.
- Este flujo no rompe ni reemplaza el despliegue actual con Docker.
