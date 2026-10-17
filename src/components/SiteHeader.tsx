import { useEffect, useRef, useState } from 'react';
import { goToSection, SectionId, useExperience } from '@/experience/store';
import { setSceneEnabled } from './SceneLayer';
import css from './SiteHeader.module.css';

/** The index is labelled by body part: the navigation and the character are one system. */
export const NAV: { id: SectionId; label: string; part: string }[] = [
    { id: 'mind', label: 'Thinking', part: 'Head' },
    { id: 'work', label: 'Work', part: 'Hands' },
    { id: 'observations', label: 'Observations', part: 'Eyes' },
    { id: 'playground', label: 'Experiments', part: 'Studio' },
    { id: 'journey', label: 'About', part: 'Journey' },
    { id: 'contact', label: 'Contact', part: 'Outside' }
];

export function SiteHeader() {
    const section = useExperience((s) => s.section);
    const [open, setOpen] = useState(false);

    return (
        <header className={css.header}>
            <a
                className={css.brand}
                href="#arrival"
                onClick={(e) => {
                    e.preventDefault();
                    goToSection('arrival');
                }}
            >
                <span className={css.brandName}>Anoof P K</span>
                <span className="mono">Inside / Outside</span>
            </a>
            <nav className={css.desktop} aria-label="Sections">
                <IndexList current={section} />
                <SceneToggle />
            </nav>
            <button type="button" className={`mono ${css.indexButton}`} aria-expanded={open} aria-controls="index-sheet" onClick={() => setOpen(true)}>
                Index
            </button>
            {open && <IndexSheet current={section} onClose={() => setOpen(false)} />}
        </header>
    );
}

function IndexList({ current, onNavigate }: { current: SectionId; onNavigate?: () => void }) {
    return (
        <ol className={css.list}>
            {NAV.map((item) => (
                <li key={item.id}>
                    <a
                        href={`#${item.id}`}
                        aria-current={current === item.id ? 'location' : undefined}
                        onClick={(e) => {
                            e.preventDefault();
                            onNavigate?.();
                            goToSection(item.id);
                        }}
                    >
                        <span className={css.label}>{item.label}</span>
                        <span className={`mono ${css.part}`}>{item.part}</span>
                    </a>
                </li>
            ))}
        </ol>
    );
}

export function SceneToggle() {
    const scene = useExperience((s) => s.scene);
    if (scene === 'unsupported' || scene === 'failed') {
        return <p className={`mono ${css.toggleNote}`}>3D unavailable — static view</p>;
    }
    const on = scene !== 'off';
    return (
        <button type="button" className={`mono ${css.toggle}`} aria-pressed={on} onClick={() => setSceneEnabled(!on)}>
            3D {on ? 'on' : 'off'}
        </button>
    );
}

/** Small-screen index: a modal sheet with focus kept inside and returned on close. */
function IndexSheet({ current, onClose }: { current: SectionId; onClose: () => void }) {
    const sheet = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const opener = document.activeElement as HTMLElement | null;
        const node = sheet.current;
        const focusables = () => Array.from(node?.querySelectorAll<HTMLElement>('a, button') ?? []);
        focusables()[0]?.focus();
        const key = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key !== 'Tab') return;
            const items = focusables();
            const first = items[0];
            const last = items[items.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', key);
        return () => {
            document.removeEventListener('keydown', key);
            // Navigating moves focus to the chosen section; only restore if it is still in the sheet.
            if (!document.activeElement || document.activeElement === document.body || node?.contains(document.activeElement)) {
                opener?.focus();
            }
        };
    }, [onClose]);

    return (
        <div className={css.backdrop} onClick={onClose}>
            <div ref={sheet} id="index-sheet" className={css.sheet} role="dialog" aria-modal="true" aria-label="Index" onClick={(e) => e.stopPropagation()}>
                <div className={css.sheetHead}>
                    <span className="mono">Index</span>
                    <button type="button" className={`mono ${css.close}`} onClick={onClose}>
                        Close
                    </button>
                </div>
                <IndexList current={current} onNavigate={onClose} />
                <SceneToggle />
            </div>
        </div>
    );
}
