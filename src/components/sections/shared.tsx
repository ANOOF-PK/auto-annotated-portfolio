import { ReactNode, useEffect } from 'react';
import { experience, SectionId, Target } from '@/experience/store';
import { FigureVariant, StaticFigure } from '../StaticFigure';
import css from './sections.module.css';

/** Hovering or focusing an HTML control highlights its twin in the scene. */
export function linkHover(target: Target) {
    const set = () => experience.set({ hover: { ...target, from: 'html' } });
    const clear = () => {
        const { hover } = experience.get();
        if (hover?.kind === target.kind && hover.id === target.id) experience.set({ hover: null });
    };
    return { onMouseEnter: set, onMouseLeave: clear, onFocus: set, onBlur: clear };
}

export function useEscape(active: boolean, onEscape: () => void) {
    useEffect(() => {
        if (!active) return;
        const key = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !document.querySelector('[role="dialog"][aria-modal="true"]')) onEscape();
        };
        document.addEventListener('keydown', key);
        return () => document.removeEventListener('keydown', key);
    }, [active, onEscape]);
}

interface SceneSectionProps {
    id: SectionId;
    index: string;
    part: string;
    title: string;
    /** Which side the copy sits on; the 3D focal point takes the other. */
    side: 'left' | 'right';
    art: FigureVariant;
    tone?: 'coral' | 'lime';
    children: ReactNode;
}

/**
 * A narrative section: a copy column that owns the reading, and an art cell that the
 * live scene (or its static drawing) occupies. The camera keyframe for this section
 * frames its focal point in the art cell.
 */
export function SceneSection({ id, index, part, title, side, art, tone, children }: SceneSectionProps) {
    return (
        <section id={id} className={css.section} data-side={side} data-tone={tone} aria-labelledby={`${id}-title`}>
            <div className={css.art}>
                <StaticFigure variant={art} />
            </div>
            <div className={css.copy} data-occlude>
                <p className={`mono ${css.kicker}`}>
                    <span>{index}</span> {part}
                </p>
                <h2 id={`${id}-title`} className={css.title} tabIndex={-1} data-section-heading>
                    {title}
                </h2>
                {children}
            </div>
        </section>
    );
}
