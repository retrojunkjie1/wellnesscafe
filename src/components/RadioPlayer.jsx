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

const loadJSON = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    if (!v) return fallback;
    return JSON.parse(v);
  } catch (error_) {
    console.warn("radio: loadJSON failed", error_);
    return fallback;
  }
};

const saveJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error_) {
    console.warn("radio: saveJSON failed", error_);
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

  const [customs, setCustoms] = useState(() =>
    loadJSON("wc-radio-customs", [])
  );
  const [showEditor, setShowEditor] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [error, setError] = useState("");
  const stations = useMemo(() => [...STATIONS, ...customs], [customs]);
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

  const validateUrl = (url) => /^https?:\/\//i.test(url);

  const addCustom = async () => {
    setError("");
    const name = newName.trim();
    const url = newUrl.trim();
    if (!name) {
      setError("Please enter a station name");
      return;
    }
    if (!validateUrl(url)) {
      setError("Enter a valid http(s) stream URL");
      return;
    }
    const id = `custom-${Date.now()}`;
    const next = [...customs, { id, name, url }];
    setCustoms(next);
    saveJSON("wc-radio-customs", next);
    setStationId(id);
    setShowEditor(false);
    setNewName("");
    setNewUrl("");
    // try autoplay if already playing
    const el = audioRef.current;
    if (el && playing) {
      try {
        await el.play();
      } catch (error_) {
        console.warn("radio: custom play failed", error_);
      }
    }
  };

  const removeCustom = (id) => {
    const next = customs.filter((c) => c.id !== id);
    setCustoms(next);
    saveJSON("wc-radio-customs", next);
    if (stationId === id && next.length) {
      setStationId(next[0].id);
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
          <Waves size={16} aria-hidden className="opacity-80" />
        ) : (
          <IconBadge size="sm" ariaLabel="Radio">
            <Waves size={16} aria-hidden className="opacity-90" />
          </IconBadge>
        )}
        <span className="text-xs tracking-wide opacity-90 hidden sm:inline">
          Radio
        </span>
      </div>
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
      <button
        type="button"
        onClick={() => setShowEditor((v) => !v)}
        className={
          isNavbar
            ? "ml-1 inline-flex items-center gap-1 rounded-md border border-current/30 px-2 py-1 text-xs font-medium hover:bg-current/10"
            : "ml-1 inline-flex items-center gap-1 rounded-md border border-white/25 px-2 py-1 text-xs font-medium hover:bg-white/10"
        }
        title="Add custom station"
        aria-label="Add custom station"
      >
        +
      </button>
      <button
        type="button"
        onClick={togglePlay}
        className={
          isNavbar
            ? "ml-1 inline-flex items-center gap-1 rounded-md border border-current/30 px-2 py-1 text-xs font-medium hover:bg-current/10 focus:outline-none focus:ring-1 focus:ring-current/30"
            : "ml-1 inline-flex items-center gap-1 rounded-md border border-white/25 px-2 py-1 text-xs font-medium hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-white/30"
        }
        aria-label={playing ? "Pause radio" : "Play radio"}
        title={playing ? "Pause radio" : "Play radio"}
      >
        {playing ? <Pause size={14} /> : <Play size={14} />}
        <span>{playing ? "Pause" : "Play"}</span>
      </button>

      {showEditor && (
        <div
          className={
            isNavbar
              ? "absolute mt-10 left-0 z-50 bg-black/70 text-white border border-white/20 rounded-md p-2 w-[260px]"
              : "absolute mt-10 right-0 z-50 bg-white/90 text-black border border-black/20 rounded-md p-2 w-[260px]"
          }
          role="dialog"
          aria-label="Add custom station"
        >
          <div className="mb-2 text-xs opacity-90">Add custom station</div>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Station name"
              className={
                isNavbar
                  ? "bg-black/40 text-white text-xs border border-white/25 rounded px-2 py-1"
                  : "bg-white text-black text-xs border border-black/25 rounded px-2 py-1"
              }
            />
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://example.com/stream.mp3"
              className={
                isNavbar
                  ? "bg-black/40 text-white text-xs border border-white/25 rounded px-2 py-1"
                  : "bg-white text-black text-xs border border-black/25 rounded px-2 py-1"
              }
            />
            {error && <div className="text-[11px] text-red-300">{error}</div>}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={addCustom}
                className={
                  isNavbar
                    ? "inline-flex items-center gap-1 rounded-md border border-white/30 px-2 py-1 text-xs hover:bg-white/10"
                    : "inline-flex items-center gap-1 rounded-md border border-black/30 px-2 py-1 text-xs hover:bg-black/5"
                }
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEditor(false);
                  setError("");
                }}
                className={
                  isNavbar
                    ? "inline-flex items-center gap-1 rounded-md border border-white/20 px-2 py-1 text-xs hover:bg-white/5"
                    : "inline-flex items-center gap-1 rounded-md border border-black/20 px-2 py-1 text-xs hover:bg-black/5"
                }
              >
                Cancel
              </button>
            </div>
            {customs.length > 0 && (
              <div className="pt-2 border-t border-current/20 text-xs">
                <div className="opacity-80 mb-1">Your stations</div>
                {customs.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between gap-2 py-0.5"
                  >
                    <button
                      type="button"
                      className="underline"
                      onClick={() => setStationId(c.id)}
                    >
                      {c.name}
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${c.name}`}
                      title={`Remove ${c.name}`}
                      onClick={() => removeCustom(c.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RadioPlayer;
