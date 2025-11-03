import React, { useRef, useState } from "react";
import { Pause, Radio } from "lucide-react";

const RadioPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const streamUrl = "https://stream-relay-geo.ntslive.net/stream"; // soothing ambient station

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
    } else {
      el.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="fixed bottom-5 right-5 backdrop-blur-md bg-emerald-800/90 text-white border border-white/15 rounded-full shadow-lg p-3 flex items-center justify-center cursor-pointer hover:bg-emerald-700/90 transition-all">
      <audio ref={audioRef} src={streamUrl} preload="none" />
      <button onClick={togglePlay} aria-label="Toggle radio">
        {playing ? <Pause size={20} /> : <Radio size={20} />}
      </button>
    </div>
  );
};

export default RadioPlayer;
