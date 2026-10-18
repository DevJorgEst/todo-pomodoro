// Configuración global de pruebas: registra los matchers de jest-dom
// sobre el `expect` de Vitest (por eso la entrada /vitest y no la principal,
// que extiende el `expect` de Jest).
import '@testing-library/jest-dom/vitest'
