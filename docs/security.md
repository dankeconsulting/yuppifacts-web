# Seguridad y privacidad

- Aislamiento obligatorio por tenant y contribuyente en todas las consultas.
- RBAC: propietario, administrador, contador/gestor, colaborador y auditor; soporte excepcional, temporal y auditado.
- Archivos privados, cifrados, sin bucket público; accesos mediante URL firmada corta.
- No almacenar ni solicitar e.firma, CSD, `.key`, `.cer`, llaves privadas o contraseñas fiscales.
- Registrar acceso a documentos, descargas, cambios de solicitud y acciones de soporte en `audit_events`.
- Validar MIME, tamaño, firmas de archivo y aplicar análisis antimalware antes de volver disponible un adjunto.
- Variables, credenciales de proveedor y llaves AWS solo en Secret Manager/variables del host, nunca en código, logs ni modelos de IA.
