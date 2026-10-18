import * as React from 'react';

import { Chapter, Tag } from '../primitives';

const ROADMAP = [
    { k: 'Verify core pipeline', v: 'Confirm recognition, translation and local/cloud boundaries.' },
    { k: 'Core quality', v: 'Fix code-switching, stability and latency blockers.' },
    { k: 'Usability validation', v: 'Test with representative users; iterate the overlay.' },
    { k: 'Reliable MVP', v: 'Permissions, persistence, errors, packaging.' },
    { k: 'Session notes', v: 'Only if users need them.' },
    { k: 'Apple Watch', v: 'Prototype the wrist flow.' }
];

export function Watch() {
    return (
        <Chapter id="future" index="08" label="Beyond the Mac" className="n-chapter--watch">
            <div className="n-wrap n-grid n-watch">
                <div className="n-col-5 n-stack">
                    <Tag tone="amber">Concept · not in the MVP</Tag>
                    <h2 className="n-h2" data-reveal>
                        Quick, discreet, <em>on the wrist.</em>
                    </h2>
                    <p className="n-body" data-reveal>
                        A possible Apple Watch companion: a small microphone control based on familiar watch
                        interactions, with captions shown on the wrist while listening.
                    </p>
                    <p className="n-body n-mute" data-reveal>
                        It stays a concept until it is built and tested. Making the Mac caption experience reliable
                        comes first.
                    </p>
                </div>
                <div className="n-col-6 n-col-start-7 n-watch__stage" data-reveal>
                    <div
                        className="n-watchface"
                        aria-label="Apple Watch concept: microphone control and wrist captions"
                        role="img"
                    >
                        <span className="n-watchface__crown" aria-hidden />
                        <span className="n-watchface__button" aria-hidden />
                        <div className="n-watchface__screen">
                            <span className="n-watchface__time">10:42</span>
                            <p className="n-watchface__cap n-watchface__cap--old">Can someone share the file?</p>
                            <p className="n-watchface__cap">
                                The review moved to <em>Thursday.</em>
                            </p>
                            <span className="n-watchface__mic">
                                <span />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Chapter>
    );
}

export function Reflection() {
    return (
        <section className="n-chapter n-reflection" id="learning" data-chapter="learning">
            <div className="n-wrap">
                <span className="n-label" data-reveal>
                    What I’m learning
                </span>
                <blockquote className="n-quote" data-reveal>
                    <p className="n-display">An AI product is more than a model connected to an interface.</p>
                </blockquote>
                <p className="n-body n-reflection__body" data-reveal>
                    The experience depends on how the system behaves in real conditions: partial results, language
                    switching, delays, errors, privacy expectations and recovery. Designing NooFi has mostly meant
                    designing for those moments.
                </p>

                <div className="n-status">
                    <div data-reveal>
                        <span className="n-label">Current status</span>
                        <p>Working prototype. Structured testing and feedback are next.</p>
                    </div>
                    <div data-reveal style={{ '--d': 1 } as React.CSSProperties}>
                        <span className="n-label n-label--amber">Next milestone</span>
                        <p>Validate accuracy, latency, code-switching and readability in real conversations.</p>
                    </div>
                </div>

                <ol className="n-roadmap" aria-label="Roadmap">
                    {ROADMAP.map((r, i) => (
                        <li
                            key={r.k}
                            className={i === 0 ? 'is-now' : ''}
                            data-reveal
                            style={{ '--d': i } as React.CSSProperties}
                        >
                            <span className="n-roadmap__dot" />
                            <span className="n-roadmap__phase">Phase {i + 1}</span>
                            <span className="n-roadmap__k">{r.k}</span>
                            <span className="n-roadmap__v">{r.v}</span>
                        </li>
                    ))}
                </ol>

                <p className="n-display n-closer" data-reveal>
                    The next milestone isn’t more features. It’s finding out whether people can{' '}
                    <em>genuinely follow along.</em>
                </p>
                <a href="#top" className="n-totop">
                    Back to top <span aria-hidden>↑</span>
                </a>
            </div>
        </section>
    );
}
