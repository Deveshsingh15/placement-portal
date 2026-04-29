// pages/Dashboard.jsx - Main student dashboard
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { DSA_QUESTIONS, TOTAL_QUESTIONS } from '../data/dsaSheet';
import {
  Code2, MessageSquare, FileText, Trophy, TrendingUp,
  CheckCircle, Clock, BookOpen, Target, Star, Zap
} from 'lucide-react';

const Card = ({ children, style = {} }) => (
  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px', ...style }}>
    {children}
  </div>
);

const StatCard = ({ icon: Icon, label, value, sub, color = '#6366f1', link }) => (
  <Link to={link || '#'} style={{ textDecoration: 'none' }}>
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, transition: 'all 0.2s', cursor: 'pointer' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Icon size={20} color={color} />
      </div>
      <div style={{ fontSize: 28, fontFamily: 'Syne', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{sub}</div>}
    </div>
  </Link>
);

const ProgressBar = ({ value, max, color = '#6366f1' }) => {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
        <span>{value}/{max}</span><span style={{ color }}>{pct}%</span>
      </div>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}aa)`, borderRadius: 999, transition: 'width 1s ease' }} />
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const [dsaStats, setDsaStats] = useState({ completed: 0, revision: 0 });
  const [interviewPracticed, setInterviewPracticed] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [dsaRes, qRes] = await Promise.all([
          API.get('/dsa/stats'),
          API.get('/questions?limit=1'),
        ]);
        setDsaStats(dsaRes.data.stats);

        // Count practiced questions from user progress
        const savedRes = await API.get('/questions/saved');
        setInterviewPracticed(savedRes.data.questions?.filter(q => q.practiced).length || 0);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const readinessScore = Math.min(100, Math.round(
    (dsaStats.completed / TOTAL_QUESTIONS) * 50 +
    (user?.resume?.filename ? 20 : 0) +
    (interviewPracticed * 2) +
    10
  ));

  const getReadinessLabel = (score) => {
    if (score >= 80) return { label: 'Placement Ready! 🚀', color: '#10b981' };
    if (score >= 60) return { label: 'Almost There 🔥', color: '#f59e0b' };
    if (score >= 40) return { label: 'Good Progress 📈', color: '#6366f1' };
    return { label: 'Just Getting Started 💪', color: '#94a3b8' };
  };

  const readiness = getReadinessLabel(readinessScore);

  return (
    <div className="fade-up">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},{' '}
          <span style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {user?.name?.split(' ')[0]} 👋
          </span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          {user?.college && `${user.college} · `}{user?.branch && `${user.branch} · `}
          {user?.graduationYear && `Class of ${user.graduationYear}`}
        </p>
      </div>

      {/* Readiness Score Banner */}
      <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.08))', borderColor: 'rgba(99,102,241,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'conic-gradient(#6366f1 0deg, #6366f1 ' + (readinessScore * 3.6) + 'deg, rgba(255,255,255,0.06) ' + (readinessScore * 3.6) + 'deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', width: 52, height: 52, borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne', fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>{readinessScore}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>Placement Readiness Score</div>
              <div style={{ fontSize: 13, color: readiness.color, fontWeight: 600 }}>{readiness.label}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 20, color: '#10b981' }}>{dsaStats.completed}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>DSA Solved</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 20, color: '#6366f1' }}>{interviewPracticed}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Interview Qs</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 20, color: user?.resume?.filename ? '#10b981' : '#94a3b8' }}>
                {user?.resume?.filename ? '✓' : '✗'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Resume</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard icon={Code2} label="DSA Questions Solved" value={dsaStats.completed} sub={`of ${TOTAL_QUESTIONS} total`} color="#6366f1" link="/dsa" />
        <StatCard icon={Clock} label="Under Revision" value={dsaStats.revision} sub="Questions to review" color="#f59e0b" link="/dsa" />
        <StatCard icon={MessageSquare} label="Interview Qs Practiced" value={interviewPracticed} sub="Keep practicing!" color="#06b6d4" link="/interview" />
        <StatCard icon={FileText} label="Resume Score" value={user?.resume?.score || 0} sub={user?.resume?.filename ? user.resume.originalName : 'No resume uploaded'} color="#10b981" link="/resume" />
      </div>

      {/* DSA topic progress + Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Code2 size={18} color="#6366f1" />
            <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, margin: 0 }}>DSA Progress Overview</h3>
          </div>
          <ProgressBar value={dsaStats.completed} max={TOTAL_QUESTIONS} color="#6366f1" />
          <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {TOTAL_QUESTIONS - dsaStats.completed} questions remaining. Keep going to reach 100% completion!
          </div>
          <Link to="/dsa" style={{ display: 'inline-block', marginTop: 16, padding: '8px 20px', borderRadius: 8, background: 'rgba(99,102,241,0.15)', color: '#6366f1', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
            Continue Practicing →
          </Link>
        </Card>

        <Card>
          <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: Code2, label: 'Continue DSA Sheet', to: '/dsa', color: '#6366f1' },
              { icon: MessageSquare, label: 'Practice HR Questions', to: '/interview?category=hr', color: '#06b6d4' },
              { icon: BookOpen, label: 'Technical Interview', to: '/interview?category=technical', color: '#10b981' },
              { icon: FileText, label: user?.resume?.filename ? 'Update Resume' : 'Upload Resume', to: '/resume', color: '#f59e0b' },
            ].map(({ icon: Icon, label, to, color }) => (
              <Link key={to} to={to}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, background: `${color}11`, border: `1px solid ${color}22`, textDecoration: 'none', color: 'var(--text-primary)', fontSize: 13, fontWeight: 500, transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = `${color}22`}
                onMouseLeave={e => e.currentTarget.style.background = `${color}11`}>
                <Icon size={14} color={color} />
                {label}
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
