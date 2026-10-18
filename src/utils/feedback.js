/**
 * Feedback auditivo de fin de ciclo, sintetizado con la Web Audio API.
 *
 * Sin recursos externos: no hay ficheros de audio que se corrompan, que falten
 * o que ralentizen el primer render. Y seguro con las políticas de autoplay:
 * los navegadores solo permiten crear/reanudar un `AudioContext` tras un gesto
 * del usuario, así que `playChime` es un no-op hasta que se llama a
 * `markUserInteraction` (App lo invoca en el primer `pointerdown`/`keydown`).
 */
let hasUserInteracted = false;
let audioContext = null;
/** Campanilla suave y descendente (E5 → C5). */
const CHIME_NOTES = [659.25, 523.25];
const NOTE_GAP_SECONDS = 0.18;
const NOTE_DURATION_SECONDS = 0.4;
const ATTACK_SECONDS = 0.02;
const PEAK_VOLUME = 0.15;
/** Registra un gesto del usuario para desbloquear el audio (autoplay policy). */
export function markUserInteraction() {
    hasUserInteracted = true;
    if (audioContext?.state === 'suspended') {
        void audioContext.resume().catch(() => undefined);
    }
}
function createContext() {
    if (typeof AudioContext === 'undefined')
        return null;
    try {
        return new AudioContext();
    }
    catch {
        return null;
    }
}
/** Reproduce la campanilla de fin de ciclo. No-op sin interacción previa. */
export function playChime() {
    if (!hasUserInteracted)
        return;
    const context = audioContext ?? createContext();
    if (context === null)
        return;
    audioContext = context;
    if (context.state === 'suspended') {
        void context.resume().catch(() => undefined);
    }
    scheduleChime(context);
}
function scheduleChime(context) {
    const firstNoteAt = context.currentTime + 0.02;
    CHIME_NOTES.forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const noteStart = firstNoteAt + index * NOTE_GAP_SECONDS;
        const noteEnd = noteStart + NOTE_DURATION_SECONDS;
        // Envolvente: ataque rápido y caída suave para que el tono sea sutil
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, noteStart);
        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.exponentialRampToValueAtTime(PEAK_VOLUME, noteStart + ATTACK_SECONDS);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(noteStart);
        oscillator.stop(noteEnd + 0.05);
    });
}
