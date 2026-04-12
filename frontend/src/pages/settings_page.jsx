// ======================================================
// 📁 FILE: frontend/src/pages/settings_page.jsx
// 🧩 PART 1 — STRUCTURE, STATE, HANDLER DASAR
// ======================================================

import React, { useState, useEffect, useCallback } from "react";

// UI Components (GLOBAL UI ONLY)
import Button from "../components/ui/button.jsx";
import Modal from "../components/ui/modal.jsx";
import Loader from "../components/ui/loader.jsx";
import Toast from "../components/ui/toast.jsx";

// Store (GLOBAL STATE - LIGHT ONLY)
import { useSessionStore } from "../store/session_store.js";

// Hooks (ABSTRACTION LAYER)
import { useSettings } from "../hooks/use_settings.js";

// ======================================================
// 🧠 SETTINGS PAGE COMPONENT
// ======================================================

const SettingsPage = () => {
  // ==================================================
  // 🧠 LOCAL STATE (RINGAN SAJA)
  // ==================================================

  const [isSaving, setIsSaving] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // ==================================================
  // 🌐 GLOBAL STATE (SESSION / CONFIG)
  // ==================================================

  const { user } = useSessionStore();

  // ==================================================
  // ⚙️ SETTINGS HOOK (CORE LOGIC BRIDGE)
  // ==================================================

  const {
    settings,
    updateSetting,
    resetSettings,
    loadSettings,
  } = useSettings();

  // ==================================================
  // 🚀 INITIAL LOAD
  // ==================================================

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // ==================================================
  // 🎯 HANDLER — UPDATE SETTING
  // ==================================================

  const handleChange = useCallback((key, value) => {
    if (value === undefined || value === null) return;

    updateSetting(key, value);
  }, [updateSetting]);

  // ==================================================
  // 🎯 HANDLER — SAVE SETTINGS (ASYNC)
  // ==================================================

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Simulasi async save (tidak langsung backend berat)
      await new Promise((resolve) => setTimeout(resolve, 500));

      setToastMessage("Settings berhasil disimpan");
    } catch (error) {
      setToastMessage("Gagal menyimpan settings");
    } finally {
      setIsSaving(false);
    }
  };

  // ==================================================
  // 🎯 HANDLER — RESET SETTINGS
  // ==================================================

  const handleResetConfirm = () => {
    resetSettings();
    setShowResetModal(false);
    setToastMessage("Settings direset");
  };

  // ==================================================
  // 🧩 RENDER SECTION — UI ONLY (NO LOGIC BERAT)
  // ======================================================

  return (
    <div className="settings-page-container">
      <h1 className="settings-title">Settings</h1>

      {/* USER INFO */}
      <div className="settings-section">
        <h2>User</h2>
        <p>{user?.name || "Guest"}</p>
      </div>

      {/* THEME SETTING */}
      <div className="settings-section">
        <h2>Theme</h2>

        <select
          value={settings.theme}
          onChange={(e) => handleChange("theme", e.target.value)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
