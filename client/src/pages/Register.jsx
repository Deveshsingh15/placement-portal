// pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', college: '', branch: '', graduationYear: '' });
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(form);
    if (result.success) navigate('/dashboard');
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 8,
    border: '1px solid var(--border)', background: 'rgba(255,255,255,0.04)',
    color: 'var(--text-primary)', fontSize: 13, outline: 'none',
  };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: 5 };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 520, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '40px 36px' }} className="fade-up">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'Syne', fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Create Your Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Join thousands of students preparing for placements</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>FULL NAME</label>
              <input name="name" required placeholder="Devesh Sharma" value={form.name} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>EMAIL</label>
              <input name="email" type="email" required placeholder="you@college.edu" value={form.email} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>PASSWORD</label>
            <div style={{ position: 'relative' }}>
              <input name="password" type={showPass ? 'text' : 'password'} required minLength={6} placeholder="Min 6 characters"
                value={form.password} onChange={handleChange} style={{ ...inputStyle, paddingRight: 40 }} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div>
            <label style={labelStyle}>COLLEGE</label>
            <input name="college" placeholder="Madhav Institute of Technology & Science" value={form.college} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>BRANCH</label>
              <select name="branch" value={form.branch} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">Select Branch</option>
                {['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'CSE-AI/ML', 'CSE-DS'].map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>GRADUATION YEAR</label>
              <select name="graduationYear" value={form.graduationYear} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">Year</option>
                {[2025, 2026, 2027, 2028].map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{ padding: '13px', marginTop: 8, borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: 600, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <UserPlus size={16} />
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
