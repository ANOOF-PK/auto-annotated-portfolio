import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import { useInView, usePrefersReducedMotion } from './hooks';

export type CaptionLine = {
    lang: 'en' | 'hi' | 'mix';
    text: string;
};

// Illustrative script for the recreation. Hindi and mixed lines show only their English meaning,
// matching the English-first principle: the user never reads Hindi and waits for it to be replaced.
export const DEMO_SCRIPT: CaptionLine[] = [
    { lang: 'en', text: "Okay, let's go over the launch timeline." },
    { lang: 'hi', text: 'So the design review has moved to Thursday.' },
    { lang: 'en', text: 'Can someone share the updated Figma file?' },
    { lang: 'hi', text: "I'll send it after lunch, it still needs the final icons." },
    { lang: 'mix', text: 'The client wants the onboarding flow simplified first.' },
    { lang: 'en', text: "Great. Let's lock that by Friday." }
];

export type PanelStatus = 'idle' | 'listening' | 'paused';

type Props = {
    script?: CaptionLine[];
    visibleLines?: number;
    compact?: boolean;
    interactive?: boolean;
    onProgress?: (state: { status: PanelStatus; committed: number; partial: boolean }) => void;
};

const LANG_LABEL = { en: 'EN', hi: 'HI → EN', mix: 'HI+EN → EN' };

/** A coded recreation of the NooFi floating caption window. Not a recording of the app. */
export default function CaptionPanel({
    script = DEMO_SCRIPT,
    visibleLines = 4,
    compact,
    interactive = true,
    onProgress
}: Props) {
    const rootRef = useRef<HTMLDivElement>(null);
    const inView = useInView(rootRef, '-10% 0px');
    const reduced = usePrefersReducedMotion();

    const [status, setStatus] = useState<PanelStatus>('idle');
    const [index, setIndex] = useState(0);
    const [words, setWords] = useState(0);
    const [clearedAt, setClearedAt] = useState(0);
    const [userPaused, setUserPaused] = useState(false);

    const running = inView && !userPaused && !reduced;

    useEffect(() => {
        if (!running) return;
        let delay: number;
        let step: () => void;

        if (status !== 'listening') {
            delay = 900;
            step = () => setStatus('listening');
        } else if (index >= script.length) {
            delay = 3200;
            step = () => {
                setIndex(0);
                setWords(0);
                setClearedAt(0);
                setStatus('idle');
            };
        } else {
            const total = script[index].text.split(' ').length;
            if (words < total) {
                delay = 110 + Math.random() * 120;
                step = () => setWords((w) => w + 1);
            } else {
                delay = 650;
                step = () => {
                    setIndex((i) => i + 1);
                    setWords(0);
                };
            }
        }
        const timer = window.setTimeout(step, delay);
        return () => window.clearTimeout(timer);
    }, [running, status, index, words, script]);

    useEffect(() => {
        if (userPaused) setStatus('paused');
    }, [userPaused]);

    useEffect(() => {
        onProgress?.({ status, committed: index - clearedAt, partial: words > 0 });
    }, [status, index, words, clearedAt, onProgress]);

    let lines: { line: CaptionLine; text: string; partial: boolean; key: number }[];
    if (reduced) {
        lines = script.slice(-visibleLines).map((line, i) => ({ line, text: line.text, partial: false, key: i }));
    } else {
        lines = script
            .slice(clearedAt, index)
            .map((line, i) => ({ line, text: line.text, partial: false, key: clearedAt + i }));
        if (index < script.length && words > 0) {
            const line = script[index];
            lines.push({ line, text: line.text.split(' ').slice(0, words).join(' '), partial: true, key: index });
        }
        lines = lines.slice(-visibleLines);
    }

    const shownStatus: PanelStatus = reduced ? 'listening' : status;
    const statusLabel = { idle: 'Ready', listening: 'Listening', paused: 'Paused' }[shownStatus];

    return (
        <div ref={rootRef} className={`n-panel ${compact ? 'n-panel--compact' : ''}`} data-status={shownStatus}>
            <div className="n-panel__bar">
                <span className="n-panel__lights" aria-hidden>
                    <i />
                    <i />
                    <i />
                </span>
                <span className="n-panel__title">NooFi Speaks</span>
                <span className="n-panel__status" role="status">
                    <span className="n-panel__mic" aria-hidden />
                    {statusLabel}
                </span>
            </div>
            <ol className="n-panel__lines" aria-live="off">
                {lines.length === 0 && (
                    <li className="n-panel__empty">
                        {shownStatus === 'idle' ? 'Press Start to listen' : 'Listening for speech…'}
                    </li>
                )}
                {lines.map(({ line, text, partial, key }, i) => (
                    <li
                        key={key}
                        className={`n-panel__line ${partial ? 'is-partial' : 'is-committed'}`}
                        style={{ opacity: partial ? 1 : 0.42 + (0.58 * (i + 1)) / lines.length }}
                    >
                        <span className={`n-panel__lang n-panel__lang--${line.lang}`}>{LANG_LABEL[line.lang]}</span>
                        <span className="n-panel__text">
                            {text}
                            {partial && <span className="n-panel__caret" aria-hidden />}
                        </span>
                    </li>
                ))}
            </ol>
            {interactive && (
                <div className="n-panel__controls">
                    <button type="button" onClick={() => setUserPaused((p) => !p)} className="n-panel__btn">
                        {userPaused ? 'Resume' : 'Pause'}
                    </button>
                    <button
                        type="button"
                        className="n-panel__btn n-panel__btn--ghost"
                        onClick={() => setClearedAt(index)}
                    >
                        Clear
                    </button>
                    <span className="n-panel__hint">Try it: this panel responds</span>
                </div>
            )}
        </div>
    );
}
