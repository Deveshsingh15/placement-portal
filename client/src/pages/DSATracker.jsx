// pages/DSATracker.jsx - Full DSA Sheet tracker with topic filters
import { useEffect, useState, useMemo } from 'react';
import API from '../utils/api';
import { DSA_QUESTIONS, DSA_TOPICS, TOTAL_QUESTIONS } from '../data/dsaSheet';
import { CheckCircle2, Clock, RefreshCw, ExternalLink, Search, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  completed: { label: 'Completed', color: '#10b981', bg: 'rgba(16,185,129,0.15)', icon: CheckCircle2 },
  revision: { label: 'Revision', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', icon: RefreshCw },
  pending: { label: 'Pending', color: '#94a3b8', bg: 'rgba(148,163,184,0.15)', icon: Clock },
};

const DIFFICULTY_COLOR = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' };

export default function DSATracker() {
  const [progressMap, setProgressMap] = useState({});
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/dsa/progress').then(res => {
      const map = {};
      res.data.progress.forEach(p => { map[p.questionId] = p.status; });
      setProgressMap(map);
    }).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (questionId, status) => {
    const prev = progressMap[questionId] || 'pending';
    const newStatus = prev === status ? 'pending' : status;
    setProgressMap(m => ({ ...m, [questionId]: newStatus }));
    try {
      await API.post('/dsa/progress', { questionId, status: newStatus });
    } catch {
      setProgressMap(m => ({ ...m, [questionId]: prev }));
      toast.error('Failed to update');
    }
  };

  const filtered = useMemo(() => DSA_QUESTIONS.filter(q => {
    if (selectedTopic !== 'All' && q.topic !== selectedTopic) return false;
    if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) return false;
    if (search && !q.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [selectedTopic, selectedDifficulty, search]);

  // Topic-wise stats
  const topicStats = useMemo(() => {
    const stats = {};
    DSA_TOPICS.forEach(t => {
      const qs = DSA_QUESTIONS.filter(q => q.topic === t);
      stats[t] = { total: qs.length, completed: qs.filter(q => progressMap[q.id] === 'completed').length };
    });
    return stats;
  }, [progressMap]);

  const totalCompleted = Object.values(progressMap).filter(v => v === 'completed').length;
  const totalRevision = Object.values(progressMap).filter(v => v === 'revision').length;

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading DSA Sheet...</div>
    </div>
  );

  return (
    <div className="fade-up">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: 26, fontWeight: 800, marginBottom: 6 }}>DSA Sheet Tracker</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Striver A2Z DSA Sheet · {TOTAL_QUESTIONS} Questions</p>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Completed', value: totalCompleted, total: TOTAL_QUESTIONS, color: '#10b981' },
          { label: 'Under Revision', value: totalRevision, total: TOTAL_QUESTIONS, color: '#f59e0b' },
          { label: 'Remaining', value: TOTAL_QUESTIONS - totalCompleted - totalRevision, total: TOTAL_QUESTIONS, color: '#6366f1' },
        ].map(({ label, value, total, color }) => (
          <div key={label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px' }}>
            <div style={{ fontSize: 26, fontFamily: 'Syne', fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>{label}</div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(value / total) * 100}%`, background: color, borderRadius: 999, transition: 'width 1s' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Topic Filter Pills */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          {['All', ...DSA_TOPICS].map(topic => {
            const isActive = selectedTopic === topic;
            const stats = topic !== 'All' ? topicStats[topic] : null;
            return (
              <button key={topic} onClick={() => setSelectedTopic(topic)}
                style={{ padding: '6px 14px', borderRadius: 999, border: `1px solid ${isActive ? '#6366f1' : 'var(--border)'}`, background: isActive ? 'rgba(99,102,241,0.2)' : 'transparent', color: isActive ? '#6366f1' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 12, fontWeight: 500, transition: 'all 0.15s' }}>
                {topic}
                {stats && <span style={{ marginLeft: 5, opacity: 0.6 }}>({stats.completed}/{stats.total})</span>}
              </button>
            );
          })}
        </div>

        {/* Search + Difficulty */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions..."
              style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: 8, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
          </div>
          {['All', 'easy', 'medium', 'hard'].map(d => (
            <button key={d} onClick={() => setSelectedDifficulty(d)}
              style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${selectedDifficulty === d ? (DIFFICULTY_COLOR[d] || '#6366f1') : 'var(--border)'}`, background: selectedDifficulty === d ? `${DIFFICULTY_COLOR[d] || '#6366f1'}20` : 'transparent', color: selectedDifficulty === d ? (DIFFICULTY_COLOR[d] || '#6366f1') : 'var(--text-secondary)', cursor: 'pointer', fontSize: 12, fontWeight: 500, textTransform: 'capitalize', transition: 'all 0.15s' }}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Topic progress bars (when a topic is selected) */}
      {selectedTopic !== 'All' && topicStats[selectedTopic] && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
            <span style={{ fontWeight: 600 }}>{selectedTopic} Progress</span>
            <span style={{ color: '#10b981' }}>{topicStats[selectedTopic].completed}/{topicStats[selectedTopic].total}</span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(topicStats[selectedTopic].completed / topicStats[selectedTopic].total) * 100}%`, background: 'linear-gradient(90deg, #6366f1, #06b6d4)', borderRadius: 999, transition: 'width 1s' }} />
          </div>
        </div>
      )}

      {/* Questions Table */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto auto', gap: 0, borderBottom: '1px solid var(--border)', padding: '12px 20px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <span>Problem</span>
          <span style={{ textAlign: 'center', width: 70 }}>Difficulty</span>
          <span style={{ textAlign: 'center', width: 80 }}>Link</span>
          <span style={{ textAlign: 'center', width: 100 }}>Completed</span>
          <span style={{ textAlign: 'center', width: 90 }}>Revision</span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No questions match your filter</div>
        ) : (
          filtered.map((q, i) => {
            const status = progressMap[q.id] || 'pending';
            return (
              <div key={q.id}
                style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto auto', alignItems: 'center', gap: 0, padding: '13px 20px', borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s', background: status === 'completed' ? 'rgba(16,185,129,0.03)' : 'transparent' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = status === 'completed' ? 'rgba(16,185,129,0.03)' : 'transparent'}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: status === 'completed' ? '#10b981' : 'var(--text-primary)' }}>{q.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{q.topic}</div>
                </div>
                <span style={{ width: 70, textAlign: 'center', fontSize: 11, fontWeight: 600, color: DIFFICULTY_COLOR[q.difficulty], textTransform: 'capitalize' }}>{q.difficulty}</span>
                <div style={{ width: 80, textAlign: 'center' }}>
                  <a href={q.link} target="_blank" rel="noopener noreferrer"
                    style={{ color: '#6366f1', fontSize: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    <ExternalLink size={12} /> Solve
                  </a>
                </div>
                <div style={{ width: 100, textAlign: 'center' }}>
                  <button onClick={() => updateStatus(q.id, 'completed')}
                    style={{ padding: '5px 12px', borderRadius: 6, border: `1px solid ${status === 'completed' ? '#10b981' : 'var(--border)'}`, background: status === 'completed' ? 'rgba(16,185,129,0.2)' : 'transparent', color: status === 'completed' ? '#10b981' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 11, fontWeight: 600, transition: 'all 0.15s' }}>
                    {status === 'completed' ? '✓ Done' : 'Mark Done'}
                  </button>
                </div>
                <div style={{ width: 90, textAlign: 'center' }}>
                  <button onClick={() => updateStatus(q.id, 'revision')}
                    style={{ padding: '5px 10px', borderRadius: 6, border: `1px solid ${status === 'revision' ? '#f59e0b' : 'var(--border)'}`, background: status === 'revision' ? 'rgba(245,158,11,0.2)' : 'transparent', color: status === 'revision' ? '#f59e0b' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 11, fontWeight: 600, transition: 'all 0.15s' }}>
                    {status === 'revision' ? '↻ Rev.' : 'Revision'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div style={{ textAlign: 'center', padding: '16px', fontSize: 12, color: 'var(--text-secondary)' }}>
        Showing {filtered.length} of {TOTAL_QUESTIONS} questions
      </div>
    </div>
  );
}
