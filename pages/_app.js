// import node module libraries
import Head from 'next/head';
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import SSRProvider from 'react-bootstrap/SSRProvider';

// import provider and store from redux state management.
import { Provider } from 'react-redux'
import { store } from 'app/store/store'

// Styles
import 'style/_index.scss'

// import default layouts
import DefaultLayout from 'layouts/HomeIndex';
import ProjectLayout from 'layouts/HomeIndex'; //TODO: change


function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const pageURL = process.env.baseURL + router.pathname;
  const title = `Moses Surumen`;
  const description = `Moses Surumen's Projects`;
  const keywords = 'Software engineer, resume, projects';

  // Identify the layout, which will be applied conditionally
  const Layout = Component.Layout || (router.pathname.includes('project') ? ProjectLayout : DefaultLayout)

  return (
      <SSRProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="keywords" content={keywords} />
          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        </Head>
        <NextSeo
            title={title}
            description={description}
            canonical={pageURL}
            openGraph={{
              url: pageURL,
              title: title,
              description: description,
              site_name: process.env.siteName,
            }}
        />
        <Provider store={store}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </SSRProvider>
  )
}

export default MyApp
