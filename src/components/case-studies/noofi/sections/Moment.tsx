import * as React from 'react';
import { useRef } from 'react';

import { usePrefersReducedMotion, useScrollProgress } from '../hooks';
import { Chapter } from '../primitives';

const TRANSCRIPT = [
    { who: 'Priya', lang: 'en', text: 'So for the launch, we’re aiming for the 24th.' },
    { who: 'Arjun', lang: 'hi', text: 'हाँ, लेकिन डिज़ाइन रिव्यू गुरुवार को शिफ्ट हो गया है।' },
    { who: 'Priya', lang: 'en', text: 'Right, so does that change the plan?' },
    { who: 'Arjun', lang: 'hi', text: 'क्लाइंट चाहता है कि पहले ऑनबोर्डिंग फ्लो को आसान किया जाए।' },
    { who: 'You', lang: 'you', text: '…sorry, what did we just decide?' }
];

export default function Moment() {
    const pinRef = useRef<HTMLDivElement>(null);
    const progress = useScrollProgress(pinRef);
    const reduced = usePrefersReducedMotion();

    const shown = reduced
        ? TRANSCRIPT.length
        : Math.min(TRANSCRIPT.length, Math.floor(progress * (TRANSCRIPT.length + 1.4)));
    const turned = reduced || progress > 0.22;

    return (
        <Chapter id="moment" index="01" label="The moment">
            <div ref={pinRef} className="n-pin" style={{ height: reduced ? 'auto' : '300vh' }}>
                <div className="n-pin__sticky">
                    <div className="n-wrap n-moment">
                        <div className="n-moment__statement" aria-live="polite">
                            <p className={`n-display n-moment__line ${turned ? 'is-dim' : ''}`}>
                                The meeting is in English.
                            </p>
                            <p className={`n-display n-moment__line n-moment__line--turn ${turned ? 'is-on' : ''}`}>
                                Until it isn’t.
                            </p>
                        </div>
                        <ol className="n-transcript" aria-label="A conversation that switches language">
                            {TRANSCRIPT.map((t, i) => (
                                <li
                                    key={i}
                                    className={`n-transcript__row n-transcript__row--${t.lang} ${i < shown ? 'is-on' : ''}`}
                                >
                                    <span className="n-transcript__who">{t.who}</span>
                                    <span className="n-transcript__text" lang={t.lang === 'hi' ? 'hi' : 'en'}>
                                        {t.text}
                                    </span>
                                    {t.lang === 'hi' && <span className="n-transcript__lost">Context lost</span>}
                                </li>
                            ))}
                        </ol>
                    </div>
                    <span className="n-pin__note">Illustrative scene</span>
                    {!reduced && (
                        <div className="n-pin__progress" aria-hidden>
                            <span style={{ transform: `scaleX(${progress})` }} />
                        </div>
                    )}
                </div>
            </div>

            <div className="n-wrap n-grid n-moment__after">
                <div className="n-col-5">
                    <h2 className="n-h2" data-reveal>
                        The problem isn’t just <em>language.</em>
                    </h2>
                </div>
                <div className="n-col-6 n-col-start-7 n-stack">
                    <p className="n-body" data-reveal>
                        Office conversations move between English, Hindi and Hinglish without warning. If you understand
                        English but not Hindi, you follow most of the meeting, then lose the thread the moment a
                        sentence switches.
                    </p>
                    <p className="n-body n-mute" data-reveal>
                        Asking for a repeat interrupts the flow and draws attention to the language barrier. A
                        translation app asks you to leave the conversation to use it.
                    </p>
                </div>
            </div>

            <div className="n-wrap">
                <blockquote className="n-hmw" data-reveal>
                    <span className="n-hmw__k">How might we</span>
                    <p className="n-display">
                        help someone follow conversations that switch between Hindi and English, without interrupting
                        the conversation or leaving their current task?
                    </p>
                </blockquote>
            </div>
        </Chapter>
    );
}
