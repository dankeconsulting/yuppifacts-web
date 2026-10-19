# Despliegue de YuppiFacts

## Separación de aplicaciones

| Servicio | Repositorio | Plataforma | Responsabilidad |
| --- | --- | --- | --- |
| Web | `yuppifacts-web` | Vercel | Landing, acceso y paneles web |
| API | `yuppifacts-api` | Render | API, Neon, documentos privados y servicios de correo |

El frontend no recibe `DATABASE_URL`, llaves de AWS ni otros secretos. Esos valores pertenecen exclusivamente al servicio de Render.

## Vercel: proyecto `yuppifacts-web`

1. Crea un proyecto en Vercel conectado al repositorio `yuppifacts-web`.
2. Selecciona el preset **Next.js** y el directorio raíz `./`.
3. Conserva los comandos detectados por Vercel (`pnpm install` y `pnpm build`).
4. Agrega en **Production** estas variables, usando la URL externa real de Render:

   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_WEB_URL=https://yuppifacts.com`
   - `NEXT_PUBLIC_APP_URL=https://app.yuppifacts.com`
   - `NEXT_PUBLIC_ADMIN_URL=https://admin.yuppifacts.com`

5. Vincula al mismo proyecto estos dominios:

   - `yuppifacts.com`
   - `www.yuppifacts.com` (redirigido a `yuppifacts.com`)
   - `app.yuppifacts.com`
   - `admin.yuppifacts.com`

6. Copia en el proveedor del dominio los registros DNS que Vercel indique. El proyecto ya enruta los subdominios `app` y `admin` a sus vistas correspondientes durante esta fase inicial.

## Render: proyecto `yuppifacts-api`

1. Conecta Render al repositorio `yuppifacts-api`.
2. Usa `api` como raíz del servicio si se mantiene el monorepo durante la transición; al separar el repositorio, su raíz será `./`.
3. Configura las variables de `api/.env.example`, incluyendo el `DATABASE_URL` de Neon y la lista `WEB_ORIGIN`.
4. Añade las credenciales o el rol de AWS con permisos mínimos para S3, KMS y SES. No las expongas a Vercel.
5. Copia la URL externa final de Render en `NEXT_PUBLIC_API_URL` dentro de Vercel.
