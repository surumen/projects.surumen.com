import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html data-bs-theme="light">
      <Head />
      <body className='vh-100'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
