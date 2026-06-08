import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

export default function Profile() {
  const { user, authFetch, refreshProfile } = useContext(AuthContext);
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    const data = await authFetch('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify({ bio }),
    });
    setSaving(false);
    if (data.user) {
      setMessage('Profile updated successfully.');
      refreshProfile();
    } else {
      setMessage(data.message || 'Unable to update profile.');
    }
  };

  if (!user) {
    return <div className="page-shell">Loading profile...</div>;
  }

  return (
    <main className="profile-shell">
      <section className="profile-header">
        <div>
          <p className="section-label">My profile</p>
          <h1>Welcome back, {user.name}</h1>
          <p>Track everything you completed, your progress data, and your personal details.</p>
        </div>
      </section>

      <section className="profile-grid">
        <div className="profile-card info-card">
          <h2>Profile details</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Bio:</strong> {user.bio || 'Add a short personal goal to inspire your practice.'}</p>
          <form onSubmit={handleSave} className="profile-form">
            <label>
              Update bio
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
            </label>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </form>
          {message && <p className="form-success">{message}</p>}
        </div>

        <div className="profile-card progress-card">
          <h2>Progress overview</h2>
          <div className="progress-row">
            <div>
              <span>{user.progress?.sessions || 0}</span>
              <small>sessions</small>
            </div>
            <div>
              <span>{user.progress?.minutes || 0}</span>
              <small>minutes</small>
            </div>
            <div>
              <span>{user.progress?.streak || 0}</span>
              <small>current streak</small>
            </div>
          </div>
          <div className="activity-history">
            <h3>Recent activity</h3>
            {user.activity?.length ? (
              user.activity.slice(0, 4).map((item) => (
                <div key={item._id} className="activity-item">
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                  <span>{new Date(item.completedAt).toLocaleDateString()}</span>
                </div>
              ))
            ) : (
              <p>Complete a program to record your first activity.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
