import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import { useInView, usePrefersReducedMotion } from '../hooks';
import { Chapter, MediaSlot } from '../primitives';

const HINDI = 'डिज़ाइन रिव्यू गुरुवार को है';
const ENGLISH = 'The design review is on Thursday';

// Frames of the comparison loop: [before text, before is Hindi?, after text, after is partial?]
const FRAMES: [string, boolean, string, boolean][] = [
    ['', false, '', false],
    ['डिज़ाइन रिव्यू', true, 'The design', true],
    [HINDI, true, 'The design review', true],
    [HINDI, true, 'The design review is on', true],
    ['', false, ENGLISH, true],
    ['The design', false, ENGLISH, false],
    [ENGLISH, false, ENGLISH, false],
    [ENGLISH, false, ENGLISH, false]
];

const TIMELINE = [
    { k: 'Build 01', v: 'App shell and microphone state.' },
    { k: 'Build 02', v: 'Floating window and caption list.' },
    { k: 'Now', v: 'Stable, English-first captions from live mixed speech.' },
    { k: 'Next', v: 'Structured testing in real conversations.' }
];

function Compare() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref);
    const reduced = usePrefersReducedMotion();
    const [frame, setFrame] = useState(FRAMES.length - 1);

    useEffect(() => {
        if (!inView || reduced) return;
        const id = window.setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), 700);
        return () => window.clearInterval(id);
    }, [inView, reduced]);

    const [before, beforeHi, after, afterPartial] = FRAMES[frame];

    return (
        <div ref={ref} className="n-compare" data-reveal>
            <div className="n-compare__side">
                <span className="n-label">Early build</span>
                <div className="n-compare__screen n-compare__screen--before">
                    <span
                        className={`n-compare__text ${beforeHi ? 'is-hi' : ''} ${before ? '' : 'is-blank'}`}
                        lang={beforeHi ? 'hi' : 'en'}
                    >
                        {before || ' '}
                    </span>
                </div>
                <p className="n-compare__note">
                    Hindi appeared, then got swapped out for English. The line jumped mid-read.
                </p>
            </div>
            <div className="n-compare__side">
                <span className="n-label n-label--amber">Direction</span>
                <div className="n-compare__screen n-compare__screen--after">
                    <span className={`n-compare__text ${afterPartial ? 'is-partial' : ''}`}>{after || ' '}</span>
                </div>
                <p className="n-compare__note">
                    English-only output that builds up in place, then settles once it is committed.
                </p>
            </div>
        </div>
    );
}

export default function Iteration() {
    return (
        <Chapter id="iteration" index="06" label="Building & iterating">
            <div className="n-wrap">
                <h2 className="n-h2 n-h2--wide" data-reveal>
                    The challenge wasn’t just translation. <em>It was keeping up.</em>
                </h2>
            </div>
            <div className="n-wrap n-grid">
                <div className="n-col-5 n-stack">
                    <p className="n-body" data-reveal>
                        I used AI-assisted coding to build a working macOS prototype. The first build set up the app
                        shell and the microphone state. Then the focus moved to the real product problem: getting
                        stable, useful English captions from live mixed-language speech.
                    </p>
                    <p className="n-body n-mute" data-reveal>
                        An early issue made this clear. Live translation isn’t useful if you can’t keep track of the
                        text while someone is still talking.
                    </p>
                    <p className="n-body n-mute" data-reveal>
                        AI wrote a lot of the code. The scope, the principles and what to cut were my calls.
                    </p>
                </div>
                <div className="n-col-7">
                    <Compare />
                </div>
            </div>
            <div className="n-wrap n-grid n-iteration__media">
                <div className="n-col-8">
                    <MediaSlot
                        label="Design evolution clip"
                        duration="0:10"
                        ratio="16/9"
                        caption="Real before/after recording of the caption-stability fix. Coming once captured."
                    />
                </div>
                <ol className="n-col-4 n-timeline">
                    {TIMELINE.map((t, i) => (
                        <li
                            key={t.k}
                            data-reveal
                            style={{ '--d': i } as React.CSSProperties}
                            className={t.k === 'Now' ? 'is-now' : ''}
                        >
                            <span className="n-timeline__k">{t.k}</span>
                            <span className="n-timeline__v">{t.v}</span>
                        </li>
                    ))}
                </ol>
            </div>
        </Chapter>
    );
}
