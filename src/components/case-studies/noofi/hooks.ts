import { RefObject, useEffect, useState } from 'react';

export function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReduced(query.matches);
        update();
        query.addEventListener('change', update);
        return () => query.removeEventListener('change', update);
    }, []);
    return reduced;
}

/**
 * Adds `is-in` to every `[data-reveal]` element inside `root` once it scrolls into view.
 * Elements can stagger with `style={{ '--d': 2 }}` (see noofi.css).
 */
export function useReveal(root: RefObject<HTMLElement>) {
    useEffect(() => {
        const el = root.current;
        if (!el) return;
        const targets = Array.from(el.querySelectorAll<HTMLElement>('[data-reveal]'));
        if (!('IntersectionObserver' in window)) {
            targets.forEach((t) => t.classList.add('is-in'));
            return;
        }
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-in');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
        );
        targets.forEach((t) => observer.observe(t));
        return () => observer.disconnect();
    }, [root]);
}

/** True while the element is at least partly on screen. */
export function useInView(ref: RefObject<HTMLElement>, rootMargin = '0px') {
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin });
        observer.observe(el);
        return () => observer.disconnect();
    }, [ref, rootMargin]);
    return inView;
}

/** 0 → 1 progress of an element scrolling through the viewport (for pinned sequences). */
export function useScrollProgress(ref: RefObject<HTMLElement>) {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        let frame = 0;
        const update = () => {
            frame = 0;
            const el = ref.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const total = rect.height - window.innerHeight;
            const value = total > 0 ? -rect.top / total : rect.top < 0 ? 1 : 0;
            setProgress(Math.min(1, Math.max(0, value)));
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (frame) cancelAnimationFrame(frame);
        };
    }, [ref]);
    return progress;
}
