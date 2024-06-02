import React from 'react';
import '../styles/global.css';
import Head from 'next/head';

const App = ({ Component, pageProps }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [width, setWidth] = React.useState<number>(2000);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  React.useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);

    if (width <= 768) {
      alert(
        'This site is not designed for mobile devices. Please use a desktop device for the best experience. If you wish to view an alternative version of this site, please visit https://jasoncameron.dev.',
      );
      // window.open('https://jasoncameron.dev', '_blank');
    }

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  const OnFocusAction = () => {
    inputRef.current.focus({ preventScroll: true });
  };

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
          key="viewport"
          maximum-scale="1"
        />
      </Head>

      <div
        className="text-light-foreground dark:text-dark-foreground min-w-max text-xs md:min-w-full md:text-base"
        onClick={OnFocusAction}
        onKeyDown={OnFocusAction}
        // tabIndex={0}
      >
        <main className="bg-light-background dark:bg-dark-background w-full h-full p-2">
          <Component {...pageProps} inputRef={inputRef} />
        </main>
      </div>
    </>
  );
};

export default App;
