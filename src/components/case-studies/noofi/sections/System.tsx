import * as React from 'react';

import { Chapter, Tag } from '../primitives';

const PIPELINE = [
    { k: 'Audio capture', v: 'Reads the microphone only while listening.' },
    { k: 'Speech recognition', v: 'Partial and final text, with language info where available.' },
    { k: 'Language handling', v: 'Decides what is already English and what needs translating.' },
    { k: 'Translation', v: 'Turns Hindi segments into English.' },
    { k: 'Caption state', v: 'Reconciles partials, deduplicates, commits lines.' },
    { k: 'Overlay', v: 'Renders recent lines and status without stealing focus.' },
    { k: 'Session storage', v: 'Keeps the transcript locally, with a clear way to delete it.' }
];

const STACK = ['Swift', 'SwiftUI', 'AppKit', 'Swift Package Manager', 'macOS · Apple Silicon'];

const CHECKS = [
    'Inspect package dependencies and model downloads',
    'Inspect network calls and SDK configuration',
    'Run a session with networking disabled',
    'Disclose any stage that needs the cloud'
];

export default function System() {
    return (
        <Chapter id="system" index="05" label="Under the hood">
            <div className="n-wrap n-grid">
                <div className="n-col-6">
                    <h2 className="n-h2" data-reveal>
                        The interface is the <em>smallest</em> part of the system.
                    </h2>
                </div>
                <div className="n-col-5 n-col-start-8 n-stack">
                    <p className="n-body" data-reveal>
                        The experience depends on seven stages working together in real time. Mixed Hindi-English speech
                        makes it harder: the system has to handle code-switching without translating English words,
                        duplicating text or making the stream hard to follow.
                    </p>
                </div>
            </div>

            <div className="n-wrap n-wrap--wide">
                <ol className="n-pipe" aria-label="Audio-to-caption pipeline">
                    {PIPELINE.map((p, i) => (
                        <li key={p.k} className="n-pipe__node" data-reveal style={{ '--d': i } as React.CSSProperties}>
                            <span className="n-pipe__i">{String(i + 1).padStart(2, '0')}</span>
                            <span className="n-pipe__k">{p.k}</span>
                            <span className="n-pipe__v">{p.v}</span>
                            <span className="n-pipe__badge">Local / cloud: verifying</span>
                        </li>
                    ))}
                </ol>
            </div>

            <div className="n-wrap n-grid n-system__foot">
                <div className="n-col-6 n-callout" data-reveal>
                    <span className="n-label">Rule I hold myself to</span>
                    <p className="n-display n-callout__big">Don’t claim on-device until every stage proves it.</p>
                    <p className="n-body n-mute">
                        A local UI or a local transcript doesn’t prove that audio never leaves the Mac. So before NooFi
                        says “private”, it has to pass these checks:
                    </p>
                    <ul className="n-checks">
                        {CHECKS.map((c) => (
                            <li key={c}>{c}</li>
                        ))}
                    </ul>
                </div>
                <div className="n-col-5 n-col-start-8 n-stack" data-reveal>
                    <span className="n-label">Built with</span>
                    <div className="n-chips">
                        {STACK.map((s) => (
                            <Tag key={s} tone="ghost">
                                {s}
                            </Tag>
                        ))}
                    </div>
                    <p className="n-body n-mute">
                        A native menu-bar app, packaged as a local .app bundle with Swift Package Manager and a build
                        script.
                    </p>
                </div>
            </div>
        </Chapter>
    );
}
