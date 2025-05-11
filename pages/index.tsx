import Head from 'next/head';
import { useEffect, Fragment } from "react";
import Link from 'next/link';


// import widget/custom components
import { ProjectGridView } from '@/widgets';
import { useDispatch, useSelector } from "react-redux";
import useLocalStorage from "@/hooks/useLocalStorage";
import { acceptCookies } from "@/store/appSlice";

export default function Home() {

    const acceptedCookies = useSelector((state: any) => state.app.acceptedCookies);
    const dispatch = useDispatch();

    // useEffect(() => {
    //     document.body.classList.add('bg-body-tertiary');
    // });

    const {
        storageValue,
        setStorageValue,
        getStorageValue
    } = useLocalStorage('cookieNotice', acceptedCookies);

    useEffect(() => {
        if (storageValue) {
            dispatch(acceptCookies(storageValue === 'true'));
        }
    }, [dispatch, getStorageValue, storageValue]);

    const dismissNotice = () => {
      setStorageValue('true');
      dispatch(acceptCookies(true));
    }

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

            { acceptedCookies ? (<span></span>) : (
                <div className='card card-body shadow-4 rounded-1 border-light-subtle d-flex flex-row gap-2 align-items-center py-3 px-5 position-fixed bottom-0 end-0 mb-6 me-6'>
                    <span className='text-sm'>This website uses cookies 🍪</span>
                    <span onClick={() => dismissNotice()} className='text-sm text-decoration-underline text-primary-hover cursor-pointer'>Okay thanks</span>
                </div>
            )}
        </Fragment>
    );
}
