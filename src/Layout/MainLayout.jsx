import { useEffect, useState } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import Footer from "../components/Footer";
import LoeadingSpiner from "../components/LoeadingSpiner";
import NavBar from "../components/NavBar";

const MainLayout = () => {
  const navigation = useNavigation();
  const [showSpinner, setShowSpinner] = useState(false);

  // TUNABLE CONSTANTS — change these to adjust behavior
  const SPINNER_DELAY_MS = 150; // delay before showing overlay (100-200ms recommended)
  const OVERLAY_OPACITY = 0.6; // overlay opacity (0-1)
  const FADE_DURATION_MS = 200; // fade transition duration in ms

  // small delay to avoid flicker on fast navigations
  useEffect(() => {
    let t = null;
    if (navigation.state === "loading") {
      t = setTimeout(() => setShowSpinner(true), SPINNER_DELAY_MS);
    } else {
      // hide immediately when not loading
      setShowSpinner(false);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [navigation.state]);

  // choose spinner variant based on target path (best-effort)
  const targetPath = navigation.location?.pathname || "";
  let variant = "spinner";
  let size = "md";
  if (targetPath.startsWith("/apps/")) {
    // app details — show larger spinner
    size = "lg";
  } else if (targetPath === "/apps") {
    // apps list — show top bar instead
    variant = "bar";
  }

  return (
    <div>
      <NavBar />
      <div>
        {/* Show overlay spinner when navigating and delayed show is active */}
        {showSpinner && navigation.state === "loading" ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
            style={{
              backgroundColor: `rgba(255,255,255,${OVERLAY_OPACITY})`,
              transition: `opacity ${FADE_DURATION_MS}ms ease`,
            }}
          >
            {variant === "bar" ? (
              <div className="absolute top-0 left-0 right-0">
                {/* animated indeterminate bar */}
                <div className="h-1 bg-transparent overflow-hidden">
                  <div className="h-1 bg-indigo-600 w-1/3 animate-pulse" />
                </div>
              </div>
            ) : (
              <LoeadingSpiner size={size} />
            )}
          </div>
        ) : (
          <Outlet />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
