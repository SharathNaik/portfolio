import "../styles/globals.css";
import "../styles/elastic.css";
import "../styles/component.fallintextentry.css";
import "../styles/component.navbar.css";
import "../styles/component.transition.css";
import "../styles/pages.css";
import "../styles/component.blinking.cursor.css";
import Script from "next/script";

import type { AppProps } from "next/app";
import Transition from "../components/Transition";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

      <Script strategy="lazyOnload">
        {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                    page_path: window.location.pathname,
                    });
                `}
      </Script>
    <Transition>
      <Component {...pageProps} />
    </Transition>
    </>
  );
}
