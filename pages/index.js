import Head from "next/head";

export default function Home() {

    return (
        <div className="container py-4" style={{ maxWidth: 800 }}>
            <Head>
                <title>Projects - Moses Surumen</title>
                <meta
                    name="description"
                    content="Moses Surumen's personal projects"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="d-flex flex-column gap-4">
            </main>
        </div>
    );
}
