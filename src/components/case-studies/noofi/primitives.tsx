import * as React from 'react';

type ChapterProps = React.PropsWithChildren<{
    id: string;
    index: string;
    label: string;
    className?: string;
}>;

/** A numbered chapter of the case study. `id` feeds the chapter rail. */
export function Chapter({ id, index, label, className, children }: ChapterProps) {
    return (
        <section id={id} data-chapter={id} className={`n-chapter ${className || ''}`}>
            <div className="n-wrap">
                <div className="n-eyebrow" data-reveal>
                    <span className="n-eyebrow__num">{index}</span>
                    <span className="n-eyebrow__rule" />
                    <span>{label}</span>
                </div>
            </div>
            {children}
        </section>
    );
}

export function Tag({
    children,
    tone = 'default'
}: React.PropsWithChildren<{ tone?: 'default' | 'amber' | 'hi' | 'ghost' }>) {
    return <span className={`n-tag n-tag--${tone}`}>{children}</span>;
}

type MediaSlotProps = {
    label: string;
    caption?: string;
    ratio?: '16/9' | '4/3' | '21/9';
    src?: string;
    poster?: string;
    duration?: string;
    children?: React.ReactNode;
};

/**
 * Frame for real footage. Until a `src` is supplied it shows a labelled placeholder,
 * so the page never passes off a mock as a recording.
 */
export function MediaSlot({ label, caption, ratio = '16/9', src, poster, duration, children }: MediaSlotProps) {
    return (
        <figure className="n-media" data-reveal>
            <div className="n-media__frame" style={{ aspectRatio: ratio.replace('/', ' / ') }}>
                {src ? (
                    <video src={src} poster={poster} autoPlay muted loop playsInline controls={false} />
                ) : (
                    <div className="n-media__placeholder">
                        {children}
                        <div className="n-media__meta">
                            <span className="n-media__dot" />
                            <span>{label}</span>
                            {duration && <span className="n-media__duration">{duration}</span>}
                        </div>
                        <span className="n-media__soon">Recording in production</span>
                    </div>
                )}
            </div>
            {caption && <figcaption className="n-media__caption">{caption}</figcaption>}
        </figure>
    );
}
