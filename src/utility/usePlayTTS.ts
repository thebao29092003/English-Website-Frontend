import { useState, useEffect, useRef } from "react";
import { useSpeech } from "react-text-to-speech";

export function usePlayTTS() {
  const [ttsText, setTtsText] = useState("");
  const { start, stop, speechStatus } = useSpeech({
    text: ttsText,
    lang: "en-US",
  });

  const startRef = useRef(start);
  const stopRef = useRef(stop);

  // Sync references to latest render values
  startRef.current = start;
  stopRef.current = stop;

  // Track the text we are actively playing or scheduled to play
  const activeTextRef = useRef("");

  useEffect(() => {
    if (ttsText && ttsText === activeTextRef.current) {
      stopRef.current();

      // Delay start to allow the library's internal setTimeout to update the stable value
      const timer = setTimeout(() => {
        // Double check that the text hasn't changed in the meantime
        if (ttsText === activeTextRef.current) {
          startRef.current();
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [ttsText]);

  const playTTS = (text: string) => {
    if (!text) return;

    activeTextRef.current = text;
    stopRef.current();

    if (ttsText === text) {
      // If the text is exactly the same, state won't update, so we trigger start directly
      setTimeout(() => {
        if (activeTextRef.current === text) {
          startRef.current();
        }
      }, 100);
    } else {
      // If the text is different, we update the state to trigger the useEffect
      setTtsText(text);
    }
  };

  const currentPlayingText = speechStatus === "started" ? ttsText : "";

  return { playTTS, stopTTS: stop, speechStatus, currentPlayingText };
}
