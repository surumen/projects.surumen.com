import Head from 'next/head';
import { useEffect, Fragment } from "react";
import Link from 'next/link';


// import widget/custom components
import { ProjectGridView } from 'app/components';

export default function Home() {

    useEffect(() => {
        document.body.classList.add('bg-body-tertiary');
    });

    return (
        <Fragment>
            <Head>
                <title>Projects - Moses Surumen</title>
                <meta
                    name="description"
                    content="Moses Surumen's personal projects"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ProjectGridView/>
            <div className="d-flex align-items-center gap-2 position-fixed bottom-0 end-0 mb-6 me-6 px-2 py-2 rounded-pill shadow-4 bg-white z-2">
                <Link href="#" className="mx-2 fw-bold text-xs text-dark stretched-link">Privacy</Link>
            </div>
        </Fragment>
    );
}
