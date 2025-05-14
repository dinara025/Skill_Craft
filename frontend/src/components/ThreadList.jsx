import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaClock,
  FaTags,
  FaRegBookmark,
  FaEllipsisH,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import "../styles/ThreadList.css";

const ThreadList = ({ onSelectThread, searchQuery }) => {
  const [threads, setThreads] = useState([]);
  const [filteredThreads, setFilteredThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    setLoading(true);

    axios
      .get("http://localhost:8080/api/threads", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const sortedThreads = sortThreads(res.data, sortOption);
        setThreads(sortedThreads);
        setFilteredThreads(sortedThreads);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching threads:", err);
        setLoading(false);
      });
  }, [sortOption]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = threads.filter(
        (thread) =>
          thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          thread.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (thread.tags &&
            thread.tags.some((tag) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            ))
      );
      setFilteredThreads(filtered);
    } else {
      setFilteredThreads(threads);
    }
  }, [searchQuery, threads]);

  const sortThreads = (threads, option) => {
    const sorted = [...threads];
    switch (option) {
      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "oldest":
        return sorted.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      default:
        return sorted;
    }
  };

  const handleThreadClick = (thread) => {
    onSelectThread(thread);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div
      className="thread-list-container"
      style={{ maxHeight: "100vh", overflowY: "auto" }}
    >
      <div className="thread-list-header">
        <h2>Community Discussions</h2>
        <div className="sort-controls">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortOption}
            onChange={handleSortChange}
            className="sort-select"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Loading discussions...</p>
        </div>
      ) : filteredThreads.length === 0 ? (
        <div className="empty-state">
          <img
            src="/empty-threads.svg"
            alt="No threads found"
            className="empty-image"
          />
          <h3>No discussions found</h3>
          <p>
            {searchQuery
              ? "Try a different search term"
              : "Be the first to start a discussion!"}
          </p>
        </div>
      ) : (
        <div className="thread-grid">
          {filteredThreads.map((thread) => (
            <div
              key={thread._id || thread.id}
              className="thread-card"
              onClick={() => handleThreadClick(thread)}
            >
              <div className="card-header">
                <div className="user-info">
                  {thread.author?.avatar ? (
                    <img
                      src={thread.author.avatar}
                      alt={thread.author.username}
                      className="user-avatar"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      <FaUser />
                    </div>
                  )}
                  <span className="username">
                    {thread.author?.username || "Anonymous"}
                  </span>
                </div>
                <button className="card-menu-btn">
                  <FaEllipsisH />
                </button>
              </div>

              <div className="card-body">
                <h3 className="thread-title">{thread.title}</h3>
                <p className="thread-excerpt">
                  {thread.description?.slice(0, 120)}
                  {thread.description?.length > 120 && "..."}
                </p>

                {thread.tags?.length > 0 && (
                  <div className="tags-container">
                    <FaTags className="tag-icon" />
                    {thread.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                    {thread.tags.length > 3 && (
                      <span className="more-tags">
                        +{thread.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="card-footer">
                <div className="meta-item">
                  <FaClock />
                  <span>
                    {formatDistanceToNow(new Date(thread.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>

              <button className="bookmark-btn">
                <FaRegBookmark />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThreadList;
