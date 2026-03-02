import { Component } from "react";

// Catches "Failed to fetch dynamically imported module" errors
// that occur after a new Vercel deployment invalidates old chunk files.
// Auto-reloads the page once to fetch fresh chunks.
class ChunkErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    const isChunkError =
      error?.message?.includes("Failed to fetch dynamically imported module") ||
      error?.message?.includes("Importing a module script failed") ||
      error?.name === "ChunkLoadError";

    if (isChunkError) {
      // Reload once — if already reloaded, don't loop
      const reloaded = sessionStorage.getItem("chunk_reload");
      if (!reloaded) {
        sessionStorage.setItem("chunk_reload", "1");
        window.location.reload();
        return { hasError: false };
      }
      return { hasError: true };
    }
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("ChunkErrorBoundary caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white gap-4">
          <h2 className="text-xl font-bold">Something went wrong</h2>
          <p className="text-gray-400 text-sm">
            A new version of the app was deployed.
          </p>
          <button
            onClick={() => {
              sessionStorage.removeItem("chunk_reload");
              window.location.reload();
            }}
            className="bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ChunkErrorBoundary;
