import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en-GB">
            <Head>
                <meta name="theme-color" content="#f4f0e8" />
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
