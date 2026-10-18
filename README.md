# 🍅 Pomodoro To-Do App | TypeScript & React

[![Vercel Deployment](https://img.shields.io/badge/Vercel-production-000000?logo=vercel&logoColor=white)](https://todo-pomodoro-six.vercel.app/)
[![CI Pipeline](https://github.com/DevJorgEst/todo-pomodoro/actions/workflows/ci.yml/badge.svg)](https://github.com/DevJorgEst/todo-pomodoro/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

Aplicación web de alto rendimiento para la gestión de tareas pendientes optimizada mediante la técnica Pomodoro. Diseñada y construida bajo principios de arquitectura limpia, DevSecOps y optimización extrema de recursos.

🔗 **Producción en vivo:** [https://todo-pomodoro-six.vercel.app/](https://todo-pomodoro-six.vercel.app/)

---

## 🏗️ Arquitectura y Decisiones de Ingeniería

### 1. Motor de Tareas (Task Engine)

La gestión del To-Do se delega en un custom hook inmutable (`useTodos`) con persistencia local tolerante a fallos.

- **Persistencia Segura mediante Guards:** La hidratación del estado desde `localStorage` pasa por un módulo de validación con _Type Guards_ (`isTodoArray`, `isValidFilter`). Si el JSON en el cliente está corrupto o desactualizado, el motor activa un fallback automático seguro, evitando inconsistencias o roturas de UI en tiempo de ejecución.
- **Aislamiento de Estado:** Las mutaciones son completamente inmutables, lo que garantiza el determinismo de la lógica de negocio y facilita las pruebas unitarias aisladas.

### 2. Motor Pomodoro (Resiliencia en segundo plano)

El temporizador (`usePomodoro`) implementa una estrategia de resistencia ante la agresiva ralentización (_throttling_) que aplican los navegadores modernos a los intervalos de pestañas en segundo plano.

- **Derivación por Ancla de Tiempo:** En lugar de restar segundos de forma ingenua (`time -= 1`), el reloj se ancla a una estampa temporal real (`Date.now()`). Cada ciclo calcula la diferencia exacta contra el reloj de la CPU. Un único tick retrasado corrige automáticamente cualquier deriva acumulada.
- **Sin Web Workers (Criterio KISS):** Mover el temporizador a un Inline Worker se descartó deliberadamente. Al independizar la lógica de la frecuencia de ticks ejecutados, el beneficio real de un Worker es nulo, evitando a cambio la pérdida de type-checking estricto en el build y posibles dolores de cabeza con CSP.
- **Resync con Visibility API:** Al registrar el evento `visibilitychange`, la aplicación fuerza un tick síncrono inmediato en el microsegundo en que la pestaña vuelve a ser visible, saltándose la latencia de reanudación y disparando eventos vencidos al instante.

### 3. Feedback Auditivo Sin Dependencias

El sistema de notificaciones acústicas prescinde de peticiones de red tradicionales.

- **Síntesis con Web Audio API:** Se genera una campanilla digital de dos notas (E5 → C5) manipulando osciladores sinusoidales y envolventes exponenciales nativas. Cero assets multimedia externos, eliminando riesgos de latencias, fallos de CDNs o corrupción de red.
- **Manejo de Autoplay Gating:** El `AudioContext` se instancia de forma perezosa (_lazy_) y requiere la activación de una bandera a través de un gesto real del usuario (`pointerdown`/`keydown`). El canal está protegido para entornos sin interfaz de audio (como jsdom o SSR) evitando excepciones.

---

## 🛠️ Stack Tecnológico

- **Core UI:** React 19, Vite (Bundle Engine), TypeScript (type-checking estricto).
- **Estilos:** Tailwind CSS v3 con pipeline PostCSS/Autoprefixer y purga de clases no utilizadas.
- **Gestión de Estado:** Custom Hooks inmutables + `localStorage` con hidratación validada por Type Guards.
- **Calidad:** ESLint 10 (flat config), Prettier 3 y Vitest 5 + Testing Library.
- **Toolchain:** pnpm 12 (`packageManager` fijado para builds reproducibles) y Git Flow (`main`/`develop`/`feature/*`).

---

## 🧪 QA: Suite de Pruebas y Comandos

| Comando             | Descripción                                                  |
| ------------------- | ------------------------------------------------------------ |
| `pnpm test`         | Ejecuta la suite completa (Vitest, modo `run`).              |
| `pnpm lint`         | Análisis estático con ESLint (flat config).                  |
| `pnpm format:check` | Verificación de estilo sin escribir ficheros.                |
| `pnpm build`        | `tsc -b && vite build` → artefacto de producción en `dist/`. |

La suite cubre **53 tests en 6 ficheros** con dos niveles de aislamiento:

1. **Unitarios deterministas:** el motor Pomodoro se valida con reloj falso (`vi.useFakeTimers({ toFake: [...] })`), congelando `Date` y los timers para verificar derivas, cambios de fase y el resync en segundo plano.
2. **Integración de UI:** `@testing-library/react` + `user-event` sobre jsdom, verificando el flujo real de interacción (crear, completar, filtrar) y el ciclo completo de Pomodoro, incluida la campanilla sintetizada.

---

## 🚀 Despliegue y CI/CD Failsafe

La infraestructura de despliegue opera como un cerrojo de seguridad automatizado mediante **GitHub Actions** (`.github/workflows/ci.yml`).

- **Failsafe Pipeline:** Cada push o pull request a `main` o `develop` dispara un job que ejecuta `pnpm audit --prod`, valida linter/formato, corre los 53 tests y compila el proyecto. Si un test falla o hay una CVE de producción, el despliegue se cancela.
- **Métricas de Producción:** El bundle final estático está ultra optimizado a través de _Tree-shaking_ agresivo:
  - **JS + CSS + HTML combinados:** ~241 KB totales (Apenas **74.2 KB Gzip** transferidos al cliente).
