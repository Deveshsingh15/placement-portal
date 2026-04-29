// pages/Resume.jsx - Resume upload, preview, scoring
import { useEffect, useState, useRef } from 'react';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Upload, FileText, Trash2, Eye, Star, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Resume() {
  const { user, updateUser } = useAuth();
  const [resume, setResume] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    API.get('/resume').then(res => {
      setResume(res.data.resume);
      setSuggestions(res.data.suggestions || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleUpload = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') { toast.error('Only PDF files allowed'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('File size must be under 5MB'); return; }

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const res = await API.post('/resume/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResume(res.data.resume);
      setSuggestions(res.data.suggestions || []);
      updateUser({ resume: res.data.resume });
      toast.success('Resume uploaded successfully!');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Upload failed');
    } finally { setUploading(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete your resume?')) return;
    await API.delete('/resume');
    setResume(null);
    setSuggestions([]);
    updateUser({ resume: {} });
    toast.success('Resume deleted');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleUpload(e.dataTransfer.files[0]);
  };

  const scoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>Loading...</div>;

  return (
    <div className="fade-up">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Resume Manager</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Upload your resume and get improvement suggestions</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: resume ? '1fr 360px' : '1fr', gap: 20 }}>
        {/* Upload section */}
        <div>
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragging ? '#6366f1' : 'var(--border)'}`,
              borderRadius: 20, padding: '48px 40px', textAlign: 'center', cursor: 'pointer',
              background: dragging ? 'rgba(99,102,241,0.06)' : 'var(--bg-card)',
              transition: 'all 0.2s', marginBottom: 20
            }}>
            <input ref={fileInputRef} type="file" accept=".pdf" onChange={e => handleUpload(e.target.files[0])} style={{ display: 'none' }} />
            <div style={{ width: 64, height: 64, margin: '0 auto 16px', borderRadius: 16, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {uploading ? <RefreshCw size={28} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={28} color="#6366f1" />}
            </div>
            <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
              {uploading ? 'Uploading...' : resume ? 'Replace Resume' : 'Upload Resume'}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
              {uploading ? 'Please wait...' : 'Drag & drop or click to browse · PDF only · Max 5MB'}
            </div>
          </div>

          {/* Current resume card */}
          {resume && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={22} color="#10b981" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{resume.originalName}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  Uploaded {new Date(resume.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <a href={`/uploads/resumes/${resume.filename}`} target="_blank" rel="noopener noreferrer"
                  style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(99,102,241,0.15)', color: '#6366f1', textDecoration: 'none', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Eye size={13} /> Preview
                </a>
                <button onClick={handleDelete}
                  style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Score + Suggestions */}
        {resume && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Score card */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: 16 }}>RESUME SCORE</div>
              <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 16px' }}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                  <circle cx="60" cy="60" r="52" fill="none"
                    stroke={scoreColor(resume.score)} strokeWidth="10"
                    strokeLinecap="round" strokeDasharray={`${(resume.score / 100) * 326.7} 326.7`}
                    strokeDashoffset="81.7" transform="rotate(-90 60 60)" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 28, color: scoreColor(resume.score) }}>{resume.score}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>/100</span>
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: scoreColor(resume.score) }}>
                {resume.score >= 80 ? 'Excellent! 🌟' : resume.score >= 60 ? 'Good Resume 👍' : 'Needs Improvement 📝'}
              </div>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px' }}>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertCircle size={16} color="#f59e0b" /> Suggestions
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {suggestions.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 700 }}>{i + 1}</span>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
