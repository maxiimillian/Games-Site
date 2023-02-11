import React, { useState } from "react";

const soundContext = React.createContext();

function SoundProvider(props) {
  const [playing, setPlaying] = useState("test.mp3");

  async function handlePlay(fileName) {
    if (!fileName.endsWith(".mp3")) {
      fileName = fileName + ".mp3";
    }

    try {
      await playing.pause();
    } catch (err) {}

    try {
      let audio = new Audio(`/sounds/${fileName}`);
      setPlaying(audio);

      await audio.play();
    } catch (err) {
      return;
    }
  }

  return (
    <soundContext.Provider value={handlePlay}>
      {props.children}
    </soundContext.Provider>
  );
}

export { SoundProvider, soundContext };
