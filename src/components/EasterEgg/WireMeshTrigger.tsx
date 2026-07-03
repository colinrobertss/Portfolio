"use client";

import { visualizerBus } from "./visualizer-bus";

function TriggerIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 12h3l2.5-7 4 15 3-12 2 4h3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Opens the audio visualizer widget, which lives in the root layout (see
// WireMeshEasterEggLoader) so it survives client-side navigation. This
// trigger itself has no browser-only dependencies, so unlike the widget it
// doesn't need a dynamic ssr:false wrapper.
export default function WireMeshTrigger() {
  return (
    <button
      type="button"
      onClick={() => visualizerBus.requestOpen()}
      aria-label="Play the audio visualizer easter egg"
      title="Audio visualizer"
      className="inline-flex items-center justify-center text-muted transition-colors hover:text-ink"
    >
      <TriggerIcon />
    </button>
  );
}
