import type { ThreeEvent } from '@react-three/fiber';
import type { Object3D } from 'three';
import { experience, Target } from '@/experience/store';

/** World anchors other components need to find (e.g. the hover marker). */
export const anchors: Partial<Record<'head' | 'eyes' | 'handRight' | 'handLeft', Object3D>> = {};

/**
 * The canvas sits under content panels but receives pointer events from the whole page.
 * A pointer over a panel, link or control belongs to the HTML, not to the object behind it.
 */
function occluded(e: ThreeEvent<PointerEvent | MouseEvent>) {
    const el = e.nativeEvent.target as Element | null;
    return Boolean(el?.closest?.('[data-occlude], a, button, input, [role="dialog"]'));
}

function clearHover(target: Target) {
    const { hover } = experience.get();
    if (hover?.kind === target.kind && hover.id === target.id) {
        experience.set({ hover: null });
        document.body.style.cursor = '';
    }
}

/** Pointer handlers for a 3D object that mirrors an HTML control. */
export function interactive(target: Target, enabled: () => boolean, onSelect: () => void) {
    const hoverTarget: Target = { ...target, from: 'scene' };
    return {
        onPointerOver(e: ThreeEvent<PointerEvent>) {
            if (!enabled() || occluded(e)) return;
            e.stopPropagation();
            experience.set({ hover: hoverTarget });
            document.body.style.cursor = 'pointer';
        },
        onPointerMove(e: ThreeEvent<PointerEvent>) {
            if (!enabled() || occluded(e)) clearHover(target);
            else e.stopPropagation();
        },
        onPointerOut() {
            clearHover(target);
        },
        onClick(e: ThreeEvent<MouseEvent>) {
            if (!enabled() || occluded(e)) return;
            e.stopPropagation();
            onSelect();
        }
    };
}

/** 0–1 emphasis for an object: 1 when selected, 0.7 when hovered from anywhere. */
export function emphasis(kind: Target['kind'], id: string, selected: string | null) {
    if (selected === id) return 1;
    const { hover } = experience.get();
    return hover?.kind === kind && hover.id === id ? 0.7 : 0;
}
