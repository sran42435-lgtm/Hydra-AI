// =========================================
// HYDRA FRONTEND ROOT CONTROLLER
// FILE: app.jsx
// =========================================

// =========================================
// CORE IMPORTS
// =========================================
import React, { useEffect, useState, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";

// =========================================
// ROUTES
// =========================================
import AppRoutes from "./routes";

// =========================================
// GLOBAL STORE (STATE MANAGEMENT)
// =========================================
import { ChatStoreProvider } from "../store/chat_store";
import { SessionStoreProvider } from "../store/session_store";
import { MemoryStoreProvider } from "../store/memory_store";
import { HistoryStoreProvider } from "../store/history_store";

// =========================================
// GLOBAL UI
// =========================================
import ErrorBoundary from "./components/ui/error_boundary";
import Loader from "./components/ui/loader";

// =========================================
// GLOBAL STYLES (OPTIONAL SAFE IMPORT)
// =========================================
import "../styles/main.css";
import "../styles/theme.css";

// =========================================
// APP ROOT COMPONENT
// =========================================
const App = () => {
  // =========================================
  // GLOBAL APP STATE (VERY MINIMAL)
  // =========================================
  const [isAppReady, setIsAppReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  // =========================================
  // INITIAL APP BOOTSTRAP
  // =========================================
  useEffect(() => {
    try {
      /**
       * Tujuan:
       * - Restore session ringan
       * - Setup config awal
       * - Tidak boleh berat
       */

      initializeApp();

    } catch (error) {
      console.error("App Initialization Error:", error);
      setHasError(true);
    }
  }, []);

  // =========================================
  // INITIALIZATION FUNCTION
  // =========================================
  const initializeApp = async () => {
    try {
      /**
       * RULE:
       * - Tidak boleh API kompleks
       * - Hanya init ringan
       */

      // Simulasi delay kecil (UX smooth)
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Tandai app siap
      setIsAppReady(true);

    } catch (error) {
      setHasError(true);
    }
  };

  // =========================================
  // ERROR FALLBACK
  // =========================================
  if (hasError) {
    return (
      <div style={styles.errorContainer}>
        <h2>Hydra mengalami kesalahan</h2>
        <p>Silakan refresh halaman</p>
      </div>
    );
  }

  // =========================================
  // LOADING STATE
  // =========================================
  if (!isAppReady) {
    return (
      <div style={styles.loaderContainer}>
        <Loader />
      </div>
    );
  }

  // =========================================
  // MAIN RENDER
  // =========================================
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <SessionStoreProvider>
          <ChatStoreProvider>
            <MemoryStoreProvider>
              <HistoryStoreProvider>

                {/* Suspense untuk lazy loading */}
                <Suspense fallback={<Loader />}>

                  {/* ROUTES ENTRY */}
                  <AppRoutes />

                </Suspense>

              </HistoryStoreProvider>
            </MemoryStoreProvider>
          </ChatStoreProvider>
        </SessionStoreProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

// =========================================
// GLOBAL STYLES (INLINE MINIMAL ONLY)
// =========================================
const styles = {
  loaderContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#0a0a0a"
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#0a0a0a",
    color: "#fff"
  }
};

// =========================================
// EXPORT
// =========================================
export default App;

// =========================================
// NOTES:
// - Tidak ada logic fitur
// - Tidak ada API call kompleks
// - Semua orchestration saja
// =========================================
// =========================================
// ADVANCED LIFECYCLE & PERFORMANCE GUARD
// =========================================

// =========================================
// SAFE GLOBAL EFFECT (RUN ONCE)
// =========================================
useEffect(() => {
  /**
   * Tujuan:
   * - Global event setup (ringan saja)
   * - Tidak boleh heavy logic
   */

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      // Bisa digunakan untuk pause task ringan
      console.debug("App hidden");
    } else {
      console.debug("App visible");
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}, []);

// =========================================
// WINDOW ERROR HANDLER (GLOBAL SAFETY)
// =========================================
useEffect(() => {
  const handleGlobalError = (event) => {
    console.error("Global Error:", event.message);
  };

  const handleUnhandledRejection = (event) => {
    console.error("Unhandled Promise Rejection:", event.reason);
  };

  window.addEventListener("error", handleGlobalError);
  window.addEventListener("unhandledrejection", handleUnhandledRejection);

  return () => {
    window.removeEventListener("error", handleGlobalError);
    window.removeEventListener("unhandledrejection", handleUnhandledRejection);
  };
}, []);

// =========================================
// PERFORMANCE MARKING (OPTIONAL)
// =========================================
useEffect(() => {
  if (window.performance) {
    performance.mark("app-mounted");

    setTimeout(() => {
      performance.measure("app-ready", "navigationStart", "app-mounted");
    }, 0);
  }
}, []);

// =========================================
// HYDRATION SAFETY CHECK
// =========================================
useEffect(() => {
  /**
   * Mencegah mismatch antara HTML & React
   */
  const root = document.getElementById("root");

  if (!root) {
    console.warn("Root element not found!");
    setHasError(true);
  }
}, []);

// =========================================
// OPTIONAL: THEME INIT (LIGHT/DARK MODE)
// =========================================
useEffect(() => {
  try {
    const savedTheme = localStorage.getItem("hydra_theme");

    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  } catch (error) {
    console.warn("Theme init failed:", error);
  }
}, []);

// =========================================
// OPTIONAL: SESSION RESTORE (SAFE VERSION)
// =========================================
useEffect(() => {
  /**
   * Hanya restore ringan
   * Tidak fetch data berat
   */
  try {
    const session = localStorage.getItem("hydra_session");

    if (session) {
      console.debug("Session restored (light)");
    }
  } catch (error) {
    console.warn("Session restore failed");
  }
}, []);

// =========================================
// DEBUG MODE (DEV ONLY)
// =========================================
if (import.meta && import.meta.env && import.meta.env.DEV) {
  console.debug("Hydra App running in DEV mode");
}

// =========================================
// STRICT MODE WRAPPER (OPTIONAL)
// =========================================
const RootWrapper = ({ children }) => {
  return (
    <React.StrictMode>
      {children}
    </React.StrictMode>
  );
};

// =========================================
// FINAL EXPORT WRAPPED
// =========================================
const WrappedApp = () => {
  return (
    <RootWrapper>
      <App />
    </RootWrapper>
  );
};

export { WrappedApp };

// =========================================
// SCALING NOTES:
//
// - Semua feature logic tetap di luar
// - App tetap ringan walau sistem besar
// - Aman untuk SaaS scale
// =========================================

// =========================================
// FUTURE EXTENSION POINT (DO NOT TOUCH)
// =========================================

// Example (comment only):
// - Feature Flag Provider
// - A/B Testing Wrapper
// - Analytics Provider
// - WebSocket Global Handler

// =========================================
// END OF FILE
// =========================================
