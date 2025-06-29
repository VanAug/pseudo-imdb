import React, { useEffect, useState } from 'react';
import './Profile.css';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '' });
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState({ favorites: 0, ratings: 0 });

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch('https://fullstack-backend-hc6q.onrender.com/users/me', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      console.log('Fetched profile:', data); // ✅ ADD THIS LINE
      setProfile(data);
      setFormData({ username: data.username, email: data.email });
    };

    const fetchStats = async () => {
      const favRes = await fetch('https://fullstack-backend-hc6q.onrender.com/favorites', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const ratedRes = await fetch('https://fullstack-backend-hc6q.onrender.com/ratings/movies', {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const favData = await favRes.json();
      const ratedData = await ratedRes.json();

      setStats({ favorites: favData.length, ratings: ratedData.length });
    };

    if (user) {
      fetchProfile();
      fetchStats();
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    const res = await fetch('https://fullstack-backend-hc6q.onrender.com/users/me', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      setProfile(data);
      setIsEditing(false);
      updateUser({ username: data.username, email: data.email });
    } else {
      alert(data.error || 'Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const res = await fetch('https://fullstack-backend-hc6q.onrender.com/users/change-password', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(passwordData),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(data.message);
      setPasswordData({ current_password: '', new_password: '' });
    } else {
      setMessage(data.error || 'Failed to update password');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action is permanent.');

    if (!confirmDelete) return;

    const res = await fetch('https://fullstack-backend-hc6q.onrender.com/users/me', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user.token}` },
    });

    if (res.ok) {
      logout();
    } else {
      alert('Failed to delete account');
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      alert('File size too large (max 2MB)');
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('profile_picture', file);

    try {
      const res = await fetch('https://fullstack-backend-hc6q.onrender.com/users/me', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${user.token}` },
        body: formDataUpload,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await res.json();
      setProfile(data);
      updateUser(data);
    } catch (error) {
      alert(error.message);
    }
  };

  if (!profile) return <p className="loading">Loading profile...</p>;

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      <div className="profile-picture-container">
        {profile.profile_picture ? (
          <img
            src={`https://fullstack-backend-hc6q.onrender.com/static/profile_pics/${profile.profile_picture}`}
            alt="Profile"
            className="profile-picture"
          />
        ) : (
          <div className="profile-picture default-avatar">👤</div>
        )}

        <label className="upload-label">
          Change Picture
          <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
        </label>
      </div>

      <div className="profile-section">
        <label>Username:</label>
        {isEditing ? (
          <input
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        ) : (
          <p>{profile.username}</p>
        )}

        <label>Email:</label>
        {isEditing ? (
          <input
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        ) : (
          <p>{profile.email}</p>
        )}

        <div className="edit-buttons">
          {isEditing ? (
            <>
              <button className="save-btn" onClick={handleProfileUpdate}>Save Changes</button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <h4>{stats.favorites}</h4>
            <p>Favorited Movies</p>
          </div>
          <div className="stat-card">
            <h4>{stats.ratings}</h4>
            <p>Rated Movies</p>
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h3>🔐 Change Password</h3>
        <form onSubmit={handlePasswordChange}>
          <input
            type="password"
            placeholder="Current password"
            value={passwordData.current_password}
            onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="New password"
            value={passwordData.new_password}
            onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
            required
          />
          <button type="submit">Update Password</button>
        </form>
        {message && <p className="password-message">{message}</p>}
      </div>

      <div className="delete-section">
        <button className="delete-account-btn" onClick={handleDeleteAccount}>
          🗑 Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;
