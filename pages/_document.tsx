import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html data-bs-theme="light">
      <Head />
      <body className='vh-100 has-navbar-vertical-aside navbar-vertical-aside-show-xl navbar-vertical-aside-compact-mini-mode navbar-vertical-aside-compact-mode'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
