# Límites y estados transparentes

Estados de solicitud: `pendiente_de_usuario`, `asistida`, `automatica_autorizada`, `enviada`, `recibida`, `fallida`, `cancelada`. No se debe mostrar `automatica_autorizada` salvo que exista un adaptador del proveedor validado y consentimiento aplicable.

YuppiFacts no supera CAPTCHA/MFA, no crea cuentas de proveedor sin autorización expresa, no extrae secretos, no asegura que un alias de correo equivalga a un CFDI válido y no procesa pagos con datos de tarjeta. Los pagos se integrarán mediante proveedor tokenizado y webhooks verificados.
