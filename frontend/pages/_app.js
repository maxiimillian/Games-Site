import "../styles/App.css";
import "../styles/index.scss";
import "../styles/buttons.scss";
import "../styles/slider.scss";
import React from 'react';

import { SoundProvider } from "../contexts/soundContext";
import useAuth, { AuthProvider } from "../contexts/authContext";

function baseApp({ Component, pageProps }) {
  
  return (
    <SoundProvider>
      <AuthProvider>
        <div className="top-container">                 
            <Component {...pageProps} />
        </div>
      </AuthProvider>
    </SoundProvider>
  )
}

export default baseApp;
