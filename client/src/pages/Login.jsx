// pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ShieldCheck, LogIn } from 'lucide-react';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form);
    if (result.success) navigate(result.role === 'admin' ? '/admin' : '/dashboard');
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 10,
    border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)',
    color: 'var(--text-primary)', fontSize: 14, outline: 'none',
    transition: 'border 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)' }}>
      {/* Left visual panel */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #0d1526, #1a1040)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60, position: 'relative', overflow: 'hidden' }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(99,102,241,0.08)', top: -100, right: -100 }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(6,182,212,0.06)', bottom: -80, left: -60 }} />

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 400 }}>
          <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #6366f1, #06b6d4)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 20px 40px rgba(99,102,241,0.3)' }}>
            <ShieldCheck size={36} color="white" />
          </div>
          <h1 style={{ fontFamily: 'Syne', fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 16, lineHeight: 1.1 }}>
            PlacePro<br />
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Placement Portal</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.6 }}>
            Your all-in-one platform to ace campus placements. Track DSA progress, practice interviews, and build the perfect resume.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
            {['DSA Tracker', 'Interview Prep', 'Resume Builder'].map(tag => (
              <span key={tag} style={{ padding: '6px 14px', borderRadius: 999, border: '1px solid rgba(99,102,241,0.4)', fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ width: 440, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 360 }} className="fade-up">
          <h2 style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>Welcome back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32 }}>Sign in to continue your preparation journey</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>EMAIL ADDRESS</label>
              <input name="email" type="email" placeholder="student@college.edu" required
                value={form.email} onChange={handleChange} style={inputStyle} />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <input name="password" type={showPass ? 'text' : 'password'} placeholder="••••••••" required
                  value={form.password} onChange={handleChange} style={{ ...inputStyle, paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ padding: '13px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: 600, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8, transition: 'transform 0.1s' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <LogIn size={16} />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Create account</Link>
          </p>

          <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 10, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0 }}>
              <strong style={{ color: 'var(--accent)' }}>Admin?</strong> Use the{' '}
              <Link to="/admin/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Admin Login</Link> page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
