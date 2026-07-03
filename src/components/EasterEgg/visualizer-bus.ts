// Tiny pub-sub so the trigger (rendered per-page inside Footer, and thus
// remounted on every client-side navigation) can tell the audio visualizer
// widget (mounted once in the root layout, so it survives navigation and can
// keep playing across pages) to open — without any shared React tree between
// the two. If requestOpen() fires before the widget has subscribed yet (the
// widget is behind a dynamic ssr:false import, so there's a brief window
// after a click where nothing is listening), the request is queued and
// replayed on the next subscription instead of being dropped.
type Listener = () => void;

const listeners = new Set<Listener>();
let pendingOpen = false;

export const visualizerBus = {
  requestOpen() {
    if (listeners.size === 0) {
      pendingOpen = true;
      return;
    }
    listeners.forEach((listener) => listener());
  },
  onRequestOpen(listener: Listener): () => void {
    listeners.add(listener);
    if (pendingOpen) {
      pendingOpen = false;
      listener();
    }
    return () => listeners.delete(listener);
  },
};
