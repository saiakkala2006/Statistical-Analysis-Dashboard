import React, { useState, useEffect } from 'react';

// Main App component
const App = () => {
  // State variables to store data fetched from the backend
  const [overallStats, setOverallStats] = useState(null);
  const [categorySummaries, setCategorySummaries] = useState([]);
  const [recentOperations, setRecentOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Base URL for your backend API
  // IMPORTANT: Replace with your actual backend URL if deployed, otherwise use localhost
  const API_BASE_URL = 'http://localhost:5000'; // Make sure this matches your backend port

  useEffect(() => {
    // Function to fetch all data
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true when starting fetch
        setError(null); // Clear any previous errors

        // Fetch Overall Statistics
        const statsResponse = await fetch(`${API_BASE_URL}/api/stats`);
        if (!statsResponse.ok) throw new Error(`HTTP error! status: ${statsResponse.status}`);
        const statsData = await statsResponse.json();
        setOverallStats(statsData);

        // Fetch Category Summaries
        const categoriesResponse = await fetch(`${API_BASE_URL}/api/categories/summary`);
        if (!categoriesResponse.ok) throw new Error(`HTTP error! status: ${categoriesResponse.status}`);
        const categoriesData = await categoriesResponse.json();
        setCategorySummaries(categoriesData);

        // Fetch Recent Operations
        const recentOpsResponse = await fetch(`${API_BASE_URL}/api/recent-operations`);
        if (!recentOpsResponse.ok) throw new Error(`HTTP error! status: ${recentOpsResponse.status}`);
        const recentOpsData = await recentOpsResponse.json();
        setRecentOperations(recentOpsData);

      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data. Please ensure the backend server is running and accessible.");
      } finally {
        setLoading(false); // Set loading to false once fetching is complete
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    // Main container with a semantic class for classic styling
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">SQL Data Analysis Dashboard</h1>
        <p className="dashboard-subtitle">Unlocking Key Insights from Your PostgreSQL Data</p>
      </header>

      <main className="dashboard-main">
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading powerful insights...</p>
          </div>
        )}

        {error && (
          <div className="error-message" role="alert">
            <p className="error-title">Error Loading Data:</p>
            <p>{error}</p>
            <p className="error-hint">Please ensure your backend server is active and accessible. Check your browser's console for more details.</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Overall Statistics Card */}
            <section className="dashboard-section">
              <h2 className="section-title">Overall Statistics</h2>
              {overallStats ? (
                <div className="stats-grid">
                  {/* Statistic cards */}
                  <div className="stat-card">
                    <p className="stat-label">Average Value</p>
                    <p className="stat-value">{overallStats.average_value?.toFixed(2) || 'N/A'}</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-label">Median Value</p>
                    <p className="stat-value">{overallStats.median_value?.toFixed(2) || 'N/A'}</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-label">Standard Deviation</p>
                    <p className="stat-value">{overallStats.stddev_value?.toFixed(2) || 'N/A'}</p>
                  </div>
                </div>
              ) : (
                <p className="no-data-message">No overall statistics available.</p>
              )}
            </section>

            {/* Category Summaries Table */}
            <section className="dashboard-section">
              <h2 className="section-title">Category Summaries</h2>
              {categorySummaries.length > 0 ? (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Record Count</th>
                        <th>Average Value</th>
                        <th>Total Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categorySummaries.map((summary, index) => (
                        <tr key={index}>
                          <td>{summary.category}</td>
                          <td>{summary.record_count}</td>
                          <td>{summary.avg_value?.toFixed(2)}</td>
                          <td>{summary.total_value?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-data-message">No category summaries available.</p>
              )}
            </section>

            {/* Recent Operations Log Table */}
            <section className="dashboard-section">
              <h2 className="section-title">Recent Operations Log (Last 10)</h2>
              {recentOperations.length > 0 ? (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Log ID</th>
                        <th>User Name</th>
                        <th>Operation</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOperations.map((op, index) => (
                        <tr key={index}>
                          <td>{op.log_id}</td>
                          <td>{op.user_name}</td>
                          <td>{op.operation}</td>
                          <td>{new Date(op.log_time).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-data-message">No recent operations available.</p>
              )}
            </section>

            {/* Placeholder for more sections (e.g., Trendline, Top 5 Values, etc.) */}
            <section className="dashboard-section">
              <h2 className="section-title">Additional Analyses (To be implemented)</h2>
              <p>
                This dashboard can be expanded to include richer visualizations and detailed tables for:
              </p>
              <ul className="analysis-list">
                <li><span>Trendline Analysis over Time:</span> Visualize daily average value trends.</li>
                <li><span>Top 5 Highest Values by Category:</span> Detailed lists of top entries.</li>
                <li><span>Mean Value Comparison between Categories:</span> Compare performance across different groups.</li>
                <li><span>Frequent Labels per Category:</span> Identify key classifications.</li>
                <li><span>Outlier Detection Results:</span> Highlight anomalous data points.</li>
                <li><span>Daily Activity of Analysts:</span> Monitor user engagement and operational patterns.</li>
                <li><span>Category vs. Label Distribution Summary:</span> Understand data segmentation more deeply.</li>
              </ul>
              <p className="implementation-note">
                To implement these, you would:
                <ol>
                    <li>Add new API endpoints in your <code>server.js</code> file, connecting to the corresponding SQL functions/views.</li>
                    <li>Integrate the fetching and rendering logic (<code>useState</code>, <code>useEffect</code>, JSX) into this <code>App.jsx</code> component.</li>
                    <li>Consider adding charting libraries (e.g., Recharts, Chart.js) for visual representations.</li>
                </ol>
              </p>
            </section>
          </>
        )}
      </main>

      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} SQL Data Analysis Project. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
