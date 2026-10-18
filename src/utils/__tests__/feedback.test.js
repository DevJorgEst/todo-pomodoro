import { beforeEach, describe, expect, it, vi } from 'vitest';
class FakeGain {
    gain = {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
    };
    connect = vi.fn();
}
class FakeOscillator {
    type = 'sine';
    frequency = { setValueAtTime: vi.fn() };
    connect = vi.fn();
    start = vi.fn();
    stop = vi.fn();
}
class FakeAudioContext {
    state = 'running';
    currentTime = 12;
    destination = { name: 'destination' };
    resume = vi.fn().mockResolvedValue(undefined);
    createOscillator = vi.fn(() => new FakeOscillator());
    createGain = vi.fn(() => new FakeGain());
}
/** Sustituye el global AudioContext y devuelve el constructor espiado. */
function stubAudioContext(state = 'running') {
    const instances = [];
    // Function (no flecha): debe poder invocarse como constructor con `new`
    const constructor = vi.fn(function FakeAudioContextConstructor() {
        const instance = new FakeAudioContext();
        instance.state = state;
        instances.push(instance);
        return instance;
    });
    vi.stubGlobal('AudioContext', constructor);
    return { constructor, instances };
}
/** Importa el módulo de forma aislada: su estado interno vive a nivel de módulo. */
async function loadFeedback() {
    return import('../feedback');
}
beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
});
describe('feedback auditivo (Web Audio API)', () => {
    it('no reproduce nada sin un gesto previo del usuario (política de autoplay)', async () => {
        const { constructor } = stubAudioContext();
        const { playChime } = await loadFeedback();
        playChime();
        expect(constructor).not.toHaveBeenCalled();
    });
    it('tras la interacción sintetiza la campanilla de dos notas', async () => {
        const { constructor, instances } = stubAudioContext('running');
        const { markUserInteraction, playChime } = await loadFeedback();
        markUserInteraction();
        playChime();
        const context = instances[0];
        expect(constructor).toHaveBeenCalledTimes(1);
        expect(context.createOscillator).toHaveBeenCalledTimes(2);
        expect(context.createGain).toHaveBeenCalledTimes(2);
        const oscillators = context.createOscillator.mock.results.map((result) => result.value);
        for (const oscillator of oscillators) {
            expect(oscillator.start).toHaveBeenCalledTimes(1);
            expect(oscillator.stop).toHaveBeenCalledTimes(1);
            expect(oscillator.connect).toHaveBeenCalledTimes(1);
        }
        // Con el contexto en marcha no hace falta reanudarlo
        expect(context.resume).not.toHaveBeenCalled();
    });
    it('reutiliza un único contexto de audio entre campanillas', async () => {
        const { constructor, instances } = stubAudioContext();
        const { markUserInteraction, playChime } = await loadFeedback();
        markUserInteraction();
        playChime();
        playChime();
        expect(constructor).toHaveBeenCalledTimes(1);
        expect(instances).toHaveLength(1);
    });
    it('intenta reanudar un contexto suspendido antes de sonar', async () => {
        const { instances } = stubAudioContext('suspended');
        const { markUserInteraction, playChime } = await loadFeedback();
        markUserInteraction();
        playChime();
        expect(instances[0].resume).toHaveBeenCalledTimes(1);
    });
    it('no falla si el entorno no soporta Web Audio (jsdom o SSR)', async () => {
        vi.stubGlobal('AudioContext', undefined);
        const { markUserInteraction, playChime } = await loadFeedback();
        markUserInteraction();
        expect(() => playChime()).not.toThrow();
    });
    it('no propaga errores si el navegador bloquea la creación del contexto', async () => {
        vi.stubGlobal('AudioContext', vi.fn(function BrokenAudioContext() {
            throw new Error('audio bloqueado');
        }));
        const { markUserInteraction, playChime } = await loadFeedback();
        markUserInteraction();
        expect(() => playChime()).not.toThrow();
    });
});
