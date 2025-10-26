import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PostsOverTimeChart from '../components/charts/PostsOverTimeChart';
import PostsPerGroupChart from '../components/charts/PostsPerGroupChart';
import PopularGroupsChart from '../components/charts/PopularGroupsChart';
import ApiService from '../services/api';
import './StatisticsPage.css';

export default function StatisticsPage({ user, currentPage, onNavigate, onLogout }) {
  const [postsOverTimeData, setPostsOverTimeData] = useState([]);
  const [postsPerGroupData, setPostsPerGroupData] = useState([]);
  const [popularGroupsData, setPopularGroupsData] = useState([]);
  const [generalStats, setGeneralStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllStatistics();
  }, []);

  const fetchAllStatistics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch all statistics in parallel
      const [postsTime, postsGroup, popularGroups, general] = await Promise.all([
        ApiService.getPostsOverTime(),
        ApiService.getPostsPerGroup(),
        ApiService.getPopularGroups(),
        ApiService.getGeneralStats()
      ]);

      if (postsTime.success) {
        setPostsOverTimeData(postsTime.data || []);
      }

      if (postsGroup.success) {
        setPostsPerGroupData(postsGroup.data || []);
      }

      if (popularGroups.success) {
        setPopularGroupsData(popularGroups.data || []);
      }

      if (general.success) {
        setGeneralStats(general.data || null);
      }

    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError('Failed to load statistics. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="statistics-page">
      <Header
        currentPage={currentPage}
        onNavigate={onNavigate}
        onLogout={onLogout}
        isLoggedIn={true}
        user={user}
      />

      <div className="statistics-container">
        <div className="statistics-content">
          <div className="statistics-header">
            <h1 className="page-title">📊 Platform Statistics</h1>
            <p className="page-subtitle">Comprehensive analytics and insights</p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading statistics...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="error-container">
              <p className="error-message">{error}</p>
              <button onClick={fetchAllStatistics} className="retry-btn">
                Try Again
              </button>
            </div>
          )}

          {/* Statistics Content */}
          {!isLoading && !error && (
            <>
              {/* General Stats Cards */}
              {generalStats && (
                <div className="stats-cards">
                  <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                      <h3 className="stat-value">{generalStats.totalUsers}</h3>
                      <p className="stat-label">Total Users</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">📝</div>
                    <div className="stat-info">
                      <h3 className="stat-value">{generalStats.totalPosts}</h3>
                      <p className="stat-label">Total Posts</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-info">
                      <h3 className="stat-value">{generalStats.totalGroups}</h3>
                      <p className="stat-label">Total Groups</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-info">
                      <h3 className="stat-value">{generalStats.recentPosts}</h3>
                      <p className="stat-label">Posts (Last 7 Days)</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Most Active Group */}
              {generalStats && generalStats.mostActiveGroup && (
                <div className="highlight-card">
                  <h3>🏆 Most Active Group</h3>
                  <p className="highlight-name">{generalStats.mostActiveGroup.name}</p>
                  <p className="highlight-value">{generalStats.mostActiveGroup.postsCount} posts</p>
                </div>
              )}

              {/* Charts Section */}
              <div className="charts-grid">
                {/* Posts Over Time Chart */}
                <div className="chart-wrapper full-width">
                  <PostsOverTimeChart data={postsOverTimeData} />
                </div>

                {/* Posts Per Group Chart */}
                <div className="chart-wrapper full-width">
                  <PostsPerGroupChart data={postsPerGroupData} />
                </div>

                {/* Popular Groups Chart */}
                <div className="chart-wrapper">
                  <PopularGroupsChart data={popularGroupsData} />
                </div>
              </div>

              {/* Refresh Button */}
              <div className="refresh-section">
                <button onClick={fetchAllStatistics} className="refresh-btn">
                  🔄 Refresh Data
                </button>
                <p className="last-updated">
                  Last updated: {new Date().toLocaleString()}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

