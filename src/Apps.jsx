import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppCards from "./components/AppCards";
import useApps from "./Hooks/useApps";

const Apps = () => {
  const { apps, loading, error } = useApps();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // simple debounce for user typing
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    if (!debounced) return apps;
    const q = debounced.toLowerCase();
    return apps.filter((a) => (a.title || "").toLowerCase().includes(q));
  }, [apps, debounced]);

  // initialize query from url param q
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const q = params.get("q") || "";
      setQuery(q);
      setDebounced(q);
    } catch {
      // ignore
    }
  }, [location.search]);

  // keep url in sync with query (debounced)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (debounced) {
      params.set("q", debounced);
    } else {
      params.delete("q");
    }
    const next = params.toString();
    navigate(
      { pathname: location.pathname, search: next ? `?${next}` : "" },
      { replace: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  if (loading) return <div className="py-20 text-center">Loading apps...</div>;
  if (error)
    return (
      <div className="py-20 text-center text-red-500">Failed to load apps</div>
    );

  return (
    <div className="px-6 lg:px-28 py-10">
      <div className="flex flex-col gap-3 my-6">
        <h2 className="text-4xl font-semibold text-center">
          Our All Applications
        </h2>
        <p className="text-center text-gray-500">
          Explore All Apps on the Market developed by us. We code for Millions{" "}
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="text-xl text-black font-bold">
          <span className="font-semibold text-gray-700">
            ({filtered.length})
          </span>{" "}
          Apps Found
        </div>

        <div className="ml-4 flex justify-end w-full max-w-[220px]">
          <label htmlFor="app-search" className="sr-only">
            Search apps
          </label>
          <input
            id="app-search"
            type="search"
            placeholder="Search apps"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1629A1] focus:ring-offset-2 focus:ring-offset-white transition-shadow duration-150"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((app) => (
          <AppCards key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
};

export default Apps;
