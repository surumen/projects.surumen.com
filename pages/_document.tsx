import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <script 
          id="theme-preload"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('app-storage');
                const theme = stored 
                  ? (JSON.parse(stored).state?.skin || 'light')
                  : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                
                document.documentElement.setAttribute('data-bs-theme', theme);
              } catch (e) {
                document.documentElement.setAttribute('data-bs-theme', 'light');
              }
            `
          }}
        />
      </Head>
      <body className='vh-100'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}