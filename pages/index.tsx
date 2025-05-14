import Head from 'next/head';
import { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ProjectGridView } from '@/widgets';
import useLocalStorage from '@/hooks/useLocalStorage';
import { acceptCookies } from '@/store/appSlice';

export default function Home() {
    const dispatch = useDispatch();
    const acceptedCookies = useSelector((state: any) => state.app.acceptedCookies);

    // initialize storage with the current acceptedCookies flag
    const {
        storageValue,    // string | null
        setStorageValue, // (val: string) => void
    } = useLocalStorage('cookieNotice', acceptedCookies.toString());

    // whenever storageValue flips to "true", fire acceptCookies()
    useEffect(() => {
        if (storageValue === 'true' && !acceptedCookies) {
            dispatch(acceptCookies());
        }
    }, [dispatch, storageValue, acceptedCookies]);

    const dismissNotice = () => {
        setStorageValue('true');
        if (!acceptedCookies) dispatch(acceptCookies());
    };

    return (
        <Fragment>
            <Head>
                <title>Projects – Moses Surumen</title>
                <meta name="description" content="Moses Surumen’s personal projects" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <ProjectGridView />

            {!acceptedCookies && (
                <div className="card card-body shadow-4 bg-body rounded-1 border-light d-flex flex-row gap-2 align-items-center py-3 px-5 position-fixed bottom-0 end-0 mb-6 me-6">
                    <span className="text-sm">This website uses cookies 🍪</span>
                    <button
                        onClick={dismissNotice}
                        className="btn btn-link text-sm p-0 ms-2"
                    >
                        Okay thanks
                    </button>
                </div>
            )}
        </Fragment>
    );
}