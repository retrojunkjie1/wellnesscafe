import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./LiveBackground.css";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const LiveBackground = ({ images = [], intensity = 8, className = "" }) => {
  const reduceMotion = typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  const wrapRef = useRef(null);
  const rafRef = useRef(0);
  const [layerOffsets, setLayerOffsets] = useState(() => images.map(() => ({ x: 0, y: 0 })));

  useEffect(() => {
    if (!images.length) return;
    if (reduceMotion) return; // CSS keyframe fallback handles motion

    let targetX = 0; // -1..1
    let targetY = 0; // -1..1
    let curX = 0;
    let curY = 0;

    const onMouseMove = (e) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      const nx = (e.clientX / w) * 2 - 1;
      const ny = (e.clientY / h) * 2 - 1;
      targetX = clamp(nx, -1, 1);
      targetY = clamp(ny, -1, 1);
    };

    const onDevice = (evt) => {
      // gamma: left-right tilt [-90..90], beta: front-back [-180..180]
      const g = typeof evt.gamma === "number" ? evt.gamma : 0;
      const b = typeof evt.beta === "number" ? evt.beta : 0;
      const nx = clamp(g / 45, -1, 1);
      const ny = clamp(b / 45, -1, 1);
      targetX = nx;
      targetY = ny;
    };

    const step = () => {
      // ease towards target
      const ease = 0.08;
      curX += (targetX - curX) * ease;
      curY += (targetY - curY) * ease;

      setLayerOffsets((prev) =>
        prev.map((_, i) => {
          const depth = (i + 1) / (images.length + 1); // 0..1
          const px = curX * intensity * depth;
          const py = curY * intensity * depth;
          return { x: px, y: py };
        })
      );

      rafRef.current = window.requestAnimationFrame(step);
    };

    // listeners
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      try {
        // Best-effort: subscribe without prompting; if iOS requires permission, it will no-op
        window.addEventListener("deviceorientation", onDevice, { passive: true });
      } catch (_) {
        /* no-op */
      }
    }

    rafRef.current = window.requestAnimationFrame(step);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("deviceorientation", onDevice);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [images.length, intensity, reduceMotion]);

  if (!images.length) return null;

  return (
    <div ref={wrapRef} className={`live-bg ${reduceMotion ? "is-reduced" : ""} ${className}`.trim()} aria-hidden>
      {images.map((src, i) => {
        const off = layerOffsets[i] || { x: 0, y: 0 };
        const style = reduceMotion
          ? { backgroundImage: `url(${src})` }
          : {
              backgroundImage: `url(${src})`,
              transform: `translate3d(${off.x.toFixed(2)}px, ${off.y.toFixed(2)}px, 0)`
            };
        return <div key={i} className={`live-layer layer-${i + 1}`} style={style} />;
      })}
      <div className="live-dim" />
      <div className="live-vignette" />
    </div>
  );
};

LiveBackground.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  intensity: PropTypes.number,
  className: PropTypes.string,
};

export default LiveBackground;
