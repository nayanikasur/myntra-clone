import { useState } from 'react';
import { api } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function ProfileDetails() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, mobile: user.mobile || '', gender: user.gender || '' });
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' });
  const [changingPw, setChangingPw] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      setUser(await api('/auth/me', { method: 'PUT', body: form }));
      setEditing(false);
      toast('Profile updated', 'success');
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    try {
      await api('/auth/password', { method: 'PUT', body: pw });
      setPw({ currentPassword: '', newPassword: '' });
      setChangingPw(false);
      toast('Password changed', 'success');
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  if (editing) {
    return (
      <form className="profile-form" onSubmit={saveProfile}>
        <h3 className="account-title">Edit Details</h3>
        <label>
          Email
          <input value={user.email} disabled />
        </label>
        <label>
          Full Name
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </label>
        <label>
          Mobile Number
          <input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} inputMode="numeric" maxLength={10} />
        </label>
        <div className="gender-toggle">
          {['Male', 'Female'].map((g) => (
            <button key={g} type="button" className={form.gender === g ? 'active' : ''} onClick={() => setForm({ ...form, gender: g })}>
              {g}
            </button>
          ))}
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          SAVE DETAILS
        </button>
        <button type="button" className="link-btn" onClick={() => setEditing(false)}>
          Cancel
        </button>
      </form>
    );
  }

  return (
    <div className="profile-details">
      <h3 className="account-title">Profile Details</h3>
      <dl>
        <dt>Full Name</dt>
        <dd>{user.name}</dd>
        <dt>Mobile Number</dt>
        <dd>{user.mobile || '- not added -'}</dd>
        <dt>Email ID</dt>
        <dd>{user.email}</dd>
        <dt>Gender</dt>
        <dd>{user.gender || '- not added -'}</dd>
        <dt>Member since</dt>
        <dd>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '-'}</dd>
      </dl>
      <button type="button" className="btn btn-primary btn-block" onClick={() => setEditing(true)}>
        EDIT
      </button>

      {changingPw ? (
        <form className="profile-form pw-form" onSubmit={savePassword}>
          <label>
            Current Password
            <input type="password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} required autoComplete="current-password" />
          </label>
          <label>
            New Password
            <input type="password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} required minLength={6} autoComplete="new-password" />
          </label>
          <button type="submit" className="btn btn-outline btn-block">
            UPDATE PASSWORD
          </button>
        </form>
      ) : (
        <button type="button" className="link-btn change-pw" onClick={() => setChangingPw(true)}>
          CHANGE PASSWORD
        </button>
      )}
    </div>
  );
}
