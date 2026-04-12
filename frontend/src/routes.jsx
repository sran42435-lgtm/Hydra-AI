// =========================================
// HYDRA ROUTING SYSTEM
// FILE: routes.jsx
// =========================================

// =========================================
// CORE IMPORTS
// =========================================
import React, { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// =========================================
// LAZY LOAD PAGES (PERFORMANCE)
// =========================================
const ChatPage = lazy(() => import("./pages/chat_page"));
const SettingsPage = lazy(() => import("./pages/settings_page"));
const HistoryPage = lazy(() => import("./pages/history_page"));

// =========================================
// OPTIONAL: SIMPLE ROUTE GUARD
// =========================================
const ProtectedRoute = ({ children }) => {
  /**
   * RULE:
   * - Tidak boleh logic kompleks
   * - Hanya check ringan
   */

  const isAuthenticated = checkAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// =========================================
// SIMPLE AUTH CHECK (LIGHT ONLY)
// =========================================
const checkAuth = () => {
  try {
    const token = localStorage.getItem("hydra_token");
    return !!token;
  } catch (error) {
    console.warn("Auth check failed");
    return false;
  }
};

// =========================================
// ROUTES COMPONENT
// =========================================
const AppRoutes = () => {
  return (
    <Routes>

      {/* ========================================= */}
      {/* MAIN CHAT ROUTE */}
      {/* ========================================= */}
      <Route path="/" element={<ChatPage />} />

      {/* ========================================= */}
      {/* HISTORY ROUTE */}
      {/* ========================================= */}
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        }
      />

      {/* ========================================= */}
      {/* SETTINGS ROUTE */}
      {/* ========================================= */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* ========================================= */}
      {/* FALLBACK ROUTE */}
      {/* ========================================= */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};

// =========================================
// EXPORT
// =========================================
export default AppRoutes;

// =========================================
// NOTES:
// - Tidak ada API call
// - Tidak ada state kompleks
// - Hanya mapping route → page
// =========================================
// =========================================
// OPTIONAL: GLOBAL LAYOUT WRAPPER
// =========================================
const AppLayout = ({ children }) => {
  /**
   * Tujuan:
   * - Wrapper global (header, sidebar, dll)
   * - Tidak boleh logic berat
   */

  return (
    <div style={layoutStyles.container}>
      {/* HEADER (future optional) */}
      <div style={layoutStyles.header}>
        <h3 style={layoutStyles.logo}>Hydra</h3>
      </div>

      {/* MAIN CONTENT */}
      <div style={layoutStyles.content}>
        {children}
      </div>
    </div>
  );
};

// =========================================
// LAYOUT STYLES (MINIMAL)
// =========================================
const layoutStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    background: "#0a0a0a",
    color: "#fff"
  },
  header: {
    height: "50px",
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    borderBottom: "1px solid #1a1a1a"
  },
  logo: {
    margin: 0,
    fontSize: "16px"
  },
  content: {
    flex: 1,
    overflow: "hidden"
  }
};

// =========================================
// EXTENDED ROUTES (WITH LAYOUT)
// =========================================
const WrappedRoutes = () => {
  return (
    <AppLayout>
      <AppRoutes />
    </AppLayout>
  );
};

// =========================================
// OPTIONAL: ROUTE CONFIG (SCALABLE)
// =========================================
/**
 * Ini untuk masa depan:
 * Bisa dipakai untuk dynamic routing
 */
export const routeConfig = [
  {
    path: "/",
    component: "ChatPage",
    protected: false
  },
  {
    path: "/history",
    component: "HistoryPage",
    protected: true
  },
  {
    path: "/settings",
    component: "SettingsPage",
    protected: true
  }
];

// =========================================
// OPTIONAL: NAVIGATION HELPER
// =========================================
export const navigationItems = [
  {
    label: "Chat",
    path: "/"
  },
  {
    label: "History",
    path: "/history"
  },
  {
    label: "Settings",
    path: "/settings"
  }
];

// =========================================
// OPTIONAL: FUTURE EXTENSION POINT
// =========================================

// Contoh pengembangan:
// - Role-based routing
// - Feature flag routing
// - A/B testing route
// - Dynamic module loading

// =========================================
// FINAL EXPORT OVERRIDE (SCALABLE)
// =========================================
export { WrappedRoutes };

// =========================================
// SCALING NOTES:
//
// - Routing tetap clean walau page bertambah
// - Mudah tambah route tanpa ubah struktur
// - Siap untuk SaaS multi-feature
// =========================================

// =========================================
// END OF FILE
// =========================================
