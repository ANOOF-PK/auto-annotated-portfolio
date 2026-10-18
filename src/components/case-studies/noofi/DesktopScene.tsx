import * as React from 'react';

/** A stylised Mac desktop with a meeting-notes window, used as the stage for the caption panel. */
export default function DesktopScene({ children, label = true }: React.PropsWithChildren<{ label?: boolean }>) {
    return (
        <div className="n-desk">
            <div className="n-desk__wall" aria-hidden />
            <div className="n-desk__menubar" aria-hidden>
                <span className="n-desk__menu">
                    <b>Notes</b>
                    <span>File</span>
                    <span>Edit</span>
                    <span>View</span>
                </span>
                <span className="n-desk__tray">
                    <span className="n-desk__traymic" title="NooFi Speaks menu-bar item" />
                    <span>Thu 10:42</span>
                </span>
            </div>
            <div className="n-desk__window" aria-hidden>
                <div className="n-desk__chrome">
                    <i />
                    <i />
                    <i />
                    <span>Launch sync — notes</span>
                </div>
                <div className="n-desk__doc">
                    <div className="n-desk__h" />
                    <div className="n-desk__p" style={{ width: '82%' }} />
                    <div className="n-desk__p" style={{ width: '64%' }} />
                    <div className="n-desk__p" style={{ width: '71%' }} />
                    <div className="n-desk__h n-desk__h--sm" />
                    <div className="n-desk__p" style={{ width: '58%' }} />
                    <div className="n-desk__p" style={{ width: '76%' }} />
                </div>
            </div>
            <div className="n-desk__float">{children}</div>
            {label && <span className="n-desk__label">Interactive recreation, not a screen recording</span>}
        </div>
    );
}
