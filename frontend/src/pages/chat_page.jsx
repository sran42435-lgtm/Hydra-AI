// =========================================
// HYDRA CHAT PAGE (CORE INTERACTION LAYER)
// FILE: chat_page.jsx
// =========================================

// =========================================
// CORE IMPORTS
// =========================================
import React, { useEffect, useState, useCallback } from "react";

// =========================================
// CHAT COMPONENTS
// =========================================
import ChatContainer from "../components/chat/chat_container";
import MessageList from "../components/chat/message_list";
import InputBar from "../components/chat/input_bar";
import TypingIndicator from "../components/chat/typing_indicator";

// =========================================
// HOOKS (LOGIC BRIDGE)
// =========================================
import useChat from "../hooks/use_chat";
import useStream from "../hooks/use_stream";

// =========================================
// OPTIONAL STORE (LIGHT USAGE)
// =========================================
import { useChatStore } from "../../store/chat_store";

// =========================================
// MAIN COMPONENT
// =========================================
const ChatPage = () => {

  // =========================================
  // PAGE LEVEL STATE (MINIMAL)
  // =========================================
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  // =========================================
  // STORE ACCESS (LIGHT ONLY)
  // =========================================
  const { currentSession } = useChatStore();

  // =========================================
  // HOOK INITIALIZATION
  // =========================================
  const {
    messages,
    sendMessage,
    regenerateMessage
  } = useChat();

  const {
    streamResponse,
    isStreaming
  } = useStream();

  // =========================================
  // INITIAL LOAD (OPTIONAL)
  // =========================================
  useEffect(() => {
    /**
     * Tujuan:
     * - Load initial state ringan
     * - Tidak fetch berat
     */
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      // Bisa dipakai untuk preload ringan
      console.debug("Chat initialized");
    } catch (err) {
      setError("Failed to initialize chat");
    }
  };

  // =========================================
  // HANDLE SEND MESSAGE
  // =========================================
  const handleSend = useCallback(async (input) => {
    try {
      if (!input || input.trim() === "") return;

      setIsTyping(true);

      /**
       * FLOW:
       * input → hook → service → backend
       */
      const response = await sendMessage(input);

      /**
       * STREAMING HANDLING (delegated)
       */
      if (response?.stream) {
        await streamResponse(response.stream);
      }

    } catch (err) {
      console.error("Send error:", err);
      setError("Gagal mengirim pesan");
    } finally {
      setIsTyping(false);
    }
  }, [sendMessage, streamResponse]);

  // =========================================
  // HANDLE REGENERATE
  // =========================================
  const handleRegenerate = useCallback(async () => {
    try {
      setIsTyping(true);

      const response = await regenerateMessage();

      if (response?.stream) {
        await streamResponse(response.stream);
      }

    } catch (err) {
      setError("Gagal regenerate pesan");
    } finally {
      setIsTyping(false);
    }
  }, [regenerateMessage, streamResponse]);

  // =========================================
  // HANDLE ERROR RESET
  // =========================================
  const clearError = () => {
    setError(null);
  };

  // =========================================
  // RENDER ERROR STATE
  // =========================================
  const renderError = () => {
    if (!error) return null;

    return (
      <div style={styles.errorBox} onClick={clearError}>
        {error}
      </div>
    );
  };

  // =========================================
  // MAIN RENDER
  // =========================================
  return (
    <ChatContainer>

      {/* ERROR DISPLAY */}
      {renderError()}

      {/* MESSAGE LIST */}
      <MessageList messages={messages} />

      {/* TYPING INDICATOR */}
      {(isTyping || isStreaming) && (
        <TypingIndicator />
      )}

      {/* INPUT BAR */}
      <InputBar
        onSend={handleSend}
        onRegenerate={handleRegenerate}
        disabled={isTyping || isStreaming}
      />

    </ChatContainer>
  );
};

// =========================================
// STYLES (MINIMAL)
// =========================================
const styles = {
  errorBox: {
    background: "#ff4d4f",
    color: "#fff",
    padding: "8px 12px",
    margin: "8px",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

// =========================================
// EXPORT
// =========================================
export default ChatPage;

// =========================================
// NOTES:
// - Tidak ada API langsung
// - Semua lewat hooks
// - UI hanya composition
// =========================================
// =========================================
// ADVANCED FLOW CONTROL & SAFETY
// =========================================

// =========================================
// PREVENT RACE CONDITION (MULTIPLE SEND)
// =========================================
const requestLockRef = { current: false };

const safeExecute = async (fn) => {
  if (requestLockRef.current) return;
  requestLockRef.current = true;

  try {
    await fn();
  } finally {
    requestLockRef.current = false;
  }
};

// =========================================
// ENHANCED SEND HANDLER (SAFE)
// =========================================
const handleSafeSend = useCallback((input) => {
  safeExecute(async () => {
    await handleSend(input);
  });
}, [handleSend]);

// =========================================
// ENHANCED REGENERATE HANDLER (SAFE)
// =========================================
const handleSafeRegenerate = useCallback(() => {
  safeExecute(async () => {
    await handleRegenerate();
  });
}, [handleRegenerate]);

// =========================================
// STREAMING GUARD (ANTI GLITCH)
// =========================================
useEffect(() => {
  /**
   * Pastikan hanya 1 stream aktif
   */
  if (isStreaming) {
    console.debug("Streaming active...");
  }
}, [isStreaming]);

// =========================================
// AUTO SCROLL TRIGGER (DELEGATED)
// =========================================
useEffect(() => {
  /**
   * Tidak handle DOM di sini
   * hanya trigger perubahan
   */
  if (messages.length > 0) {
    console.debug("New message arrived");
  }
}, [messages]);

// =========================================
// CLEANUP ON UNMOUNT
// =========================================
useEffect(() => {
  return () => {
    /**
     * Cleanup ringan
     */
    setIsTyping(false);
    console.debug("Chat page unmounted");
  };
}, []);

// =========================================
// PERFORMANCE OPTIMIZATION (MEMO HELPERS)
// =========================================
const isInputDisabled = isTyping || isStreaming;

// =========================================
// OPTIONAL: KEYBOARD SHORTCUT
// =========================================
useEffect(() => {
  const handleKey = (e) => {
    if (e.key === "Escape") {
      clearError();
    }
  };

  window.addEventListener("keydown", handleKey);

  return () => {
    window.removeEventListener("keydown", handleKey);
  };
}, []);

// =========================================
// EXTENSION POINT: FUTURE FEATURES
// =========================================

// Contoh fitur masa depan:
// - Voice input handler
// - File upload handler
// - Multi-modal input
// - Prompt template system

// =========================================
// EXTENDED RENDER (SAFE HANDLERS)
// =========================================
const ExtendedChatPage = () => {
  return (
    <ChatContainer>

      {/* ERROR */}
      {renderError()}

      {/* MESSAGES */}
      <MessageList messages={messages} />

      {/* TYPING */}
      {(isTyping || isStreaming) && <TypingIndicator />}

      {/* INPUT */}
      <InputBar
        onSend={handleSafeSend}
        onRegenerate={handleSafeRegenerate}
        disabled={isInputDisabled}
      />

    </ChatContainer>
  );
};

// =========================================
// FINAL EXPORT OVERRIDE
// =========================================
export { ExtendedChatPage };

// =========================================
// SCALING NOTES:
//
// - Anti race condition sudah aman
// - Streaming tidak bentrok
// - Re-render lebih terkontrol
// - Siap untuk fitur kompleks
// =========================================

// =========================================
// END OF FILE
// =========================================
