// import node module libraries
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Fragment } from 'react';
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo';
import { AuthProvider } from '../lib/firebase/AuthContext';

// Layout system imports
import { 
  getLayoutForRoute, 
  getLayoutByName, 
  LayoutComponent,
  PageWithLayout
} from '../lib/layoutMapping';

// Styles
import 'style/_index.scss';

// Extend AppProps to include Layout property
type AppPropsWithLayout = AppProps & {
  Component: AppProps['Component'] & PageWithLayout;
};

function MyProjectsApp({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  const pageURL = process.env.baseURL + router.pathname;
  const title = `Moses Surumen`;
  const description = `Moses Surumen's Projects`;
  const keywords = 'Software engineer, resume, projects';

  /**
   * Enhanced Layout Assignment Logic
   * Priority:
   * 1. Component.Layout (explicit override)
   * 2. Route-based automatic assignment
   * 3. Default layout fallback
   */
  const getPageLayout = (): LayoutComponent => {
    // Check if component specifies a layout
    if (Component.Layout) {
      // Handle both component and string layout specifications
      if (typeof Component.Layout === 'string') {
        return getLayoutByName(Component.Layout);
      }
      return Component.Layout;
    }
    
    // Use route-based automatic assignment
    return getLayoutForRoute(router.pathname);
  };

  const Layout = getPageLayout();

  return (
    <AuthProvider>
      <Fragment>
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
          <Layout>
            <Component {...pageProps} />
          </Layout>
      </Fragment>
    </AuthProvider>
  )
}

export default MyProjectsApp;
