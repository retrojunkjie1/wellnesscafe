/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, Waves } from "lucide-react";
import IconBadge from "./IconBadge";

const STATIONS = [
  {
    id: "nts",
    name: "NTS Ambient",
    url: "https://stream-relay-geo.ntslive.net/stream",
  },
  {
    id: "groove",
    name: "SomaFM Groove Salad",
    url: "https://ice6.somafm.com/groovesalad-128-mp3",
  },
  {
    id: "drone",
    name: "SomaFM Drone Zone",
    url: "https://ice1.somafm.com/dronezone-128-mp3",
  },
  {
    id: "lush",
    name: "SomaFM Lush",
    url: "https://ice1.somafm.com/lush-128-mp3",
  },
  {
    id: "spacestation",
    name: "SomaFM Space Station",
    url: "https://ice3.somafm.com/spacestation-128-mp3",
  },
  {
    id: "deepspace",
    name: "SomaFM Deep Space One",
    url: "https://ice3.somafm.com/deepspaceone-128-mp3",
  },
  {
    id: "npr",
    name: "NPR News (Live)",
    url: "https://npr-ice.streamguys1.com/live.mp3",
  },
  {
    id: "bbcws",
    name: "BBC World Service",
    url: "https://stream.live.vc.bbcmedia.co.uk/bbc_world_service",
  },
];

const loadPref = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ?? fallback;
  } catch (error_) {
    // eslint-disable-next-line no-console
    console.warn("radio: loadPref failed", error_);
    return fallback;
  }
};

const savePref = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (error_) {
    // eslint-disable-next-line no-console
    console.warn("radio: savePref failed", error_);
  }
};

const RadioPlayer = ({ variant = "floating" }) => {
  const [stationId, setStationId] = useState(() =>
    loadPref("wc-radio-station", STATIONS[0].id)
  );
  const [playing, setPlaying] = useState(
    () => loadPref("wc-radio-playing", "false") === "true"
  );
  const audioRef = useRef(null);

  const stations = useMemo(() => STATIONS, []);
  const current = stations.find((s) => s.id === stationId) || stations[0];

  useEffect(() => {
    savePref("wc-radio-station", stationId);
  }, [stationId]);

  useEffect(() => {
    savePref("wc-radio-playing", String(playing));
  }, [playing]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.src = current.url;
    if (playing) {
      el.play().catch((error_) => {
        // eslint-disable-next-line no-console
        console.warn("radio: play failed", error_);
        setPlaying(false);
      });
    } else {
      el.pause();
    }
  }, [current.url, playing]);

  const togglePlay = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      try {
        await el.play();
        setPlaying(true);
      } catch (error_) {
        // eslint-disable-next-line no-console
        console.warn("radio: play failed", error_);
        setPlaying(false);
      }
    }
  };

  const onTune = async (e) => {
    const nextId = e.target.value;
    setStationId(nextId);
    const el = audioRef.current;
    if (!el) return;
    el.src = (stations.find((s) => s.id === nextId) || stations[0]).url;
    if (playing) {
      try {
        await el.play();
      } catch (error_) {
        // eslint-disable-next-line no-console
        console.warn("radio: tune+play failed", error_);
        setPlaying(false);
      }
    }
  };

  const isNavbar = variant === "navbar";
  return (
    <div
      className={
        isNavbar
          ? "relative z-40 text-inherit px-0 py-0 flex items-center gap-2"
          : "fixed right-4 md:bottom-4 bottom-24 z-40 text-white rounded-2xl shadow-lg px-3 py-2 flex items-center gap-2"
      }
      style={
        isNavbar
          ? undefined
          : { background: "transparent", backdropFilter: "none", border: "0" }
      }
    >
      <audio
        ref={audioRef}
        preload="none"
        aria-label={`${current.name} radio stream`}
      />
      <div className="flex items-center gap-1 pr-1">
        {isNavbar ? (
          <Waves size={14} aria-hidden className="opacity-80" />
        ) : (
          <IconBadge size="sm" ariaLabel="Radio">
            <Waves size={16} aria-hidden className="opacity-90" />
          </IconBadge>
        )}
        {!isNavbar && (
          <span className="text-xs tracking-wide opacity-90 hidden sm:inline">
            Radio
          </span>
        )}
      </div>
      {!isNavbar && (
        <select
          value={stationId}
          onChange={onTune}
          className={
            isNavbar
              ? "bg-transparent text-current text-xs border border-current/30 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-current/40"
              : "bg-transparent text-white/90 text-xs border border-white/20 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-white/30"
          }
          aria-label="Choose station"
        >
          {stations.map((s) => (
            <option key={s.id} value={s.id} className="text-black">
              {s.name}
            </option>
          ))}
        </select>
      )}
      {isNavbar && (
        <select
          value={stationId}
          onChange={onTune}
          className="ml-1 bg-transparent text-current text-xs border border-current/30 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-current/40"
          aria-label="Choose station"
        >
          {stations.map((s) => (
            <option key={s.id} value={s.id} className="text-black">
              {s.name}
            </option>
          ))}
        </select>
      )}
      <button
        type="button"
        onClick={togglePlay}
        className={
          isNavbar
            ? "ml-1 inline-flex items-center gap-1 rounded-md border border-current/30 px-1.5 py-1 text-[11px] font-medium hover:bg-current/10 focus:outline-none focus:ring-1 focus:ring-current/30"
            : "ml-1 inline-flex items-center gap-1 rounded-md border border-white/25 px-2 py-1 text-xs font-medium hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-white/30"
        }
        aria-label={playing ? "Pause radio" : "Play radio"}
        title={playing ? "Pause radio" : "Play radio"}
      >
        {playing ? <Pause size={12} /> : <Play size={12} />}
        {!isNavbar && <span>{playing ? "Pause" : "Play"}</span>}
      </button>
    </div>
  );
};

export default RadioPlayer;
