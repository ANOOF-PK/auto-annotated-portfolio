import Head from 'next/head';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import { useReveal } from './hooks';
import { Principles, Workarounds } from './sections/Approach';
import { Reflection, Watch } from './sections/Future';
import Hero from './sections/Hero';
import Interaction from './sections/Interaction';
import Iteration from './sections/Iteration';
import Moment from './sections/Moment';
import System from './sections/System';
import Testing from './sections/Testing';

const CHAPTERS = [
    { id: 'moment', n: '01', label: 'The moment' },
    { id: 'workarounds', n: '02', label: 'Workarounds' },
    { id: 'principles', n: '03', label: 'Principles' },
    { id: 'interaction', n: '04', label: 'Interaction' },
    { id: 'system', n: '05', label: 'System' },
    { id: 'iteration', n: '06', label: 'Iterating' },
    { id: 'testing', n: '07', label: 'Testing' },
    { id: 'future', n: '08', label: 'Beyond the Mac' }
];

const FONTS_URL =
    'https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Instrument+Serif:ital@0;1&family=Noto+Sans+Devanagari:wght@400;500&display=swap';

function ChapterRail() {
    const [visible, setVisible] = useState(false);
    const [active, setActive] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let frame = 0;
        const update = () => {
            frame = 0;
            const doc = document.documentElement;
            const max = doc.scrollHeight - window.innerHeight;
            setProgress(max > 0 ? window.scrollY / max : 0);
            setVisible(window.scrollY > window.innerHeight * 0.85);
            let current: string | null = null;
            document.querySelectorAll<HTMLElement>('[data-chapter]').forEach((el) => {
                if (el.getBoundingClientRect().top < window.innerHeight * 0.4) current = el.dataset.chapter || null;
            });
            setActive(current);
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
    }, []);

    const current = CHAPTERS.find((c) => c.id === active);

    return (
        <nav className={`n-rail ${visible ? 'is-visible' : ''}`} aria-label="Case study chapters">
            <a href="#top" className="n-rail__brand">
                NooFi Speaks
            </a>
            <span className="n-rail__current" aria-live="polite">
                {current ? (
                    <>
                        <b>{current.n}</b> {current.label}
                    </>
                ) : (
                    'Case study'
                )}
            </span>
            <ol className="n-rail__list">
                {CHAPTERS.map((c) => (
                    <li key={c.id}>
                        <a href={`#${c.id}`} className={c.id === active ? 'is-active' : ''} title={c.label}>
                            {c.n}
                        </a>
                    </li>
                ))}
            </ol>
            <span className="n-rail__progress" aria-hidden>
                <span style={{ transform: `scaleX(${progress})` }} />
            </span>
        </nav>
    );
}

/** Bespoke, cinematic case study for NooFi Speaks. Content follows the product docs' verified/target/future split. */
export default function NoofiCaseStudy() {
    const rootRef = useRef<HTMLDivElement>(null);
    useReveal(rootRef);

    return (
        <div ref={rootRef} className="noofi">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link rel="stylesheet" href={FONTS_URL} />
            </Head>
            <div className="n-grain" aria-hidden />
            <ChapterRail />
            <Hero />
            <Moment />
            <Workarounds />
            <Principles />
            <Interaction />
            <System />
            <Iteration />
            <Testing />
            <Watch />
            <Reflection />
        </div>
    );
}
