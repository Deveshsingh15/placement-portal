// pages/Profile.jsx - Student profile settings
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { Save, User, GraduationCap, Code2, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

const SKILLS_LIST = [
  'C++', 'Java', 'Python', 'JavaScript', 'React', 'Node.js', 'MongoDB',
  'SQL', 'Data Structures', 'Algorithms', 'Machine Learning', 'Git',
  'REST APIs', 'System Design', 'Linux', 'AWS', 'Docker'
];

const COMPANIES = ['Google', 'Microsoft', 'Amazon', 'Flipkart', 'Infosys', 'TCS', 'Wipro', 'Accenture', 'Capgemini', 'HCL', 'Tech Mahindra', 'Deloitte', 'IBM'];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    college: user?.college || '',
    branch: user?.branch || '',
    graduationYear: user?.graduationYear || '',
    phone: user?.phone || '',
    skills: user?.skills || [],
    targetCompanies: user?.targetCompanies || [],
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleSkill = (skill) => {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(skill) ? f.skills.filter(s => s !== skill) : [...f.skills, skill]
    }));
  };

  const toggleCompany = (company) => {
    setForm(f => ({
      ...f,
      targetCompanies: f.targetCompanies.includes(company) ? f.targetCompanies.filter(c => c !== company) : [...f.targetCompanies, company]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await API.put('/auth/profile', form);
      updateUser(res.data.user);
      toast.success('Profile updated successfully!');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: 6 };
  const sectionStyle = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px', marginBottom: 20 };

  return (
    <div className="fade-up" style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Profile Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Keep your profile updated for better placement opportunities</p>
      </div>

      {/* Avatar + Email */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne', fontWeight: 800, fontSize: 26, color: 'white' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18 }}>{user?.name}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{user?.email}</div>
            <div style={{ fontSize: 11, color: '#6366f1', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {user?.role === 'admin' ? '⚡ Admin' : '🎓 Student'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <User size={15} color="#6366f1" />
          <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14 }}>Personal Information</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>FULL NAME</label>
            <input name="name" value={form.name} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>PHONE NUMBER</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Academic Info */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <GraduationCap size={15} color="#06b6d4" />
          <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14 }}>Academic Details</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>COLLEGE / UNIVERSITY</label>
            <input name="college" value={form.college} onChange={handleChange} placeholder="Your College Name" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>BRANCH</label>
            <select name="branch" value={form.branch} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Select Branch</option>
              {['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'CSE-AI/ML', 'CSE-DS', 'MCA', 'BCA'].map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>GRADUATION YEAR</label>
            <select name="graduationYear" value={form.graduationYear} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Select Year</option>
              {[2024, 2025, 2026, 2027, 2028].map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Code2 size={15} color="#10b981" />
          <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14 }}>Technical Skills</span>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)', marginLeft: 4 }}>({form.skills.length} selected)</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SKILLS_LIST.map(skill => {
            const active = form.skills.includes(skill);
            return (
              <button key={skill} onClick={() => toggleSkill(skill)}
                style={{ padding: '6px 14px', borderRadius: 999, border: `1px solid ${active ? '#10b981' : 'var(--border)'}`, background: active ? 'rgba(16,185,129,0.15)' : 'transparent', color: active ? '#10b981' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 12, fontWeight: 500, transition: 'all 0.15s' }}>
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Companies */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Building2 size={15} color="#f59e0b" />
          <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14 }}>Target Companies</span>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)', marginLeft: 4 }}>({form.targetCompanies.length} selected)</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {COMPANIES.map(company => {
            const active = form.targetCompanies.includes(company);
            return (
              <button key={company} onClick={() => toggleCompany(company)}
                style={{ padding: '6px 14px', borderRadius: 999, border: `1px solid ${active ? '#f59e0b' : 'var(--border)'}`, background: active ? 'rgba(245,158,11,0.15)' : 'transparent', color: active ? '#f59e0b' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 12, fontWeight: 500, transition: 'all 0.15s' }}>
                {company}
              </button>
            );
          })}
        </div>
      </div>

      {/* Save button */}
      <button onClick={handleSave} disabled={saving}
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: 600, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
        <Save size={16} />
        {saving ? 'Saving...' : 'Save Profile'}
      </button>
    </div>
  );
}
