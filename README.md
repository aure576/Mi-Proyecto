# Chat Bidireccional Netlify + Pusher

Este proyecto incluye una función serverless en Netlify para conectar dos aplicaciones de chat en tiempo real usando Pusher.

## Estructura

- `custom_functions/bidireccional.js`: función que conecta ambos chats
- `index.html`: ejemplo de frontend para enviar y recibir mensajes
- `netlify.toml`: configuración para Netlify Functions

## Instalación

1. Instala dependencias:
   ```
   npm install
   ```
2. Comprime todos los archivos y carpetas y súbelos a Netlify.
3. ¡Listo! Tu función estará disponible en `/functions/bidireccional`.