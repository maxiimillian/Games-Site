import "../styles/App.css";
import "../styles/index.scss";
import "../styles/buttons.scss";
import "../styles/slider.scss";
import React from 'react';
import Head from "next/head";
import { SoundProvider } from "../contexts/soundContext";
import Header from "../components/main/Header";
import useAuth, { AuthProvider } from "../contexts/AuthContext";

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

function baseApp({ Component, pageProps }) {
  
  return (
    <SoundProvider>
      <AuthProvider>
        <Head>
          <title>Playholdr - Free Multiplayer Games</title>
              <meta charSet="utf-8" />
              <meta name="theme-color" content="#A8BD92"></meta>
              <meta name="description" content={"Features several online games. Free-to-play, no accounts needed"} />
              <meta name="og:url" content={"https://playholdr.com"}></meta>
              <meta name="og:type" content={"website"}></meta>
              <meta name="og:title" content="Free multiplayer games site with Sudoku, Poker, and more" />
              <meta name="og:site_name" content={"Playholdr"} />
              <meta name="og:description" content={"Features several online games. Free-to-play, no accounts needed"} />
          </Head>
        <Header />
        <div className="top-container">                 
            <Component {...pageProps} />
        </div>
      </AuthProvider>
    </SoundProvider>
  )
}

export default baseApp;
