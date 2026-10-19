# YuppiFacts

MVP de YuppiFacts: SaaS para capturar comprobantes, preparar solicitudes de factura y organizar XML/PDF por cuenta y contribuyente.

## Rutas incluidas

- `/` landing pública responsive.
- `/entrar` y `/registro` para acceso y alta.
- `/demo` espacio de trabajo con datos ficticios y aviso explícito de demostración.
- `/admin` panel maestro separado del espacio suscriptor.

## Dominios de producción

- `yuppifacts.com`: sitio público y suscripciones.
- `app.yuppifacts.com`: panel de clientes, contadores y empresas; el host raíz se resuelve al espacio de trabajo.
- `admin.yuppifacts.com`: administrador maestro; el host raíz se resuelve a `/admin`.

En Vercel, añadir los tres dominios al mismo proyecto y crear los registros DNS solicitados. La aplicación resuelve los hosts mediante `middleware.ts`; la autorización real por rol debe mantenerse también en la API.

## Desarrollo

```bash
pnpm install
pnpm dev
```

Para el servicio API en Render:

```bash
cd api
pnpm install
pnpm dev
```

Copiar `.env.example` para cada servicio y cargar las variables reales en Vercel/Render, nunca en el repositorio.

## Límites del MVP

No emite CFDI, no opera como PAC y no solicita ni almacena e.firma, CSD, `.key`, `.cer` ni contraseñas fiscales. Las integraciones con proveedores quedan en estado asistido hasta contar con una API autorizada o intervención explícita del usuario. Consulte `docs/limitations.md`.
