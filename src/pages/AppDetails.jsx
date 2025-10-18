import React, { useEffect, useState } from "react";
import { AiOutlineDownload } from "react-icons/ai";
import { FaRegComments } from "react-icons/fa";
import { IoIosStarHalf } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// local formatNumber implementation is used below

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const formatNumber = (n) => {
  if (n == null) return "";
  const num = Number(n);
  if (Number.isNaN(num)) return n;
  if (num >= 1_000_000) {
    let v = (num / 1_000_000).toFixed(1);
    if (v.endsWith(".0")) v = v.slice(0, -2);
    return `${v}M`;
  }
  if (num >= 1_000) {
    let v = (num / 1_000).toFixed(1);
    if (v.endsWith(".0")) v = v.slice(0, -2);
    return `${v}K`;
  }
  return String(num);
};

// Local error boundary to prevent router-level ErrorPage from replacing this view
class LocalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, lastChildrenSnapshot: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // keep a lightweight console record but don't escalate
    console.warn("LocalErrorBoundary caught an error", error, info);
  }

  componentDidUpdate(prevProps) {
    // when there's no error, keep a snapshot of the last good children
    if (!this.state.hasError && this.props.children !== prevProps.children) {
      try {
        this.setState({ lastChildrenSnapshot: this.props.children });
      } catch {
        // ignore snapshot failures
      }
    }
  }

  reset = () => {
    this.setState({ hasError: false });
    if (typeof this.props.onReset === "function") this.props.onReset();
  };

  renderFallbackBanner() {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-700">
              Something went wrong
            </p>
            <p className="text-xs text-red-600">
              We hit an error showing part of this app. You can continue using
              the page.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={this.reset}
              className="px-3 py-1 bg-amber-500 text-white rounded text-sm"
            >
              Retry
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-3 py-1 bg-gray-200 rounded text-sm"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      // Render last known good children (if available) and a small banner instead of a full-page takeover
      return (
        <div>
          {this.state.lastChildrenSnapshot || (
            <div className="py-8 text-center">An error occurred</div>
          )}
          <div className="px-6 lg:px-28 mt-4">
            {this.renderFallbackBanner()}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [installed, setInstalled] = useState(false);
  const [persisted, setPersisted] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/data.json")
      .then((r) => r.json())
      .then((data) => {
        const found = data.find((a) => String(a.id) === String(id));
        setApp(found || null);
      })
      .catch(() => setApp(null))
      .finally(() => setLoading(false));
  }, [id]);

  // check if this app is already installed (persistent)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("installedApps");
      if (raw) {
        const parsed = JSON.parse(raw) || [];
        const exists = parsed.some((p) => String(p.id) === String(id));
        if (exists) setInstalled(true);
        // if the app exists in persisted storage, mark persisted
        if (exists) setPersisted(true);
      }
    } catch (err) {
      console.warn("failed to read installedApps", err);
    }

    // keep installed state in sync if uninstall happens elsewhere
    const handler = (e) => {
      try {
        const next =
          e?.detail ||
          JSON.parse(localStorage.getItem("installedApps") || "[]");
        const exists = (next || []).some((p) => String(p.id) === String(id));
        setInstalled(Boolean(exists));
        setPersisted(Boolean(exists));
      } catch (err) {
        console.warn("installedAppsUpdated handler error", err);
      }
    };
    window.addEventListener("installedAppsUpdated", handler);
    // also listen to storage events for cross-tab sync
    const onStorage = (e) => {
      if (e.key === "installedApps") {
        try {
          const next = JSON.parse(e.newValue || "[]");
          const exists = (next || []).some((p) => String(p.id) === String(id));
          setInstalled(Boolean(exists));
          setPersisted(Boolean(exists));
        } catch (err) {
          console.warn("installedApps storage event parse error", err);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("installedAppsUpdated", handler);
    // cleanup storage listener as well
    // note: returning a single cleanup closure is fine; but we already returned above, so attach another
  }, [id]);

  // separate effect to cleanup storage listener (keeps things explicit)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "installedApps") {
        try {
          const next = JSON.parse(e.newValue || "[]");
          const exists = (next || []).some((p) => String(p.id) === String(id));
          setInstalled(Boolean(exists));
          setPersisted(Boolean(exists));
        } catch (err) {
          console.warn("installedApps storage event parse error", err);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [id]);

  // avoid accessing app before it's loaded

  const handleInstall = async () => {
    if (!app) return false;

    try {
      const raw = localStorage.getItem("installedApps");
      let parsed = [];
      try {
        parsed = raw ? JSON.parse(raw) : [];
      } catch (parseErr) {
        // If parse fails, reset to empty array (don't throw)
        parsed = [];
        console.warn(
          "installedApps parse failed, resetting to empty",
          parseErr
        );
      }

      const exists = (parsed || []).some(
        (p) => String(p.id) === String(app.id)
      );
      if (!exists) {
        const next = [...(parsed || []), app];
        try {
          localStorage.setItem("installedApps", JSON.stringify(next));
          setPersisted(true);
        } catch (storageErr) {
          // storage write failed; swallow and continue with local state
          console.warn("localStorage.setItem failed", storageErr);
          setPersisted(false);
        }
      } else {
        // already exists in storage
        setPersisted(true);
      }

      // update state and notify user
      setInstalled(true);
      toast.success(`${app.title} installed successfully`);

      // notify other tabs/components (best-effort)
      try {
        const detail = (() => {
          try {
            return JSON.parse(localStorage.getItem("installedApps") || "[]");
          } catch {
            return parsed || [];
          }
        })();
        const ev = new CustomEvent("installedAppsUpdated", { detail });
        window.dispatchEvent(ev);
      } catch (evErr) {
        // ignore event dispatch errors
        console.warn("failed to dispatch installedAppsUpdated", evErr);
      }

      return true;
    } catch (err) {
      // final fallback: ensure we don't throw
      console.error("unexpected install error", err);
      try {
        setInstalled(true);
        setPersisted(false);
        toast.info(`${app.title} marked installed (local only)`);
      } catch (sErr) {
        console.warn(
          "failed to update installed state after install error",
          sErr
        );
      }
      return false;
    }
  };

  if (loading) return <div className="py-20 text-center">Loading...</div>;

  // prepare chart data sorted in descending order so bars show largest -> smallest
  const chartData = (app?.ratings || [])
    .map((r) => ({ name: r.name, count: r.count }))
    .sort((a, b) => (b.count || 0) - (a.count || 0));

  return (
    <LocalErrorBoundary
      onReset={() => {
        /* no-op */
      }}
    >
      {!app ? (
        <div className="py-20 text-center">
          <h2 className="text-2xl font-semibold mb-2">App not found</h2>
          <p className="text-gray-600 mb-4">
            We couldn't find the app you're looking for.
          </p>
          <div className="flex items-center gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-2 bg-gray-200 rounded"
            >
              Go back
            </button>
            <button
              onClick={() => navigate("/apps")}
              className="px-3 py-2 bg-amber-500 text-white rounded"
            >
              Browse Apps
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-3 py-2 bg-white border rounded"
            >
              Home
            </button>
          </div>
        </div>
      ) : (
        <div className="px-6 lg:px-28 py-10">
          <ToastContainer />
          <div className="flex gap-6 items-center">
            <img
              src={app.image}
              alt={app.title}
              className="w-58 h-58 object-cover rounded-lg shadow"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold leading-tight mb-2">
                {app.title}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Developed by{" "}
                <span className="text-blue-800 font-semibold">
                  {app.companyName}
                </span>
              </p>
              <hr className="my-4 border-t border-gray-200" />

              <div className="flex items-center gap-10 mt-2">
                <div className="flex flex-col gap-2">
                  <AiOutlineDownload className="text-xl text-green-600" />
                  <span className="text-xs text-gray-500">Downloads</span>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">
                      {formatNumber(app.downloads)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <IoIosStarHalf className="text-xl text-yellow-500" />
                  <span className="text-xs text-gray-500">Average Rating</span>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">{app.ratingAvg}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <FaRegComments className="text-xl text-blue-500" />
                  <span className="text-xs text-gray-500">Total Reviews</span>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">
                      {formatNumber(app.reviews)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.preventDefault();
                      // show a transient installing toast; handleInstall will show success/fallback
                      let infoId = null;
                      try {
                        infoId = toast.info("Installing...", {
                          autoClose: false,
                        });
                      } catch (tErr) {
                        // ignore toast creation errors
                        console.warn("toast.info failed", tErr);
                      }
                      try {
                        await handleInstall();
                      } catch (err) {
                        // swallow any unexpected errors so router error boundary isn't triggered
                        console.error("install button handler error", err);
                        try {
                          toast.error("Failed to install the app");
                        } catch {
                          // intentionally ignore toast failures
                        }
                      } finally {
                        try {
                          if (infoId != null) toast.dismiss(infoId);
                        } catch {
                          // ignore dismiss errors
                        }
                      }
                    }}
                    disabled={installed}
                    className={`px-4 py-2 rounded-md ${
                      installed
                        ? "bg-gray-300 text-gray-600"
                        : "bg-green-600 text-white"
                    }`}
                  >
                    {installed
                      ? "Installed"
                      : `Install Now (${formatNumber(app.size)}MB)`}
                  </button>
                  {/* persisted badge: only show when data is persisted */}
                  {persisted && (
                    <span className="items-center px-2 py-1 text-xs rounded bg-green-100 text-green-800 hidden">
                      Persisted
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Ratings</h3>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    // give left margin a negative offset so the bars visually start under the 'Ratings' heading
                    margin={{ top: 5, right: 20, left: -50, bottom: 5 }}
                    barGap={20}
                    barCategoryGap={40}
                  >
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#FF8811" barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <hr className="my-4 border-t border-gray-200" />
          <h3 className="text-lg font-semibold mt-6 mb-3">Description</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {app.description}
          </p>
        </div>
      )}
    </LocalErrorBoundary>
  );

  // removed duplicate JSX block; chartData is defined above and used inside the LocalErrorBoundary's JSX
};

export default AppDetails;
