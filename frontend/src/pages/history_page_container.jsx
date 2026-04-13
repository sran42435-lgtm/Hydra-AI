// ======================================================
// 📁 FILE: frontend/src/pages/history_page.jsx
// 🧩 PART 1 — STRUCTURE, STATE, BASIC FLOW
// ======================================================

import React, { useEffect, useState, useCallback } from "react";

// ======================================================
// 📦 COMPONENTS (HISTORY UI LAYER)
// ======================================================

import ChatHistory from "../components/history/chat_history.jsx";
import ChatSearch from "../components/history/chat_search.jsx";
import ChatFilter from "../components/history/chat_filter.jsx";

// ======================================================
// 🧠 HOOKS (LOGIC BRIDGE)
// ======================================================

import { useHistory } from "../hooks/use_history.js";

// ======================================================
// 🗂️ STORE (LIGHT CACHE)
// ======================================================

import { useHistoryStore } from "../store/history_store.js";

// ======================================================
// 🧠 HISTORY PAGE COMPONENT
// ======================================================

const HistoryPage = () => {
  // ==================================================
  // 🧠 LOCAL STATE (PAGE LEVEL ONLY)
  // ==================================================

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // ==================================================
  // 🌐 GLOBAL HISTORY STATE (STORE)
  // ==================================================

  const {
    chats,
    page,
    hasMore,
    setChats,
    appendChats,
  } = useHistoryStore();

  // ==================================================
  // 🔗 HOOK (CORE LOGIC)
  // ==================================================

  const {
    fetchHistory,
    searchHistory,
    loadMoreHistory,
  } = useHistory();

  // ==================================================
  // 🚀 INITIAL LOAD (PAGINATED)
  // ==================================================

  useEffect(() => {
    const loadInitial = async () => {
      const data = await fetchHistory({ page: 1 });
      setChats(data);
    };

    loadInitial();
  }, [fetchHistory, setChats]);

  // ==================================================
  // 🔍 SEARCH HANDLER (DEBOUNCE DI HOOK)
  // ==================================================

  const handleSearch = useCallback((value) => {
    setQuery(value);
    searchHistory(value);
  }, [searchHistory]);

  // ==================================================
  // 🧩 FILTER HANDLER
  // ==================================================

  const handleFilterChange = useCallback((value) => {
    setFilter(value);
  }, []);

  // ==================================================
  // 📂 SELECT CHAT (NAVIGATION TRIGGER)
  // ==================================================

  const handleSelectChat = useCallback((chatId) => {
    setSelectedChatId(chatId);

    // nanti bisa redirect ke chat_page
    // contoh:
    // navigate(`/chat/${chatId}`);
  }, []);

  // ==================================================
  // 🔄 LOAD MORE (INFINITE SCROLL)
  // ==================================================

  const handleLoadMore = async () => {
    if (!hasMore || isLoadingMore) return;

    try {
      setIsLoadingMore(true);

      const nextPage = page + 1;
      const data = await loadMoreHistory(nextPage);

      appendChats(data);
    } catch (err) {
      console.error("Load more error:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // ==================================================
  // 🧩 RENDER UI (ONLY COMPOSITION)
  // ======================================================

  return (
    <div className="history-page-container">
      <h1 className="history-title">Chat History</h1>

      {/* SEARCH */}
      <ChatSearch value={query} onChange={handleSearch} />

      {/* FILTER */}
      <ChatFilter value={filter} onChange={handleFilterChange} />

      {/* HISTORY LIST */}
      <ChatHistory
        chats={chats}
        onSelect={handleSelectChat}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
      />
// ======================================================
// 🧩 PART 2 — EMPTY STATE, LOADING, FINAL UI, EXPORT
// ======================================================

      {/* EMPTY STATE */}
      {chats.length === 0 && !isLoadingMore && (
        <div className="empty-state">
          <p>Belum ada riwayat chat</p>
        </div>
      )}

      {/* LOADING MORE INDICATOR */}
      {isLoadingMore && (
        <div className="loading-more">
          <p>Loading more history...</p>
        </div>
      )}

      {/* SELECTED CHAT INFO (OPTIONAL UI STATE) */}
      {selectedChatId && (
        <div className="selected-chat-info">
          <p>Selected Chat ID: {selectedChatId}</p>
        </div>
      )}

      {/* LOAD MORE BUTTON (FALLBACK IF NO INFINITE SCROLL) */}
      {hasMore && !isLoadingMore && (
        <button
          className="load-more-btn"
          onClick={handleLoadMore}
        >
          Load More
        </button>
      )}
    </div>
  );
};

// ======================================================
// 🚀 EXPORT
// ======================================================

export default HistoryPage;
