import { Component, ComponentType, ReactNode, useEffect, useRef, useState } from 'react';
import { experience, pointer, useExperience } from '@/experience/store';
import { labelFor } from './primitives';
import css from './SceneLayer.module.css';

const PREF_KEY = 'inside-outside:3d';

function readPref() {
    try {
        return localStorage.getItem(PREF_KEY) !== 'off';
    } catch {
        return true;
    }
}

/** The visitor's 3D switch. Off is a first-class mode, not an error state. */
export function setSceneEnabled(on: boolean) {
    try {
        localStorage.setItem(PREF_KEY, on ? 'on' : 'off');
    } catch {
        // Storage can be unavailable (private windows); the choice still applies to this visit.
    }
    experience.set({ scene: on ? 'idle' : 'off' });
}

function webglAvailable() {
    try {
        const canvas = document.createElement('canvas');
        return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
    } catch {
        return false;
    }
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
    state = { failed: false };
    static getDerivedStateFromError() {
        return { failed: true };
    }
    componentDidCatch(error: unknown) {
        console.error('3D scene failed; continuing without it.', error);
        experience.set({ scene: 'failed' });
    }
    render() {
        return this.state.failed ? null : this.props.children;
    }
}

/**
 * Fixed WebGL layer behind the content panels. Loads after the HTML is usable and
 * reports its status on <html data-scene> so CSS can show static art instead.
 */
export function SceneLayer() {
    const scene = useExperience((s) => s.scene);
    const [Stage, setStage] = useState<ComponentType<{ eventSource: HTMLElement }> | null>(null);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const sync = () => experience.set({ reducedMotion: mq.matches });
        sync();
        mq.addEventListener('change', sync);

        const move = (e: PointerEvent) => {
            if (e.pointerType === 'touch') return;
            pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
            pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('pointermove', move, { passive: true });

        if (!readPref()) experience.set({ scene: 'off' });
        return () => {
            mq.removeEventListener('change', sync);
            window.removeEventListener('pointermove', move);
        };
    }, []);

    useEffect(() => {
        // Read the store, not the render value: the saved preference may have just switched it off.
        const current = experience.get().scene;
        document.documentElement.dataset.scene = current;
        if (current !== 'idle') return;
        if (!webglAvailable()) {
            experience.set({ scene: 'unsupported' });
            return;
        }
        experience.set({ scene: 'loading' });
        import('@/scene/Stage')
            .then((m) => setStage(() => m.default))
            .catch((error) => {
                console.error('3D scene could not load; continuing without it.', error);
                experience.set({ scene: 'failed' });
            });
    }, [scene]);

    const mounted = Stage && (scene === 'loading' || scene === 'ready');
    const root = typeof document !== 'undefined' ? document.getElementById('__next') : null;

    return (
        <>
            <div className={css.layer} data-ready={scene === 'ready'}>
                {mounted && root && (
                    <SceneBoundary>
                        <Stage eventSource={root} />
                    </SceneBoundary>
                )}
            </div>
            {scene === 'ready' && <CursorLabel />}
        </>
    );
}

/** Names whatever 3D object the pointer is over. Visual only: every object has an HTML twin. */
function CursorLabel() {
    const hover = useExperience((s) => (s.hover?.from === 'scene' ? s.hover : null));
    const el = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const move = (e: PointerEvent) => {
            if (el.current) el.current.style.transform = `translate(${e.clientX + 18}px, ${e.clientY + 14}px)`;
        };
        window.addEventListener('pointermove', move, { passive: true });
        return () => window.removeEventListener('pointermove', move);
    }, []);

    const label = hover ? labelFor(hover) : null;
    return (
        <div ref={el} className={css.cursorLabel} data-visible={Boolean(label)} aria-hidden="true">
            {label && (
                <>
                    <span className={css.cursorTitle}>{label.title}</span>
                    <span className="mono">{label.hint}</span>
                </>
            )}
        </div>
    );
}
