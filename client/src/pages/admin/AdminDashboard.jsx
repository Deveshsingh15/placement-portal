// pages/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import API from '../../utils/api';
import { Users, BookOpen, FileText, TrendingUp, BarChart3, Code2 } from 'lucide-react';

const Card = ({ children, style = {} }) => (
  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, ...style }}>
    {children}
  </div>
);

const StatCard = ({ icon: Icon, label, value, color }) => (
  <Card>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <div style={{ width: 42, height: 42, borderRadius: 10, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={18} color={color} />
      </div>
    </div>
    <div style={{ fontSize: 30, fontFamily: 'Syne', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{value}</div>
    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</div>
  </Card>
);

const CATEGORY_LABELS = { hr: 'HR', technical: 'Technical', dbms: 'DBMS', os: 'OS', cn: 'Networks', oops: 'OOPs', aptitude: 'Aptitude', company: 'Company' };
const CATEGORY_COLORS = { hr: '#06b6d4', technical: '#6366f1', dbms: '#10b981', os: '#f59e0b', cn: '#8b5cf6', oops: '#ec4899', aptitude: '#f97316', company: '#14b8a6' };

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/analytics').then(res => setAnalytics(res.data.analytics)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-secondary)' }}>Loading analytics...</div>;
  if (!analytics) return null;

  const dsaCompleted = analytics.dsaStats.find(s => s._id === 'completed')?.count || 0;
  const dsaRevision = analytics.dsaStats.find(s => s._id === 'revision')?.count || 0;

  return (
    <div className="fade-up">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Admin Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Overview of all student activity and platform usage</p>
      </div>

      {/* Key metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard icon={Users} label="Total Students" value={analytics.totalStudents} color="#6366f1" />
        <StatCard icon={BookOpen} label="Interview Questions" value={analytics.totalQuestions} color="#06b6d4" />
        <StatCard icon={FileText} label="Resumes Uploaded" value={analytics.studentsWithResume} color="#10b981" />
        <StatCard icon={Code2} label="DSA Completed (All)" value={dsaCompleted} color="#f59e0b" />
      </div>

      {/* DSA Stats + Category Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* DSA breakdown */}
        <Card>
          <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Code2 size={16} color="#6366f1" /> Platform-wide DSA Progress
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Completed', value: dsaCompleted, color: '#10b981' },
              { label: 'Under Revision', value: dsaRevision, color: '#f59e0b' },
              { label: 'Pending', value: analytics.dsaStats.find(s => s._id === 'pending')?.count || 0, color: '#94a3b8' },
            ].map(({ label, value, color }) => {
              const total = analytics.dsaStats.reduce((a, s) => a + s.count, 0) || 1;
              const pct = Math.round((value / total) * 100);
              return (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                    <span style={{ fontWeight: 600, color }}>{value} <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>({pct}%)</span></span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 999 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Question categories */}
        <Card>
          <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOpen size={16} color="#06b6d4" /> Questions by Category
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {analytics.categoryStats.sort((a, b) => b.count - a.count).map(({ _id, count }) => {
              const maxCount = Math.max(...analytics.categoryStats.map(s => s.count));
              const pct = Math.round((count / maxCount) * 100);
              const color = CATEGORY_COLORS[_id] || '#6366f1';
              return (
                <div key={_id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 70, fontSize: 12, color: 'var(--text-secondary)', textAlign: 'right', flexShrink: 0 }}>{CATEGORY_LABELS[_id] || _id}</div>
                  <div style={{ flex: 1, height: 20, background: 'rgba(255,255,255,0.04)', borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: `${color}88`, borderRadius: 6, display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
                      <span style={{ fontSize: 10, color: 'white', fontWeight: 600 }}>{count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Resume coverage */}
      <Card>
        <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Resume Upload Coverage</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ position: 'relative', width: 80, height: 80 }}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <circle cx="40" cy="40" r="34" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${analytics.totalStudents > 0 ? (analytics.studentsWithResume / analytics.totalStudents) * 213.6 : 0} 213.6`}
                strokeDashoffset="53.4" transform="rotate(-90 40 40)" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne', fontWeight: 800, fontSize: 14, color: '#10b981' }}>
              {analytics.totalStudents > 0 ? Math.round((analytics.studentsWithResume / analytics.totalStudents) * 100) : 0}%
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18 }}>{analytics.studentsWithResume} / {analytics.totalStudents} students</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>have uploaded their resume</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
