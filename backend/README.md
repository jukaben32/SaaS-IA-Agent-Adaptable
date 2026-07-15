# EstateCall — Backend

Backend en **Node.js + Express + TypeScript + Prisma**, sobre **Supabase** (Postgres +
Auth) — igual que el stack real del proyecto original — para la plataforma "Real Estate
Multi AI Agent Platform": llamadas de IA, calificación de leads, reserva de citas, portal
de clientes, pagos con Stripe y sitio web embebible.

## Funcionalidades implementadas

- **Auth con Supabase**: el login/signup lo maneja el frontend directo contra Supabase
  Auth (`supabase.auth.signUp` / `signInWithPassword`). El backend valida el JWT de
  Supabase en cada request y solo crea/vincula el perfil de dominio (`Agent` o `Client`)
  la primera vez, vía `POST /auth/agent/complete-profile` y
  `POST /auth/client/complete-profile` — esto último reproduce el flujo del video de
  "creá tu cuenta con el mismo email que usaste para reservar".
- **Propiedades**: CRUD completo, contadores por estado (Available/Pending/Sold), feed
  público filtrado por `aiAgentId` para que el agente de IA solo hable de lo permitido
  (`visibleToAiAgent`), carga de imágenes (vía URLs — conectar a Supabase Storage).
- **AI Agents**: perfiles de agentes de llamada (nombre, especialidad, guion de saludo,
  voz, personalidad), asignables a propiedades. Endpoint de "runtime context" protegido
  con API key para que el orquestador de voz/LLM arme el system prompt.
- **Citas (appointments)**: reserva (por IA o widget del sitio), slots disponibles,
  confirmar, cancelar, reprogramar (con estado `RESCHEDULE_REQUESTED` pendiente de
  aprobación, igual que en el video), pago en efectivo o marcado tras pago online.
- **Pagos**: Stripe PaymentIntents para pagar la cita, webhook para confirmar el pago y
  notificar por email, suscripción mensual para el website builder ($29/mes en el demo).
- **Llamadas**: registro de cada llamada (call log) con transcripción, duración y
  resultado, listado para el dashboard.
- **Clientes**: vista del agente con historial de citas por cliente.
- **Soporte**: tickets y chat cliente-agente.
- **Website builder**: configuración de micro-sitio por `slug` (tema, hero, agente de IA
  activo), publicación, requiere suscripción activa. Calza con `app/sites/[slug]` del
  frontend.
- Emails transaccionales en cada paso (reserva, confirmación, cancelación, reprogramación,
  pago, invitación al portal) vía **Resend**.

## Instalación

```bash
cd estatecall-backend
npm install
cp .env.example .env   # completá DATABASE_URL y credenciales de Supabase, Stripe, Resend
npx prisma migrate dev --name init
npm run seed             # crea el usuario demo en Supabase Auth + los 4 listados del video
npm run dev
```

Login de prueba tras el seed (usuario real en Supabase Auth): `agent@estatecall.com` /
`password123`

### Configurar Supabase

1. Creá un proyecto en [supabase.com](https://supabase.com).
2. `Project Settings > Database` → copiá el **Connection string** a `DATABASE_URL`
   (usá el modo "Session" o "Transaction pooler" para producción).
3. `Project Settings > API` → copiá `URL` → `SUPABASE_URL`, `service_role` key →
   `SUPABASE_SERVICE_ROLE_KEY`, y el `JWT Secret` → `SUPABASE_JWT_SECRET`.
4. El schema de `prisma/schema.prisma` crea sus propias tablas en el mismo Postgres de
   Supabase — no hace falta tocar nada en el SQL editor de Supabase, `prisma migrate dev`
   se encarga.

## Estructura

```
src/
  config/        # env vars, cliente Prisma, cliente admin de Supabase
  middleware/     # auth (valida JWT de Supabase, resuelve perfil agente/cliente/servicio)
  modules/
    auth/         # completar perfil tras el signup de Supabase
    properties/   # listados
    agents/       # perfiles de AI agent (llamadas)
    appointments/  # reservas, confirmación, cancelación, reprogramación
    calls/        # call log
    clients/      # vista de clientes del agente
    support/      # tickets de soporte
    payments/     # Stripe (intents, webhook, suscripción)
    website/      # website builder (slug)
  routes/         # router principal /api
  app.ts          # Express app + middlewares
  index.ts        # arranque del servidor
prisma/
  schema.prisma   # modelo de datos completo
  seed.ts         # datos de ejemplo + usuario demo en Supabase Auth
```

## Autenticación

- **Frontend → Supabase**: el login/signup ocurre directo contra Supabase Auth desde
  Next.js (`@supabase/ssr`). El JWT resultante (`session.access_token`) es el que se
  manda como `Authorization: Bearer <token>` a este backend.
- **Backend**: valida ese token con `supabaseAdmin.auth.getUser(token)` y busca el
  `Agent`/`Client` vinculado por `authUserId`. No hay contraseñas ni JWT propio en el
  backend — Supabase es la única fuente de verdad de autenticación.
- **Servicio** (orquestador de voz IA / webhooks internos): header
  `x-service-key: <AI_SERVICE_KEY>` para `runtime-context` y logging de llamadas.

## Próximos pasos sugeridos

1. **Imágenes**: conectar `POST /properties/:id/images` a **Supabase Storage** (bucket
   público) antes de guardar las URLs.
2. **Orquestación de voz**: este backend expone todo lo que un orquestador de voz
   (Realtime API + telefonía) necesita — `GET /ai-agents/:id/runtime-context` para el
   contexto y `POST /appointments` + `POST /calls` para registrar resultados — pero no
   incluye la integración de telefonía en sí.
3. **Stripe**: crear el producto/precio del website builder en el dashboard de Stripe y
   configurar `STRIPE_WEBSITE_PRICE_ID`, y apuntar el webhook a
   `POST /api/payments/webhook`.
4. **RLS**: como el backend usa la `service_role` key (bypassea RLS), es buena práctica
   igual activar Row Level Security en las tablas desde el dashboard de Supabase como
   defensa en profundidad, aunque el acceso público solo pase por esta API.

