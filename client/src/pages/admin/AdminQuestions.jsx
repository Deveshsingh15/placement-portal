// pages/admin/AdminQuestions.jsx
import { useEffect, useState } from 'react';
import API from '../../utils/api';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['hr', 'technical', 'dbms', 'os', 'cn', 'oops', 'aptitude', 'company'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];
const DIFF_COLOR = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' };
const CAT_LABELS = { hr: 'HR', technical: 'Technical', dbms: 'DBMS', os: 'OS', cn: 'Networks', oops: 'OOPs', aptitude: 'Aptitude', company: 'Company' };

const EMPTY_FORM = { question: '', answer: '', category: 'hr', difficulty: 'medium', company: 'General', tags: '' };

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterCat, setFilterCat] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingQ, setEditingQ] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (filterCat) params.append('category', filterCat);
      const res = await API.get(`/questions?${params}`);
      setQuestions(res.data.questions);
      setTotal(res.data.total);
    } catch { toast.error('Failed to load questions'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchQuestions(); }, [page, filterCat]);

  const openAdd = () => { setEditingQ(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (q) => {
    setEditingQ(q);
    setForm({ question: q.question, answer: q.answer || '', category: q.category, difficulty: q.difficulty, company: q.company || 'General', tags: (q.tags || []).join(', ') });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.question.trim()) { toast.error('Question is required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
      if (editingQ) {
        await API.put(`/questions/${editingQ._id}`, payload);
        toast.success('Question updated!');
      } else {
        await API.post('/questions', payload);
        toast.success('Question added!');
      }
      setShowModal(false);
      fetchQuestions();
    } catch (e) { toast.error(e.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this question?')) return;
    try {
      await API.delete(`/questions/${id}`);
      toast.success('Question deleted');
      fetchQuestions();
    } catch { toast.error('Delete failed'); }
  };

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: 6 };

  return (
    <div className="fade-up">
      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setShowModal(false)}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 32, maxWidth: 560, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, margin: 0 }}>{editingQ ? 'Edit Question' : 'Add New Question'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>QUESTION *</label>
                <textarea value={form.question} onChange={e => setForm({ ...form, question: e.target.value })}
                  placeholder="Enter the interview question..." rows={3}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }} />
              </div>
              <div>
                <label style={labelStyle}>ANSWER / HINT</label>
                <textarea value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })}
                  placeholder="Enter the answer or hints..." rows={3}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>CATEGORY</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>DIFFICULTY</label>
                  <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                    {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>COMPANY (optional)</label>
                <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
                  placeholder="e.g. Google, Amazon, TCS" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>TAGS (comma-separated)</label>
                <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                  placeholder="e.g. sql, transactions, acid" style={inputStyle} />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: '11px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13 }}>
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  style={{ flex: 2, padding: '11px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 13, opacity: saving ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Save size={14} /> {saving ? 'Saving...' : editingQ ? 'Update Question' : 'Add Question'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Syne', fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Manage Questions</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{total} interview questions in database</p>
        </div>
        <button onClick={openAdd}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
          <Plus size={16} /> Add Question
        </button>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <button onClick={() => { setFilterCat(''); setPage(1); }}
          style={{ padding: '6px 14px', borderRadius: 999, border: `1px solid ${!filterCat ? '#6366f1' : 'var(--border)'}`, background: !filterCat ? 'rgba(99,102,241,0.2)' : 'transparent', color: !filterCat ? '#6366f1' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>
          All
        </button>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => { setFilterCat(c); setPage(1); }}
            style={{ padding: '6px 14px', borderRadius: 999, border: `1px solid ${filterCat === c ? '#6366f1' : 'var(--border)'}`, background: filterCat === c ? 'rgba(99,102,241,0.2)' : 'transparent', color: filterCat === c ? '#6366f1' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 12, fontWeight: 500, transition: 'all 0.15s' }}>
            {CAT_LABELS[c]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 80px 100px 90px', padding: '12px 20px', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <span>Question</span>
          <span style={{ textAlign: 'center' }}>Category</span>
          <span style={{ textAlign: 'center' }}>Difficulty</span>
          <span style={{ textAlign: 'center' }}>Company</span>
          <span style={{ textAlign: 'center' }}>Actions</span>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>
        ) : questions.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>No questions found</div>
        ) : questions.map((q, i) => (
          <div key={q._id}
            style={{ display: 'grid', gridTemplateColumns: '1fr 90px 80px 100px 90px', alignItems: 'center', padding: '13px 20px', borderBottom: i < questions.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{q.question}</div>
              {q.tags?.length > 0 && (
                <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                  {q.tags.slice(0, 3).map(tag => (
                    <span key={tag} style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>#{tag}</span>
                  ))}
                </div>
              )}
            </div>
            <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#6366f1' }}>{CAT_LABELS[q.category] || q.category}</div>
            <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: DIFF_COLOR[q.difficulty], textTransform: 'capitalize' }}>{q.difficulty}</div>
            <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.company || '—'}</div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
              <button onClick={() => openEdit(q)}
                style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.1)', color: '#6366f1', cursor: 'pointer' }}>
                <Pencil size={12} />
              </button>
              <button onClick={() => handleDelete(q._id)}
                style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer' }}>
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
