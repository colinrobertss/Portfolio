"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TRACKS } from "@/lib/tracks";
import { visualizerBus } from "./visualizer-bus";
import { WireMeshVisualizer } from "./wire-mesh-visualizer";

type Phase = "closed" | "open" | "minimized";

function buildShuffleOrder(current: number, length: number): number[] {
  const order = Array.from({ length }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  // keep whatever's currently playing first, so turning shuffle on doesn't
  // change the track — it only changes what's next.
  const idx = order.indexOf(current);
  if (idx > 0) [order[0], order[idx]] = [order[idx], order[0]];
  return order;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6.5" y="5" width="4" height="14" rx="1" />
      <rect x="13.5" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}
function PrevIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 5h2v14H6V5Zm3.5 7 10-7v14l-10-7Z" />
    </svg>
  );
}
function NextIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 5h2v14h-2V5ZM4.5 5l10 7-10 7V5Z" />
    </svg>
  );
}
function ShuffleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 6h3.5L16 17h4M4 18h3.5L11 13.3M16 6h4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.5 3.5 20 6l-2.5 2.5M17.5 14.5 20 17l-2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function VolumeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 9.5v5h3.5L13 19V5L7.5 9.5H4Z" strokeLinejoin="round" />
      <path d="M16.5 9a4 4 0 0 1 0 6" strokeLinecap="round" />
    </svg>
  );
}
function MuteIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 9.5v5h3.5L13 19V5L7.5 9.5H4Z" strokeLinejoin="round" />
      <path d="M16 9.5 20 13.5M20 9.5 16 13.5" strokeLinecap="round" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

export default function WireMeshEasterEgg() {
  const [phase, setPhase] = useState<Phase>("closed");
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [shuffleOrder, setShuffleOrder] = useState<number[]>([]);
  const [shufflePointer, setShufflePointer] = useState(0);

  const mounted = phase !== "closed";

  const stageRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const engineRef = useRef<WireMeshVisualizer | null>(null);

  // Mirrors the latest playlist-navigation state into a ref so the stable
  // `advance` callback (used both by next/prev buttons and by the "ended"
  // listener registered once in the mount effect below) always reads
  // current values instead of a stale closure.
  const latestRef = useRef({ shuffle, shuffleOrder, shufflePointer, trackIndex });
  useEffect(() => {
    latestRef.current = { shuffle, shuffleOrder, shufflePointer, trackIndex };
  }, [shuffle, shuffleOrder, shufflePointer, trackIndex]);

  const advance = useCallback((direction: 1 | -1) => {
    const { shuffle: shuffleOn, shuffleOrder: order } = latestRef.current;
    if (shuffleOn && order.length > 0) {
      const nextPointer = (latestRef.current.shufflePointer + direction + order.length) % order.length;
      setShufflePointer(nextPointer);
      setTrackIndex(order[nextPointer]);
    } else {
      setTrackIndex((i) => (i + direction + TRACKS.length) % TRACKS.length);
    }
  }, []);

  // subscribe once: the trigger (rendered per-page inside Footer) opens this
  // root-mounted widget across a plain pub-sub, since they don't share a
  // React tree that survives navigation.
  useEffect(() => visualizerBus.onRequestOpen(() => setPhase("open")), []);

  // Escape backs out of the full overlay the same way clicking the backdrop
  // does — minimizes, doesn't close. Only the explicit X fully tears down.
  useEffect(() => {
    if (phase !== "open") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPhase("minimized");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  // mount/teardown the three.js scene + AudioContext + <audio> element.
  // Keyed on `mounted` (open OR minimized), not on `phase === "open"`, so
  // minimizing never disposes anything — only the explicit close button
  // (which sets phase to "closed") does.
  useEffect(() => {
    if (!mounted || !stageRef.current) return;

    const audio = document.createElement("audio");
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";
    audio.volume = volume;
    audio.muted = muted;
    audio.src = TRACKS[trackIndex]?.src ?? "";
    audioRef.current = audio;

    const engine = new WireMeshVisualizer(stageRef.current, audio);
    engineRef.current = engine;

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    const handleEnded = () => advance(1);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("loadedmetadata", handleDurationChange);

    let ro: ResizeObserver | undefined;
    if (window.ResizeObserver) {
      ro = new ResizeObserver(() => {
        const r = stageRef.current!.getBoundingClientRect();
        engine.setSize(Math.round(r.width), Math.round(r.height));
      });
      ro.observe(stageRef.current);
    }

    return () => {
      ro?.disconnect();
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("loadedmetadata", handleDurationChange);
      audio.pause();
      engine.dispose();
      engineRef.current = null;
      audioRef.current = null;
      setPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // sync <audio> src when the track changes after mount (the initial track
  // is set directly in the mount effect above, since this effect's
  // trackIndex dependency doesn't re-fire just because `mounted` changed)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const wasPlaying = !audio.paused;
    setCurrentTime(0);
    setDuration(0);
    audio.src = TRACKS[trackIndex]?.src ?? "";
    if (wasPlaying) audio.play().catch(() => {});
  }, [trackIndex]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }, []);

  const toggleShuffle = () => {
    setShuffle((prev) => {
      const next = !prev;
      if (next) {
        setShuffleOrder(buildShuffleOrder(trackIndex, TRACKS.length));
        setShufflePointer(0);
      }
      return next;
    });
  };

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number(e.target.value);
    setCurrentTime(t);
    if (audioRef.current) audioRef.current.currentTime = t;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  const track = TRACKS[trackIndex];
  const silent = muted || volume === 0;

  return (
    <>
      {mounted && (
        <div
          className={
            phase === "open"
              ? "fixed inset-0 z-[10050] flex items-center justify-center bg-ink/92 backdrop-blur-sm"
              : "group fixed bottom-6 left-6 z-[10050] h-14 w-14 cursor-pointer overflow-hidden rounded-full border border-cream/25 shadow-[0_8px_24px_rgba(26,24,20,0.35)]"
          }
          role={phase === "open" ? "dialog" : "button"}
          aria-modal={phase === "open" ? true : undefined}
          aria-label={phase === "open" ? "Audio visualizer" : "Expand audio visualizer"}
          tabIndex={phase === "minimized" ? 0 : undefined}
          onClick={() => setPhase(phase === "open" ? "minimized" : "open")}
          onKeyDown={
            phase === "minimized"
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setPhase("open");
                  }
                }
              : undefined
          }
        >
          <div ref={stageRef} className="absolute inset-0" />

          {phase === "open" && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPhase("closed");
                }}
                aria-label="Close"
                className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-cream/30 text-cream/80 transition-colors hover:border-cream hover:text-cream"
              >
                <CloseIcon />
              </button>

              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-8 left-1/2 z-10 w-[min(420px,calc(100vw-32px))] -translate-x-1/2 rounded-2xl border border-cream/20 bg-ink/70 px-5 py-4 backdrop-blur"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12px] font-medium text-cream">{track ? track.title : "—"}</div>
                    <div className="truncate text-[10px] uppercase tracking-[1.5px] text-cream/50">
                      {track ? track.artist : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={toggleShuffle}
                      aria-label="Toggle shuffle"
                      aria-pressed={shuffle}
                      title="Shuffle"
                      className={`transition-colors ${shuffle ? "text-accent" : "text-cream/70 hover:text-cream"}`}
                    >
                      <ShuffleIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => advance(-1)}
                      aria-label="Previous track"
                      title="Previous"
                      className="text-cream/70 transition-colors hover:text-cream"
                    >
                      <PrevIcon />
                    </button>
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={playing ? "Pause" : "Play"}
                      title={playing ? "Pause" : "Play"}
                      className="text-cream transition-colors hover:text-accent"
                    >
                      {playing ? <PauseIcon /> : <PlayIcon />}
                    </button>
                    <button
                      type="button"
                      onClick={() => advance(1)}
                      aria-label="Next track"
                      title="Next"
                      className="text-cream/70 transition-colors hover:text-cream"
                    >
                      <NextIcon />
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className="w-8 text-right text-[10px] tabular-nums text-cream/50">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    aria-label="Seek"
                    min={0}
                    max={duration || 0}
                    step={0.1}
                    value={Math.min(currentTime, duration || 0)}
                    onChange={handleSeek}
                    disabled={!duration}
                    className="h-1.5 w-full cursor-pointer accent-accent disabled:cursor-default"
                  />
                  <span className="w-8 text-[10px] tabular-nums text-cream/50">{formatTime(duration)}</span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={silent ? "Unmute" : "Mute"}
                    title={silent ? "Unmute" : "Mute"}
                    className="text-cream/70 transition-colors hover:text-cream"
                  >
                    {silent ? <MuteIcon /> : <VolumeIcon />}
                  </button>
                  <input
                    type="range"
                    aria-label="Volume"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={handleVolumeChange}
                    className="h-1.5 w-full cursor-pointer accent-accent"
                  />
                </div>
              </div>
            </>
          )}

          {phase === "minimized" && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPhase("closed");
              }}
              aria-label="Close audio visualizer"
              className="absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-cream/40 bg-ink text-cream/80 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            >
              <CloseIcon />
            </button>
          )}
        </div>
      )}
    </>
  );
}
