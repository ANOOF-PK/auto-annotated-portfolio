import type { AppProps } from 'next/app';
import '@fontsource-variable/bricolage-grotesque/opsz.css';
import '@fontsource/dm-mono/400.css';
import '@fontsource/dm-mono/500.css';
import '../css/main.css';

export default function App({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}
