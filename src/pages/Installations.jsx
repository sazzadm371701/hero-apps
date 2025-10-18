import { useEffect, useRef, useState } from "react";
import { AiOutlineDownload } from "react-icons/ai";
import { IoIosStarHalf } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatNumber } from "../utils/formatNumber";

const Installations = () => {
  const [installedApps, setInstalledApps] = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const [sortKey, setSortKey] = useState("size");
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' or 'desc'
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("installedApps");
      if (raw) {
        const parsed = JSON.parse(raw);
        setInstalledApps(parsed || []);
      }
    } catch {
      console.warn("failed to read installedApps");
    }
    // keep in sync across browser tabs/windows
    const onStorage = (e) => {
      if (e.key === "installedApps") {
        try {
          const next = JSON.parse(e.newValue || "[]");
          setInstalledApps(next || []);
        } catch {
          console.warn("failed to parse installedApps from storage event");
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // close sort dropdown on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (!sortRef.current) return;
      try {
        if (!sortRef.current.contains(e.target)) setSortOpen(false);
      } catch {
        // ignore
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const handleUninstall = (appId) => {
    // capture the removed app to allow undo
    let removedApp = null;
    setInstalledApps((prev) => {
      const next = prev.filter((p) => {
        if (String(p.id) === String(appId)) {
          removedApp = p;
          return false;
        }
        return true;
      });
      try {
        localStorage.setItem("installedApps", JSON.stringify(next));
      } catch (err) {
        console.warn("failed to save installedApps", err);
      }
      // dispatch a custom event so other open pages/components can react
      try {
        window.dispatchEvent(
          new CustomEvent("installedAppsUpdated", { detail: next })
        );
      } catch (e) {
        console.debug("could not dispatch installedAppsUpdated event", e);
      }
      console.log("uninstalled", appId, "next:", next);
      return next;
    });

    // show toast with undo action
    toast(
      ({ closeToast }) => (
        <div className="flex items-center justify-between">
          <span>App uninstalled</span>
          <button
            onClick={() => {
              if (!removedApp) return;
              setInstalledApps((prev) => {
                const exists = prev.some(
                  (p) => String(p.id) === String(removedApp.id)
                );
                const next = exists ? prev : [...(prev || []), removedApp];
                try {
                  localStorage.setItem("installedApps", JSON.stringify(next));
                } catch {
                  console.warn("failed to save installedApps on undo");
                }
                try {
                  window.dispatchEvent(
                    new CustomEvent("installedAppsUpdated", { detail: next })
                  );
                } catch {
                  console.debug(
                    "could not dispatch installedAppsUpdated event"
                  );
                }
                return next;
              });
              closeToast();
              toast.success(`${removedApp.title} restored`);
            }}
            className="ml-4 underline"
          >
            Undo
          </button>
        </div>
      ),
      { autoClose: 5000 }
    );
  };

  // always render the Installations section; show empty state if no apps
  return (
    <section className="mt-8 bg-gray-50 p-6 rounded">
      <ToastContainer />
      <div className="my-6 text-center">
        <h2 className="text-3xl font-semibold mb-2">Your Installed Apps</h2>
        <p className="text-sm text-gray-500">
          Explore all trending apps on the market developed by us
        </p>
      </div>
      <div className="flex items-start justify-between mb-4">
        <div className="w-full flex justify-between items-center gap-4">
          <div className="text-sm text-gray-700">
            {installedApps.length} Apps Found
          </div>
          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => setSortOpen((s) => !s)}
              aria-haspopup="menu"
              aria-expanded={sortOpen}
              className="border rounded px-3 py-2 text-sm bg-white flex items-center gap-2"
            >
              <span>Sort By Size</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {sortOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-md z-40">
                <div className="px-3 py-2 border-b text-sm text-gray-500">
                  ✓ Sort By Size
                </div>
                <button
                  onClick={() => {
                    setSortKey("size");
                    setSortOrder("asc");
                    setSortOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100"
                >
                  Low-High
                </button>
                <button
                  onClick={() => {
                    setSortKey("size");
                    setSortOrder("desc");
                    setSortOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100"
                >
                  High-Low
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {installedApps && installedApps.length > 0 ? (
          // create a sorted copy for rendering
          [...installedApps]
            .slice()
            .sort((x, y) => {
              const a = x;
              const b = y;
              let diff = 0;
              if (sortKey === "title") {
                diff = String(a.title || "").localeCompare(
                  String(b.title || "")
                );
              } else {
                // numeric fields
                const na = Number(a[sortKey] ?? 0);
                const nb = Number(b[sortKey] ?? 0);
                diff = na - nb;
              }
              return sortOrder === "asc" ? diff : -diff;
            })
            .map((a) => (
              <div
                key={a.id}
                className="flex items-center bg-white p-4 rounded shadow-sm w-full"
              >
                <div className="flex items-center flex-1">
                  <img
                    src={a.image}
                    alt={a.title}
                    className="w-12 h-12 rounded mr-4 object-cover shadow"
                  />
                  <div>
                    <div className="font-semibold text-sm">{a.title}</div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      <AiOutlineDownload className="text-green-600" />
                      <span>{formatNumber(a.downloads)}</span>
                      <span>•</span>
                      <IoIosStarHalf className="text-yellow-500" />
                      <span>{a.ratingAvg}</span>
                      <span>•</span>
                      <span>{formatNumber(a.size)} MB</span>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <button
                    type="button"
                    disabled={processingId === a.id}
                    onClick={(e) => {
                      // defensive: prevent any navigation from parent clickable containers
                      try {
                        e.preventDefault();
                      } catch (err) {
                        console.debug("preventDefault failed", err);
                      }
                      try {
                        e.stopPropagation();
                      } catch (err) {
                        console.debug("stopPropagation failed", err);
                      }
                      try {
                        e.nativeEvent &&
                          e.nativeEvent.stopImmediatePropagation &&
                          e.nativeEvent.stopImmediatePropagation();
                      } catch (err) {
                        console.debug("stopImmediatePropagation failed", err);
                      }

                      if (processingId === a.id) return;
                      setProcessingId(a.id);

                      // show transient 'Uninstalling...' toast while we perform the action
                      let infoId = null;
                      try {
                        infoId = toast.info("Uninstalling...", {
                          autoClose: false,
                        });
                      } catch {
                        console.warn("toast.info failed");
                      }

                      try {
                        const ok = window.confirm(`Uninstall ${a.title}?`);
                        if (ok) handleUninstall(a.id);
                      } catch {
                        console.error("uninstall click handler error");
                      } finally {
                        // small delay to ensure state updates propagate
                        setTimeout(() => setProcessingId(null), 200);
                        try {
                          if (infoId != null) toast.dismiss(infoId);
                        } catch {
                          /* ignore */
                        }
                      }
                    }}
                    className="px-3 py-1 bg-green-500 text-white rounded disabled:opacity-50"
                  >
                    Uninstall
                  </button>
                </div>
              </div>
            ))
        ) : (
          <div className="p-6 bg-white rounded">
            <p className="text-sm text-gray-600">No installed apps yet.</p>
            <p className="text-xs text-gray-500 mt-2">
              Go to an app details page and click Install to add apps here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Installations;
