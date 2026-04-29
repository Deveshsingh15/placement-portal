// pages/InterviewQuestions.jsx
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import { Search, Bookmark, BookmarkCheck, CheckCircle, Circle, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'hr', label: '🤝 HR' },
  { value: 'technical', label: '💻 Technical' },
  { value: 'dbms', label: '🗄️ DBMS' },
  { value: 'os', label: '⚙️ Operating Systems' },
  { value: 'cn', label: '🌐 Computer Networks' },
  { value: 'oops', label: '🔷 OOPs' },
  { value: 'aptitude', label: '🧮 Aptitude' },
  { value: 'company', label: '🏢 Company-wise' },
];

const DIFF_COLOR = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' };

function QuestionCard({ q, onToggle }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px', transition: 'all 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <button onClick={() => onToggle(q._id, 'practiced')}
          style={{ marginTop: 2, background: 'none', border: 'none', cursor: 'pointer', color: q.practiced ? '#10b981' : 'var(--text-secondary)', flexShrink: 0 }}>
          {q.practiced ? <CheckCircle size={18} /> : <Circle size={18} />}
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <p style={{ fontSize: 14, fontWeight: 500, margin: 0, lineHeight: 1.5, color: q.practiced ? 'var(--text-secondary)' : 'var(--text-primary)', textDecoration: q.practiced ? 'line-through' : 'none' }}>{q.question}</p>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
              <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'capitalize', color: DIFF_COLOR[q.difficulty] }}>
                {q.difficulty}
              </span>
              {q.company && q.company !== 'General' && (
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>{q.company}</span>
              )}
              <button onClick={() => onToggle(q._id, 'saved')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: q.saved ? '#f59e0b' : 'var(--text-secondary)' }}>
                {q.saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              </button>
              <button onClick={() => setExpanded(!expanded)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>
          {q.tags?.length > 0 && (
            <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              {q.tags.map(tag => (
                <span key={tag} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>#{tag}</span>
              ))}
            </div>
          )}
          {expanded && q.answer && (
            <div style={{ marginTop: 14, padding: '14px 16px', borderRadius: 10, background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#6366f1', letterSpacing: '0.05em', marginBottom: 8 }}>ANSWER / HINT</div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{q.answer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InterviewQuestions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const category = searchParams.get('category') || '';
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (category) params.append('category', category);
      if (difficulty) params.append('difficulty', difficulty);
      if (search) params.append('search', search);
      const res = await API.get(`/questions?${params}`);
      setQuestions(res.data.questions);
      setTotal(res.data.total);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [category, difficulty, search, page]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const handleToggle = async (id, field) => {
    setQuestions(qs => qs.map(q => q._id === id ? { ...q, [field]: !q[field] } : q));
    try {
      await API.post(`/questions/${id}/toggle`, { field });
    } catch {
      setQuestions(qs => qs.map(q => q._id === id ? { ...q, [field]: !q[field] } : q));
      toast.error('Update failed');
    }
  };

  const inputStyle = { padding: '9px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' };

  return (
    <div className="fade-up">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Interview Questions</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{total} questions across all categories</p>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {CATEGORIES.map(c => (
          <button key={c.value} onClick={() => { setSearchParams(c.value ? { category: c.value } : {}); setPage(1); }}
            style={{ padding: '6px 14px', borderRadius: 999, border: `1px solid ${category === c.value ? '#6366f1' : 'var(--border)'}`, background: category === c.value ? 'rgba(99,102,241,0.2)' : 'transparent', color: category === c.value ? '#6366f1' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 12, fontWeight: 500, transition: 'all 0.15s' }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search questions..."
            style={{ ...inputStyle, width: '100%', paddingLeft: 34 }} />
        </div>
        <select value={difficulty} onChange={e => { setDifficulty(e.target.value); setPage(1); }} style={{ ...inputStyle, cursor: 'pointer' }}>
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Questions */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="shimmer" style={{ height: 70, borderRadius: 14 }} />
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div>No questions found. Try different filters.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {questions.map(q => <QuestionCard key={q._id} q={q} onToggle={handleToggle} />)}
        </div>
      )}

      {/* Pagination */}
      {total > 15 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1 }}>
            Previous
          </button>
          <span style={{ padding: '8px 16px', color: 'var(--text-secondary)', fontSize: 13 }}>Page {page}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page * 15 >= total}
            style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: page * 15 >= total ? 'not-allowed' : 'pointer', opacity: page * 15 >= total ? 0.4 : 1 }}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
