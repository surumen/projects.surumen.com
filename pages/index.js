import Head from 'next/head';
import { useEffect, Fragment } from "react";
import { Row, Col } from 'react-bootstrap';


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
            <main className="container-fluid px-3 py-5 p-lg-6 p-xxl-8">
                <ProjectGridView/>
            </main>
        </Fragment>
    );
}
