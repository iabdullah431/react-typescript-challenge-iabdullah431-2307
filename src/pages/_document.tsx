// src/pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ar" dir="rtl">
      <Head>
        <link rel="icon" href="/logo-square.webp" type="image/webp" />
        <title>متجر التجربة الجميلة</title>
      </Head>
      <body className="text-right">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
