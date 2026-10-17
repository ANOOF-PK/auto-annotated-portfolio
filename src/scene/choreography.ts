import type { SectionId } from '@/experience/store';

export type Vec3 = [number, number, number];

/** Scene parameters blended by scroll. Each is 0 outside its section and 1 inside it. */
export interface Params {
    headOpen: number;
    handRaise: number;
    eyeFocus: number;
    studio: number;
    profile: number;
    rest: number;
    /** Whole-figure views where head, hands and eyes act as navigation. */
    parts: number;
}

export interface Keyframe {
    /** What the camera looks at. */
    target: Vec3;
    /** Camera position relative to the target. Lengthened on narrow viewports. */
    offset: Vec3;
    /** Where on screen the target sits (0–1 from top-left), so HTML can own the rest. */
    frame: { x: number; y: number };
    frameNarrow: { x: number; y: number };
    params: Partial<Params>;
}

/**
 * The camera plan. Read alongside docs/inside-outside.md §3.
 * Coordinates: plinth top at y = 0, head centre at y ≈ 1.8, character faces +z.
 */
export const keyframes: Record<SectionId, Keyframe> = {
    arrival: {
        target: [0, 1.3, 0],
        offset: [2.1, 0.75, 7.6],
        frame: { x: 0.575, y: 0.55 },
        frameNarrow: { x: 0.5, y: 0.47 },
        params: { parts: 1 }
    },
    mind: {
        target: [0, 2.0, 0],
        offset: [0.4, 2.3, 2.0],
        frame: { x: 0.68, y: 0.5 },
        frameNarrow: { x: 0.5, y: 0.26 },
        params: { headOpen: 1 }
    },
    work: {
        target: [-0.1, 1.38, 1.35],
        offset: [0.5, 2.0, 3.8],
        frame: { x: 0.31, y: 0.52 },
        frameNarrow: { x: 0.5, y: 0.25 },
        params: { handRaise: 1 }
    },
    observations: {
        target: [0.21, 1.84, 0.55],
        offset: [0.35, 0.08, 1.45],
        frame: { x: 0.7, y: 0.48 },
        frameNarrow: { x: 0.5, y: 0.25 },
        params: { eyeFocus: 1 }
    },
    playground: {
        target: [1.5, 1.5, -0.9],
        offset: [0.5, 1.5, 10],
        frame: { x: 0.7, y: 0.5 },
        frameNarrow: { x: 0.5, y: 0.26 },
        params: { studio: 1 }
    },
    journey: {
        target: [0, 1.35, 0],
        offset: [7.4, 0.9, 1.8],
        frame: { x: 0.74, y: 0.52 },
        frameNarrow: { x: 0.5, y: 0.26 },
        params: { profile: 1, parts: 1 }
    },
    contact: {
        target: [0, 1.3, 0.3],
        offset: [0, 0.6, 8.6],
        frame: { x: 0.5, y: 0.3 },
        frameNarrow: { x: 0.5, y: 0.27 },
        params: { rest: 1, parts: 1 }
    }
};

const emptyParams = (): Params => ({
    headOpen: 0,
    handRaise: 0,
    eyeFocus: 0,
    studio: 0,
    profile: 0,
    rest: 0,
    parts: 0
});

/**
 * Live scene values, written once per frame by the Director and read by every
 * other component's frame loop. Never stored in React state.
 */
export const live = {
    params: emptyParams(),
    reduced: false,
    narrow: false,
    time: 0
};

/** Frame-rate independent exponential smoothing. */
export function damp(current: number, target: number, lambda: number, dt: number) {
    if (live.reduced) return target;
    return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

export const smoothstep = (t: number) => {
    const x = Math.min(1, Math.max(0, t));
    return x * x * (3 - 2 * x);
};
