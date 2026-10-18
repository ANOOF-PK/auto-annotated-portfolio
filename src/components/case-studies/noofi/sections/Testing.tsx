import * as React from 'react';

import { Chapter } from '../primitives';

const MATRIX = [
    { k: 'Translation accuracy', q: 'Does the English caption keep the meaning of the Hindi phrase?' },
    { k: 'Code-switching', q: 'Does English stay English when speakers switch mid-sentence?' },
    { k: 'Latency', q: 'How long until speech becomes readable English?' },
    { k: 'Caption stability', q: 'Do partials update in place without flicker, duplicates or abrupt replacement?' },
    { k: 'Usability', q: 'Can someone follow along without constantly looking away?' },
    { k: 'Privacy', q: 'Can the whole audio-to-English pipeline run on-device, and is the mic state always clear?' }
];

const DISPROVE = [
    'Translation is too inaccurate to keep the meaning of the discussion.',
    'Captions arrive too late to follow the current topic.',
    'Code-switching causes repeated errors or garbled sentences.',
    'Glancing at the overlay becomes a distraction of its own.',
    'Existing tools already solve this workflow well enough.'
];

const SEVERITY = [
    { p: 'P0', k: 'Blocker', v: 'Mic keeps listening after Stop.' },
    { p: 'P1', k: 'High', v: 'Hindi never translated; repeated duplicates.' },
    { p: 'P2', k: 'Medium', v: 'Caption flicker; overlay steals focus.' },
    { p: 'P3', k: 'Low', v: 'Spacing or subtle motion inconsistencies.' }
];

export default function Testing() {
    return (
        <Chapter id="testing" index="07" label="Testing the experience">
            <div className="n-wrap n-grid">
                <div className="n-col-7">
                    <h2 className="n-h2" data-reveal>
                        A successful demo <em>isn’t evidence.</em>
                    </h2>
                </div>
                <div className="n-col-4 n-col-start-9 n-stack">
                    <p className="n-body n-mute" data-reveal>
                        The prototype works. Whether it actually helps is still an open question. Next I test it in real
                        conversations, with consenting speakers and a human-checked reference for every clip.
                    </p>
                </div>
            </div>

            <div className="n-wrap">
                <div className="n-matrix" role="table" aria-label="Test plan">
                    <div className="n-matrix__row n-matrix__row--head" role="row">
                        <span role="columnheader">Test area</span>
                        <span role="columnheader">Question to answer</span>
                        <span role="columnheader">Result</span>
                    </div>
                    {MATRIX.map((m, i) => (
                        <div
                            key={m.k}
                            className="n-matrix__row"
                            role="row"
                            data-reveal
                            style={{ '--d': i } as React.CSSProperties}
                        >
                            <span role="cell" className="n-matrix__k">
                                {m.k}
                            </span>
                            <span role="cell" className="n-matrix__q">
                                {m.q}
                            </span>
                            <span role="cell">
                                <span className="n-pill">
                                    <span className="n-pill__pulse" />
                                    Not yet measured
                                </span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="n-wrap n-grid n-testing__foot">
                <div className="n-col-6 n-stack">
                    <h3 className="n-label" data-reveal>
                        What would prove me wrong
                    </h3>
                    <ol className="n-disprove">
                        {DISPROVE.map((d, i) => (
                            <li key={i} data-reveal style={{ '--d': i } as React.CSSProperties}>
                                <span className="n-disprove__n n-display">{i + 1}</span>
                                {d}
                            </li>
                        ))}
                    </ol>
                </div>
                <div className="n-col-5 n-col-start-8 n-stack">
                    <h3 className="n-label" data-reveal>
                        How I triage what breaks
                    </h3>
                    <ul className="n-severity">
                        {SEVERITY.map((s) => (
                            <li
                                key={s.p}
                                className={`n-severity__row n-severity__row--${s.p.toLowerCase()}`}
                                data-reveal
                            >
                                <span className="n-severity__p">{s.p}</span>
                                <span className="n-severity__k">{s.k}</span>
                                <span className="n-severity__v">{s.v}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="n-note" data-reveal>
                        Results will be published with the sample size, conditions and build version. No metric goes on
                        this page until it has been measured.
                    </p>
                </div>
            </div>
        </Chapter>
    );
}
