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
// ======================================================
// 🧩 PART 2 — ADVANCED SETTINGS, MODAL, FINAL RENDER
// ======================================================

      {/* MODEL SELECTION */}
      <div className="settings-section">
        <h2>Model AI</h2>

        <select
          value={settings.model}
          onChange={(e) => handleChange("model", e.target.value)}
        >
          <option value="gpt-standard">Standard</option>
          <option value="gpt-advanced">Advanced</option>
          <option value="gpt-fast">Fast</option>
        </select>
      </div>

      {/* RESPONSE MODE */}
      <div className="settings-section">
        <h2>Response Mode</h2>

        <select
          value={settings.responseMode}
          onChange={(e) => handleChange("responseMode", e.target.value)}
        >
          <option value="balanced">Balanced</option>
          <option value="creative">Creative</option>
          <option value="precise">Precise</option>
        </select>
      </div>

      {/* FONT SIZE */}
      <div className="settings-section">
        <h2>Font Size</h2>

        <input
          type="range"
          min="12"
          max="22"
          value={settings.fontSize}
          onChange={(e) =>
            handleChange("fontSize", Number(e.target.value))
          }
        />
        <span>{settings.fontSize}px</span>
      </div>

      {/* ACTION BUTTONS */}
      <div className="settings-actions">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader /> : "Save Changes"}
        </Button>

        <Button
          variant="danger"
          onClick={() => setShowResetModal(true)}
        >
          Reset Settings
        </Button>
      </div>

      {/* RESET CONFIRM MODAL */}
      {showResetModal && (
        <Modal onClose={() => setShowResetModal(false)}>
          <div className="modal-content">
            <h3>Reset Settings?</h3>
            <p>Semua konfigurasi akan kembali ke default.</p>

            <div className="modal-actions">
              <Button onClick={handleResetConfirm}>
                Ya, Reset
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowResetModal(false)}
              >
                Batal
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

// ======================================================
// 🚀 EXPORT
// ======================================================

export default SettingsPage;
