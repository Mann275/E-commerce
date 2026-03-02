import { useEffect, useRef, useState } from "react";
import { ServerCrash } from "lucide-react";

// Strip /api/v1 suffix if present — health route is at root /health
const BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8000"
).replace(/\/api\/v1\/?$/, "");

export default function ServerWakeup() {
  const [show, setShow] = useState(false);
  const [dots, setDots] = useState("");
  const resolvedRef = useRef(false);

  useEffect(() => {
    // Step 1: ping server immediately
    fetch(`${BASE_URL}/health`)
      .then((res) => {
        if (res.ok) {
          resolvedRef.current = true;
          setShow(false);
        }
      })
      .catch(() => {});

    // Step 2: if not resolved in 5s, show banner
    const bannerTimer = setTimeout(() => {
      if (!resolvedRef.current) setShow(true);
    }, 5000);

    // Step 3: keep retrying every 4s until server wakes
    const retryInterval = setInterval(() => {
      if (resolvedRef.current) {
        clearInterval(retryInterval);
        return;
      }
      fetch(`${BASE_URL}/health`)
        .then((res) => {
          if (res.ok) {
            resolvedRef.current = true;
            setShow(false);
            clearInterval(retryInterval);
          }
        })
        .catch(() => {});
    }, 4000);

    // Animate dots
    const dotInterval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 500);

    return () => {
      clearTimeout(bannerTimer);
      clearInterval(retryInterval);
      clearInterval(dotInterval);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-black/80 backdrop-blur-md border border-yellow-500/40 text-yellow-300 text-sm px-4 py-2.5 rounded-xl shadow-lg">
      <ServerCrash className="w-4 h-4 shrink-0 animate-pulse" />
      <span>Server is starting up, please wait{dots}</span>
    </div>
  );
}
