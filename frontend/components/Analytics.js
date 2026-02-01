import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Analytics({ groupId, taskId, studentId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let endpoint = '';
        if (taskId) {
          endpoint = `/analytics/task/${taskId}/progress`;
        } else if (groupId) {
          endpoint = `/analytics/group/${groupId}`;
        } else if (studentId) {
          endpoint = `/analytics/student/${studentId}`;
        } else {
          endpoint = `/analytics/global`;
        }
        const response = await api.get(endpoint);
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [groupId, taskId, studentId]);

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="analytics">
      <h3>Analytics</h3>
      {Array.isArray(stats) ? (
        <table className="analytics-table">
          <tbody>
            {stats.map((stat, index) => (
              <tr key={index}>
                <td>{Object.entries(stat)[0][0]}</td>
                <td>{Object.entries(stat)[0][1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>
          {stats && Object.entries(stats).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
