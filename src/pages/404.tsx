import Head from 'next/head';
import Link from 'next/link';
import css from '@/components/CaseStudy.module.css';

export default function NotFound() {
    return (
        <main className={css.page}>
            <Head>
                <title>Not found — Anoof P K</title>
            </Head>
            <p className="mono">404</p>
            <h1 className={css.title}>Nothing here.</h1>
            <p className={css.lead}>
                <Link href="/">Back to the portfolio</Link> or straight to <Link href="/#work">the work</Link>.
            </p>
        </main>
    );
}
