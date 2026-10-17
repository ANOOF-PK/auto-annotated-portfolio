import Head from 'next/head';
import { SceneLayer } from '@/components/SceneLayer';
import { SiteHeader } from '@/components/SiteHeader';
import { Arrival } from '@/components/sections/Arrival';
import { Contact } from '@/components/sections/Contact';
import { Journey } from '@/components/sections/Journey';
import { Mind } from '@/components/sections/Mind';
import { Observations } from '@/components/sections/Observations';
import { Playground } from '@/components/sections/Playground';
import { Work } from '@/components/sections/Work';
import { profile } from '@/content/site';

export default function Home() {
    const title = `${profile.name} — ${profile.profession} · Inside / Outside`;
    const description = `${profile.statement} Portfolio of ${profile.name}: accessibility, AI interfaces, B2B workflows and operational tools.`;
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
            </Head>
            <a className="skip-link" href="#work">
                Skip to work
            </a>
            <SiteHeader />
            <SceneLayer />
            <main>
                <Arrival />
                <Mind />
                <Work />
                <Observations />
                <Playground />
                <Journey />
                <Contact />
            </main>
        </>
    );
}
