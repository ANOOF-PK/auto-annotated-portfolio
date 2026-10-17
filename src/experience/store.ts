import { useSyncExternalStore } from 'react';

export const SECTIONS = ['arrival', 'mind', 'work', 'observations', 'playground', 'journey', 'contact'] as const;
export type SectionId = (typeof SECTIONS)[number];

export type SceneStatus = 'idle' | 'loading' | 'ready' | 'failed' | 'unsupported' | 'off';
export type Target = {
    kind: 'part' | 'concept' | 'project' | 'observation' | 'experiment';
    id: string;
    /** Hovers that start in the scene get a cursor label; HTML controls are already labelled. */
    from?: 'scene' | 'html';
};

export interface ExperienceState {
    scene: SceneStatus;
    section: SectionId;
    reducedMotion: boolean;
    hover: Target | null;
    concept: string | null;
    project: string | null;
    observation: string | null;
}

let state: ExperienceState = {
    scene: 'idle',
    section: 'arrival',
    reducedMotion: false,
    hover: null,
    concept: null,
    project: null,
    observation: null
};

const listeners = new Set<() => void>();

export const experience = {
    get: () => state,
    set(patch: Partial<ExperienceState>) {
        let changed = false;
        for (const key in patch) {
            if (patch[key] !== state[key]) changed = true;
        }
        if (!changed) return;
        state = { ...state, ...patch };
        listeners.forEach((l) => l());
    },
    subscribe(listener: () => void) {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    }
};

export function useExperience<T>(select: (s: ExperienceState) => T): T {
    return useSyncExternalStore(experience.subscribe, () => select(state), () => select(state));
}

/**
 * Element that opened the current overlay or preview, so closing it can hand focus back.
 * Kept outside React state because it is never rendered.
 */
export const focusReturn: { el: HTMLElement | null } = { el: null };

/** Scroll to a section and move focus to its heading, honouring reduced motion. */
export function goToSection(id: SectionId) {
    const section = document.getElementById(id);
    if (!section) return;
    section.scrollIntoView({ behavior: state.reducedMotion ? 'auto' : 'smooth', block: 'start' });
    const heading = section.querySelector<HTMLElement>('[data-section-heading]');
    heading?.focus({ preventScroll: true });
    history.replaceState(null, '', `#${id}`);
}

/** Pointer position in normalised device coordinates. Written by listeners, read in the frame loop. */
export const pointer = { x: 0, y: 0 };
