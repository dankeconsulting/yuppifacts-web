# Arquitectura

`yuppifacts-web` es una aplicación Next.js para Vercel. `api/` es un servicio Express/TypeScript para el repositorio `yuppifacts-api`, diseñado para desplegarse en Render. Neon/PostgreSQL será la fuente de verdad; las consultas deben imponer `tenant_id` y permisos sobre `taxpayer_id`.

## AWS

Los archivos privados viven en S3 bajo `taxpayers/{taxpayerId}/documents/{uuid}-{nombre}`. La API genera una URL firmada de carga que expira a los 5 minutos y limita los MIME types a PDF, JPEG y PNG. Se solicita cifrado SSE-KMS por variable `AWS_KMS_KEY_ID`. No se debe exponer AWS al navegador.

Los avisos operativos deberán salir de SES desde `AWS_SES_FROM_EMAIL`, después de verificar dominio, identidad y configuración de rebotes. La recepción de correo debe usar una regla SES/S3 o un proveedor inbound, antivirus, cuarentena y un worker que enlace adjuntos XML/PDF por alias de solicitud; no debe aceptar ni procesar correo no atribuible.

## Datos iniciales

Entidades: users, tenants, memberships, roles, taxpayers, taxpayer_documents, tickets, qr_scans, invoice_requests, request_steps, invoices, invoice_files, vendors, vendor_portals, mail_aliases, received_messages, subscriptions, payments, notifications y audit_events.
