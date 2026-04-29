// pages/admin/AdminStudents.jsx
import { useEffect, useState } from 'react';
import API from '../../utils/api';
import { Search, Trash2, Eye, ChevronRight, GraduationCap, FileText, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentProgress, setStudentProgress] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search) params.append('search', search);
      const res = await API.get(`/admin/students?${params}`);
      setStudents(res.data.students);
      setTotal(res.data.total);
    } catch (e) { toast.error('Failed to load students'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStudents(); }, [page, search]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete student ${name}? This cannot be undone.`)) return;
    try {
      await API.delete(`/admin/students/${id}`);
      toast.success('Student deleted');
      fetchStudents();
    } catch { toast.error('Delete failed'); }
  };

  const viewProgress = async (student) => {
    setSelectedStudent(student);
    try {
      const res = await API.get(`/admin/students/${student._id}/progress`);
      setStudentProgress(res.data);
    } catch { toast.error('Failed to load progress'); }
  };

  const inputStyle = { padding: '9px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' };

  return (
    <div className="fade-up">
      {/* Student Detail Modal */}
      {selectedStudent && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => { setSelectedStudent(null); setStudentProgress(null); }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 32, maxWidth: 520, width: '100%', maxHeight: '80vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne', fontWeight: 800, fontSize: 22, color: 'white' }}>
                {selectedStudent.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18 }}>{selectedStudent.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{selectedStudent.email}</div>
                <div style={{ fontSize: 11, color: '#6366f1', marginTop: 2 }}>{selectedStudent.college} · {selectedStudent.branch}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'DSA Completed', value: studentProgress?.dsaProgress?.filter(p => p.status === 'completed').length ?? '...', color: '#10b981' },
                { label: 'Under Revision', value: studentProgress?.dsaProgress?.filter(p => p.status === 'revision').length ?? '...', color: '#f59e0b' },
                { label: 'Resume Score', value: selectedStudent.resume?.score || 'N/A', color: '#6366f1' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, color }}>{value}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Target Companies</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {selectedStudent.targetCompanies?.length > 0 ? selectedStudent.targetCompanies.map(c => (
                    <span key={c} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>{c}</span>
                  )) : <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>None set</span>}
                </div>
              </div>
              <div style={{ flex: 1, padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Skills</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {selectedStudent.skills?.length > 0 ? selectedStudent.skills.slice(0, 6).map(s => (
                    <span key={s} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>{s}</span>
                  )) : <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>None set</span>}
                </div>
              </div>
            </div>
            <button onClick={() => { setSelectedStudent(null); setStudentProgress(null); }}
              style={{ marginTop: 20, width: '100%', padding: '10px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13 }}>
              Close
            </button>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Manage Students</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{total} registered students</p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 360 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name..."
          style={{ ...inputStyle, width: '100%', paddingLeft: 34 }} />
      </div>

      {/* Students Table */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px 120px 80px 100px', gap: 0, padding: '12px 20px', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <span>Student</span>
          <span>College / Branch</span>
          <span style={{ textAlign: 'center' }}>Resume</span>
          <span style={{ textAlign: 'center' }}>Grad Year</span>
          <span style={{ textAlign: 'center' }}>Actions</span>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>
        ) : students.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No students found</div>
        ) : students.map((s, i) => (
          <div key={s._id}
            style={{ display: 'grid', gridTemplateColumns: '1fr 180px 120px 80px 100px', alignItems: 'center', gap: 0, padding: '14px 20px', borderBottom: i < students.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: 'white', flexShrink: 0 }}>
                {s.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{s.email}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.college || '—'}</div>
              <div style={{ color: '#6366f1', fontSize: 11 }}>{s.branch || '—'}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              {s.resume?.filename ? (
                <span style={{ fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <CheckCircle size={12} /> Uploaded
                </span>
              ) : (
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>None</span>
              )}
            </div>
            <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-secondary)' }}>{s.graduationYear || '—'}</div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
              <button onClick={() => viewProgress(s)}
                style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.1)', color: '#6366f1', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Eye size={12} /> View
              </button>
              <button onClick={() => handleDelete(s._id, s.name)}
                style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer', fontSize: 11 }}>
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {total > 15 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1 }}>
            Previous
          </button>
          <span style={{ padding: '8px 16px', color: 'var(--text-secondary)', fontSize: 13 }}>Page {page} of {Math.ceil(total / 15)}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page * 15 >= total}
            style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: page * 15 >= total ? 'not-allowed' : 'pointer', opacity: page * 15 >= total ? 0.4 : 1 }}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
