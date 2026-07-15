# EstateCall — Frontend

Next.js 14 (App Router) + Supabase Auth + Tailwind, calcando la estructura de rutas del
repo original (`(auth)`, dashboard del agente, portal del cliente, sitio público por
`slug`, widget embebible).

## Diferencia consciente respecto al repo original

El starter repo original usaba **route groups puros** (`(dashboard)`, `(portal)`) que no
agregan segmento a la URL. Acá usé carpetas reales `dashboard/` y `portal/` (con URLs
`/dashboard/*` y `/portal/*`) en su lugar, porque:

1. Evita colisiones de rutas entre el dashboard del agente y el portal del cliente
   (ambos necesitan una página `/appointments`, por ejemplo).
2. El `middleware.ts` necesita un prefijo de URL real para poder proteger esas rutas con
   un `matcher` simple.

Todo lo demás —`sites/[slug]`, `widget-demo`, `widget-test`, `(auth)` como `/login` y
`/signup`— sigue exactamente la convención del repo original.

## Stack

Next.js 14 · TypeScript · Tailwind · Supabase (`@supabase/ssr`) · TanStack Query ·
Stripe Elements · Zustand (listo para usar, aún no hay estado global complejo que lo
necesite) · Lucide icons

## Sistema de diseño

- **Colores**: `forest` (#0B3D2E, verde bosque profundo — sidebar y branding),
  `sand` (#F7F5EF, fondo cálido), `accent` (#16A34A, CTAs y estados positivos),
  `clay` (#D97757, errores/cancelaciones)
- **Tipografía**: `Fraunces` (display, títulos con carácter) + `Inter` (UI, cuerpo)
- **Componentes base** en `globals.css`: `.card`, `.btn-primary/secondary/danger`,
  `.input`, `.badge` — reutilizados en toda la app en vez de repetir clases de Tailwind

## Instalación

```bash
cd estatecall-frontend
npm install
cp .env.example .env.local   # completá Supabase (anon key), API URL, Stripe publishable key
npm run dev
```

Corré el backend en paralelo (`estatecall-backend`, puerto 4000 por defecto) — el
frontend le pega directo vía `NEXT_PUBLIC_API_URL`.

## Estructura

```
src/
  app/
    page.tsx                 # landing
    login/, signup/           # auth (Supabase directo desde el cliente)
    dashboard/                 # dashboard del agente (protegido)
      page.tsx                 # overview
      listings/, appointments/, calls/, clients/, ai-agents/, website/
    portal/                    # portal del cliente (protegido)
      page.tsx                 # sus citas: pagar, reprogramar, cancelar
    sites/[slug]/               # micro-sitio público del agente + widget embebido
    widget-demo/, widget-test/   # páginas para probar el widget embebible
  components/
    layout/    # Sidebar del dashboard, header del portal
    ui/        # StatusBadge, StatCard
    auth/      # AuthCard compartida
    portal/    # PaymentModal (Stripe Elements)
    widget/    # CallWidget embebible
  lib/
    supabase/  # clientes browser y server
    api.ts     # wrapper de fetch que adjunta el token de Supabase
  types/       # tipos alineados con los modelos de Prisma del backend
  middleware.ts # protege /dashboard y /portal, refresca sesión
```

## Flujo de autenticación

1. `/signup` llama a `supabase.auth.signUp()` directo desde el navegador.
2. Inmediatamente después, llama a `POST /api/auth/agent/complete-profile` (o
   `/client/complete-profile`) en el backend para crear la fila de dominio vinculada a
   ese usuario de Supabase — es el mismo patrón que el backend espera.
3. Los clientes llegan a `/signup?role=client&email=...` desde el link que manda el
   backend después de una reserva (mismo flujo que el video: "creá tu cuenta con el
   mismo email que usaste para reservar").
4. `middleware.ts` protege `/dashboard/*` y `/portal/*`, redirigiendo a `/login` si no
   hay sesión.

## Pendiente / próximos pasos

1. **Voz en tiempo real**: `CallWidget` simula visualmente el estado de la llamada
   (idle → connecting → live). Conectar de verdad requiere WebRTC/WebSocket contra tu
   orquestador de voz (Realtime API) — el backend ya expone `GET
   /ai-agents/:id/runtime-context` para armar el contexto de esa llamada.
2. **Formulario "Add listing"**: el botón está en la UI pero falta el modal/formulario
   de creación — reusar el patrón del formulario de AI Agents.
3. **Confirmación de email de Supabase**: si tenés confirmación de email activada en tu
   proyecto de Supabase, el `complete-profile` no se puede llamar hasta que el usuario
   confirme y tenga sesión — hoy el signup asume confirmación desactivada (típico en
   desarrollo). Ajustar el flujo según tu configuración de producción.
