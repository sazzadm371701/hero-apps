import axios from "axios";
import { useEffect, useState } from "react";

// cache key and TTL (ms)
const CACHE_KEY = "apps_cache_v1";
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

const readCache = () => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.ts || !parsed.data) return null;
    if (Date.now() - parsed.ts > CACHE_TTL) return null;
    return parsed.data;
  } catch {
    return null;
  }
};

const writeCache = (data) => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    // ignore storage failures
  }
};

const useApps = () => {
  const [apps, setApps] = useState(() => readCache() || []);
  const [loading, setLoading] = useState(apps.length === 0);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const doFetch = async () => {
      setLoading(true);
      try {
        const res = await axios("/data.json");
        if (!mounted) {
          // component unmounted - no-op
        } else {
          setApps(next);
          writeCache(next);
        }
        const next = res.data || [];
        setApps(next);
        writeCache(next);
      } catch (err) {
        if (!mounted) {
          // ignore
        } else {
          setError(err);
        }
      } finally {
        if (!mounted) {
          // ignore
        } else {
          setLoading(false);
        }
      }
    };

    // If we have cached apps, return them immediately and refresh in background
    const cached = readCache();
    if (cached && cached.length > 0) {
      setApps(cached);
      // refresh in background but don't force loading state for immediate performance
      (async () => {
        try {
          const res = await axios("/data.json");
          if (!mounted) {
            // ignore
          } else {
            const next = res.data || [];
            // update only if different length or first item changed (cheap heuristic)
            if (
              next.length !== (cached || []).length ||
              (next[0] && cached[0] && next[0].id !== cached[0].id)
            ) {
              setApps(next);
              writeCache(next);
            }
          }
        } catch {
          // ignore background refresh errors
        }
      })();
    } else {
      doFetch();
    }

    return () => {
      mounted = false;
    };
  }, []);

  return { apps, loading, error };
};

export default useApps;
